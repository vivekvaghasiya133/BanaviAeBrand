import React, { useState } from 'react';
import { 
  Search, Download, Trash2, Calendar, Phone, MessageCircle, Clock, 
  CheckCircle, XCircle, Plus, ChevronDown, ChevronUp, X, RefreshCw, 
  Share2, Users, UserPlus, AlertCircle 
} from 'lucide-react';
import { API_URL } from '../config';

// Helper to determine follow-up status (Today, Overdue, Upcoming) accurately
export const getFollowUpStatus = (dateStr, historyList = []) => {
  if (!dateStr || !dateStr.trim()) {
    return { status: 'None', label: 'Not Scheduled', isToday: false, isOverdue: false, isUpcoming: false };
  }

  const now = new Date();
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth();
  const todayDate = now.getDate();
  const todayStart = new Date(todayYear, todayMonth, todayDate, 0, 0, 0, 0);
  const todayEnd = new Date(todayYear, todayMonth, todayDate, 23, 59, 59, 999);

  let targetDate = null;
  const raw = dateStr.trim();
  const lower = raw.toLowerCase();

  // Find creation date of the latest history item if available
  const lastEntry = historyList && historyList.length > 0 ? historyList[historyList.length - 1] : null;
  const createdDate = lastEntry?.createdAt ? new Date(lastEntry.createdAt) : now;

  // 1. Check relative keywords: "today", "tomorrow", "in X days"
  if (lower.startsWith('today') || lower.includes('aaje')) {
    targetDate = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
  } else if (lower.startsWith('tomorrow') || lower.includes('kale')) {
    targetDate = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate() + 1);
  } else if (lower.includes('in 2 days')) {
    targetDate = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate() + 2);
  } else if (lower.includes('in 3 days')) {
    targetDate = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate() + 3);
  } else {
    // 2. Try parsing DD/MM/YYYY or DD-MM-YYYY
    const ddmmyyyy = raw.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
    if (ddmmyyyy) {
      const day = parseInt(ddmmyyyy[1], 10);
      const month = parseInt(ddmmyyyy[2], 10) - 1;
      const year = parseInt(ddmmyyyy[3], 10);
      targetDate = new Date(year, month, day);
    } else {
      // 3. Try parsing YYYY-MM-DD
      const yyyymmdd = raw.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
      if (yyyymmdd) {
        const year = parseInt(yyyymmdd[1], 10);
        const month = parseInt(yyyymmdd[2], 10) - 1;
        const day = parseInt(yyyymmdd[3], 10);
        targetDate = new Date(year, month, day);
      } else {
        // 4. Fallback Date.parse
        const parsed = new Date(raw);
        if (!isNaN(parsed.getTime())) {
          targetDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
        }
      }
    }
  }

  if (!targetDate || isNaN(targetDate.getTime())) {
    return { status: 'Other', label: raw, isToday: false, isOverdue: false, isUpcoming: false };
  }

  const targetTime = targetDate.getTime();
  const startTime = todayStart.getTime();
  const endTime = todayEnd.getTime();

  if (targetTime < startTime) {
    return { status: 'Overdue', label: raw, isToday: false, isOverdue: true, isUpcoming: false };
  } else if (targetTime >= startTime && targetTime <= endTime) {
    return { status: 'Today', label: raw, isToday: true, isOverdue: false, isUpcoming: false };
  } else {
    return { status: 'Upcoming', label: raw, isToday: false, isOverdue: false, isUpcoming: true };
  }
};

