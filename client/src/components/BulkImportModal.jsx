import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Download, RefreshCw, Users, Tag } from 'lucide-react';
import { API_URL } from '../config';

export default function BulkImportModal({ isOpen, onClose, onSuccess, defaultCaller = 'Admin' }) {
  const [activeTab, setActiveTab] = useState('paste'); // 'paste' | 'file'
  const [pasteText, setPasteText] = useState('');
  const [file, setFile] = useState(null);
  const [parsedLeads, setParsedLeads] = useState([]);
  const [defaultTag, setDefaultTag] = useState('');
  const [callerName, setCallerName] = useState(defaultCaller);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Clean phone number helper
  const cleanPhoneNumber = (val) => {
    if (!val) return '';
    return String(val).replace(/[\s\-\(\)\.\+]/g, '');
  };

  // Parse a single CSV line with quote awareness (handles commas inside quotes)
  const parseCSVLine = (line, delimiter = ',') => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === delimiter && !inQuotes) {
        result.push(cur.trim().replace(/^"|"$/g, ''));
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim().replace(/^"|"$/g, ''));
    return result;
  };

  // Robust Native Parser for CSV / TSV / Pasted rows
  const parseRows = (text) => {
    if (!text || !text.trim()) return [];
    
    const lines = text.trim().split(/\r?\n/);
    if (lines.length === 0) return [];

    const results = [];
    
    // Detect delimiter in first row (tab, comma, semicolon, pipe)
    const sampleLine = lines[0];
    let delimiter = ',';
    if (sampleLine.includes('\t')) delimiter = '\t';
    else if (sampleLine.includes('|')) delimiter = '|';
    else if (sampleLine.includes(';') && !sampleLine.includes(',')) delimiter = ';';

    // Parse the first line to check for headers
    const firstLineParts = parseCSVLine(lines[0], delimiter);
    const firstLineLower = firstLineParts.map(p => p.toLowerCase().trim());

    let nameIdx = -1;
    let phoneIdx = -1;
    let tagIdx = -1;

    // Check if line 1 has recognizable headers
    const hasHeader = firstLineLower.some(h => 
      h === 'name' || h.includes('name') || 
      h === 'phone' || h.includes('phone') || h.includes('number') || h.includes('mobile') ||
      h === 'tag' || h === 'tags' || h.includes('tag') || h.includes('category')
    );

    if (hasHeader) {
      nameIdx = firstLineLower.findIndex(h => h === 'name' || h.includes('name') || h.includes('lead') || h.includes('student'));
      phoneIdx = firstLineLower.findIndex(h => h === 'phone' || h.includes('phone') || h.includes('number') || h.includes('mobile') || h.includes('cell'));
      tagIdx = firstLineLower.findIndex(h => h === 'tags' || h === 'tag' || h.includes('tag') || h.includes('category') || h.includes('label'));
    }

    const startIndex = hasHeader ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = parseCSVLine(line, delimiter);
      if (parts.length === 0) continue;

      let name = '';
      let phone = '';
      let tag = '';

      if (hasHeader && phoneIdx !== -1) {
        // We know the exact column indices from the header!
        name = nameIdx !== -1 && parts[nameIdx] !== undefined ? parts[nameIdx].trim() : '';
        phone = cleanPhoneNumber(parts[phoneIdx]);
        
        if (tagIdx !== -1 && parts[tagIdx] !== undefined && parts[tagIdx].trim()) {
          tag = parts[tagIdx].trim();
        } else {
          // If tag column is empty on this row, check pipeline / status
          const pipelineIdx = firstLineLower.findIndex(h => h.includes('pipeline') || h.includes('stage'));
          if (pipelineIdx !== -1 && parts[pipelineIdx] && parts[pipelineIdx] !== 'new') {
            tag = parts[pipelineIdx].trim();
          }
        }
      } else {
        // Heuristic fallback when no header is present
        if (parts.length === 1) {
          const cleaned = cleanPhoneNumber(parts[0]);
          if (cleaned.length >= 8) {
            phone = cleaned;
            name = 'Prospect ' + (i + 1);
          }
        } else if (parts.length === 2) {
          const p0Clean = cleanPhoneNumber(parts[0]);
          const p1Clean = cleanPhoneNumber(parts[1]);
          if (p1Clean.length >= 8 && p0Clean.length < 8) {
            name = parts[0].trim();
            phone = p1Clean;
          } else if (p0Clean.length >= 8 && p1Clean.length < 8) {
            phone = p0Clean;
            name = parts[1].trim();
          } else {
            name = parts[0].trim();
            phone = p1Clean || p0Clean;
          }
        } else if (parts.length === 3) {
          name = parts[0].trim();
          phone = cleanPhoneNumber(parts[1]);
          if (!parts[2].includes('@')) {
            tag = parts[2].trim();
          }
        } else {
          // 4 or more columns:
          // Format like: Name, Phone, Email, Status, Tags, Pipeline, Added
          name = parts[0].trim();
          phone = cleanPhoneNumber(parts[1]);

          if (parts[4] !== undefined && parts[4].trim()) {
            tag = parts[4].trim(); // Tags column!
          } else if (parts[2] !== undefined && !parts[2].includes('@') && parts[2].trim()) {
            tag = parts[2].trim();
          } else if (parts[5] !== undefined && parts[5].trim() && parts[5] !== 'new') {
            tag = parts[5].trim();
          }
        }
      }

      // If phone wasn't in expected column, look for a 8-14 digit number in any column
      if (!phone || phone.length < 8) {
        for (let p of parts) {
          const c = cleanPhoneNumber(p);
          if (c.length >= 8 && c.length <= 14) {
            phone = c;
            break;
          }
        }
      }

      // Fallback name
      if (!name || name === phone) {
        name = 'Prospect ' + phone;
      }

      if (phone && phone.length >= 8) {
        results.push({
          name: name.trim(),
          phone,
          tag: tag ? tag.trim() : (defaultTag ? defaultTag.trim() : '')
        });
      }
    }

    return results;
  };

  const handlePasteChange = (e) => {
    const val = e.target.value;
    setPasteText(val);
    setError('');
    const parsed = parseRows(val);
    setParsedLeads(parsed);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      const parsed = parseRows(content);
      setParsedLeads(parsed);
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try copy-pasting the data directly.');
    };
    reader.readAsText(selectedFile);
  };

  const downloadSampleCSV = () => {
    const sample = `Name,Phone,Tag\nRahul Patel,9876543210,Real Estate\nDr. Priya Shah,9823456789,Doctor\nVikas Mehta,9988776655,Builder\nAarav Sharma,9123456789,Ecommerce\nSneha Desai,9879012345,Fashion Designer`;
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_coldcall_leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async () => {
    if (parsedLeads.length === 0) {
      setError('Please provide at least one valid lead with a phone number.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    setProgress({ current: 0, total: parsedLeads.length, percent: 0 });

    try {
      // Apply default tag if a lead has no tag
      const leadsToImport = parsedLeads.map(l => ({
        ...l,
        tag: l.tag || defaultTag || ''
      }));

      // Send in batches of 1500 to keep UI responsive
      const BATCH_SIZE = 1500;
      let totalInserted = 0;

      for (let i = 0; i < leadsToImport.length; i += BATCH_SIZE) {
        const chunk = leadsToImport.slice(i, i + BATCH_SIZE);
        
        const response = await fetch(`${API_URL}/api/admin/registrations/bulk-import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leads: chunk,
            leadType: 'coldcall',
            defaultTag,
            callerName
          })
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed during bulk import batch.');
        }

        totalInserted += data.count || chunk.length;
        const currentProgress = Math.min(totalInserted, leadsToImport.length);
        const percent = Math.round((currentProgress / leadsToImport.length) * 100);
        setProgress({ current: currentProgress, total: leadsToImport.length, percent });
      }

      setSuccessMessage(`🎉 Successfully imported ${totalInserted.toLocaleString()} cold call leads!`);
      setTimeout(() => {
        onSuccess?.();
        onClose?.();
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error importing leads. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101018] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-[#3B82F6] flex items-center justify-center font-bold">
              <Upload size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                Bulk Lead Import
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-blue-500/20 text-[#3B82F6] border border-blue-500/30">
                  6,000+ Support
                </span>
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Quickly add thousands of cold call leads with Name, Number & Tag
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-3">
              <CheckCircle size={18} className="shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex bg-black p-1 rounded-xl border border-white/10 text-sm">
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  activeTab === 'paste'
                    ? 'bg-[#3B82F6] text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                📋 Paste from Excel / Sheets
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('file')}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  activeTab === 'file'
                    ? 'bg-[#3B82F6] text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                📁 Upload CSV / Excel File
              </button>
            </div>

            <button
              type="button"
              onClick={downloadSampleCSV}
              className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1.5"
            >
              <Download size={13} /> Sample CSV Template
            </button>
          </div>

          {/* Tab 1: Paste Text */}
          {activeTab === 'paste' && (
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                Paste rows here (Name, Number, Tag) — Tab or Comma separated
              </label>
              <textarea
                rows={6}
                value={pasteText}
                onChange={handlePasteChange}
                disabled={isSubmitting}
                placeholder="Example:
Rahul Patel	9876543210	Real Estate
Dr. Priya Shah	9823456789	Doctor
Vikas Mehta	9988776655	Builder"
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white font-mono text-xs focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all resize-y"
              />
            </div>
          )}

          {/* Tab 2: Upload File */}
          {activeTab === 'file' && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-[#3B82F6] rounded-2xl p-8 text-center cursor-pointer transition-all bg-black/30 hover:bg-white/[0.02]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .txt, .tsv"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="mx-auto w-10 h-10 text-white/40 mb-3" />
              <p className="text-sm font-bold text-white mb-1">
                {file ? file.name : 'Click or Drag & Drop CSV / Text file here'}
              </p>
              <p className="text-xs text-white/40">
                Supports .csv, .txt, .tsv with Name, Phone, and Tag columns
              </p>
            </div>
          )}

          {/* Settings Row: Default Tag & Assigned Caller */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/30 p-4 rounded-xl border border-white/5">
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Tag size={12} className="text-[#3B82F6]" /> Default Tag / Industry
              </label>
              <input
                type="text"
                value={defaultTag}
                onChange={(e) => setDefaultTag(e.target.value)}
                placeholder="e.g. Real Estate, Doctor, Surat Expo"
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:border-[#3B82F6] outline-none"
              />
              <span className="text-[10px] text-white/40 mt-1 block">Applied to leads without specific tag</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Users size={12} className="text-[#3B82F6]" /> Assigned Caller Name
              </label>
              <input
                type="text"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                placeholder="e.g. Pooja Ma'am, Admin"
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-xs focus:border-[#3B82F6] outline-none"
              />
              <span className="text-[10px] text-white/40 mt-1 block">Assigns who will follow up with these leads</span>
            </div>
          </div>

          {/* Parsed Leads Preview */}
          {parsedLeads.length > 0 && (
            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40">
              <div className="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle size={14} />
                  {parsedLeads.length.toLocaleString()} leads detected ready to import
                </span>
                <span className="text-[11px] text-white/40">Showing preview of first 5 records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-white/50">
                      <th className="p-2.5 pl-4">#</th>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5">Phone Number</th>
                      <th className="p-2.5 pr-4">Tag / Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                    {parsedLeads.slice(0, 5).map((lead, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="p-2.5 pl-4 text-white/30">{idx + 1}</td>
                        <td className="p-2.5 font-bold text-white">{lead.name}</td>
                        <td className="p-2.5 text-[#3B82F6]">{lead.phone}</td>
                        <td className="p-2.5 pr-4">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/80">
                            {lead.tag || defaultTag || 'General'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isSubmitting && (
            <div className="space-y-2 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
              <div className="flex justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-2">
                  <RefreshCw size={13} className="animate-spin text-[#3B82F6]" />
                  Importing leads into database...
                </span>
                <span>{progress.current.toLocaleString()} / {progress.total.toLocaleString()} ({progress.percent}%)</span>
              </div>
              <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 flex items-center justify-between bg-black/40">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 hover:text-white text-sm font-semibold transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleImport}
            disabled={isSubmitting || parsedLeads.length === 0}
            className={`px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center gap-2 transition-all ${
              parsedLeads.length > 0 && !isSubmitting
                ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-black shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Importing ({progress.percent}%)...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>Import {parsedLeads.length > 0 ? parsedLeads.length.toLocaleString() : ''} Leads</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
