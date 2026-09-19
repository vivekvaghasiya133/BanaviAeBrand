import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

export default function BanaviAeBrandIntro() {
  return (
    <section className="py-24 bg-[#050507] text-white relative border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            WHAT IS <span className="text-lime">BanaviAeBrand?</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            “એક દિવસ શીખવાનું નહીં — એક દિવસ કરીને બતાવવાનું.”<br/>
            You won't just learn Social Media. You'll use it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* This is NOT */}
          <div className="bg-red-900/10 border border-red-500/20 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <h3 className="text-2xl font-black text-red-400 mb-6 flex items-center gap-3">
              <XCircle className="w-8 h-8" />
              THIS IS NOT:
            </h3>
            <ul className="space-y-4">
              {[
                "30 days of lectures",
                "Just recorded videos",
                "Theory-only learning",
                "A certificate-focused workshop",
                "Sitting and taking notes all day"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-white/60 font-medium text-lg">
                  <span className="text-red-500/50 mt-1">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* This IS */}
          <div className="bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-lime"></div>
            <h3 className="text-2xl font-black text-[#3B82F6] mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8" />
              THIS IS:
            </h3>
            <ul className="space-y-4">
              {[
                "One full day of practical learning",
                "Real business challenges",
                "Real content decisions",
                "Real shooting & editing",
                "Real publishing",
                "Mentor feedback & Team assistance",
                "Post-event follow-up",
                "Founding 30 community"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-white font-bold text-lg">
                  <span className="text-[#3B82F6] mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
