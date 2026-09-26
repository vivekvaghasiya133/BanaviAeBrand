import React from 'react';

export default function FinalCTA() {
  return (
    <section className="py-32 bg-[#3B82F6] text-black text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
          READY TO TAKE ACTION?
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10 text-2xl md:text-3xl font-bold uppercase tracking-wider">
          <span>30 PEOPLE.</span>
          <span className="hidden md:block w-2 h-2 bg-black rounded-full"></span>
          <span>30 BUSINESSES.</span>
          <span className="hidden md:block w-2 h-2 bg-black rounded-full"></span>
          <span>1 DAY.</span>
        </div>

        <div className="mb-12">
          <div className="text-6xl md:text-8xl font-black tracking-tighter mb-2">₹10,000</div>
          <div className="text-lg font-bold uppercase tracking-widest bg-black text-[#3B82F6] inline-flex items-center gap-2 px-4 py-1.5 rounded-sm border border-[#3B82F6]/40 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            FOUNDING BATCH — ONLY 5 SEATS AVAILABLE
          </div>
        </div>

        <button 
          onClick={(e) => {
            e?.preventDefault?.();
            const el = document.getElementById('register');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setTimeout(() => {
                const input = el.querySelector('input');
                if (input) input.focus({ preventScroll: true });
              }, 500);
            } else {
              window.location.href = '#register';
            }
          }}
          className="px-12 py-6 bg-black text-[#3B82F6] text-xl md:text-2xl font-black rounded-2xl hover:bg-neutral-900 transition-colors uppercase tracking-widest shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 duration-300 cursor-pointer"
        >
          BOOK YOUR SLOT — 5 SEATS AVAILABLE
        </button>
        
        <p className="mt-6 text-black/70 font-bold uppercase tracking-widest text-sm">
          "Don't come to watch. Come to create."
        </p>
      </div>
    </section>
  );
}
