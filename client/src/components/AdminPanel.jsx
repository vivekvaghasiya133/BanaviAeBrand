import React, { useState, useEffect } from 'react';
import { Users, Search, Download, Trash2, Calendar, MapPin, Hash, Plus, PhoneCall, Edit2, X, Check } from 'lucide-react';
import { API_URL } from '../config';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('registrations'); // 'registrations' | 'workshops' | 'followups'
  
  // Followups State
  const [followupFilter, setFollowupFilter] = useState('All'); // All, Pending, Interested, Not Interested, Done
  const [editingFollowUpId, setEditingFollowUpId] = useState(null);
  const [editForm, setEditForm] = useState({ status: 'Pending', assignedTo: '', followUpDate: '', notes: '' });
  // Registrations state
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
      const res = await fetch(`${API_URL}/api/admin/registrations`);
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.data);
      }
    } catch (err) {
      console.error(err);
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

  const handleDeleteReg = async (id) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/registrations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRegistrations(registrations.filter(r => r.id !== id));
        fetchWorkshops(); // refresh counts
      }
    } catch (err) { console.error(err); }
  };

  const handleEditClick = (reg) => {
    setEditingFollowUpId(reg.id);
    setEditForm({
      status: reg.status || 'Pending',
      assignedTo: reg.assignedTo || '',
      followUpDate: reg.followUpDate || '',
      notes: reg.notes || ''
    });
  };

  const handleUpdateFollowUp = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/registrations/${id}/followup`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(registrations.map(r => r.id === id ? data.data : r));
        setEditingFollowUpId(null);
      }
    } catch (err) { console.error(err); }
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

  const filteredRegistrations = registrations.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.phone.includes(searchTerm)
  );

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
            <p className="text-white/60 mt-2 text-sm">Enter password to view registrations</p>
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
              className="w-full py-3 bg-[#3B82F6] text-black font-black uppercase tracking-wider rounded-xl hover:bg-[#2563EB] transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#3B82F6] tracking-tight uppercase">Admin Dashboard</h1>
            <p className="text-white/60 mt-1">Manage BanaviAeBrand Workshops & Registrations</p>
          </div>
          
          <div className="flex bg-[#101018] p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setActiveTab('registrations')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'registrations' ? 'bg-[#3B82F6] text-black shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-white/60 hover:text-white'}`}
            >
              <Users size={16} /> Registrations
            </button>
            <button 
              onClick={() => setActiveTab('workshops')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'workshops' ? 'bg-[#3B82F6] text-black shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-white/60 hover:text-white'}`}
            >
              <Calendar size={16} /> Workshops
            </button>
            <button 
              onClick={() => setActiveTab('followups')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'followups' ? 'bg-[#3B82F6] text-black shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-white/60 hover:text-white'}`}
            >
              <PhoneCall size={16} /> Follow-ups
            </button>
          </div>
        </div>

        {activeTab === 'registrations' && (
          <>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3 top-3 text-white/40" />
                <input 
                  type="text" 
                  placeholder="Search name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#101018] border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#3B82F6] outline-none transition-all"
                />
              </div>
              <button className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-sm">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            <div className="bg-[#101018] rounded-2xl shadow-xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/40 border-b border-white/5">
                      <th className="p-4 font-bold text-white/50 text-xs uppercase tracking-wider">Name & City</th>
                      <th className="p-4 font-bold text-white/50 text-xs uppercase tracking-wider">Contact</th>
                      <th className="p-4 font-bold text-white/50 text-xs uppercase tracking-wider">Profession</th>
                      <th className="p-4 font-bold text-white/50 text-xs uppercase tracking-wider">Workshop</th>
                      <th className="p-4 font-bold text-white/50 text-xs uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadingRegs ? (
                      <tr><td colSpan="5" className="p-8 text-center text-white/40">Loading...</td></tr>
                    ) : filteredRegistrations.length === 0 ? (
                      <tr><td colSpan="5" className="p-8 text-center text-white/40">No registrations found.</td></tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-white">{reg.name}</div>
                            <div className="text-xs text-white/40 mt-0.5">{reg.city}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-white/80">{reg.phone}</div>
                            <div className="text-xs text-[#3B82F6] mt-0.5">{reg.email}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-white/80">{reg.profession}</div>
                            <div className="text-xs text-white/40 mt-0.5">{reg.interestArea}</div>
                          </td>
                          <td className="p-4">
                            <div className="inline-block px-2 py-1 rounded bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-bold border border-[#3B82F6]/20">
                              {reg.workshopDate}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => handleDeleteReg(reg.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'workshops' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-[#101018] rounded-2xl p-6 border border-white/10 sticky top-24">
                <h3 className="text-lg font-black text-white uppercase tracking-wide mb-5">Create New Workshop</h3>
                <form onSubmit={handleCreateWorkshop} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5">Date / Title</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                      <input 
                        type="text" required
                        value={newWorkshop.date} onChange={e => setNewWorkshop({...newWorkshop, date: e.target.value})}
                        placeholder="e.g. 15th November 2026"
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
                        type="number" required min="1" max="200"
                        value={newWorkshop.maxSlots} onChange={e => setNewWorkshop({...newWorkshop, maxSlots: e.target.value})}
                        className="w-full pl-9 pr-3 py-2.5 bg-black border border-white/10 rounded-xl text-white text-sm focus:border-[#3B82F6] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 mt-2 bg-[#3B82F6] text-black font-black rounded-xl hover:bg-[#2563EB] transition-colors flex items-center justify-center gap-2 uppercase tracking-wide text-sm shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <Plus size={16} /> Add Workshop
                  </button>
                </form>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-black text-white uppercase tracking-wide mb-1">Active Workshops</h3>
              {loadingWorkshops ? (
                <div className="text-white/40 p-4">Loading...</div>
              ) : workshops.length === 0 ? (
                <div className="text-white/40 p-4 border border-white/10 rounded-xl border-dashed">No workshops created yet.</div>
              ) : (
                workshops.map(ws => (
                  <div key={ws.id} className="bg-[#101018] rounded-2xl p-5 border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/20 transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xl font-bold text-white">{ws.date}</h4>
                        {ws.isFull && <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">Sold Out</span>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/50">
                        <span className="flex items-center gap-1"><MapPin size={14} /> {ws.location}</span>
                        <span className="flex items-center gap-1"><Users size={14} /> {ws.slotsBooked} / {ws.maxSlots} Booked</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="flex-1 md:w-32 h-2 bg-black rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-[#3B82F6] transition-all" 
                          style={{ width: `${(ws.slotsBooked / ws.maxSlots) * 100}%`, background: ws.isFull ? '#ef4444' : '#3B82F6' }}
                        />
                      </div>
                      <button onClick={() => handleDeleteWorkshop(ws.id)} className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'followups' && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex gap-2">
                {['All', 'Pending', 'Interested', 'Not Interested', 'Done'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFollowupFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${followupFilter === status ? 'bg-[#3B82F6] text-black border-[#3B82F6]' : 'bg-transparent text-white/60 border-white/10 hover:border-white/30'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="relative flex-1 max-w-sm">
                <Search className="w-5 h-5 absolute left-3 top-3 text-white/40" />
                <input 
                  type="text" 
                  placeholder="Search name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#101018] border border-white/10 rounded-xl text-white focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="bg-[#101018] rounded-2xl shadow-xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/40 border-b border-white/5">
                      <th className="p-4 font-bold text-white/50 text-xs uppercase tracking-wider">Lead Info</th>
                      <th className="p-4 font-bold text-white/50 text-xs uppercase tracking-wider">Status</th>
                      <th className="p-4 font-bold text-white/50 text-xs uppercase tracking-wider">Assigned To</th>
                      <th className="p-4 font-bold text-white/50 text-xs uppercase tracking-wider">Follow Up Date</th>
                      <th className="p-4 font-bold text-white/50 text-xs uppercase tracking-wider">Notes</th>
                      <th className="p-4 font-bold text-white/50 text-xs uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadingRegs ? (
                      <tr><td colSpan="6" className="p-8 text-center text-white/40">Loading...</td></tr>
                    ) : filteredRegistrations.filter(r => followupFilter === 'All' || (r.status || 'Pending') === followupFilter).length === 0 ? (
                      <tr><td colSpan="6" className="p-8 text-center text-white/40">No leads found.</td></tr>
                    ) : (
                      filteredRegistrations
                        .filter(r => followupFilter === 'All' || (r.status || 'Pending') === followupFilter)
                        .map((reg) => (
                          <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-4">
                              <div className="font-bold text-white">{reg.name}</div>
                              <div className="text-sm text-[#3B82F6]">{reg.phone}</div>
                            </td>
                            {editingFollowUpId === reg.id ? (
                              <td colSpan="5" className="p-4 bg-black/50">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                  <div>
                                    <label className="block text-xs font-bold text-white/50 mb-1">Status</label>
                                    <select 
                                      value={editForm.status} 
                                      onChange={e => setEditForm({...editForm, status: e.target.value})}
                                      className="w-full bg-[#101018] border border-white/20 text-white rounded-lg p-2 text-sm focus:border-[#3B82F6] outline-none"
                                    >
                                      <option>Pending</option>
                                      <option>Interested</option>
                                      <option>Not Interested</option>
                                      <option>Done</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-white/50 mb-1">Assigned To</label>
                                    <input 
                                      type="text" 
                                      value={editForm.assignedTo} 
                                      onChange={e => setEditForm({...editForm, assignedTo: e.target.value})}
                                      placeholder="e.g. Kuldeep"
                                      className="w-full bg-[#101018] border border-white/20 text-white rounded-lg p-2 text-sm focus:border-[#3B82F6] outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-white/50 mb-1">Date / Time</label>
                                    <input 
                                      type="text" 
                                      value={editForm.followUpDate} 
                                      onChange={e => setEditForm({...editForm, followUpDate: e.target.value})}
                                      placeholder="e.g. Tomorrow 10 AM"
                                      className="w-full bg-[#101018] border border-white/20 text-white rounded-lg p-2 text-sm focus:border-[#3B82F6] outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-white/50 mb-1">Notes</label>
                                    <input 
                                      type="text" 
                                      value={editForm.notes} 
                                      onChange={e => setEditForm({...editForm, notes: e.target.value})}
                                      placeholder="Remarks..."
                                      className="w-full bg-[#101018] border border-white/20 text-white rounded-lg p-2 text-sm focus:border-[#3B82F6] outline-none"
                                    />
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-end gap-2">
                                  <button onClick={() => setEditingFollowUpId(null)} className="px-4 py-2 rounded-lg text-sm font-bold text-white/60 hover:bg-white/10 transition-colors">
                                    Cancel
                                  </button>
                                  <button onClick={() => handleUpdateFollowUp(reg.id)} className="px-4 py-2 rounded-lg text-sm font-bold bg-[#3B82F6] text-black hover:bg-[#2563EB] transition-colors flex items-center gap-1">
                                    <Check size={14} /> Save
                                  </button>
                                </div>
                              </td>
                            ) : (
                              <>
                                <td className="p-4">
                                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border
                                    ${(reg.status || 'Pending') === 'Pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                                      reg.status === 'Interested' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                      reg.status === 'Not Interested' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    }`}>
                                    {reg.status || 'Pending'}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="text-sm text-white/80">{reg.assignedTo || '-'}</div>
                                </td>
                                <td className="p-4">
                                  <div className={`text-sm ${reg.followUpDate ? 'text-white' : 'text-white/40'}`}>{reg.followUpDate || 'Not set'}</div>
                                </td>
                                <td className="p-4 max-w-[200px] truncate">
                                  <div className="text-xs text-white/60" title={reg.notes}>{reg.notes || '-'}</div>
                                </td>
                                <td className="p-4 text-right">
                                  <button onClick={() => handleEditClick(reg)} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
