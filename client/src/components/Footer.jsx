import React from 'react';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer({ onOpenOnboarding }) {
  return (
    <footer id="footer" className="bg-[#050507] border-t border-white/[0.08] relative overflow-hidden text-white">
      {/* Animated comet streaks in footer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="footer-comet"
          style={{
            position: 'absolute',
            top: '20%',
            left: '-10%',
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 0 6px #fff, 0 0 16px rgba(255,255,255,0.7)',
            animation: 'hero-comet-shoot 14s linear infinite',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '100%',
              width: '120px',
              height: '1.2px',
              background: 'linear-gradient(to left, rgba(255,255,255,0.9) 0%, transparent 100%)',
              transform: 'translateY(-50%)',
            }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-12">
        {/* Top Section: CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0A0A12] border border-white/10 mb-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <div className="text-[#3B82F6] text-xs font-mono font-bold tracking-widest uppercase mb-2">
              Ready to Accelerate Growth?
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Let's craft your unfair advantage.
            </h3>
          </div>

          <button
            onClick={onOpenOnboarding}
            className="px-8 py-4 rounded-xl bg-[#3B82F6] text-black font-black text-sm uppercase tracking-wider hover:bg-[#2563EB] shadow-[0_0_25px_rgba(191,255,0,0.4)] transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span>Start Your Project</span>
            <ArrowUpRight size={18} />
          </button>
        </div>

        {/* Middle Section: 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <a href="/" className="inline-block">
              <span className="text-2xl font-black tracking-tighter text-white">
                Banavi<span className="text-[#3B82F6]">Ae</span>Brand
              </span>
            </a>

            <p className="text-white/60 text-sm leading-relaxed max-w-sm mt-4">
              Real Action. Real Results. <br />
              Join the BanaviAeBrand founding batch. We blend creative storytelling with autonomous machine intelligence to scale visionary brands.
            </p>

            <div className="space-y-2 text-xs text-white/70">
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#3B82F6]" />
                <a href="tel:+919328489016" className="hover:text-white transition-colors">
                  +91 93284 89016
                </a>
                <span className="text-white/40">/</span>
                <a href="tel:+918000133106" className="hover:text-white transition-colors">
                  +91 80001 33106
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#3B82F6]" />
                <a href="mailto:support.banaviaebrand@gmail.com" className="hover:text-white transition-colors">
                  support.banaviaebrand@gmail.com
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/banaviaebrand"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#3B82F6] hover:text-black text-white/70 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/banaviaebrand/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#3B82F6] hover:text-black text-white/70 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://x.com/banaviaebrand"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#3B82F6] hover:text-black text-white/70 flex items-center justify-center transition-colors"
                aria-label="X (Twitter)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://www.threads.com/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#3B82F6] hover:text-black text-white/70 flex items-center justify-center transition-colors"
                aria-label="Threads"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.12 10.635c.164.887-.193 1.834-.823 2.535-1.107 1.205-3.056 1.488-4.502.825-1.285-.59-1.956-1.896-1.91-3.275.056-1.637 1.402-2.915 3.036-2.91 1.493.003 2.766 1.137 2.97 2.617h1.996c-.305-2.502-2.327-4.398-4.87-4.456-2.824-.066-5.244 2.052-5.503 4.85-.27 2.923 1.954 5.512 4.881 5.69 1.635.099 3.197-.562 4.195-1.785.49-.597.834-1.31.95-2.072h-5.418v-2.019h5.013zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@banaviaebrand"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#3B82F6] hover:text-black text-white/70 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <div>
            @2026 Up BanaviaeBrand All rights resevred.
          </div>
          <div className="flex items-center gap-6">
          </div>
        </div>
      </div>
    </footer>
  );
}
