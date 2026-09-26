import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const CYCLER_WORDS = [
  { word: "BRAND", color: "#3B82F6" },
  { word: "CONTENT", color: "#00D4E8" },
  { word: "REELS", color: "#3B82F6" },
  { word: "IMPACT", color: "#EC4899" },
  { word: "VIRAL", color: "#F97316" },
  { word: "GROWTH", color: "#10B981" },
  { word: "FUTURE", color: "#A78BFA" }
];

const PILLARS = [
  {
    id: 1,
    title: 'Content Strategy',
    color: '#BFFF00', // Lime
    x: '68%', y: '25%',
    size: 130,
    orbitDuration: '14s',
    learningPoints: [
      "Deep research & hook psychology",
      "Scriptwriting that retains viewers past 3 seconds",
      "Architecting viral concepts before recording",
      "Identifying high-converting content formats"
    ]
  },
  {
    id: 2,
    title: 'Pro Shooting',
    color: '#00D4E8', // Cyan
    x: '85%', y: '45%',
    size: 110,
    orbitDuration: '18s',
    learningPoints: [
      "Smartphone camera maximization",
      "Cinematic framing & angles",
      "Dynamic movement for visual retention",
      "Lighting manipulation without expensive gear"
    ]
  },
  {
    id: 3,
    title: 'Live Editing',
    color: '#F97316', // Orange
    x: '62%', y: '60%',
    size: 150,
    orbitDuration: '22s',
    learningPoints: [
      "Pacing and high-retention cuts",
      "Sound design and audio psychology",
      "Auto-captions and text animations",
      "Hands-on building of your final reel"
    ]
  },
  {
    id: 4,
    title: 'Social Growth',
    color: '#A78BFA', // Purple
    x: '75%', y: '78%',
    size: 120,
    orbitDuration: '16s',
    learningPoints: [
      "Mastering Instagram & social algorithms",
      "Engagement hacks & profile optimization",
      "Community building strategies",
      "Turning fleeting views into loyal followers"
    ]
  },
  {
    id: 5,
    title: 'Paid Ads',
    color: '#EC4899', // Pink
    x: '88%', y: '15%',
    size: 90,
    orbitDuration: '20s',
    learningPoints: [
      "Scaling success with Meta Ads",
      "Correctly boosting reels for ROI",
      "Targeting your ideal high-ticket audience",
      "Running profitable paid campaigns"
    ]
  }
];

// Reusable SVG Planet Component to mimic the vibe
const PlanetOrb = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <defs>
      <clipPath id="circle-clip"><circle cx="100" cy="100" r="100" /></clipPath>
      <radialGradient id={`glow-${color}`} cx="30%" cy="26%" r="80%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
        <stop offset="40%" stopColor={color} />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>
      <radialGradient id={`atmo-${color}`} cx="50%" cy="50%" r="50%">
        <stop offset="85%" stopColor="transparent" />
        <stop offset="100%" stopColor={`${color}88`} />
      </radialGradient>
    </defs>
    <g clipPath="url(#circle-clip)">
      <rect width="200" height="200" fill={color} />
      <circle cx="100" cy="100" r="100" fill={`url(#glow-${color})`} />
      
      {/* Texture overlays (basic shapes to simulate terrain/gas) */}
      <ellipse cx="100" cy="30" rx="120" ry="20" fill="white" opacity="0.15" />
      <ellipse cx="100" cy="80" rx="120" ry="15" fill="black" opacity="0.15" />
      <ellipse cx="100" cy="150" rx="120" ry="25" fill="white" opacity="0.1" />
      
      <circle cx="100" cy="100" r="100" fill={`url(#atmo-${color})`} />
      <circle cx="100" cy="100" r="100" fill="rgba(0,0,0,0.2)" />
    </g>
  </svg>
);

