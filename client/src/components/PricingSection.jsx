import React from 'react';
import { Check } from 'lucide-react';

export default function PricingSection() {
  const inclusions = [
    "Full-day practical experience",
    "Live Social Media learning",
    "Real business challenge",
    "Hook + content creation",
    "Shooting assistance",
    "Live editing guidance",
    "Publishing workflow",
    "Mentor feedback",
    "Pre-recorded supporting lessons",
    "Post-event team follow-up",
    "Founding 30 community"
  ];

  return (
    <section className="py-24 bg-[#101018] relative border-y border-white/10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-[#0A0A0F] border-2 border-[#3B82F6] rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(191,255,0,0.15)] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="text-center mb-12 relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="inline-block px-4 py-1 bg-[#3B82F6]/10 border border-[#3B82F6] text-[#3B82F6] rounded-full text-sm font-bold tracking-widest uppercase">
                FOUNDING BATCH
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full text-xs font-black uppercase tracking-wider animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.3)]">
                🔥 Only 5 Seats Left
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
              ₹10,000
            </h2>
            <p className="text-white/60 text-lg font-medium uppercase tracking-widest">
              ONE-DAY REAL-WORLD EXPERIENCE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-12 relative z-10 max-w-2xl mx-auto">
            {inclusions.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#3B82F6] shrink-0" />
                <span className="text-white font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="text-center relative z-10">
            <button 
              onClick={() => window.location.href = '#register'}
              className="px-10 py-5 bg-[#3B82F6] text-black text-lg md:text-xl font-black rounded-xl hover:bg-[#2563EB] transition-colors uppercase tracking-wider w-full md:w-auto shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105 duration-300"
            >
              APPLY FOR FOUNDING 30
            </button>
            <p className="text-red-400 mt-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              Hurry! Only 5 seats available for this batch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
