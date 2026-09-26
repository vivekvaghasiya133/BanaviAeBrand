import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Edit2, Shield, PhoneCall, Key, Lock, Check, X, Search, Crown, UserCheck } from 'lucide-react';
import { API_URL } from '../config';

export default function UserManagement({ currentUser, onUserListChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null when adding
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'Caller'
  });
  const [showPasswords, setShowPasswords] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/users`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        if (onUserListChange) onUserListChange(data.users);
      } else {
        setError(data.error || 'Failed to load users');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to server to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', username: '', password: '', role: 'Caller' });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password || '',
      role: user.role || 'Caller'
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim() || !formData.password.trim()) {
      setError('Please fill in Name, Username, and Password');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const url = editingUser 
        ? `${API_URL}/api/admin/users/${editingUser.id}` 
        : `${API_URL}/api/admin/users`;
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(editingUser ? `User "${formData.name}" updated successfully!` : `User "${formData.name}" created successfully!`);
        setTimeout(() => setSuccessMsg(''), 4000);
        setIsModalOpen(false);
        fetchUsers();
      } else {
        setError(data.error || 'Failed to save user');
      }
    } catch (err) {
      console.error(err);
      setError('Server error occurred while saving user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.name}" (@${user.username})?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`User "${user.name}" deleted.`);
        setTimeout(() => setSuccessMsg(''), 4000);
        fetchUsers();
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Top Header & Action ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#101018] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
            <Shield className="text-[#3B82F6]" size={24} />
            <span>User & Role Management</span>
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            Create user accounts, set passwords, and assign roles (Admin vs Caller).
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2">
          <Check size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── Filter / Search Bar ── */}
      <div className="flex items-center gap-3 bg-[#101018] px-4 py-3 rounded-2xl border border-white/10">
        <Search size={16} className="text-white/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, username, or role..."
          className="w-full bg-transparent text-white text-xs sm:text-sm outline-none placeholder:text-white/40"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white text-xs">
            Clear
          </button>
        )}
      </div>

      {/* ── Users Table ── */}
      <div className="bg-[#101018] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-white/50 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-4 px-6">User / Display Name</th>
                <th className="py-4 px-6">Username</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Password</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-white/40">
                    Loading users from database...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-white/40">
                    No users found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = currentUser?.username === u.username;
                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${
                            u.role === 'Admin'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/20 text-[#3B82F6] border border-blue-500/30'
                          }`}>
                            {u.role === 'Admin' ? '👑' : '📞'}
                          </div>
                          <div>
                            <div className="font-extrabold text-white flex items-center gap-2">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-white/40 text-[11px] block mt-0.5">
                              Created: {new Date(u.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono font-bold text-white/90">
                        @{u.username}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${
                          u.role === 'Admin'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-blue-500/15 text-[#3B82F6] border-blue-500/30'
                        }`}>
                          {u.role === 'Admin' ? <Crown size={12} /> : <PhoneCall size={12} />}
                          <span>{u.role}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs bg-black/60 px-2.5 py-1 rounded-lg border border-white/10 text-white/80">
                            {showPasswords[u.id] ? u.password : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(u.id)}
                            className="text-white/40 hover:text-white text-[11px] font-bold"
                          >
                            {showPasswords[u.id] ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer border border-white/10"
                            title="Edit User"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer border border-red-500/20"
                            title="Delete User"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit User Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101018] rounded-3xl p-6 sm:p-8 border border-white/10 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-black text-white text-lg uppercase tracking-tight flex items-center gap-2">
                {editingUser ? <Edit2 size={18} className="text-[#3B82F6]" /> : <UserPlus size={18} className="text-[#3B82F6]" />}
                <span>{editingUser ? 'Edit User Profile' : 'Create New User'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 hover:text-white text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Full Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pooja Ma'am or Vivek"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white text-sm focus:border-[#3B82F6] outline-none transition-all"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Login Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. pooja, vivek"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white text-sm font-mono focus:border-[#3B82F6] outline-none transition-all"
                />
                <span className="text-[10px] text-white/40 mt-1 block">
                  Lowercase, no spaces (used to log in).
                </span>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter login password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white text-sm font-mono focus:border-[#3B82F6] outline-none transition-all"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Assign User Role *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'Caller' })}
                    className={`py-3 px-3 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.role === 'Caller'
                        ? 'bg-blue-600/20 border-blue-500 shadow-md'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs text-white">
                      <span>📞 Caller</span>
                    </div>
                    <span className="text-[10px] text-white/50 block mt-1">Calling & follow-up logs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'Admin' })}
                    className={`py-3 px-3 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.role === 'Admin'
                        ? 'bg-amber-500/20 border-amber-500 shadow-md'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs text-amber-300">
                      <span>👑 Admin</span>
                    </div>
                    <span className="text-[10px] text-white/50 block mt-1">Full control & manage users</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
