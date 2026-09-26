import React, { useState, useEffect } from 'react';
import { Users, Search, Download, Trash2, Calendar, MapPin, Hash, Plus, PhoneCall, Award, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../config';
import FollowupDashboard from './FollowupDashboard';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('original'); // 'original' | 'coldcall' | 'confirmed' | 'workshops'

  // Registrations state
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [leadCounts, setLeadCounts] = useState({ original: 0, coldcall: 0, confirmed: 0, total: 0 });

  // Workshops state
  const [workshops, setWorkshops] = useState([]);
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);
  const [newWorkshop, setNewWorkshop] = useState({ date: '', location: '', maxSlots: 30 });

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    if (password === 'Action30') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050507] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#101018] rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Admin Access</h2>
            <p className="text-white/60 mt-2 text-sm">Enter password to unlock CRM Dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all"
                autoFocus
              />
              {error && <p className="text-red-400 text-xs mt-2 font-bold">{error}</p>}
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-[#3B82F6] text-black font-black uppercase tracking-wider rounded-xl hover:bg-[#2563EB] transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer"
            >
              Unlock Dashboard
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
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase flex items-center gap-3">
              <span>Banavi<span className="text-[#3B82F6]">Ae</span>Brand</span>
              <span className="text-sm font-bold px-3 py-1 rounded-full bg-blue-500/20 text-[#3B82F6] border border-blue-500/30">
                CRM Portal
              </span>
            </h1>
            <p className="text-white/60 text-xs sm:text-sm mt-1">
              Lead Calling, Bulk Import (6,000+) & Course Enrollment System
            </p>
          </div>
          
          {/* Main 4 Switcher Buttons */}
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

            {/* 4. WORKSHOPS BUTTON */}
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

        {/* ── Tab Views ── */}
        {(activeTab === 'original' || activeTab === 'coldcall' || activeTab === 'confirmed') && (
          <FollowupDashboard 
            registrations={registrations} 
            fetchRegistrations={fetchRegistrations} 
            activeCategory={activeTab} 
            setActiveCategory={setActiveTab}
            workshops={workshops}
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
