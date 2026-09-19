import React from 'react';
import { PlayCircle } from 'lucide-react';

export default function PreRecorded() {
  const topics = [
    "Social Media fundamentals",
    "Instagram basics",
    "Content fundamentals",
    "Hooks",
    "Reel structure",
    "Shooting basics",
    "Editing basics",
    "Publishing basics",
    "Supporting software tutorials"
  ];

  return (
    <section className="py-24 bg-black relative">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="bg-[#101018] border border-white/10 rounded-3xl p-8 md:p-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
              BEFORE YOU ARRIVE
            </h2>
            <p className="text-xl text-[#3B82F6] font-medium uppercase tracking-widest">
              "Learn the basics before the day. Use the day to execute."
            </p>
            <p className="text-white/60 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
              Participants will receive supporting pre-recorded learning material. The pre-recorded material is NOT the main experience. It exists so participants can prepare before the event and use the videos later as reference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, idx) => (
              <div key={idx} className="bg-[#050507] border border-white/10 rounded-xl p-6 flex items-start gap-4 hover:border-[#3B82F6]/50 transition-colors group">
                <PlayCircle className="w-6 h-6 text-white/60 group-hover:text-[#3B82F6] shrink-0 transition-colors" />
                <span className="text-white font-medium">{topic}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
