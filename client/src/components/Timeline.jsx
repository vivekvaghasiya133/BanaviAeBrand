import React from 'react';

export default function Timeline() {
  const events = [
    { time: '07:00 AM', title: 'Departure from Surat', desc: 'Journey begins to the secret venue.' },
    { time: '08:00 AM', title: 'Venue Arrival + Breakfast', desc: 'Settle in and network with the Founding 30.' },
    { time: '08:30 AM', title: 'BanaviAeBrand Masterclass', desc: 'Core fundamentals of content and strategy.' },
    { time: '09:30 AM', title: 'Secret Business Reveal', desc: 'You get your real-world challenge.' },
    { time: '10:00 AM', title: 'Research + Concept', desc: 'Brainstorming and scripting.' },
    { time: '11:00 AM', title: 'Shooting Begins', desc: 'Turn your concept into raw footage.' },
    { time: '01:00 PM', title: 'Lunch Break', desc: 'Refuel and discuss with peers.' },
    { time: '02:00 PM', title: 'Live Editing Session', desc: 'Watch less. Edit more.' },
    { time: '04:00 PM', title: 'Final Publishing', desc: 'Caption, Cover, and Upload.' },
    { time: '05:00 PM', title: 'Screening + Feedback', desc: 'Review the completed reels.' },
    { time: '06:00 PM', title: 'Final Challenge', desc: 'Awards and closing thoughts.' },
    { time: 'Evening', title: 'Dinner + Networking', desc: 'Celebrate the hard work.' }
  ];

  return (
    <section id="about" className="py-24 bg-[#050507] relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-[#101018] to-transparent rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <p className="text-[#3B82F6] text-xs font-bold tracking-[0.4em] uppercase mb-4">
            The Schedule
          </p>
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
            WHAT WILL HAPPEN <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">ON THE DAY?</span>
          </h2>
          <p className="text-white/50 mt-6 text-sm max-w-md mx-auto font-medium">
            * Exact timings may be adjusted based on the final venue and logistics.
          </p>
        </div>

        <div className="relative border-l-2 border-white/10 ml-4 md:ml-0 md:border-none">
          {/* Vertical line for desktop with gradient */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3B82F6]/0 via-[#3B82F6]/20 to-[#00D4E8]/0 -translate-x-1/2"></div>
          
          <div className="space-y-6 md:space-y-12">
            {events.map((event, idx) => (
              <div key={idx} className={`relative flex flex-col md:flex-row items-center justify-between group`}>
                
                {/* Left Side (Time) */}
                <div className={`pl-8 md:pl-0 w-full md:w-[45%] text-left ${idx % 2 === 0 ? 'md:text-right' : 'md:order-3 md:text-left'}`}>
                  <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-[#3B82F6] transition-colors tracking-widest uppercase">{event.time}</h3>
                </div>

                {/* Center Glowing Dot */}
                <div className="absolute left-[-6px] md:left-1/2 top-1 md:top-auto w-4 h-4 bg-[#0a0a0f] border-[3px] border-[#333] rounded-full md:-translate-x-1/2 md:order-2 group-hover:border-[#3B82F6] group-hover:bg-[#3B82F6] transition-all duration-300 shadow-[0_0_0_rgba(191,255,0,0)] group-hover:shadow-[0_0_20px_rgba(191,255,0,0.6)] z-10"></div>

                {/* Right Side (Content Glass Card) */}
                <div className={`pl-8 md:pl-0 mt-3 md:mt-0 w-full md:w-[45%] text-left ${idx % 2 === 0 ? 'md:order-3' : 'md:order-1 md:text-right'}`}>
                  <div className="bg-[#0a0a0f]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl group-hover:border-[#3B82F6]/30 transition-all duration-300 group-hover:bg-[#101018] group-hover:-translate-y-1 shadow-xl">
                    <h4 className="text-lg md:text-xl font-bold text-white mb-2">{event.title}</h4>
                    <p className="text-white/50 text-sm font-medium">{event.desc}</p>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