export default function HeroSolarSystem({ onOpenOnboarding }) {
  const [cyclerIndex, setCyclerIndex] = useState(0);
  const [activePlanet, setActivePlanet] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCyclerIndex((prev) => (prev + 1) % CYCLER_WORDS.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const current = CYCLER_WORDS[cyclerIndex];

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen bg-black flex flex-col justify-center overflow-hidden">
      {/* Modal for Learning Points */}
      <AnimatePresence>
        {activePlanet && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setActivePlanet(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#101018] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal ambient glow */}
              <div 
                className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[80px] opacity-20 pointer-events-none"
                style={{ background: activePlanet.color }}
              />
              
              <button 
                onClick={() => setActivePlanet(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10 text-white/50 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${activePlanet.color}22`, border: `1px solid ${activePlanet.color}55` }}
                >
                  <span className="text-xl font-black" style={{ color: activePlanet.color }}>
                    0{activePlanet.id}
                  </span>
                </div>
                <div>
                  <p className="text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                    Learning Pillar
                  </p>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                    {activePlanet.title}
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                {activePlanet.learningPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="mt-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activePlanet.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <p className="text-white/80 font-medium leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Ambient Radial Glows ── */}
      <div
        className="absolute top-0 right-0 w-[min(600px,80vw)] h-[min(600px,80vw)] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 65%)', // Neon Blue
          transform: 'translate(20%, -20%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[min(400px,70vw)] h-[min(400px,70vw)] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 65%)',
          transform: 'translate(-20%, 20%)',
        }}
      />

      {/* ── Twinkling Star Field ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(i * 17.51) % 100}%`,
              top: `${(i * 29.17) % 100}%`,
              width: `${i % 3 === 0 ? 1.6 : 0.8}px`,
              height: `${i % 3 === 0 ? 1.6 : 0.8}px`,
              borderRadius: '50%',
              background: 'white',
              opacity: 0.1 + ((i % 5) * 0.1),
              animation: `star-twinkle ${2 + (i % 4) * 0.5}s ease-in-out ${(i * 0.2) % 4}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Interactive React Planets (Desktop Only) ── */}
      <div className="hidden lg:block absolute inset-0" style={{ zIndex: 1 }}>
        {PILLARS.map((pillar) => (
          <div
            key={pillar.id}
            style={{
              position: 'absolute',
              left: pillar.x,
              top: pillar.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            {/* Hover Tooltip (Simulated via group hover) */}
            <div className="relative group flex flex-col items-center cursor-pointer" onClick={() => setActivePlanet(pillar)}>
              
              {/* Floating Animation Wrapper */}
              <div
                style={{
                  animation: `planet-float-${pillar.id % 3} ${5 + pillar.id}s ease-in-out infinite alternate`
                }}
              >
                {/* Orbiting Moon */}
                <div 
                  className="absolute top-1/2 left-1/2 rounded-full border border-white/5 pointer-events-none"
                  style={{
                    width: pillar.size * 1.5,
                    height: pillar.size * 1.5,
                    transform: 'translate(-50%, -50%)',
                    animation: `spin ${pillar.orbitDuration} linear infinite`
                  }}
                >
                  <div 
                    className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]"
                    style={{ transform: 'translate(-50%, -50%)', boxShadow: `0 0 10px ${pillar.color}` }}
                  />
                </div>

                {/* The Planet itself */}
                <div 
                  className="rounded-full relative z-10 transition-transform duration-300 group-hover:scale-105"
                  style={{
                    width: pillar.size,
                    height: pillar.size,
                    boxShadow: `0 0 30px ${pillar.color}44, inset 0 0 20px rgba(255,255,255,0.2)`,
                  }}
                >
                  <PlanetOrb color={pillar.color} size={pillar.size} />
                </div>
              </div>

              {/* Text Label */}
              <div 
                className="mt-4 text-[10px] font-black tracking-[0.2em] uppercase text-white/50 transition-colors duration-300 group-hover:text-white"
                style={{ textShadow: `0 0 10px ${pillar.color}88` }}
              >
                {pillar.title}
                <span className="block text-center mt-1 text-[8px] text-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to view details
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Left-to-Right Hero Foreground Typography ── */}
      <div
        className="relative flex-1 flex flex-col items-start justify-center text-left px-8 lg:px-20 pt-20 pb-8 lg:pt-24 lg:pb-20 min-h-[90vh] lg:min-h-screen"
        style={{ zIndex: 3, pointerEvents: 'none' }}
      >
        <div className="flex flex-col items-start w-full max-w-4xl" style={{ pointerEvents: 'auto' }}>
          {/* Tagline */}
          <div className="flex flex-wrap items-center justify-start gap-3 mb-6 lg:mb-10">
            <span className="w-10 h-px bg-[#3B82F6]" />
            <span className="text-[#3B82F6] text-xs font-bold tracking-[0.4em] uppercase">
              બનાવીએ બ્રાન્ડ · ONLY 5 SEATS AVAILABLE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-black uppercase tracking-wider animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.3)]">
              🔥 Only 5 Seats Left
            </span>
          </div>

          {/* Huge Dynamic Headline */}
          <div className="mb-6 lg:mb-10 select-none">
            {/* Line 1: 30 PEOPLE. */}
            <div className="overflow-hidden">
              <div
                className="leading-[0.88] tracking-tight"
                style={{
                  fontSize: 'clamp(3.75rem, 8.5vw, 12rem)',
                  WebkitTextStroke: '2px rgba(255,255,255,0.75)',
                  color: 'transparent',
                  fontFamily: 'var(--font-fraunces), serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                }}
              >
                30 PEOPLE.
              </div>
            </div>

            {/* Line 2: Rotating Word Cycler + Glowing Pulse Dot */}
            <div className="flex items-baseline justify-start gap-4" style={{ minHeight: '1.1em' }}>
              <div
                className="font-black leading-[0.88] tracking-tight text-[#3B82F6]"
                style={{ fontSize: 'clamp(3.75rem, 8.5vw, 12rem)' }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={current.word}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                    style={{ willChange: 'opacity, transform' }}
                  >
                    {current.word}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Pulsing Beacon Dot */}
              <motion.span
                animate={{ background: current.color }}
                transition={{ duration: 0.4 }}
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  marginBottom: 8,
                  boxShadow: `0 0 16px ${current.color}`,
                  flexShrink: 0,
                }}
              />
            </div>

            {/* Line 3: 1 DAY. */}
            <div className="overflow-hidden">
              <div
                className="font-black leading-[0.88] tracking-tight text-white"
                style={{ fontSize: 'clamp(3.75rem, 8.5vw, 12rem)' }}
              >
                1 DAY.
              </div>
            </div>
          </div>

          {/* Subtitle & Buttons */}
          <div className="flex flex-col gap-5 lg:gap-8">
            <div className="max-w-md">
              <p className="text-white/60 text-base sm:text-lg leading-relaxed uppercase tracking-widest font-bold">
                Real Action. Real Results.
              </p>
            </div>

            <div className="flex items-center justify-start gap-5">
              <button
                onClick={() => window.location.href = '#register'}
                data-cursor-label="Apply"
                className="group flex items-center gap-3 px-8 py-4 bg-[#3B82F6] text-white font-black rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(59,130,246,0.3)] text-sm uppercase tracking-wider"
              >
                <span>Apply For Founding 30</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes spin { 100% { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes planet-float-0 { from { transform: translateY(0px) rotate(0deg); } to { transform: translateY(-15px) rotate(3deg); } }
        @keyframes planet-float-1 { from { transform: translateY(-10px) rotate(-2deg); } to { transform: translateY(10px) rotate(2deg); } }
        @keyframes planet-float-2 { from { transform: translateY(5px) rotate(1deg); } to { transform: translateY(-12px) rotate(-1deg); } }
      `}} />
    </section>
  );
}
