import React, { useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AboutTeam() {
  const [activeIndex, setActiveIndex] = useState(0);

  const team = [
    {
      id: 1,
      firstName: 'VIVEK',
      lastName: 'VAGHASIYA',
      role: 'Videography & Social Media Strategist',
      initials: 'VV',
      color: '#3B82F6',
      gradient: 'from-[#3B82F6] to-green-500',
      bio: [
        "Social media isn't just about posting content. It's about psychology, strategy, and execution.",
        "I've built communities, grown brands, and generated massive reach by understanding exactly what stops the scroll. I am here to make you execute the exact visual and strategic formulas that work in the real world."
      ],
      quote: "We don't need more people watching tutorials. We need more people creating.",
      instagram: 'https://www.instagram.com/vivek.socialflipss'
    },
    {
      id: 2,
      firstName: 'JAYDIP',
      lastName: 'TALAVIYA',
      role: 'Content Strategist',
      initials: 'JT',
      color: '#00D4E8',
      gradient: 'from-[#00D4E8] to-blue-500',
      bio: [
        "A viral video starts long before you press record. It starts with the hook and the deep research behind it.",
        "I will show you how to architect a script that retains viewers past the 3-second mark and forces engagement. We don't guess what works; we engineer it."
      ],
      quote: "Don't let them scroll. Give them a reason to stay.",
      instagram: 'https://www.instagram.com/mr_talaviya'
    },
    {
      id: 3,
      firstName: 'MANTHAN',
      lastName: 'DONGA',
      role: 'Coordinator',
      initials: 'MD',
      color: '#F97316',
      gradient: 'from-[#F97316] to-red-500',
      bio: [
        "Execution requires structure. Behind every successful shoot and viral campaign is flawless logistics and coordination.",
        "I ensure that the entire creative process runs seamlessly from start to finish, so you can focus entirely on creating your best work without friction."
      ],
      quote: "Seamless execution is the backbone of viral content.",
      instagram: 'https://www.instagram.com/md.donga'
    },
    {
      id: 4,
      firstName: 'KULDEEP',
      lastName: 'VAGHASIYA',
      role: 'Speaker & Communicator',
      initials: 'KV',
      color: '#A78BFA',
      gradient: 'from-[#A78BFA] to-purple-500',
      bio: [
        "Knowing the strategy is only half the battle. Delivering it with impact, confidence, and authority is what truly converts.",
        "As a speaker, my goal is to break down complex marketing and execution barriers so you can confidently face the camera and your audience without hesitation."
      ],
      quote: "Your message means nothing if you don't know how to deliver it.",
      instagram: '#'
    }
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % team.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + team.length) % team.length);
  };

  const currentTrainer = team[activeIndex];

  return (
    <section className="py-24 bg-[#050507] border-y border-white/10 overflow-hidden relative">
      {/* Background glow based on active trainer */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full filter blur-[150px] pointer-events-none transition-colors duration-700 opacity-10"
        style={{ backgroundColor: currentTrainer.color }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 w-full relative">
            {/* Slider Navigation (Dots) */}
            <div className="flex gap-2 mb-8">
              {team.map((_, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${activeIndex === idx ? 'w-10' : 'w-3 bg-white/20 hover:bg-white/40'}`}
                  style={{ backgroundColor: activeIndex === idx ? currentTrainer.color : undefined }}
                />
              ))}
            </div>

            <p 
              className="text-xs font-bold tracking-[0.4em] uppercase mb-4 transition-colors duration-500"
              style={{ color: currentTrainer.color }}
            >
              The Mentors — {currentTrainer.role}
            </p>
            
            <div className="h-[120px] md:h-[140px] flex items-center">
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none animate-fadeIn">
                {currentTrainer.firstName} <br/>
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentTrainer.gradient}`}>
                  {currentTrainer.lastName}
                </span>
              </h2>
            </div>
            
            <div key={`bio-${activeIndex}`} className="space-y-6 text-lg text-white/60 font-medium leading-relaxed animate-fadeIn min-h-[320px] md:min-h-[240px]">
              {currentTrainer.bio.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
              <p className="text-white italic">
                "{currentTrainer.quote}"
              </p>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <a 
                href={currentTrainer.instagram} 
                target={currentTrainer.instagram !== '#' ? "_blank" : "_self"} 
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-[#101018] border border-white/10 rounded-full transition-all text-white font-bold group"
                style={{ '--hover-color': currentTrainer.color }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = currentTrainer.color;
                  e.currentTarget.style.backgroundColor = `${currentTrainer.color}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.backgroundColor = '#101018';
                }}
              >
                <svg className="w-5 h-5 transition-colors" style={{ color: currentTrainer.color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>Follow on Instagram</span>
                <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              </a>

              {/* Slider Arrows */}
              <div className="flex gap-2 ml-auto">
                <button 
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Image Block */}
          <div className="flex-1 w-full max-w-md">
            <div 
              className="aspect-[4/5] bg-[#101018] border border-white/10 rounded-3xl overflow-hidden relative group p-2 transition-all duration-700"
              style={{ boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${currentTrainer.color}15` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
              
              {/* Fallback image if actual photo not provided */}
              <div className="w-full h-full bg-[#050507] rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                
                {/* Background glow behind initials */}
                <div 
                  className="absolute inset-0 opacity-20 blur-2xl transition-colors duration-700"
                  style={{ backgroundColor: currentTrainer.color }}
                ></div>

                <div key={`avatar-${activeIndex}`} className="text-center z-10 animate-fadeIn">
                  <div className="w-24 h-24 mx-auto bg-[#101018] border border-white/10 rounded-full flex items-center justify-center mb-4 shadow-xl">
                    <span 
                      className="text-4xl font-black transition-colors duration-700"
                      style={{ color: currentTrainer.color }}
                    >
                      {currentTrainer.initials}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white">
                    {currentTrainer.firstName} {currentTrainer.lastName}
                  </div>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </div>

      {/* Global CSS for basic fade animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}} />
    </section>
  );
}
