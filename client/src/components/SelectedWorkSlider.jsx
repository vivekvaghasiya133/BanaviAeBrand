import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles, X } from 'lucide-react';

export default function SelectedWorkSlider({ onOpenOnboarding }) {
  const sliderRef = useRef(null);
  const [selectedCase, setSelectedCase] = useState(null);

  const projects = [
    {
      id: 'remina',
      num: '01',
      title: '@dr.remina',
      category: 'Social Media · UGC',
      stat: '+417K followers',
      desc: 'Featured in Forbes Canada. Generated $100K+ revenue in 90 days with high-converting short-form video hooks and audience nurturing.',
      image: '/remina/forbes-cover.png',
      accent: '#EC4899',
      tags: ['Viral Scripting', 'UGC Production', 'Influencer Seeding', 'Forbes Feature']
    },
    {
      id: 'savants',
      num: '02',
      title: 'Savants AI',
      category: 'AI SEO · Web Dev',
      stat: '320% organic growth',
      desc: 'Engineered a next-gen web platform with programmatic SEO, ranking #1 for 14 competitive AI search terms in under 6 months.',
      image: '/bella-mo.png',
      accent: '#00D4E8',
      tags: ['Headless React', 'LLM Search Citations', 'Programmatic SEO', 'SGE Ranking']
    },
    {
      id: 'pongbot',
      num: '03',
      title: 'Pongbot',
      category: 'Meta Ads · Branding',
      stat: '5.2× ROAS',
      desc: 'Continuous automated ad creative testing system on Meta and TikTok, reducing CAC by 38% and unlocking nationwide scaling.',
      image: '/pongbot/aerial-blue-court.png',
      accent: '#3B82F6',
      tags: ['Meta Performance', 'TikTok Ads', 'Creative Testing Engine', 'ROAS Optimization']
    },
    {
      id: 'slavista',
      num: '04',
      title: 'Slavista',
      category: 'Branding · Identity',
      stat: '0→1 Launch',
      desc: 'Created an iconic luxury brand identity, 3D visual render system, packaging design, and high-conversion e-commerce storefront.',
      image: '/pexels-workspace.jpg',
      accent: '#F97316',
      tags: ['Brand Identity', 'Packaging 3D', 'Shopify Plus', 'Omni-channel Launch']
    },
    {
      id: 'gateway',
      num: '05',
      title: 'Gateway Counseling',
      category: 'Non-Profit · Google Grants',
      stat: '$120K granted',
      desc: 'Secured and optimized $120,000 annual Google Ad Grants, resulting in a +210% increase in patient appointment bookings.',
      image: '/work/sq/1709530734423-1Y8MAG5VJP5YZU8B4BL0-IMG_9748.jpg',
      accent: '#10B981',
      tags: ['Google Ad Grants', 'HIPAA Conversion Tracking', 'Non-Profit Scaling']
    },
    {
      id: 'duck',
      num: '06',
      title: 'Duck English',
      category: 'Viral TikTok · EdTech',
      stat: '2.4M views',
      desc: 'Short-form algorithmic video campaigns driving over 85,000 app installs within 60 days across target demographic cohorts.',
      image: '/work/sq/31c423ed-eaf9-4686-9e0d-43f77159f6d5-2.png',
      accent: '#A78BFA',
      tags: ['Viral TikTok', 'ASO Funnels', 'EdTech Growth']
    }
  ];

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 420;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="selected-work" className="py-24 md:py-32 bg-[#050507] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/70 text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles size={12} className="text-[#3B82F6]" />
              <span>Selected Work</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase">
              Projects that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#3B82F6]">
                moved the needle.
              </span>
            </h2>
          </div>

          {/* Slider controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto px-6 max-w-7xl mx-auto scrollbar-none pb-8 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedCase(p)}
            data-cursor-label="View"
            className="flex-shrink-0 w-[320px] sm:w-[380px] md:w-[420px] snap-start bg-[#0A0A10] rounded-2xl border border-white/10 hover:border-white/25 overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            {/* Image Banner */}
            <div className="relative h-60 w-full overflow-hidden bg-neutral-900">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A10] via-transparent to-black/30" />

              {/* Number Badge */}
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 font-mono text-xs text-white/80">
                {p.num}
              </div>

              {/* Metric Tag */}
              <div
                className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg text-black font-black text-xs uppercase tracking-wide drop-shadow-md"
                style={{ background: p.accent }}
              >
                {p.stat}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-1">
                  {p.category}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#3B82F6] transition-colors flex items-center justify-between">
                  <span>{p.title}</span>
                  <ArrowUpRight size={18} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                  {p.desc}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-white/5">
                {p.tags.slice(0, 3).map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-white/50 border border-white/5">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Case Study Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#0A0A10] border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative h-64 w-full">
              <img
                src={selectedCase.image}
                alt={selectedCase.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A10] via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <div className="text-xs font-mono uppercase tracking-widest text-[#3B82F6] mb-1">
                  {selectedCase.category}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  {selectedCase.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div
                  className="px-4 py-2 rounded-xl text-black font-black text-base uppercase"
                  style={{ background: selectedCase.accent }}
                >
                  {selectedCase.stat}
                </div>
                <span className="text-white/40 text-xs font-mono">Verified Metric</span>
              </div>

              <p className="text-white/80 text-base leading-relaxed">
                {selectedCase.desc}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                  Delivered Scope
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/90"
                    >
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedCase(null);
                    onOpenOnboarding();
                  }}
                  className="px-6 py-3 rounded-xl bg-[#3B82F6] text-black font-bold text-sm hover:bg-[#2563EB] transition-colors"
                >
                  Achieve Similar Results →
                </button>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-3 text-white/60 hover:text-white text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
