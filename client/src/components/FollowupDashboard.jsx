import React, { useState, useMemo } from 'react';
import { 
  Search, Download, Trash2, Calendar, Phone, MessageCircle, Clock, 
  CheckCircle, XCircle, Plus, ChevronDown, ChevronUp, X, RefreshCw, 
  Share2, Users, UserPlus, AlertCircle, Upload, Award, ArrowRightLeft, 
  Tag, ChevronLeft, ChevronRight, CheckCircle2, PhoneCall, Sparkles, Filter,
  Crown, User
} from 'lucide-react';
import { API_URL } from '../config';
import BulkImportModal from './BulkImportModal';
import ConfirmLeadModal from './ConfirmLeadModal';

// Helper to determine follow-up status (Today, Overdue, Upcoming) accurately
export const getFollowUpStatus = (dateStr, historyList = [], fallbackCreatedAt = null) => {
  if (!dateStr || !dateStr.trim()) {
    return { status: 'None', label: 'Not Scheduled', isToday: false, isOverdue: false, isUpcoming: false, date: null };
  }

  const now = new Date();
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth();
  const todayDate = now.getDate();
  const todayStart = new Date(todayYear, todayMonth, todayDate, 0, 0, 0, 0);
  const todayEnd = new Date(todayYear, todayMonth, todayDate, 23, 59, 59, 999);

  const raw = dateStr.trim();
  const lower = raw.toLowerCase();

  // Find creation date of the latest history item if available
  const lastEntry = historyList && historyList.length > 0 ? historyList[historyList.length - 1] : null;
  const createdRaw = lastEntry?.createdAt || fallbackCreatedAt;
  const createdDate = createdRaw ? new Date(createdRaw) : now;

  let targetDate = null;

  // 1. Relative keyword matching (handles "tomorrow", "next day", "kale", "kal", "today", "aaje")
  if (lower.startsWith('today') || lower.includes('aaje')) {
    targetDate = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
  } else if (
    lower.startsWith('tomorrow') || 
    lower.includes('next day') || 
    lower.includes('nextday') ||
    lower.includes('kale') || 
    /\bkal\b/.test(lower)
  ) {
    targetDate = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate() + 1);
  } else if (lower.includes('in 2 days')) {
    targetDate = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate() + 2);
  } else if (lower.includes('in 3 days')) {
    targetDate = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate() + 3);
  } else {
    // 2. Try parsing DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
    const ddmmyyyy = raw.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
    if (ddmmyyyy) {
      const day = parseInt(ddmmyyyy[1], 10);
      const month = parseInt(ddmmyyyy[2], 10) - 1;
      const year = parseInt(ddmmyyyy[3], 10);
      targetDate = new Date(year, month, day);
    } else {
      // 3. Try parsing DD/MM/YY (2-digit year)
      const ddmmyy = raw.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2})\b/);
      if (ddmmyy) {
        const day = parseInt(ddmmyyyy ? ddmmyyyy[1] : ddmmyy[1], 10);
        const month = parseInt(ddmmyyyy ? ddmmyyyy[2] : ddmmyy[2], 10) - 1;
        const year = 2000 + parseInt(ddmmyy[3], 10);
        targetDate = new Date(year, month, day);
      } else {
        // 4. Try parsing YYYY-MM-DD
        const yyyymmdd = raw.match(/(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
        if (yyyymmdd) {
          const year = parseInt(yyyymmdd[1], 10);
          const month = parseInt(yyyymmdd[2], 10) - 1;
          const day = parseInt(yyyymmdd[3], 10);
          targetDate = new Date(year, month, day);
        } else {
          // 5. Try parsing DD/MM or DD-MM (without year, assume current year)
          const ddmm = raw.match(/^(\d{1,2})[\/\-\.](\d{1,2})\b/);
          if (ddmm) {
            const day = parseInt(ddmm[1], 10);
            const month = parseInt(ddmm[2], 10) - 1;
            targetDate = new Date(todayYear, month, day);
          } else {
            // 6. Fallback Date.parse
            const parsed = new Date(raw);
            if (!isNaN(parsed.getTime())) {
              targetDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
            }
          }
        }
      }
    }
  }

  if (!targetDate || isNaN(targetDate.getTime())) {
    return { status: 'Other', label: raw, isToday: false, isOverdue: false, isUpcoming: false, date: null };
  }

  const targetTime = targetDate.getTime();
  const startTime = todayStart.getTime();
  const endTime = todayEnd.getTime();

  if (targetTime < startTime) {
    return { status: 'Overdue', label: raw, isToday: false, isOverdue: true, isUpcoming: false, date: targetDate };
  } else if (targetTime >= startTime && targetTime <= endTime) {
    return { status: 'Today', label: raw, isToday: true, isOverdue: false, isUpcoming: false, date: targetDate };
  } else {
    return { status: 'Upcoming', label: raw, isToday: false, isOverdue: false, isUpcoming: true, date: targetDate };
  }
};

