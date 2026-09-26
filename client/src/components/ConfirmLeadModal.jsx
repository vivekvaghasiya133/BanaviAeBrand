import React, { useState } from 'react';
import { Award, CheckCircle, X, Calendar, DollarSign, UserCheck, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';

export default function ConfirmLeadModal({ isOpen, onClose, lead, workshops = [], onSuccess, defaultCaller = 'Admin' }) {
  if (!isOpen || !lead) return null;

  const [confirmedCourse, setConfirmedCourse] = useState(
    lead.workshopDate || (workshops.length > 0 ? workshops[0].date : '4th October 2025 (Surat)')
  );
  const [confirmedNote, setConfirmedNote] = useState('');
  const [callerName, setCallerName] = useState(lead.latestCallerName || defaultCaller);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/admin/registrations/${lead.id}/confirm`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmedCourse,
          confirmedNote,
          callerName
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess?.();
        onClose?.();
      } else {
        setError(data.error || 'Failed to confirm lead.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error confirming lead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101018] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Award size={22} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Confirm Lead For Course
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Mark student as confirmed & enrolled in course
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Lead Summary Pill */}
          <div className="p-4 bg-black/50 border border-white/5 rounded-2xl flex items-center justify-between">
            <div>
              <div className="font-extrabold text-white text-base">{lead.name}</div>
              <div className="text-xs text-[#3B82F6] font-mono mt-0.5">{lead.phone}</div>
              {lead.tag && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-white/60">
                  Tag: {lead.tag}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-[#3B82F6] border border-blue-500/20">
                {lead.leadType === 'coldcall' ? 'Cold Call Lead' : 'Original Lead'}
              </span>
            </div>
          </div>

          {/* Course / Workshop Selection */}
          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar size={13} className="text-[#3B82F6]" /> Select Course / Batch Date *
            </label>
            <select
              value={confirmedCourse}
              onChange={(e) => setConfirmedCourse(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white text-sm focus:border-[#3B82F6] outline-none"
              required
            >
              {workshops.map(ws => (
                <option key={ws.id} value={`${ws.date} (${ws.location})`}>
                  {ws.date} — {ws.location} ({ws.slotsBooked}/{ws.maxSlots} Booked)
                </option>
              ))}
              <option value="4th October 2025 (Surat)">4th October 2025 (Surat)</option>
              <option value="Online 1-on-1 Content Mentorship">Online 1-on-1 Content Mentorship</option>
              <option value="Personal Brand Mastery">Personal Brand Mastery</option>
              <option value="Custom Batch / Course">Custom Batch / Course</option>
            </select>
          </div>

          {/* Payment & Confirmation Note */}
          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <DollarSign size={13} className="text-emerald-400" /> Payment & Confirmation Notes
            </label>
            <input
              type="text"
              value={confirmedNote}
              onChange={(e) => setConfirmedNote(e.target.value)}
              placeholder="e.g. ₹2000 token advance paid via GPay, rest on arrival"
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white text-sm focus:border-[#3B82F6] outline-none"
            />
          </div>

          {/* Caller / Executive */}
          <div>
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <UserCheck size={13} className="text-[#3B82F6]" /> Confirmed By (Caller Name)
            </label>
            <input
              type="text"
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
              placeholder="e.g. Pooja Ma'am, Admin"
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white text-sm focus:border-[#3B82F6] outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 text-sm font-semibold transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
            >
              <CheckCircle size={16} />
              <span>{isSubmitting ? 'Confirming...' : 'Confirm Student & Enroll'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
