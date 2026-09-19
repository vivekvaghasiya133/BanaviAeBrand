import React from 'react';

export default function TrustedByMarquee() {
  const brands = [
    'Supermicro',
    'Avant Gallery',
    'Bayer',
    'Mauboussin',
    'Villeroy & Boch',
    'Dorchester',
    'Four Seasons',
    'Sephora',
    'Ritz-Carlton',
    'Gateway Counseling',
    'Pongbot',
    'Savants AI'
  ];

  return (
    <section className="relative overflow-hidden py-14 bg-[#f7f7f2] border-y border-black/[0.06]">
      <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-black/40">
          Trusted By Industry Leaders & Visionary Brands
        </span>
      </div>

      {/* Infinite scrolling ticker */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Left and right gradient fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#f7f7f2] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#f7f7f2] to-transparent z-10 pointer-events-none" />

        <div className="flex shrink-0 animate-client-scroll items-center gap-12 whitespace-nowrap">
          {brands.concat(brands).map((brand, idx) => (
            <div key={idx} className="flex items-center gap-12">
              <span className="font-serif italic text-2xl sm:text-3xl text-black/75 hover:text-black hover:opacity-100 transition-all cursor-default select-none tracking-tight">
                {brand}
              </span>
              <span className="text-[#2563EB] text-lg select-none">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