export default function FollowupDashboard({ 
  registrations = [], 
  fetchRegistrations, 
  activeCategory = 'original', 
  setActiveCategory,
  workshops = [],
  activeCaller = 'Vivek',
  setActiveCaller
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('All'); 
  const [selectedTagFilter, setSelectedTagFilter] = useState('All');
  const [selectedAdminFilter, setSelectedAdminFilter] = useState('All');
  
  const [expandedLeadId, setExpandedLeadId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Modals for Bulk Import & Course Confirmation
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedLeadForConfirm, setSelectedLeadForConfirm] = useState(null);

  // Toast alert
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
  
  // Follow-up form with active caller persistence and assignedAdmin
  const [form, setForm] = useState({
    callerName: activeCaller || localStorage.getItem('crm_active_caller') || 'Vivek',
    outcome: 'Call Again',
    assignedAdmin: 'Vivek',
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
    tag: '',
    interestArea: 'Personal Brand',
    source: activeCategory === 'coldcall' ? 'Cold Call Manual' : 'Manual Entry',
    leadType: activeCategory === 'coldcall' ? 'coldcall' : 'original',
    callerName: activeCaller || localStorage.getItem('crm_active_caller') || 'Vivek',
    outcome: 'Call Again',
    assignedAdmin: 'Vivek',
    nextFollowUpDate: '',
    note: ''
  });
  const [addLeadSubmitting, setAddLeadSubmitting] = useState(false);
  const [addLeadError, setAddLeadError] = useState('');

  // Pagination state (50 items per page for silky smooth performance on 6000+ leads)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Reset page when switching category, tag, admin, or search
  const handleCategorySwitch = (cat) => {
    if (setActiveCategory) {
      setActiveCategory(cat);
    }
    setCurrentPage(1);
    setSelectedTagFilter('All');
    setSelectedAdminFilter('All');
  };

  const getOutcomeColor = (outcome) => {
    switch(outcome) {
      case 'Call Again': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Pending Lead': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'Client Done': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Not Interested': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'No Answer / Busy': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'Admin Call': return 'bg-amber-500/15 text-amber-800 border-amber-500/30';
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
      case 'Admin Call': return <Crown size={14} className="text-amber-600" />;
      default: return <Phone size={14} />;
    }
  };

  const handleOpenModal = (lead) => {
    setSelectedLead(lead);
    const currentActive = activeCaller || localStorage.getItem('crm_active_caller') || lead.latestCallerName || 'Vivek';
    setForm({
      callerName: currentActive,
      outcome: lead.latestOutcome && lead.latestOutcome !== 'Pending' ? lead.latestOutcome : 'Call Again',
      assignedAdmin: lead.assignedAdmin || 'Vivek',
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
        if (form.outcome === 'Admin Call') {
          showToast(`👑 Assigned to ${form.assignedAdmin || 'Admin'} for Admin Call!`, 'warning');
        } else {
          showToast(`Follow-up saved for ${selectedLead.name}`);
        }
        fetchRegistrations();
      }
    } catch (err) {
      console.error(err);
      alert('Error saving follow-up');
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

  const handleDateTimeChange = (isoDateTime, targetFormSetter) => {
    if (!isoDateTime) return;
    const d = new Date(isoDateTime);
    if (isNaN(d.getTime())) return;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, '0');
    const formatted = `${dd}/${mm}/${yyyy}, ${formattedHours}:${minutes} ${ampm}`;
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
        body: JSON.stringify({
          ...leadForm,
          leadType: activeCategory === 'coldcall' ? 'coldcall' : 'original'
        })
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
          tag: '',
          interestArea: 'Personal Brand',
          source: activeCategory === 'coldcall' ? 'Cold Call Manual' : 'Manual Entry',
          leadType: activeCategory === 'coldcall' ? 'coldcall' : 'original',
          callerName: '',
          outcome: 'Call Again',
          nextFollowUpDate: '',
          note: ''
        });
        showToast('Lead added successfully!');
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

  // Move Lead from Cold Call to Original Leads
  const handleMoveToOriginal = async (lead) => {
    if (!window.confirm(`Move "${lead.name} (${lead.phone})" from Cold Call to Original Leads?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/registrations/${lead.id}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'original',
          callerName: lead.latestCallerName || 'Ma\'am',
          note: `Interested client moved from Cold Call to Original Leads`
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`✅ "${lead.name}" moved to Original Leads!`);
        fetchRegistrations();
      } else {
        alert(data.error || 'Failed to move lead');
      }
    } catch (err) {
      console.error(err);
      alert('Network error moving lead');
    }
  };

  // Revert Confirmation
  const handleRevertConfirm = async (lead) => {
    if (!window.confirm(`Revert course confirmation for "${lead.name}" and move back to active leads?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/registrations/${lead.id}/revert-confirm`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: lead.source?.toLowerCase().includes('cold') ? 'coldcall' : 'original',
          callerName: lead.latestCallerName || 'Ma\'am',
          note: `Course confirmation reverted by ${lead.latestCallerName || 'Ma\'am'}`
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`↩️ Confirmation reverted for "${lead.name}"`);
        fetchRegistrations();
      } else {
        alert(data.error || 'Failed to revert confirmation');
      }
    } catch (err) {
      console.error(err);
      alert('Network error reverting confirmation');
    }
  };

  // Delete lead
  const handleDeleteLead = async (id, name) => {
    if (!window.confirm(`Permanently delete "${name}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/registrations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`🗑️ Lead deleted`);
        fetchRegistrations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Enrich registrations with computed follow-up status
  const enrichedRegistrations = useMemo(() => {
    return registrations.map(reg => {
      const followUpInfo = getFollowUpStatus(reg.latestNextFollowUpDate, reg.followUpHistory, reg.createdAt);
      return {
        ...reg,
        leadType: reg.leadType || 'original',
        tag: reg.tag || '',
        assignedAdmin: reg.assignedAdmin || '',
        followUpInfo
      };
    });
  }, [registrations]);

  // Overall counts for category tabs
  const categoryCounts = useMemo(() => {
    const original = enrichedRegistrations.filter(r => r.leadType === 'original' && r.latestOutcome !== 'Admin Call').length;
    const coldcall = enrichedRegistrations.filter(r => r.leadType === 'coldcall' && r.latestOutcome !== 'Admin Call').length;
    const confirmed = enrichedRegistrations.filter(r => r.leadType === 'confirmed').length;
    const admincall = enrichedRegistrations.filter(r => r.latestOutcome === 'Admin Call').length;
    return { original, coldcall, confirmed, admincall, total: enrichedRegistrations.length };
  }, [enrichedRegistrations]);

  // Unique tags for coldcall leads
  const availableTags = useMemo(() => {
    const tagsSet = new Set();
    enrichedRegistrations.forEach(r => {
      if (r.leadType === 'coldcall' && r.tag && r.tag.trim()) {
        tagsSet.add(r.tag.trim());
      }
    });
    return Array.from(tagsSet).sort();
  }, [enrichedRegistrations]);

  // Tag counts
  const tagCounts = useMemo(() => {
    const counts = {};
    enrichedRegistrations.forEach(r => {
      if (r.leadType === 'coldcall' && r.tag) {
        counts[r.tag] = (counts[r.tag] || 0) + 1;
      }
    });
    return counts;
  }, [enrichedRegistrations]);

  // Admin breakdown counts for Admin Call queue
  const adminCounts = useMemo(() => {
    const counts = { Vivek: 0, Manthan: 0, Jaydeep: 0, Kuldeep: 0 };
    enrichedRegistrations.forEach(r => {
      if (r.latestOutcome === 'Admin Call' && r.assignedAdmin) {
        counts[r.assignedAdmin] = (counts[r.assignedAdmin] || 0) + 1;
      }
    });
    return counts;
  }, [enrichedRegistrations]);

  // Filter leads based on activeCategory, tag, search, admin, and status
  const filteredLeads = useMemo(() => {
    return enrichedRegistrations.filter(r => {
      // 1. Matches Category
      if (activeCategory === 'admincall') {
        if (r.latestOutcome !== 'Admin Call') return false;
        if (selectedAdminFilter !== 'All' && r.assignedAdmin !== selectedAdminFilter) return false;
      } else if (activeCategory === 'original') {
        if (r.leadType !== 'original' || r.latestOutcome === 'Admin Call') return false;
      } else if (activeCategory === 'coldcall') {
        if (r.leadType !== 'coldcall' || r.latestOutcome === 'Admin Call') return false;
      } else if (activeCategory === 'confirmed') {
        if (r.leadType !== 'confirmed') return false;
      }

      // 2. Matches Tag (for coldcall)
      if (activeCategory === 'coldcall' && selectedTagFilter !== 'All') {
        if ((r.tag || '').trim() !== selectedTagFilter) return false;
      }

      // 3. Matches Search
      const search = searchTerm.toLowerCase().trim();
      if (search) {
        const matches = 
          (r.name || '').toLowerCase().includes(search) || 
          (r.phone || '').includes(search) ||
          (r.tag || '').toLowerCase().includes(search) ||
          (r.city || '').toLowerCase().includes(search) ||
          (r.profession || '').toLowerCase().includes(search) ||
          (r.assignedAdmin || '').toLowerCase().includes(search) ||
          (r.latestCallerName || '').toLowerCase().includes(search);
        if (!matches) return false;
      }

      // 4. Matches Outcome/Status Filter
      if (filterMode === 'All') return true;
      if (filterMode === 'Today') return r.followUpInfo.isToday;
      if (filterMode === 'Overdue') return r.followUpInfo.isOverdue;
      if (filterMode === 'Pending Lead') return r.latestOutcome === 'Pending Lead';
      if (filterMode === 'Client Done') return r.latestOutcome === 'Client Done';
      if (filterMode === 'Not Interested') return r.latestOutcome === 'Not Interested';
      
      return false;
    });
  }, [enrichedRegistrations, activeCategory, selectedTagFilter, selectedAdminFilter, searchTerm, filterMode]);

  // Category specific stats
  const categoryStats = useMemo(() => {
    let list = [];
    if (activeCategory === 'admincall') {
      list = enrichedRegistrations.filter(r => r.latestOutcome === 'Admin Call');
    } else if (activeCategory === 'original') {
      list = enrichedRegistrations.filter(r => r.leadType === 'original' && r.latestOutcome !== 'Admin Call');
    } else if (activeCategory === 'coldcall') {
      list = enrichedRegistrations.filter(r => r.leadType === 'coldcall' && r.latestOutcome !== 'Admin Call');
    } else {
      list = enrichedRegistrations.filter(r => r.leadType === 'confirmed');
    }

    return {
      total: list.length,
      today: list.filter(r => r.followUpInfo.isToday).length,
      overdue: list.filter(r => r.followUpInfo.isOverdue).length,
      pendingLead: list.filter(r => r.latestOutcome === 'Pending Lead').length,
      notInterested: list.filter(r => r.latestOutcome === 'Not Interested').length,
      pendingCall: list.filter(r => !r.latestOutcome || r.latestOutcome === 'Pending' || r.latestOutcome === 'Call Again' || r.latestOutcome === 'Admin Call').length,
      done: list.filter(r => r.latestOutcome === 'Client Done').length
    };
  }, [enrichedRegistrations, activeCategory]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedLeads = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, safeCurrentPage, pageSize]);

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Tag', 'City', 'Profession', 'Latest Outcome', 'Next Followup', 'Caller', 'Confirmed Course', 'Confirmed Note'];
    const rows = filteredLeads.map(l => [
      `"${l.name || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.tag || ''}"`,
      `"${l.city || ''}"`,
      `"${l.profession || ''}"`,
      `"${l.latestOutcome || ''}"`,
      `"${l.latestNextFollowUpDate || ''}"`,
      `"${l.latestCallerName || ''}"`,
      `"${l.confirmedCourse || ''}"`,
      `"${l.confirmedNote || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `banaviaebrand_${activeCategory}_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#f8fafc] text-gray-800 rounded-3xl min-h-screen p-4 sm:p-6 font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#101018] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      {/* ── Top Lead Switcher (Original Leads vs Cold Call vs Confirmed Leads) ── */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-gray-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center bg-gray-100 p-1 rounded-xl border border-gray-200 gap-1 w-full sm:w-auto">
          <button
            onClick={() => handleCategorySwitch('original')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeCategory === 'original'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <Users size={16} />
            <span>Original Leads</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeCategory === 'original' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {categoryCounts.original}
            </span>
          </button>

          <button
            onClick={() => handleCategorySwitch('coldcall')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeCategory === 'coldcall'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <PhoneCall size={16} />
            <span>Cold Call Leads</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeCategory === 'coldcall' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {categoryCounts.coldcall.toLocaleString()}
            </span>
          </button>

          <button
            onClick={() => handleCategorySwitch('confirmed')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeCategory === 'confirmed'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <Award size={16} />
            <span>Confirmed Leads</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeCategory === 'confirmed' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {categoryCounts.confirmed}
            </span>
          </button>

          {/* Admin Calls Tab (Next to Confirmed Leads) */}
          <button
            onClick={() => handleCategorySwitch('admincall')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeCategory === 'admincall'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md'
                : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50/80 border border-amber-300/50'
            }`}
          >
            <Crown size={16} className={activeCategory === 'admincall' ? 'text-black' : 'text-amber-600'} />
            <span>Admin Calls</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
              activeCategory === 'admincall' ? 'bg-black/25 text-black' : 'bg-amber-200 text-amber-950'
            }`}>
              {categoryCounts.admincall}
            </span>
          </button>
        </div>

        {/* Category Header Label */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-extrabold text-gray-500 uppercase tracking-wider pr-2">
          {activeCategory === 'original' && '📥 Inbound Website Leads & Direct Applications'}
          {activeCategory === 'coldcall' && '📞 Outbound Calling Database & Bulk Leads'}
          {activeCategory === 'confirmed' && '🏆 Finalized Students & Course Enrollments'}
          {activeCategory === 'admincall' && '👑 Priority Calls Assigned to Admins (Vivek, Manthan, Jaydeep, Kuldeep)'}
        </div>
      </div>

      {/* ── Top Metric Stats for active category ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm flex flex-col justify-center">
          <div className="text-2xl sm:text-3xl font-black text-slate-800">{categoryStats.total.toLocaleString()}</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
            {activeCategory === 'coldcall' ? 'Total Cold Leads' : activeCategory === 'confirmed' ? 'Confirmed Students' : activeCategory === 'admincall' ? 'Admin Calls Queue' : 'Total Original'}
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-300 shadow-sm flex flex-col justify-center">
          <div className="text-2xl sm:text-3xl font-black text-green-700 flex items-center gap-2">
            {categoryStats.today}
            {categoryStats.today > 0 && <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />}
          </div>
          <div className="text-[11px] font-bold text-green-700 uppercase tracking-wider mt-1">Follow-up Today</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-300 shadow-sm flex flex-col justify-center">
          <div className="text-2xl sm:text-3xl font-black text-red-700">{categoryStats.overdue}</div>
          <div className="text-[11px] font-bold text-red-600/70 uppercase tracking-wider mt-1">Overdue Calls</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 shadow-sm flex flex-col justify-center">
          <div className="text-2xl sm:text-3xl font-black text-purple-700">{categoryStats.pendingLead}</div>
          <div className="text-[11px] font-bold text-purple-600/70 uppercase tracking-wider mt-1">Pending Leads</div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 shadow-sm flex flex-col justify-center">
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">{categoryStats.done}</div>
          <div className="text-[11px] font-bold text-emerald-600/70 uppercase tracking-wider mt-1">Confirmed / Done</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 shadow-sm flex flex-col justify-center">
          <div className="text-2xl sm:text-3xl font-black text-orange-700">{categoryStats.pendingCall}</div>
          <div className="text-[11px] font-bold text-orange-600/70 uppercase tracking-wider mt-1">Pending Calls</div>
        </div>
      </div>

      {/* ── Action Toolbar ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <span className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded bg-gray-50 text-xs">⛶</span>
            <span>
              {activeCategory === 'coldcall' ? 'Cold Call Tele-calling' : activeCategory === 'confirmed' ? 'Confirmed Enrollments' : activeCategory === 'admincall' ? 'Admin Priority Calling Queue' : 'Original Leads CRM'}
            </span>
            <span className="text-xs text-gray-400 font-normal">
              ({filteredLeads.length.toLocaleString()} leads matching filters)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* BULK IMPORT BUTTON (Prominent on Cold Call) */}
            {activeCategory === 'coldcall' && (
              <button 
                onClick={() => setIsBulkImportOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-md hover:scale-105 cursor-pointer"
              >
                <Upload size={16} />
                <span>+ Import Bulk Leads (6000+)</span>
              </button>
            )}

            {/* ADD MANUAL LEAD BUTTON */}
            {activeCategory !== 'confirmed' && (
              <button 
                onClick={() => setIsAddLeadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                <UserPlus size={16} />
                <span>+ Add Lead</span>
              </button>
            )}

            <button 
              onClick={fetchRegistrations} 
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-300 text-gray-700 text-xs sm:text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw size={15} /> Refresh
            </button>

            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-gray-300 text-gray-700 text-xs sm:text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <Download size={15} /> Export CSV
            </button>
          </div>
        </div>

        {/* ── Tag Filter Pills (Only visible in Cold Call Leads view) ── */}
        {activeCategory === 'coldcall' && availableTags.length > 0 && (
          <div className="mb-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Tag size={13} className="text-purple-600" /> Filter by Tag / Industry:
            </div>
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => { setSelectedTagFilter('All'); setCurrentPage(1); }}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  selectedTagFilter === 'All'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                All Tags ({categoryStats.total})
              </button>

              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => { setSelectedTagFilter(tag); setCurrentPage(1); }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    selectedTagFilter === tag
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span>🏷️ {tag}</span>
                  <span className="text-[10px] opacity-75">({tagCounts[tag] || 0})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Admin Filter Pills (Only visible in Admin Calls view) ── */}
        {activeCategory === 'admincall' && (
          <div className="mb-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Crown size={13} className="text-amber-600" /> Filter by Admin Queue:
            </div>
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => { setSelectedAdminFilter('All'); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  selectedAdminFilter === 'All'
                    ? 'bg-amber-500 text-black border-amber-500 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                All Admins ({categoryCounts.admincall || 0})
              </button>

              {['Vivek', 'Manthan', 'Jaydeep', 'Kuldeep'].map(admin => (
                <button
                  key={admin}
                  onClick={() => { setSelectedAdminFilter(admin); setCurrentPage(1); }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    selectedAdminFilter === admin
                      ? 'bg-amber-500 text-black border-amber-500 shadow-sm ring-1 ring-amber-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-50'
                  }`}
                >
                  <span>👑 {admin}</span>
                  <span className="text-[10px] font-black opacity-80">({adminCounts[admin] || 0})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Status Filter Chips ── */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {[
            { label: 'All', count: categoryStats.total, color: 'bg-slate-700 text-white' },
            { label: 'Today', count: categoryStats.today, icon: '📅', color: 'bg-green-100 text-green-800' },
            { label: 'Overdue', count: categoryStats.overdue, icon: '🚨', color: 'bg-red-50 text-red-700' },
            { label: 'Pending Lead', count: categoryStats.pendingLead, icon: '⏳', color: 'bg-purple-50 text-purple-700' },
            { label: 'Client Done', count: categoryStats.done, icon: '🏆', color: 'bg-emerald-50 text-emerald-700' },
            { label: 'Not Interested', count: categoryStats.notInterested, icon: '❌', color: 'bg-rose-50 text-rose-700' },
          ].map(filter => (
            <button
              key={filter.label}
              onClick={() => { setFilterMode(filter.label); setCurrentPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                filterMode === filter.label 
                  ? 'ring-2 ring-blue-500 ring-offset-1 bg-blue-600 text-white border-transparent' 
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
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder={`Search ${activeCategory} leads by name, phone, tag, city, admin, or caller...`}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50/60 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
          />
        </div>
      </div>

      {/* ── Leads Table ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto mb-6">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/70">
              <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Visitor / Lead</th>
              <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Phone / WhatsApp</th>
              {activeCategory === 'coldcall' && (
                <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Tag / Industry</th>
              )}
              {activeCategory === 'admincall' && (
                <>
                  <th className="p-4 text-xs font-black text-amber-800 uppercase tracking-wider">Assigned Admin</th>
                  <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Assigned By</th>
                </>
              )}
              {activeCategory === 'confirmed' ? (
                <>
                  <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Confirmed Course</th>
                  <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Payment / Note</th>
                  <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Confirmed Date</th>
                </>
              ) : (
                <>
                  <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Next Follow-up</th>
                  <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">Last Outcome & Note</th>
                  <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider">History</th>
                </>
              )}
              <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={activeCategory === 'coldcall' ? 7 : activeCategory === 'admincall' ? 8 : 6} className="p-16 text-center text-gray-400">
                  <div className="max-w-md mx-auto space-y-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                      <Search size={22} />
                    </div>
                    <p className="font-bold text-gray-700 text-base">No {activeCategory} leads found.</p>
                    <p className="text-xs text-gray-400">
                      {activeCategory === 'coldcall' 
                        ? 'Click "+ Import Bulk Leads (6000+)" above to import from Excel or CSV!' 
                        : activeCategory === 'admincall'
                        ? 'Leads marked with "Admin Call" outcome will appear here for Vivek, Manthan, Jaydeep or Kuldeep.'
                        : 'No leads matching the current filter.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedLeads.map((reg) => (
                <React.Fragment key={reg.id}>
                  <tr className={`hover:bg-gray-50/80 transition-colors ${reg.followUpInfo?.isToday ? 'bg-green-50/40' : ''}`}>
                    <td className="p-4 align-top">
                      <div className="font-extrabold text-gray-900 text-base flex items-center gap-2">
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
                      {reg.workshopDate && (
                        <div className="text-xs text-blue-600 font-semibold mt-0.5">
                          Workshop: {reg.workshopDate}
                        </div>
                      )}
                    </td>

                    <td className="p-4 align-top">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                        <Phone size={14} /> 
                        <a href={`tel:${reg.phone}`} className="hover:underline">{reg.phone}</a>
                      </div>
                      <a 
                        href={`https://wa.me/${reg.phone.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-emerald-700 text-xs font-bold rounded-lg mt-2 hover:bg-green-100 transition-colors border border-green-200"
                      >
                        <MessageCircle size={13} /> WhatsApp Chat
                      </a>
                    </td>

                    {/* Tag Column (Only for Cold Call) */}
                    {activeCategory === 'coldcall' && (
                      <td className="p-4 align-top">
                        {reg.tag ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            🏷️ {reg.tag}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No tag</span>
                        )}
                      </td>
                    )}

                    {/* Admin Call Specific Columns */}
                    {activeCategory === 'admincall' && (
                      <>
                        <td className="p-4 align-top">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border shadow-sm ${
                            reg.assignedAdmin === 'Vivek' ? 'bg-blue-50 text-blue-900 border-blue-300' :
                            reg.assignedAdmin === 'Manthan' ? 'bg-purple-50 text-purple-900 border-purple-300' :
                            reg.assignedAdmin === 'Jaydeep' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                            reg.assignedAdmin === 'Kuldeep' ? 'bg-orange-50 text-orange-900 border-orange-300' :
                            'bg-amber-50 text-amber-900 border-amber-300'
                          }`}>
                            <Crown size={14} className="text-amber-600" />
                            {reg.assignedAdmin || 'Unassigned'}
                          </span>
                        </td>
                        <td className="p-4 align-top">
                          <div className="text-xs font-bold text-gray-800 flex items-center gap-1">
                            <Users size={12} className="text-gray-400" />
                            {reg.latestCallerName || 'Caller'}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            Source: {reg.leadType === 'coldcall' ? 'Cold Call' : 'Original Lead'}
                          </div>
                        </td>
                      </>
                    )}

                    {/* Confirmed view columns */}
                    {activeCategory === 'confirmed' ? (
                      <>
                        <td className="p-4 align-top">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
                            <Award size={14} className="text-emerald-600" />
                            {reg.confirmedCourse || reg.workshopDate || 'Workshop'}
                          </span>
                        </td>
                        <td className="p-4 align-top max-w-[220px]">
                          <div className="text-xs font-semibold text-gray-800">
                            {reg.confirmedNote || 'Confirmed enrollment'}
                          </div>
                          <div className="text-[11px] text-gray-500 mt-1">
                            By: <strong>{reg.latestCallerName || 'Admin'}</strong>
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <div className="text-xs text-gray-600 font-medium">
                            {reg.confirmedAt ? new Date(reg.confirmedAt).toLocaleDateString('en-IN') : 'Recent'}
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
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
                            {reg.followUpHistory?.length || 0}
                          </button>
                        </td>
                      </>
                    )}

                    {/* Actions Column */}
                    <td className="p-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        
                        {/* UPDATE / CALL MODAL */}
                        <button 
                          onClick={() => handleOpenModal(reg)} 
                          title="Log Follow-up Call / Update"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                        >
                          <Plus size={14} /> Update
                        </button>

                        {/* MOVE TO ORIGINAL (Only on Cold Call) */}
                        {activeCategory === 'coldcall' && (
                          <button
                            onClick={() => handleMoveToOriginal(reg)}
                            title="Move this lead to Original Leads"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            <ArrowRightLeft size={13} /> Move Original
                          </button>
                        )}

                        {/* CONFIRM FOR COURSE (On Original & Cold Call) */}
                        {activeCategory !== 'confirmed' && (
                          <button
                            onClick={() => {
                              setSelectedLeadForConfirm(reg);
                              setIsConfirmModalOpen(true);
                            }}
                            title="Confirm & Enroll Student in Course"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-black rounded-lg transition-colors cursor-pointer"
                          >
                            <Award size={13} /> Confirm
                          </button>
                        )}

                        {/* REVERT CONFIRMATION (On Confirmed view) */}
                        {activeCategory === 'confirmed' && (
                          <button
                            onClick={() => handleRevertConfirm(reg)}
                            title="Cancel / Revert Confirmation"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            ↩️ Revert
                          </button>
                        )}

                        {/* DELETE */}
                        <button 
                          onClick={() => handleDeleteLead(reg.id, reg.name)}
                          title="Delete Lead"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Follow-up History */}
                  {expandedLeadId === reg.id && reg.followUpHistory && (
                    <tr>
                      <td colSpan={activeCategory === 'coldcall' ? 7 : 6} className="p-0 bg-gray-50/70 border-t border-gray-100">
                        <div className="p-6 border-l-4 border-blue-500 ml-4 my-4 bg-white rounded-r-xl shadow-sm max-w-4xl">
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
                                <p className="text-sm text-gray-800">{hist.note}</p>
                                {hist.nextFollowUpDate && (
                                  <div className="mt-2 text-xs font-semibold text-blue-700 flex items-center gap-1">
                                    <Calendar size={12}/> Next Follow-up: {hist.nextFollowUpDate}
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

      {/* ── Pagination Bar ── */}
      {filteredLeads.length > pageSize && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-semibold text-gray-500">
            Showing <strong className="text-gray-900">{((safeCurrentPage - 1) * pageSize) + 1}</strong> to{' '}
            <strong className="text-gray-900">{Math.min(safeCurrentPage * pageSize, filteredLeads.length).toLocaleString()}</strong> of{' '}
            <strong className="text-gray-900">{filteredLeads.length.toLocaleString()}</strong> leads
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={safeCurrentPage === 1}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                safeCurrentPage === 1 
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <span className="text-xs font-bold text-gray-700 px-2">
              Page {safeCurrentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={safeCurrentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                safeCurrentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Modal 1: Add Manual Lead Modal ── */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-lg">
                <UserPlus className="text-emerald-600" size={20} />
                <span>Add {activeCategory === 'coldcall' ? 'Cold Call Lead' : 'Manual Lead'}</span>
              </div>
              <button 
                onClick={() => setIsAddLeadModalOpen(false)} 
                className="text-gray-400 hover:text-gray-700 p-1 rounded-full transition-colors cursor-pointer"
              >
                <X size={20}/>
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="p-6 overflow-y-auto space-y-4">
              {addLeadError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{addLeadError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Rahul Patel"
                    value={leadForm.name} 
                    onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. 9876543210"
                    value={leadForm.phone} 
                    onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Tag / Industry
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Real Estate, Doctor"
                    value={leadForm.tag} 
                    onChange={e => setLeadForm({ ...leadForm, tag: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Surat"
                    value={leadForm.city} 
                    onChange={e => setLeadForm({ ...leadForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Caller / Executive Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Pooja Ma'am"
                  value={leadForm.callerName} 
                  onChange={e => setLeadForm({ ...leadForm, callerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Initial Note
                </label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Spoke briefly, requested callback tomorrow"
                  value={leadForm.note} 
                  onChange={e => setLeadForm({ ...leadForm, note: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)} 
                  className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={addLeadSubmitting}
                  className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  {addLeadSubmitting ? 'Saving...' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal 2: Follow-up Call / Update Modal ── */}
      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-tight">
                    {selectedLead.name}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="font-semibold text-emerald-700">{selectedLead.phone}</span>
                    {selectedLead.tag && <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200">🏷️ {selectedLead.tag}</span>}
                  </div>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                <X size={18}/>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Call Outcome
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Call Again', color: 'border-blue-400 bg-blue-50 text-blue-800' },
                    { label: 'Pending Lead', color: 'border-purple-400 bg-purple-50 text-purple-800' },
                    { label: 'Client Done', color: 'border-green-400 bg-green-50 text-green-800' },
                    { label: 'Not Interested', color: 'border-red-400 bg-red-50 text-red-800' },
                    { label: 'No Answer / Busy', color: 'border-orange-400 bg-orange-50 text-orange-800' },
                    { label: 'Admin Call', color: 'border-amber-400 bg-amber-50 text-amber-900' }
                  ].map(item => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setForm({ ...form, outcome: item.label })}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                        form.outcome === item.label
                          ? `${item.color} shadow-sm ring-2 ring-offset-1 ring-blue-500`
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.label === 'Admin Call' && <Crown size={13} className="text-amber-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Admin Call Selector Box */}
              {form.outcome === 'Admin Call' && (
                <div className="p-4 bg-amber-50/80 border-2 border-amber-300 rounded-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Crown size={15} className="text-amber-600" />
                      Select Admin To Call (Escalation): <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      Director Queue
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Vivek', 'Manthan', 'Jaydeep', 'Kuldeep'].map(admin => (
                      <button
                        key={admin}
                        type="button"
                        onClick={() => setForm({ ...form, assignedAdmin: admin })}
                        className={`py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          form.assignedAdmin === admin
                            ? 'bg-amber-500 text-black shadow-md ring-2 ring-amber-600 scale-105'
                            : 'bg-white text-gray-700 border border-amber-200 hover:bg-amber-100/50'
                        }`}
                      >
                        👑 {admin}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-amber-800">
                    ⚡ This lead will immediately appear under the <strong>Admin Calls</strong> tab for <strong>{form.assignedAdmin || 'Admin'}</strong> to call.
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Caller / Executive Name
                  </label>
                  <span className="text-[10px] text-gray-400">Current: {activeCaller}</span>
                </div>
                <input 
                  type="text"
                  value={form.callerName}
                  onChange={e => setForm({ ...form, callerName: e.target.value })}
                  placeholder="e.g. Pooja Ma'am, Admin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Vivek', 'Manthan', 'Jaydeep', 'Kuldeep', 'Pooja Ma\'am'].map(name => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setForm({ ...form, callerName: name })}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                        form.callerName === name
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Next Follow-up Date
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <button 
                    type="button" 
                    onClick={() => setFormattedQuickDate(0, '04:00 PM', setForm)}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-xs font-semibold rounded-lg border border-gray-200"
                  >
                    Today 4 PM
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormattedQuickDate(1, '11:00 AM', setForm)}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-xs font-semibold rounded-lg border border-gray-200"
                  >
                    Tomorrow 11 AM
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormattedQuickDate(2, '02:00 PM', setForm)}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-xs font-semibold rounded-lg border border-gray-200"
                  >
                    In 2 Days
                  </button>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={form.nextFollowUpDate}
                    onChange={e => setForm({ ...form, nextFollowUpDate: e.target.value })}
                    placeholder="DD/MM/YYYY, HH:MM PM (or 'Tomorrow 11am')"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <div className="flex items-center px-2 py-1 bg-gray-100 border border-gray-300 rounded-xl">
                    <input 
                      type="datetime-local" 
                      onChange={e => handleDateTimeChange(e.target.value, setForm)}
                      className="text-xs bg-transparent text-gray-700 outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Note / Discussion Details
                </label>
                <textarea 
                  value={form.note}
                  onChange={e => setForm({ ...form, note: e.target.value })}
                  placeholder='e.g. "Asked to send syllabus on WhatsApp, will call back tomorrow"'
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitFollowUp} 
                className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <CheckCircle size={16} /> Save Follow-up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 3: Bulk Import Modal (6000+ Support) ── */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onSuccess={() => {
          showToast('🎉 Bulk leads imported successfully!');
          fetchRegistrations();
        }}
        defaultCaller="Admin"
      />

      {/* ── Modal 4: Confirm Lead for Course Modal ── */}
      <ConfirmLeadModal
        isOpen={isConfirmModalOpen}
        lead={selectedLeadForConfirm}
        workshops={workshops}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setSelectedLeadForConfirm(null);
        }}
        onSuccess={() => {
          showToast(`🏆 Lead confirmed for course!`);
          fetchRegistrations();
        }}
        defaultCaller="Admin"
      />

    </div>
  );
}
