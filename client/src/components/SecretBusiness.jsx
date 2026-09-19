import React from 'react';

export default function SecretBusiness() {
  const steps = [
    { num: '01', title: 'You receive your business' },
    { num: '02', title: 'Understand the business' },
    { num: '03', title: 'Find the USP' },
    { num: '04', title: 'Identify audience/problem' },
    { num: '05', title: 'Create a powerful hook' },
    { num: '06', title: 'Build the Reel concept' },
    { num: '07', title: 'Shoot it' },
    { num: '08', title: 'Edit it' },
    { num: '09', title: 'Complete/publish content' },
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          <div className="flex-1">
            <p className="text-[#3B82F6] text-xs font-bold tracking-[0.4em] uppercase mb-4">
              The Secret Business Challenge
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] mb-6 uppercase tracking-tight">
              Every participant will receive a real <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime to-green-500">
                business challenge.
              </span>
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-lg font-medium leading-relaxed">
              "You won't know your business until the challenge begins."
            </p>
            
            <div className="relative w-full max-w-sm aspect-[4/3] bg-[#101018] border border-white/10 rounded-xl shadow-2xl flex items-center justify-center group overflow-hidden">
              <div className="absolute inset-0 bg-[#3B82F6]/10 group-hover:bg-[#3B82F6]/20 transition-colors"></div>
              <div className="text-center">
                <div className="text-6xl mb-4">🤫</div>
                <div className="text-xl font-black text-white uppercase tracking-widest border-2 border-white px-6 py-2">
                  TOP SECRET
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-[#101018] border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-wider">The Experience Flow</h3>
              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-[#050507] border border-white/10 hover:border-[#3B82F6]/50 transition-colors">
                    <span className="text-[#3B82F6] font-mono font-bold text-xl">{step.num}</span>
                    <span className="text-white font-bold text-lg">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
