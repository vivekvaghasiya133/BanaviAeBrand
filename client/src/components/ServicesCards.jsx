import React, { useState } from 'react';
import { ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ServicesCards({ onOpenOnboarding }) {
  const [flipped, setFlipped] = useState({});

  const services = [
    {
      num: '01',
      title: 'Business Owners',
      color: '#3B82F6',
      icon: '/work/sq/7dc40788-c623-470f-b743-9eef91464d78-5.png', // Fallback if image missing
      desc: 'Entrepreneurs who want to understand how to leverage social media for lead generation and brand authority without relying on agencies.',
      features: ['Direct ROI', 'Brand Authority', 'In-house Control']
    },
    {
      num: '02',
      title: 'Aspiring Creators',
      color: '#00D4E8',
      icon: '/work/sq/22c2e543-6b02-4886-99c8-751c3bf72a67-6.png',
      desc: 'Individuals who want to build a personal brand but don\'t know where to start, what to say, or how to shoot.',
      features: ['Personal Brand', 'Confidence', 'Content Strategy']
    },
    {
      num: '03',
      title: 'Freelancers',
      color: '#F97316',
      icon: '/work/sq/dc2e6963-fac1-4d62-8a8c-9c2ecccbef09-4.png',
      desc: 'Service providers looking to attract high-paying clients by showcasing their expertise through high-quality video content.',
      features: ['Client Acquisition', 'Portfolio Building', 'Trust']
    },
    {
      num: '04',
      title: 'Social Media Managers',
      color: '#8B5CF6',
      icon: '/work/sq/b4d60dba-6a88-4974-ac95-1590bceff34e-8.png',
      desc: 'SMMs who want to upgrade their skills from just posting graphics to actually creating high-converting short-form video strategies.',
      features: ['Skill Upgrade', 'Better Results', 'Higher Retainers']
    },
    {
      num: '05',
      title: 'Students & Beginners',
      color: '#F59E0B',
      icon: '/work/sq/4f690480-71b4-48cb-9dcd-810571566eb4-7.png',
      desc: 'Those looking to learn a highly in-demand skill that they can monetize immediately.',
      features: ['In-demand Skill', 'Monetization', 'Practical Experience']
    },
    {
      num: '06',
      title: 'Action Takers',
      color: '#EC4899',
      icon: '/work/sq/31c423ed-eaf9-4686-9e0d-43f77159f6d5-2.png',
      desc: 'If you are tired of just scrolling and watching tutorials, and actually want to sit down and create something real.',
      features: ['Execution', 'Real Results', 'No More Excuses']
    }
  ];

  const toggleFlip = (index) => {
    setFlipped((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section id="services" className="pt-20 pb-24 md:py-32 bg-[#050507] relative overflow-hidden border-t border-white/10">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <p className="text-[#3B82F6] text-xs font-bold tracking-[0.4em] uppercase mb-4">
              Who is this for?
            </p>
            <div
              className="text-[clamp(2.5rem,5vw,5rem)] font-black text-white leading-[0.9]"
              aria-label="WHO IS THIS EXPERIENCE FOR?"
            >
              W H O &nbsp; I S &nbsp; I T &nbsp; F O R ?
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-white/60 text-sm max-w-xs leading-relaxed uppercase tracking-widest font-bold">
              If you fit into any of these categories, BanaviAeBrand is built for you.
            </p>
          </div>
        </div>

        {/* 6 Exact 3D Flip Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, idx) => {
            const isCardFlipped = !!flipped[idx];

            return (
              <div
                key={item.num}
                className="cursor-pointer h-80 w-full group select-none"
                style={{ perspective: '1200px' }}
                onMouseEnter={() => setFlipped((prev) => ({ ...prev, [idx]: true }))}
                onMouseLeave={() => setFlipped((prev) => ({ ...prev, [idx]: false }))}
                onClick={() => toggleFlip(idx)}
              >
                <div
                  className="relative w-full h-full transition-transform duration-700 ease-out"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* FRONT FACE (Dark Glassmorphism) */}
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 flex flex-col shadow-2xl bg-[#0A0A0F] group-hover:border-white/20 transition-colors"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Top colored accent line */}
                    <div className="h-1 w-full flex-shrink-0" style={{ background: item.color }} />

                    <div className="flex-1 p-8 flex flex-col justify-between relative overflow-hidden">
                      {/* Subtle background glow based on item color */}
                      <div 
                        className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none"
                        style={{ background: item.color }}
                      ></div>

                      {/* Top Bar: Pulse Badge */}
                      <div className="flex items-start justify-end">
                        <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white/5 border border-white/10">
                          <RefreshCw size={12} className="text-white/50 group-hover:animate-spin-slow" />
                          <span className="text-white/50 text-[10px] font-black tracking-widest uppercase">
                            Hover to reveal
                          </span>
                        </div>
                      </div>

                      {/* Middle: Number + Title */}
                      <div className="relative z-10">
                        <p
                          className="text-sm font-black tracking-widest uppercase mb-3"
                          style={{ color: item.color }}
                        >
                          {item.num}
                        </p>
                        <h3 className="text-white font-black text-3xl leading-tight">
                          {item.title}
                        </h3>
                      </div>

                      {/* Bottom: Arrow Circle */}
                      <div className="flex justify-start relative z-10">
                        <span
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <ArrowRight size={18} className="text-white/80" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE (Vibrant Solid Gradient) */}
                  <div
                    className="absolute inset-0 rounded-3xl p-8 flex flex-col justify-between overflow-hidden shadow-2xl"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 40%)',
                      }}
                    />

                    <div className="relative z-10">
                      <p className="text-black/50 text-[10px] font-black tracking-widest uppercase mb-2">
                        {item.num}
                      </p>
                      <h3 className="text-black font-black text-2xl leading-tight">
                        {item.title}
                      </h3>
                    </div>

                    <p className="relative z-10 text-black/80 text-sm leading-relaxed flex-1 mt-4 font-bold">
                      {item.desc}
                    </p>

                    {item.features && (
                      <div className="relative z-10 flex flex-wrap gap-2 mt-2">
                        {item.features.map((feat, fIdx) => (
                          <span key={fIdx} className="text-[10px] bg-black/20 text-white px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="relative z-10 flex items-center justify-between mt-6 pt-4 border-t border-black/10">
                      <span className="text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <span>Built for you</span>
                        <CheckCircle2 size={14} className="text-black" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
