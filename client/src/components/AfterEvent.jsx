import React from 'react';
import { Target, Users, ArrowUpRight } from 'lucide-react';

export default function AfterEvent() {
  const points = [
    "Our team tracks participant progress.",
    "Pending content is followed up.",
    "Participants receive assistance where required.",
    "The goal is to complete the assigned content.",
    "Once the group reaches completion, we continue the community and discuss the next-level experience."
  ];

  return (
    <section className="py-24 bg-[#101018] border-y border-white/10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-8">
          THE DAY DOESN'T END <br/>
          <span className="text-lime">WHEN YOU LEAVE.</span>
        </h2>

        <div className="bg-[#050507] border border-white/10 rounded-3xl p-8 md:p-12 text-left shadow-2xl mb-8">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-3">
            <Target className="text-[#3B82F6] w-6 h-6" />
            After the live experience:
          </h3>
          <ul className="space-y-4">
            {points.map((point, idx) => (
              <li key={idx} className="flex items-start gap-4 text-white/60 text-lg">
                <span className="text-[#3B82F6] font-bold mt-1">{idx + 1}.</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-white/50 text-sm font-medium uppercase tracking-widest border border-white/10 inline-block px-6 py-2 rounded-full">
          Post-event follow-up and assistance will be provided as part of the Founding Batch experience.
        </p>

      </div>
    </section>
  );
}
