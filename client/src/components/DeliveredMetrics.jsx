import React from 'react';
import { Target, Users, Play, Clock, Smartphone, Zap } from 'lucide-react';

export default function DeliveredMetrics() {
  const metrics = [
    {
      value: "1",
      unit: "DAY",
      label: "Full Immersion",
      icon: <Clock className="w-5 h-5 text-lime" />,
    },
    {
      value: "30",
      unit: "SEATS",
      label: "Limited Batch",
      icon: <Users className="w-5 h-5 text-[#00D4E8]" />,
    },
    {
      value: "30",
      unit: "BRANDS",
      label: "Real Challenges",
      icon: <Target className="w-5 h-5 text-[#EC4899]" />,
    },
    {
      value: "100%",
      unit: "PRACTICAL",
      label: "Execution Focus",
      icon: <Zap className="w-5 h-5 text-[#F59E0B]" />,
    },
    {
      value: "1",
      unit: "REEL",
      label: "Finished Product",
      icon: <Play className="w-5 h-5 text-[#8B5CF6]" />,
    },
    {
      value: "∞",
      unit: "IMPACT",
      label: "Social Media Strategy",
      icon: <Smartphone className="w-5 h-5 text-[#F43F5E]" />,
    }
  ];

  return (
    <section className="py-24 bg-black border-y border-white/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <p className="text-[#3B82F6] text-xs font-bold tracking-[0.4em] uppercase mb-4">
            The Output
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            WHAT YOU WILL <span className="text-lime">EXPERIENCE</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {metrics.map((m, idx) => (
            <div 
              key={idx} 
              className="bg-[#101018] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center group hover:border-[#3B82F6]/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#050507] border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {m.icon}
              </div>
              <div className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-1">
                {m.value}
              </div>
              <div className="text-[#3B82F6] font-bold text-sm tracking-widest uppercase mb-3">
                {m.unit}
              </div>
              <div className="text-white/60 text-sm font-medium">
                {m.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