export default function FollowupDashboard({ registrations = [], fetchRegistrations }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('All'); 
  
  const [expandedLeadId, setExpandedLeadId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Follow-up form
  const [form, setForm] = useState({
    callerName: '',
    outcome: 'Call Again',
    nextFollowUpDate: '',
    note: ''
  });

  // Manual Lead Modal state
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    profession: '',
    interestArea: 'Personal Brand',
    source: 'Manual Entry',
    callerName: '',
    outcome: 'Call Again',
    nextFollowUpDate: '',
    note: ''
  });
  const [addLeadSubmitting, setAddLeadSubmitting] = useState(false);
  const [addLeadError, setAddLeadError] = useState('');

  const getOutcomeColor = (outcome) => {
    switch(outcome) {
      case 'Call Again': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Pending Lead': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'Client Done': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Not Interested': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'No Answer / Busy': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getOutcomeIcon = (outcome) => {
    switch(outcome) {
      case 'Call Again': return <Phone size={14} />;
      case 'Pending Lead': return <Clock size={14} />;
      case 'Client Done': return <CheckCircle size={14} />;
      case 'Not Interested': return <XCircle size={14} />;
      case 'No Answer / Busy': return <Clock size={14} />;
      default: return <Phone size={14} />;
    }
  };

  const handleOpenModal = (lead) => {
    setSelectedLead(lead);
    setForm({
      callerName: lead.latestCallerName || '',
      outcome: lead.latestOutcome && lead.latestOutcome !== 'Pending' ? lead.latestOutcome : 'Call Again',
      nextFollowUpDate: '',
      note: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmitFollowUp = async () => {
    if (!selectedLead) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/registrations/${selectedLead.id}/followups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchRegistrations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setFormattedQuickDate = (offsetDays, timeStr, targetFormSetter) => {
    const target = new Date();
    target.setDate(target.getDate() + offsetDays);
    const dd = String(target.getDate()).padStart(2, '0');
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    const yyyy = target.getFullYear();
    const formatted = `${dd}/${mm}/${yyyy}, ${timeStr}`;
    targetFormSetter(prev => ({ ...prev, nextFollowUpDate: formatted }));
  };

  const handleCreateManualLead = async (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) {
      setAddLeadError('Name and Phone number are required.');
      return;
    }

    setAddLeadSubmitting(true);
    setAddLeadError('');

    try {
      const res = await fetch(`${API_URL}/api/admin/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsAddLeadModalOpen(false);
        setLeadForm({
          name: '',
          phone: '',
          email: '',
          city: '',
          profession: '',
          interestArea: 'Personal Brand',
          source: 'Manual Entry',
          callerName: '',
          outcome: 'Call Again',
          nextFollowUpDate: '',
          note: ''
        });
        fetchRegistrations();
      } else {
        setAddLeadError(data.error || 'Failed to create lead.');
      }
    } catch (err) {
      console.error(err);
      setAddLeadError('Network error while creating lead.');
    } finally {
      setAddLeadSubmitting(false);
    }
  };

  // Enrich registrations with computed follow-up status
  const enrichedRegistrations = registrations.map(reg => {
    const followUpInfo = getFollowUpStatus(reg.latestNextFollowUpDate, reg.followUpHistory);
    return {
      ...reg,
      followUpInfo
    };
  });

  const totalScanned = enrichedRegistrations.length;
  const todayCount = enrichedRegistrations.filter(r => r.followUpInfo.isToday).length;
  const overdueCount = enrichedRegistrations.filter(r => r.followUpInfo.isOverdue).length;
  const pendingLeadCount = enrichedRegistrations.filter(r => r.latestOutcome === 'Pending Lead').length;
  const notInterestedCount = enrichedRegistrations.filter(r => r.latestOutcome === 'Not Interested').length;
  const pendingCount = enrichedRegistrations.filter(r => !r.latestOutcome || r.latestOutcome === 'Pending' || r.latestOutcome === 'Call Again').length;

  const filteredLeads = enrichedRegistrations.filter(r => {
    const matchesSearch = 
      (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (r.phone || '').includes(searchTerm) ||
      (r.city || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filterMode === 'All') return true;
    if (filterMode === 'Today') return r.followUpInfo.isToday;
    if (filterMode === 'Overdue') return r.followUpInfo.isOverdue;
    if (filterMode === 'Pending Lead') return r.latestOutcome === 'Pending Lead';
    if (filterMode === 'Client Done') return r.latestOutcome === 'Client Done';
    if (filterMode === 'Not Interested') return r.latestOutcome === 'Not Interested';
    
    return false;
  });

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'City', 'Profession', 'Latest Outcome', 'Next Followup', 'Caller', 'Last Note'];
    const rows = filteredLeads.map(l => [
      `"${l.name || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.city || ''}"`,
      `"${l.profession || ''}"`,
      `"${l.latestOutcome || ''}"`,
      `"${l.latestNextFollowUpDate || ''}"`,
      `"${l.latestCallerName || ''}"`,
      `"${(l.followUpHistory?.[l.followUpHistory.length - 1]?.note || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `banaviaebrand_calling_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#f8fafc] text-gray-800 rounded-2xl min-h-screen p-6 font-sans">
      {/* ── Top Metric Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm flex flex-col justify-center">
          <div className="text-3xl font-black text-slate-800">{totalScanned}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Scanned</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-300 shadow-sm flex flex-col justify-center">
          <div className="text-3xl font-black text-green-700 flex items-center gap-2">
            {todayCount}
            {todayCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />}
          </div>
          <div className="text-xs font-bold text-green-700 uppercase tracking-wider mt-1">Followup Today</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-300 shadow-sm flex flex-col justify-center">
          <div className="text-3xl font-black text-red-700">{overdueCount}</div>
          <div className="text-xs font-bold text-red-600/70 uppercase tracking-wider mt-1">Overdue Calls</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 shadow-sm flex flex-col justify-center">
          <div className="text-3xl font-black text-purple-700">{pendingLeadCount}</div>
          <div className="text-xs font-bold text-purple-600/70 uppercase tracking-wider mt-1">Pending Leads</div>
        </div>
        <div className="bg-rose-50 rounded-xl p-4 border border-rose-200 shadow-sm flex flex-col justify-center">
          <div className="text-3xl font-black text-rose-700">{notInterestedCount}</div>
          <div className="text-xs font-bold text-rose-600/70 uppercase tracking-wider mt-1">Not Interested</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 shadow-sm flex flex-col justify-center">
          <div className="text-3xl font-black text-orange-700">{pendingCount}</div>
          <div className="text-xs font-bold text-orange-600/70 uppercase tracking-wider mt-1">Pending Call</div>
        </div>
      </div>

      {/* ── Action Toolbar ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded bg-gray-50 text-xs">⛶</span>
            Expo Tele-calling Dashboard ({filteredLeads.length} shown)
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* ADD MANUAL LEAD BUTTON */}
            <button 
              onClick={() => setIsAddLeadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <UserPlus size={16} /> + Add Manual Lead
            </button>

            <button 
              onClick={fetchRegistrations} 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RefreshCw size={16} /> Refresh
            </button>

            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Download size={16} /> Export Calling CSV
            </button>
          </div>
        </div>

        {/* ── Status Filter Chips ── */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {[
            { label: 'All', count: totalScanned, color: 'bg-emerald-700 text-white' },
            { label: 'Today', count: todayCount, icon: '📅', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black' },
            { label: 'Overdue', count: overdueCount, icon: '🚨', color: 'bg-red-50 text-red-700 border-red-200' },
            { label: 'Pending Lead', count: pendingLeadCount, icon: '⏳', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { label: 'Client Done', count: registrations.filter(r => r.latestOutcome === 'Client Done').length, icon: '🏆', color: 'bg-green-50 text-green-700 border-green-200' },
            { label: 'Not Interested', count: notInterestedCount, icon: '❌', color: 'bg-rose-50 text-rose-700 border-rose-200' },
          ].map(filter => (
            <button
              key={filter.label}
              onClick={() => setFilterMode(filter.label)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                filterMode === filter.label 
                  ? 'ring-2 ring-emerald-500 ring-offset-1 bg-emerald-600 text-white border-transparent' 
                  : 'hover:bg-gray-50 bg-white border-gray-200 text-gray-700'
              }`}
            >
              {filter.icon && <span>{filter.icon}</span>}
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search visitor name, phone number, city, note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* ── Leads Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Visitor / Lead</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Phone / WhatsApp</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Next Follow-up</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Outcome & Note</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">History</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-center text-gray-400">
                  <div className="max-w-sm mx-auto space-y-2">
                    <p className="font-semibold text-gray-600">No leads found in this filter.</p>
                    <p className="text-xs text-gray-400">Try selecting another filter above or add a manual lead.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLeads.map((reg) => (
                <React.Fragment key={reg.id}>
                  <tr className={`hover:bg-gray-50/80 transition-colors ${reg.followUpInfo.isToday ? 'bg-green-50/30' : ''}`}>
                    <td className="p-4 align-top">
                      <div className="font-bold text-gray-900 text-base flex items-center gap-2">
                        {reg.name}
                        {reg.source && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                            {reg.source}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {reg.profession || 'N/A'} {reg.city ? `· ${reg.city}` : ''}
                      </div>
                      {reg.interestArea && (
                        <div className="text-xs text-gray-400 mt-0.5">Interest: {reg.interestArea}</div>
                      )}
                    </td>

                    <td className="p-4 align-top">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                        <Phone size={14} /> {reg.phone}
                      </div>
                      <a 
                        href={`https://wa.me/${reg.phone.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-emerald-700 text-xs font-bold rounded mt-2 hover:bg-green-100 transition-colors border border-green-200"
                      >
                        <MessageCircle size={13} /> WhatsApp Chat
                      </a>
                    </td>

                    <td className="p-4 align-top">
                      {reg.latestNextFollowUpDate ? (
                        <div className="flex flex-col gap-1">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                            reg.followUpInfo.isToday
                              ? 'bg-green-100 text-green-900 border-green-300 font-black shadow-sm'
                              : reg.followUpInfo.isOverdue
                              ? 'bg-red-50 text-red-700 border-red-200 font-bold'
                              : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            <Calendar size={12} /> {reg.latestNextFollowUpDate}
                          </div>
                          {reg.followUpInfo.isToday && (
                            <span className="text-[10px] font-black text-green-700 uppercase tracking-wider pl-1">
                              ● Today's Follow-up
                            </span>
                          )}
                          {reg.followUpInfo.isOverdue && (
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider pl-1">
                              ⚠️ Overdue
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Not scheduled</span>
                      )}
                    </td>

                    <td className="p-4 align-top max-w-[260px]">
                      {reg.latestOutcome && (
                        <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border mb-1.5 ${getOutcomeColor(reg.latestOutcome)}`}>
                          {getOutcomeIcon(reg.latestOutcome)}
                          {reg.latestOutcome}
                        </div>
                      )}
                      {reg.followUpHistory && reg.followUpHistory.length > 0 && (
                        <>
                          <div className="text-xs text-gray-700 italic mb-1.5 line-clamp-2">
                            "{reg.followUpHistory[reg.followUpHistory.length - 1].note}"
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-gray-500 font-semibold">
                            <Users size={12} /> {reg.latestCallerName || 'Admin'}
                          </div>
                        </>
                      )}
                    </td>

                    <td className="p-4 align-top">
                      <button 
                        onClick={() => setExpandedLeadId(expandedLeadId === reg.id ? null : reg.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-full border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        {expandedLeadId === reg.id ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                        <Clock size={13}/> 
                        {reg.followUpHistory?.length || 0} history
                      </button>
                    </td>

                    <td className="p-4 align-top text-right">
                      <button 
                        onClick={() => handleOpenModal(reg)} 
                        className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                      >
                        <Plus size={15} /> Update
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Follow-up History */}
                  {expandedLeadId === reg.id && reg.followUpHistory && (
                    <tr>
                      <td colSpan="6" className="p-0 bg-gray-50/70 border-t border-gray-100">
                        <div className="p-6 border-l-4 border-emerald-500 ml-4 my-4 bg-white rounded-r-xl shadow-sm max-w-4xl">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Clock size={14}/> Full Follow-up Timeline ({reg.followUpHistory.length} interactions)
                          </h4>
                          <div className="space-y-4">
                            {[...reg.followUpHistory].reverse().map((hist, idx) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getOutcomeColor(hist.outcome)}`}>
                                      {getOutcomeIcon(hist.outcome)} {hist.outcome}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                                      <Users size={12}/> {hist.callerName || 'Admin'}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-400">
                                    {new Date(hist.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-800 italic">"{hist.note}"</p>
                                {hist.nextFollowUpDate && (
                                  <div className="mt-2.5 flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 w-fit px-2.5 py-1 rounded border border-emerald-100">
                                    <Calendar size={12}/> Scheduled: {hist.nextFollowUpDate}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODAL 1: ADD MANUAL LEAD
      ───────────────────────────────────────────────────────────── */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Add New Manual Lead</h2>
                  <p className="text-xs text-gray-500">Enter lead details to track directly in tele-calling CRM</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddLeadModalOpen(false)} 
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateManualLead} className="p-6 overflow-y-auto flex-1 space-y-5">
              {addLeadError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{addLeadError}</span>
                </div>
              )}

              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Lead Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={leadForm.name}
                    onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Mobile / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. 9876543210"
                    value={leadForm.phone}
                    onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 2: City & Profession */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">City</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Surat, Ahmedabad"
                    value={leadForm.city}
                    onChange={e => setLeadForm({ ...leadForm, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Profession / Business</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Textile, Diamond, Freelancer"
                    value={leadForm.profession}
                    onChange={e => setLeadForm({ ...leadForm, profession: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Source & Tele-caller */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Lead Source</label>
                  <select 
                    value={leadForm.source}
                    onChange={e => setLeadForm({ ...leadForm, source: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  >
                    <option value="Manual Entry">Manual Entry</option>
                    <option value="Expo / Event">Expo / Event</option>
                    <option value="Instagram DM">Instagram DM</option>
                    <option value="WhatsApp Inquiry">WhatsApp Inquiry</option>
                    <option value="Referral">Referral</option>
                    <option value="Phone Call">Incoming Phone Call</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Tele-caller / Agent</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Vivek, Priya"
                    value={leadForm.callerName}
                    onChange={e => setLeadForm({ ...leadForm, callerName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Initial Status */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Initial Call Outcome</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {['Call Again', 'Pending Lead', 'Client Done', 'Not Interested', 'No Answer / Busy'].map(status => (
                    <button
                      type="button"
                      key={status}
                      onClick={() => setLeadForm({ ...leadForm, outcome: status })}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        leadForm.outcome === status 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500' 
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Call Date */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={14} /> Schedule Next Follow-up
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">Quick pick:</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <button 
                    type="button"
                    onClick={() => setFormattedQuickDate(0, '04:00 PM', setLeadForm)}
                    className="px-3 py-1 bg-white border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg hover:bg-emerald-50 cursor-pointer shadow-2xs"
                  >
                    Today 4:00 PM
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormattedQuickDate(1, '11:00 AM', setLeadForm)}
                    className="px-3 py-1 bg-white border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg hover:bg-emerald-50 cursor-pointer shadow-2xs"
                  >
                    Tomorrow 11:00 AM
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormattedQuickDate(1, '04:00 PM', setLeadForm)}
                    className="px-3 py-1 bg-white border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg hover:bg-emerald-50 cursor-pointer shadow-2xs"
                  >
                    Tomorrow 4:00 PM
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormattedQuickDate(2, '11:00 AM', setLeadForm)}
                    className="px-3 py-1 bg-white border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg hover:bg-emerald-50 cursor-pointer shadow-2xs"
                  >
                    In 2 Days
                  </button>
                </div>

                <input 
                  type="text"
                  placeholder="DD/MM/YYYY, HH:MM PM"
                  value={leadForm.nextFollowUpDate}
                  onChange={e => setLeadForm({ ...leadForm, nextFollowUpDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-emerald-200 rounded-xl text-sm font-bold text-emerald-900 outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Note / Conversation Details</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Interested in personal brand for luxury boutique. Follow up tomorrow after 11am."
                  value={leadForm.note}
                  onChange={e => setLeadForm({ ...leadForm, note: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={addLeadSubmitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle size={16} />
                  <span>{addLeadSubmitting ? 'Saving Lead...' : 'Create Lead'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 2: UPDATE FOLLOW-UP RECORD
      ───────────────────────────────────────────────────────────── */}
      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-emerald-50/40">
              <div>
                <h2 className="text-2xl font-black text-gray-900">{selectedLead.name}</h2>
                <div className="flex items-center gap-3 mt-2 text-sm">
                  <span className="flex items-center gap-1 text-emerald-700 font-bold"><Phone size={14}/> {selectedLead.phone}</span>
                  <span className="text-gray-300">•</span>
                  <a href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-600 font-bold hover:underline">WhatsApp Chat</a>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-emerald-700" size={18}/>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Your Name (Caller Name)</h3>
                </div>
                <input 
                  type="text"
                  value={form.callerName}
                  onChange={e => setForm({...form, callerName: e.target.value})}
                  placeholder="e.g. Vivek Vaghasiya, Telecaller"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all shadow-sm"
                />
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">1. Select Call Outcome</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'Call Again', title: 'Call Again', desc: 'Set callback date & time', icon: <Phone size={18}/>, color: 'text-blue-500' },
                    { id: 'Pending Lead', title: 'Pending Lead', desc: 'Lead is in pipeline', icon: <Clock size={18}/>, color: 'text-purple-500' },
                    { id: 'Client Done', title: 'Client Done', desc: 'Converted to paying client', icon: <CheckCircle size={18}/>, color: 'text-green-500' },
                    { id: 'Not Interested', title: 'Not Interested', desc: 'Closed / Lead uninterested', icon: <XCircle size={18}/>, color: 'text-red-500' },
                    { id: 'No Answer / Busy', title: 'No Answer / Busy', desc: 'No response or line busy', icon: <Clock size={18}/>, color: 'text-orange-500' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setForm({...form, outcome: opt.id})}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${form.outcome === opt.id ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'}`}
                    >
                      <div className={`mt-0.5 ${opt.color}`}>
                        {opt.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-sm">{opt.title}</div>
                        <div className="text-xs text-gray-500">{opt.desc}</div>
                      </div>
                      {form.outcome === opt.id && <div className="text-emerald-600"><CheckCircle size={18}/></div>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-emerald-700" size={18}/>
                    <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Next Call Date & Time</h3>
                  </div>
                  <span className="text-xs text-emerald-600/80 font-semibold">Quick pick:</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <button 
                    type="button"
                    onClick={() => setFormattedQuickDate(0, '04:00 PM', setForm)}
                    className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    Today 4:00 PM
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormattedQuickDate(1, '11:00 AM', setForm)}
                    className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    Tomorrow 11:00 AM
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormattedQuickDate(1, '04:00 PM', setForm)}
                    className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    Tomorrow 4:00 PM
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormattedQuickDate(2, '11:00 AM', setForm)}
                    className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    In 2 Days
                  </button>
                </div>
                
                <div className="relative">
                  <input 
                    type="text"
                    value={form.nextFollowUpDate}
                    onChange={e => setForm({...form, nextFollowUpDate: e.target.value})}
                    placeholder="DD/MM/YYYY, HH:MM PM"
                    className="w-full px-4 py-2.5 bg-white border border-emerald-200 rounded-xl text-emerald-900 font-bold focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm text-sm"
                  />
                  <Calendar className="absolute right-4 top-3 text-emerald-400" size={16}/>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="text-emerald-700" size={18}/>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Note / Details</h3>
                </div>
                <textarea 
                  value={form.note}
                  onChange={e => setForm({...form, note: e.target.value})}
                  placeholder='e.g. "Call them tomorrow at 11am after office hours"'
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all shadow-sm resize-none text-sm"
                />
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitFollowUp} 
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle size={16} /> Save Follow-up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
