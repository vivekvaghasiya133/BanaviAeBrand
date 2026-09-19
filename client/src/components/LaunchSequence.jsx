import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, Video, Scissors, Share2, Target, CheckCircle2, Sparkles } from 'lucide-react';

export default function LaunchSequence() {
  const [activeTab, setActiveTab] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const pillars = [
    {
      title: 'Content Strategy',
      tag: 'PILLAR 01',
      icon: Lightbulb,
      color: '#3B82F6', // Lime
      description:
        'Deep research, scriptwriting, and hook psychology. Stop guessing what works and learn to architect viral concepts before you even hit record.',
      benefit: 'Viral frameworks that hook attention in 3 seconds.'
    },
    {
      title: 'Pro Shooting',
      tag: 'PILLAR 02',
      icon: Video,
      color: '#00D4E8', // Cyan
      description:
        'Framing, angles, dynamic movement, and lighting. You don\'t need expensive gear—learn how to maximize your smartphone camera for cinematic output.',
      benefit: 'Cinematic quality using just your smartphone.'
    },
    {
      title: 'Live Editing',
      tag: 'PILLAR 03',
      icon: Scissors,
      color: '#F97316', // Orange
      description:
        'Pacing, sound design, auto-captions, and jump cuts. A completely hands-on live editing session where you build and polish your final reel on the spot.',
      benefit: 'High-retention editing techniques that keep viewers watching.'
    },
    {
      title: 'Social Growth',
      tag: 'PILLAR 04',
      icon: Share2,
      color: '#EC4899', // Pink
      description:
        'Instagram algorithms, engagement hacks, profile optimization, and community building. How to strategically turn fleeting views into loyal followers.',
      benefit: 'Master the algorithm and build a loyal audience.'
    },
    {
      title: 'Paid Ads',
      tag: 'PILLAR 05',
      icon: Target,
      color: '#A78BFA', // Purple
      description:
        'Scaling your success with Meta Ads. Boosting reels correctly, targeting your ideal audience, and running profitable campaigns to maximize reach.',
      benefit: 'Turn organic traction into scalable, paid revenue.'
    }
  ];

  // Auto-rotate tabs
  useEffect(() => {
    if (!isHovered) {
      timerRef.current = setInterval(() => {
        setActiveTab((prev) => (prev + 1) % pillars.length);
      }, 4000);
    }
    return () => clearInterval(timerRef.current);
  }, [isHovered, pillars.length]);

  return (
    <section id="curriculum" className="relative bg-[#050507] text-white py-24 md:py-32 border-t border-white/10 overflow-hidden">
      {/* Background dynamic glow based on active tab */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full filter blur-[120px] pointer-events-none transition-colors duration-1000 opacity-20"
        style={{ backgroundColor: pillars[activeTab].color }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/70 text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles size={12} className="text-[#3B82F6]" />
            <span>The Curriculum</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase leading-[0.9]">
            WHAT WILL YOU <br />
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: '2px white',
              }}
            >
              LEARN & EXECUTE?
            </span>
          </h2>
        </div>

        {/* Interactive Layout: Left Pillars List, Right Spotlight Card */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Tabs on Left */}
          <div className="lg:col-span-6 space-y-3">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              const isActive = activeTab === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`p-5 rounded-2xl border transition-all duration-500 cursor-pointer flex items-center justify-between group ${
                    isActive
                      ? 'bg-white/[0.08] border-white/30 shadow-[0_0_25px_rgba(255,255,255,0.05)] scale-[1.02] transform'
                      : 'bg-[#0A0A0F] border-white/10 hover:bg-white/[0.04] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-colors duration-500"
                      style={{
                        background: isActive ? p.color : 'rgba(255,255,255,0.05)',
                        color: isActive ? '#000' : '#fff',
                      }}
                    >
                      <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold tracking-widest text-white/40 uppercase mb-1">
                        {p.tag}
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-white group-hover:text-white/90 transition-colors">
                        {p.title}
                      </h4>
                    </div>
                  </div>

                  <CheckCircle2
                    size={20}
                    className={`transition-all duration-500 ${
                      isActive ? 'opacity-100 scale-100 text-[#3B82F6]' : 'opacity-0 scale-50'
                    }`}
                    style={{ color: isActive ? p.color : undefined }}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Spotlight Detail Card */}
          <div className="lg:col-span-6">
            <div
              className="p-8 sm:p-12 rounded-3xl border border-white/10 relative overflow-hidden bg-[#101018] shadow-2xl transition-all duration-700 min-h-[400px] flex flex-col justify-center"
              style={{
                boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${pillars[activeTab].color}15`,
              }}
            >
              {/* Dynamic decorative blob */}
              <div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none filter blur-[80px] transition-all duration-1000 ease-in-out"
                style={{ background: pillars[activeTab].color, opacity: 0.15 }}
              />

              <div 
                className="inline-block px-4 py-1.5 rounded-full text-black font-black text-xs uppercase tracking-widest mb-8 transition-colors duration-500 self-start" 
                style={{ background: pillars[activeTab].color }}
              >
                {pillars[activeTab].tag}
              </div>

              <h3 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
                {pillars[activeTab].title}
              </h3>

              <p className="text-white/70 text-lg leading-relaxed mb-10 font-medium">
                {pillars[activeTab].description}
              </p>

              <div className="p-5 rounded-xl bg-[#0A0A0F] border border-white/10 mt-auto">
                <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: pillars[activeTab].color }}>
                  End Result:
                </div>
                <div className="text-sm font-bold text-white">
                  {pillars[activeTab].benefit}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
