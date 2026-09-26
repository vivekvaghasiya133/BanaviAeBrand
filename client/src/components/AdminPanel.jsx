import React, { useState, useEffect } from 'react';
import { Users, Search, Download, Trash2, Calendar, MapPin, Hash, Plus, PhoneCall, Award, CheckCircle2, Crown, User, RefreshCw, LogOut, Key, ShieldCheck, Check } from 'lucide-react';
import { API_URL } from '../config';
import FollowupDashboard from './FollowupDashboard';

// Predefined Team Members with individual PINs and Roles
export const TEAM_MEMBERS = [
  { id: 'vivek', name: 'Vivek', role: 'Admin', avatar: '👑', pin: '1111', badge: 'Admin' },
  { id: 'manthan', name: 'Manthan', role: 'Admin', avatar: '👑', pin: '2222', badge: 'Admin' },
  { id: 'jaydeep', name: 'Jaydeep', role: 'Admin', avatar: '👑', pin: '3333', badge: 'Admin' },
  { id: 'kuldeep', name: 'Kuldeep', role: 'Admin', avatar: '👑', pin: '4444', badge: 'Admin' },
  { id: 'pooja', name: 'Pooja Ma\'am', role: 'Calling Specialist', avatar: '📞', pin: '5555', badge: 'Calling Team' },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('original'); // 'original' | 'coldcall' | 'confirmed' | 'admincall' | 'workshops'

  // Persistent Login & User Profile Session
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('crm_is_authenticated') === 'true';
  });

  const [activeCaller, setActiveCaller] = useState(() => {
    return localStorage.getItem('crm_active_caller') || 'Vivek';
  });

  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('crm_caller_role') || 'Admin';
  });

  const [selectedUser, setSelectedUser] = useState(() => {
    const saved = localStorage.getItem('crm_active_caller') || 'Vivek';
    return TEAM_MEMBERS.find(m => m.name.toLowerCase() === saved.toLowerCase()) || TEAM_MEMBERS[0];
  });

  const [callerInput, setCallerInput] = useState(() => {
    return localStorage.getItem('crm_active_caller') || 'Vivek';
  });

  const [isSwitchCallerOpen, setIsSwitchCallerOpen] = useState(false);

  // Registrations state
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [leadCounts, setLeadCounts] = useState({ original: 0, coldcall: 0, confirmed: 0, admincall: 0, total: 0 });

  // Workshops state
  const [workshops, setWorkshops] = useState([]);
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);
  const [newWorkshop, setNewWorkshop] = useState({ date: '', location: '', maxSlots: 30 });

  // Auth inputs
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
      fetchWorkshops();
    }
  }, [isAuthenticated]);

  const fetchRegistrations = async () => {
    try {
      const [regsRes, countsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/registrations`),
        fetch(`${API_URL}/api/admin/lead-counts`)
      ]);

      const regsData = await regsRes.json();
      if (regsData.success) {
        setRegistrations(regsData.data);
      }

      const countsData = await countsRes.json();
      if (countsData.success && countsData.counts) {
        setLeadCounts(countsData.counts);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingRegs(false);
    }
  };

  const fetchWorkshops = async () => {
    try {
      const res = await fetch(`${API_URL}/api/workshops`);
      const data = await res.json();
      if (data.success) {
        setWorkshops(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWorkshops(false);
    }
  };

  const handleCreateWorkshop = async (e) => {
    e.preventDefault();
    if (!newWorkshop.date || !newWorkshop.location || !newWorkshop.maxSlots) return;
    
    try {
      const res = await fetch(`${API_URL}/api/admin/workshops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWorkshop)
      });
      if (res.ok) {
        setNewWorkshop({ date: '', location: '', maxSlots: 30 });
        fetchWorkshops();
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteWorkshop = async (id) => {
    if (!window.confirm('Are you sure? This will delete the workshop date.')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/workshops/${id}`, { method: 'DELETE' });
      if (res.ok) fetchWorkshops();
    } catch (err) { console.error(err); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const entered = password.trim();
    const targetUser = selectedUser || TEAM_MEMBERS.find(m => m.name.toLowerCase() === callerInput.toLowerCase().trim()) || { name: callerInput.trim() || 'Admin', role: 'Admin', pin: 'Action30' };

    // Matches user's specific PIN, or universal master password 'Action30'
    const isMaster = entered.toLowerCase() === 'action30';
    const isPinMatch = Boolean(targetUser.pin && entered === targetUser.pin);

    if (isMaster || isPinMatch) {
      const chosenCaller = callerInput.trim() || targetUser.name || 'Admin';
      const chosenRole = targetUser.role || 'Admin';

      // Persist across browser refreshes & tabs
      localStorage.setItem('crm_is_authenticated', 'true');
      localStorage.setItem('crm_active_caller', chosenCaller);
      localStorage.setItem('crm_caller_role', chosenRole);

      setActiveCaller(chosenCaller);
      setActiveRole(chosenRole);
      setIsAuthenticated(true);
      setError('');
      setPassword('');
    } else {
      setError(`Incorrect PIN/password. Enter PIN (${targetUser.pin}) or Action30`);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out from CRM Portal?')) {
      localStorage.removeItem('crm_is_authenticated');
      setIsAuthenticated(false);
      setPassword('');
      setError('');
    }
  };

  const handleSwitchCaller = (name, role = 'Caller') => {
    const chosen = name.trim() || 'Admin';
    localStorage.setItem('crm_active_caller', chosen);
    localStorage.setItem('crm_caller_role', role);
    setActiveCaller(chosen);
    setActiveRole(role);
    setCallerInput(chosen);
    const userObj = TEAM_MEMBERS.find(m => m.name.toLowerCase() === chosen.toLowerCase());
    if (userObj) setSelectedUser(userObj);
    setIsSwitchCallerOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050507] text-white flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#101018] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-[#3B82F6] flex items-center justify-center mx-auto mb-3 shadow-[0_0_25px_rgba(59,130,246,0.3)]">
              <Crown size={28} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">BanaviAeBrand CRM</h2>
            <p className="text-white/60 mt-1 text-xs">Select your profile to start calling & follow-ups</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Quick User Profiles Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={13} className="text-[#3B82F6]" /> Who is working today?
                </label>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck size={12} /> Auto-Saved
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2.5">
                {TEAM_MEMBERS.map((u) => {
                  const isSelected = selectedUser?.id === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        setSelectedUser(u);
                        setCallerInput(u.name);
                        setError('');
                      }}
                      className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-[1.02]'
                          : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">{u.avatar}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          u.role === 'Admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-pink-500/20 text-pink-300'
                        }`}>
                          {u.badge}
                        </span>
                      </div>
                      <div className="font-extrabold text-xs text-white truncate">{u.name}</div>
                      <div className="text-[10px] text-white/40 font-mono mt-0.5">PIN: {u.pin}</div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Caller Name Input */}
              <input
                type="text"
                value={callerInput}
                onChange={(e) => {
                  setCallerInput(e.target.value);
                  const matched = TEAM_MEMBERS.find(m => m.name.toLowerCase() === e.target.value.toLowerCase().trim());
                  if (matched) setSelectedUser(matched);
                }}
                placeholder="Or type custom caller name..."
                required
                className="w-full px-3.5 py-2 bg-black border border-white/10 rounded-xl text-white text-xs focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all placeholder:text-white/30"
              />
            </div>

            {/* PIN / Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                  <Key size={13} className="text-[#3B82F6]" /> Enter PIN or Master Password
                </label>
                {selectedUser && (
                  <span className="text-[10px] text-blue-400/80 font-mono">
                    PIN: <strong>{selectedUser.pin}</strong>
                  </span>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={`Enter PIN (${selectedUser?.pin || '1111'}) or Action30`}
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all text-sm font-mono tracking-widest"
                autoFocus
              />
              {error && <p className="text-red-400 text-xs mt-2 font-bold flex items-center gap-1">⚠️ {error}</p>}
            </div>

            {/* Persistence Guarantee Notice */}
            <div className="flex items-center gap-2 p-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-[11px] text-white/60">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>Refresh કરવાથી લૉગઆઉટ નહીં થાય. તમારું લૉગિન સેવ રહેશે.</span>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-[#3B82F6] text-black font-black uppercase tracking-wider rounded-xl hover:bg-[#2563EB] hover:text-white transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <span>Unlock as {callerInput || selectedUser?.name || 'User'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white p-4 sm:p-8 pt-20 sm:pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* ── Top Header & Tab Buttons Switcher ── */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 w-full xl:w-auto">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                <span>Banavi<span className="text-[#3B82F6]">Ae</span>Brand</span>
                <span className="text-sm font-bold px-3 py-1 rounded-full bg-blue-500/20 text-[#3B82F6] border border-blue-500/30">
                  CRM Portal
                </span>
              </h1>
              <p className="text-white/60 text-xs sm:text-sm mt-1">
                Lead Calling, Bulk Import (6,000+) & Admin Escalations
              </p>
            </div>

            {/* Active Caller Badge with Instant Switch Button & Logout Button */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#101018] border border-white/10 shadow-lg">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <div className="text-xs">
                <span className="text-white/40 block text-[10px] uppercase font-bold tracking-wider">Logged In As</span>
                <span className="font-extrabold text-white flex items-center gap-1.5">
                  <User size={13} className="text-[#3B82F6]" />
                  {activeCaller}
                  {activeRole && (
                    <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-500/20 text-[#3B82F6] text-[9px] font-bold uppercase">
                      {activeRole}
                    </span>
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSwitchCallerOpen(true)}
                className="ml-2 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-[11px] font-bold transition-all cursor-pointer border border-white/10 flex items-center gap-1"
                title="Switch User Profile"
              >
                Switch
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-[11px] font-bold transition-all cursor-pointer border border-red-500/20 flex items-center gap-1"
                title="Log Out from CRM"
              >
                <LogOut size={12} />
                Logout
              </button>
            </div>
          </div>

          
          {/* Main 5 Switcher Buttons */}
          <div className="flex flex-wrap items-center bg-[#101018] p-1.5 rounded-2xl border border-white/10 gap-1.5 shadow-xl w-full xl:w-auto">
            {/* 1. ORIGINAL LEADS BUTTON */}
            <button 
              onClick={() => setActiveTab('original')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'original' 
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users size={16} /> 
              <span>Original Leads</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'original' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
              }`}>
                {leadCounts.original}
              </span>
            </button>

            {/* 2. COLD CALL LEADS BUTTON */}
            <button 
              onClick={() => setActiveTab('coldcall')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'coldcall' 
                  ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <PhoneCall size={16} /> 
              <span>Cold Call Leads</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'coldcall' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
              }`}>
                {leadCounts.coldcall.toLocaleString()}
              </span>
            </button>

            {/* 3. CONFIRMED LEADS BUTTON */}
            <button 
              onClick={() => setActiveTab('confirmed')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'confirmed' 
                  ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award size={16} /> 
              <span>Confirmed Leads</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'confirmed' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
              }`}>
                {leadCounts.confirmed}
              </span>
            </button>

            {/* 4. ADMIN CALLS BUTTON (Next to Confirmed Leads!) */}
            <button 
              onClick={() => setActiveTab('admincall')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'admincall' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)]' 
                  : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/20'
              }`}
            >
              <Crown size={16} className={activeTab === 'admincall' ? 'text-black' : 'text-amber-400'} /> 
              <span>Admin Calls</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                activeTab === 'admincall' ? 'bg-black/25 text-black' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {leadCounts.admincall || 0}
              </span>
            </button>

            {/* 5. WORKSHOPS BUTTON */}
            <button 
              onClick={() => setActiveTab('workshops')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'workshops' 
                  ? 'bg-[#3B82F6] text-black shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar size={16} /> 
              <span>Workshops</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'workshops' ? 'bg-black/20 text-black' : 'bg-white/10 text-white/70'
              }`}>
                {workshops.length}
              </span>
            </button>
          </div>
        </div>

        {/* ── Caller Switcher Modal ── */}
        {isSwitchCallerOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#101018] rounded-3xl p-6 border border-white/10 max-w-sm w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                  <User size={16} className="text-[#3B82F6]" /> Switch User Profile
                </h3>
                <button onClick={() => setIsSwitchCallerOpen(false)} className="text-white/40 hover:text-white text-sm font-bold">✕</button>
              </div>
              <p className="text-xs text-white/60">Choose whose profile is calling and logging follow-ups:</p>
              <div className="grid grid-cols-2 gap-2">
                {TEAM_MEMBERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSwitchCaller(u.name, u.role)}
                    className={`py-2 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeCaller === u.name
                        ? 'bg-[#3B82F6] text-black shadow-md'
                        : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>{u.avatar} {u.name}</span>
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Or enter custom name & press Enter..."
                  className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-white text-xs outline-none focus:border-[#3B82F6]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      handleSwitchCaller(e.target.value.trim(), 'Caller');
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Tab Views ── */}
        {(activeTab === 'original' || activeTab === 'coldcall' || activeTab === 'confirmed' || activeTab === 'admincall') && (
          <FollowupDashboard 
            registrations={registrations} 
            fetchRegistrations={fetchRegistrations} 
            activeCategory={activeTab} 
            setActiveCategory={setActiveTab}
            workshops={workshops}
            activeCaller={activeCaller}
            setActiveCaller={setActiveCaller}
          />
        )}

        {/* Workshops Management Tab */}
        {activeTab === 'workshops' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-[#101018] rounded-3xl p-6 border border-white/10 sticky top-24 shadow-xl">
                <h3 className="text-lg font-black text-white uppercase tracking-wide mb-5 flex items-center gap-2">
                  <Calendar size={18} className="text-[#3B82F6]" /> Create New Workshop
                </h3>
                <form onSubmit={handleCreateWorkshop} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5">Date / Title</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                      <input 
                        type="text" required
                        value={newWorkshop.date} onChange={e => setNewWorkshop({...newWorkshop, date: e.target.value})}
                        placeholder="e.g. 4th October 2025"
                        className="w-full pl-9 pr-3 py-2.5 bg-black border border-white/10 rounded-xl text-white text-sm focus:border-[#3B82F6] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5">Location / City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                      <input 
                        type="text" required
                        value={newWorkshop.location} onChange={e => setNewWorkshop({...newWorkshop, location: e.target.value})}
                        placeholder="e.g. Surat, Gujarat"
                        className="w-full pl-9 pr-3 py-2.5 bg-black border border-white/10 rounded-xl text-white text-sm focus:border-[#3B82F6] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5">Max Slots Capacity</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                      <input 
                        type="number" required min="1" max="500"
                        value={newWorkshop.maxSlots} onChange={e => setNewWorkshop({...newWorkshop, maxSlots: e.target.value})}
                        className="w-full pl-9 pr-3 py-2.5 bg-black border border-white/10 rounded-xl text-white text-sm focus:border-[#3B82F6] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 mt-2 bg-[#3B82F6] text-black font-black rounded-xl hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-2 uppercase tracking-wide text-sm shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer">
                    <Plus size={16} /> Add Workshop
                  </button>
                </form>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-black text-white uppercase tracking-wide mb-1">Active Workshops</h3>
              {loadingWorkshops ? (
                <div className="text-white/40 p-4">Loading workshops...</div>
              ) : workshops.length === 0 ? (
                <div className="text-white/40 p-8 border border-white/10 rounded-2xl border-dashed text-center">
                  No workshops created yet. Use the form on the left to add your first batch!
                </div>
              ) : (
                workshops.map(ws => (
                  <div key={ws.id} className="bg-[#101018] rounded-2xl p-5 border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/20 transition-all shadow-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xl font-bold text-white">{ws.date}</h4>
                        {ws.isFull && <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">Sold Out</span>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/50">
                        <span className="flex items-center gap-1"><MapPin size={14} className="text-[#3B82F6]" /> {ws.location}</span>
                        <span className="flex items-center gap-1"><Users size={14} /> {ws.slotsBooked} / {ws.maxSlots} Booked</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="flex-1 md:w-32 h-2.5 bg-black rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-[#3B82F6] transition-all" 
                          style={{ width: `${Math.min(100, (ws.slotsBooked / ws.maxSlots) * 100)}%`, background: ws.isFull ? '#ef4444' : '#3B82F6' }}
                        />
                      </div>
                      <button onClick={() => handleDeleteWorkshop(ws.id)} className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
