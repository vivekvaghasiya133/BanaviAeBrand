import React, { useState } from 'react';
import { X, Check, ArrowRight, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export default function ProjectOnboardingModal({ isOpen, onClose }) {
  const [services, setServices] = useState(['Meta & Google Ads']);
  const [budget, setBudget] = useState('$5,000 - $10,000');
  const [timeline, setTimeline] = useState('Within 1 month');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  if (!isOpen) return null;

  const availableServices = [
    'Web Design',
    'Social Media & UGC',
    'Meta & Google Ads',
    'AI SEO',
    'AI Assistants & Automations',
    'Non-Profit Google Grants'
  ];

  const budgetOptions = [
    '$3,500 - $5,000/mo',
    '$5,000 - $10,000/mo',
    '$10,000 - $25,000/mo',
    '$25,000+/mo'
  ];

  const toggleService = (s) => {
    if (services.includes(s)) {
      setServices(services.filter((item) => item !== s));
    } else {
      setServices([...services, s]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          services,
          budget,
          timeline,
          message
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#090910] border border-white/20 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.9)] my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="text-center py-12 space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#3B82F6]/20 text-[#3B82F6] mx-auto flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>

            <h3 className="text-3xl font-black text-white">Project Initiated!</h3>
            <p className="text-white/70 max-w-md mx-auto text-sm leading-relaxed">
              Thank you, {name}. Our senior partners in Miami and Maya AI are reviewing your requirements.
              We'll be in touch within 24 hours with a custom strategic blueprint.
            </p>

            <button
              onClick={() => {
                setStatus('idle');
                onClose();
              }}
              className="px-8 py-3 rounded-xl bg-[#3B82F6] text-black font-bold text-sm hover:bg-[#2563EB] transition-colors"
            >
              Back to Overview
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-mono uppercase tracking-widest mb-3">
                <Sparkles size={12} />
                <span>Kickoff Project</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase">
                Let's Build Something <br />
                <span className="text-[#3B82F6]">Exceptional.</span>
              </h2>
              <p className="text-white/60 text-sm mt-2">
                Tell us about your objectives. We'll tailor a performance roadmap for your brand.
              </p>
            </div>

            {/* Step 1: Select Services */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                1. What services are you interested in?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableServices.map((s) => {
                  const isSelected = services.includes(s);
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleService(s)}
                      className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#3B82F6] text-black border-[#3B82F6] font-bold shadow-[0_0_15px_rgba(191,255,0,0.3)]'
                          : 'bg-white/[0.03] text-white/70 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span>{s}</span>
                      {isSelected && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Budget */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                2. Monthly Growth Budget
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {budgetOptions.map((b) => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setBudget(b)}
                    className={`py-2.5 px-3 rounded-xl text-center text-xs font-semibold border transition-all ${
                      budget === b
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-white/[0.03] text-white/70 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Contact Details */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                3. Contact Information
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#3B82F6] rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  required
                  placeholder="Business Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#3B82F6] rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Company / Website"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#3B82F6] rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Timeline (e.g. Immediately)"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#3B82F6] rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none transition-colors"
                />
              </div>

              <textarea
                rows={3}
                placeholder="Share your goals, current bottlenecks, or target milestones..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 focus:border-[#3B82F6] rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-4 rounded-xl bg-[#3B82F6] text-black font-bold text-base hover:bg-[#2563EB] shadow-[0_0_25px_rgba(191,255,0,0.4)] transition-all flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? (
                <span>Submitting Project Brief...</span>
              ) : (
                <>
                  <span>Submit Project Inquiry</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
