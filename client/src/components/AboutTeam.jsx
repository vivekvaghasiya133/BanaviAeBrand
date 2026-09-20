import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function AboutTeam() {
  const team = [
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
      ],
      quote: "Seamless execution is the backbone of viral content.",
      instagram: 'https://www.instagram.com/md.donga',
      image: '/manthan.jpg'
    },
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
      ],
      quote: "We don't need more people watching tutorials. We need more people creating.",
      instagram: 'https://www.instagram.com/vivek.socialflipss',
      image: '/vivek.jpg'
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
      ],
      quote: "Don't let them scroll. Give them a reason to stay.",
      instagram: 'https://www.instagram.com/mr_talaviya',
      image: '/jaydip.jpg'
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
      ],
      quote: "Your message means nothing if you don't know how to deliver it.",
      instagram: '#'
    }
  ];

  return (
    <section id="team" className="py-24 bg-[#050507] border-y border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <p className="text-[#3B82F6] text-xs font-bold tracking-[0.4em] uppercase mb-4">
            The Mentors
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none">
            MEET THE TEAM
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((trainer, idx) => (
            <div key={trainer.id} className="flex flex-col h-full bg-[#101018] border border-white/10 rounded-3xl overflow-hidden group hover:border-white/30 transition-all duration-500">
              
              {/* Image / Avatar Block */}
              <div 
                className="aspect-[4/5] relative overflow-hidden bg-[#050507] border-b border-white/10"
              >
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay z-10"></div>
                
                <div 
                  className="absolute inset-0 opacity-20 blur-2xl transition-colors duration-700"
                  style={{ backgroundColor: trainer.color }}
                ></div>

                {trainer.image ? (
                  <img src={trainer.image} alt={trainer.firstName} className="w-full h-full object-cover relative z-0" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
                    <div className="w-20 h-20 bg-[#101018] border border-white/10 rounded-full flex items-center justify-center mb-4 shadow-xl">
                      <span 
                        className="text-3xl font-black transition-colors duration-700"
                        style={{ color: trainer.color }}
                      >
                        {trainer.initials}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 right-4 z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  <h3 className="text-2xl font-black text-white leading-tight uppercase">
                    {trainer.firstName} <br/>
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${trainer.gradient}`}>
                      {trainer.lastName}
                    </span>
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: trainer.color }}>
                    {trainer.role}
                  </p>
                </div>
              </div>

              {/* Bio Block */}
              <div className="p-6 flex flex-col flex-1">
                <div className="space-y-4 text-sm text-white/60 font-medium flex-1">
                  {trainer.bio.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  <p className="text-white italic text-xs border-l-2 pl-3" style={{ borderColor: trainer.color }}>
                    "{trainer.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <a 
                    href={trainer.instagram} 
                    target={trainer.instagram !== '#' ? "_blank" : "_self"} 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                    style={{ '--hover-color': trainer.color }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = trainer.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    <span>Instagram</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
