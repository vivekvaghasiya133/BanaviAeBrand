import React from 'react';

export default function WhoNotFor() {
  const points = [
    "Only wants a certificate",
    "Wants to sit and watch lectures",
    "Is looking for guaranteed viral results",
    "Is not willing to participate",
    "Does not want to create content",
    "Expects someone else to do all the work"
  ];

  return (
    <section className="py-24 bg-[#050507] text-center">
      <div className="max-w-4xl mx-auto px-6">
        
        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight mb-12">
          "If you want to watch, this isn't for you. <br/>
          <span className="text-lime">If you want to do, welcome."</span>
        </h2>

        <div className="inline-block bg-red-900/10 border border-red-500/20 rounded-3xl p-8 md:p-12 text-left">
          <h3 className="text-2xl font-black text-red-400 mb-6 uppercase tracking-wider">
            BanaviAeBrand is NOT for someone who:
          </h3>
          <ul className="space-y-4">
            {points.map((point, idx) => (
              <li key={idx} className="flex items-center gap-4 text-white/60 text-lg font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                {point}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
