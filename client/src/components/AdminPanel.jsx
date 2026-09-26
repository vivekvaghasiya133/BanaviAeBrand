import React, { useState, useEffect } from 'react';
import { Users, Search, Download, Trash2, Calendar, MapPin, Hash, Plus, PhoneCall, Award, CheckCircle2, Crown, User, RefreshCw, LogOut, Key, ShieldCheck, Check, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../config';
import FollowupDashboard from './FollowupDashboard';
import UserManagement from './UserManagement';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('original'); // 'original' | 'coldcall' | 'confirmed' | 'admincall' | 'workshops' | 'users'

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

  const [currentUsername, setCurrentUsername] = useState(() => {
    return localStorage.getItem('crm_username') || 'vivek';
  });

  const [callerInput, setCallerInput] = useState(() => {
    return localStorage.getItem('crm_active_caller') || 'Vivek';
  });

  const [isSwitchCallerOpen, setIsSwitchCallerOpen] = useState(false);
  const [teamUsers, setTeamUsers] = useState([]);

  // Registrations state
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [leadCounts, setLeadCounts] = useState({ original: 0, coldcall: 0, confirmed: 0, admincall: 0, total: 0 });

  // Workshops state
  const [workshops, setWorkshops] = useState([]);
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);
  const [newWorkshop, setNewWorkshop] = useState({ date: '', location: '', maxSlots: 30 });

  // Login inputs
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
      fetchWorkshops();
      fetchUsers();
    }
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`);
      const data = await res.json();
      if (data.success && data.users) {
        setTeamUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching users in AdminPanel:', err);
    }
  };

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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both username and password');
      return;
    }

    try {
      setIsLoggingIn(true);
      setLoginError('');
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword.trim()
        })
      });

      const data = await res.json();
      if (data.success && data.user) {
        // Persist session across browser refresh
        localStorage.setItem('crm_is_authenticated', 'true');
        localStorage.setItem('crm_active_caller', data.user.name);
        localStorage.setItem('crm_caller_role', data.user.role);
        localStorage.setItem('crm_username', data.user.username);

        setActiveCaller(data.user.name);
        setActiveRole(data.user.role);
        setCurrentUsername(data.user.username);
        setIsAuthenticated(true);
        setLoginPassword('');
        setLoginError('');
      } else {
        setLoginError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback in case of emergency: allow Action30 master password
      if (loginPassword.trim() === 'Action30') {
        const fallbackName = loginUsername.trim() || 'Admin';
        localStorage.setItem('crm_is_authenticated', 'true');
        localStorage.setItem('crm_active_caller', fallbackName);
        localStorage.setItem('crm_caller_role', 'Admin');
        localStorage.setItem('crm_username', fallbackName.toLowerCase());

        setActiveCaller(fallbackName);
        setActiveRole('Admin');
        setCurrentUsername(fallbackName.toLowerCase());
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError('Server error. Check backend connection or password.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out from CRM Portal?')) {
      localStorage.removeItem('crm_is_authenticated');
      localStorage.removeItem('crm_username');
      setIsAuthenticated(false);
      setLoginPassword('');
      setLoginError('');
    }
  };

  const handleSwitchCaller = (name, role = 'Caller') => {
    const chosen = name.trim() || 'Admin';
    localStorage.setItem('crm_active_caller', chosen);
    localStorage.setItem('crm_caller_role', role);
    setActiveCaller(chosen);
    setActiveRole(role);
    setCallerInput(chosen);
    setIsSwitchCallerOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050507] text-white flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-[#101018] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-[#3B82F6] flex items-center justify-center mx-auto mb-3 shadow-[0_0_25px_rgba(59,130,246,0.3)]">
              <Shield size={28} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">BanaviAeBrand CRM</h2>
            <p className="text-white/60 mt-1 text-xs">Enter your Username & Password to access dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-[#3B82F6]" /> Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="e.g. vivek, pooja, manthan"
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white text-sm font-mono focus:border-[#3B82F6] outline-none transition-all placeholder:text-white/30"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock size={13} className="text-[#3B82F6]" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-11 bg-black border border-white/10 rounded-xl text-white text-sm focus:border-[#3B82F6] outline-none transition-all placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold flex items-center gap-2">
                <span>⚠️ {loginError}</span>
              </div>
            )}

            {/* Persistence Guarantee Notice */}
            <div className="flex items-center gap-2 p-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-[11px] text-white/60">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>Refresh કરવાથી લૉગઆઉટ નહીં થાય. બ્રાઉઝરમાં લૉગિન સેવ રહેશે.</span>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-wider rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Logging In...</span>
                </>
              ) : (
                <span>Login to CRM Dashboard</span>
              )}
            </button>
          </form>

          {/* Quick Helper */}
          <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <span className="text-[11px] text-white/40 block">
              💡 Users & Roles (Admin / Caller) can be created inside Admin Panel.
            </span>
          </div>
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
          
          {/* Main 6 Switcher Buttons */}
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

            {/* 4. ADMIN CALLS BUTTON */}
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

            {/* 6. MANAGE USERS BUTTON */}
            <button 
              onClick={() => setActiveTab('users')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'users' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield size={16} /> 
              <span>Users</span>
              {teamUsers.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
                }`}>
                  {teamUsers.length}
                </span>
              )}
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
                {(teamUsers.length > 0 ? teamUsers : [
                  { id: '1', name: 'Vivek', role: 'Admin' },
                  { id: '2', name: 'Manthan', role: 'Admin' },
                  { id: '3', name: 'Jaydeep', role: 'Admin' },
                  { id: '4', name: 'Kuldeep', role: 'Admin' },
                  { id: '5', name: 'Pooja Ma\'am', role: 'Caller' }
                ]).map((u) => (
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
                    <span>{u.role === 'Admin' ? '👑' : '📞'} {u.name}</span>
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

        {/* ── User Management Tab ── */}
        {activeTab === 'users' && (
          <UserManagement
            currentUser={{ username: currentUsername, name: activeCaller, role: activeRole }}
            onUserListChange={setTeamUsers}
          />
        )}

        {/* ── Workshops Management Tab ── */}
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
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5">Max Slots</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                      <input 
                        type="number" required min="1"
                        value={newWorkshop.maxSlots} onChange={e => setNewWorkshop({...newWorkshop, maxSlots: parseInt(e.target.value) || 0})}
                        className="w-full pl-9 pr-3 py-2.5 bg-black border border-white/10 rounded-xl text-white text-sm focus:border-[#3B82F6] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-3 bg-[#3B82F6] text-black font-black uppercase tracking-wider rounded-xl hover:bg-[#2563EB] hover:text-white transition-colors cursor-pointer text-xs flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Create Workshop Date
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
