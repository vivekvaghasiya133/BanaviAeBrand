import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, X } from 'lucide-react';

const ORB_HTML = `<div class="cv-float" style="position:relative;cursor:pointer;opacity:1;transform:translateY(0) scale(1)"><div style="position:absolute;left:50%;top:calc(100% - 28px);transform:translateX(-50%);width:min(280px, 60vw);height:70px;pointer-events:none;z-index:0"><div style="position:absolute;inset:0 -30px 0 -30px;border-radius:50%;border:1px solid rgba(160,120,255,0.15);box-shadow:0 0 30px rgba(160,120,255,0.10)"></div><div style="position:absolute;inset:8px 0 8px 0;border-radius:50%;border:1.5px solid rgba(191,255,0,0.45);box-shadow:0 0 18px rgba(191,255,0,0.35), inset 0 0 12px rgba(191,255,0,0.18)"></div><div style="position:absolute;inset:18px 24px 18px 24px;border-radius:50%;background:radial-gradient(ellipse, rgba(191,255,0,0.20) 0%, rgba(160,120,255,0.10) 50%, transparent 80%);animation:cv-platform-pulse 3.4s ease-in-out infinite"></div><div style="position:absolute;inset:4px -10px 4px -10px;border-radius:50%;border:1px dashed rgba(140,180,255,0.25);animation:cv-platform-spin 28s linear infinite"></div><div style="position:absolute;left:50%;top:50%;width:1px;height:6px;background:#3B82F6;box-shadow:0 0 4px #3B82F6;transform:translate(-50%, -50%) rotate(0deg) translateY(-32px);opacity:0.85"></div><div style="position:absolute;left:50%;top:50%;width:1px;height:6px;background:#3B82F6;box-shadow:0 0 4px #3B82F6;transform:translate(-50%, -50%) rotate(90deg) translateY(-32px);opacity:0.85"></div><div style="position:absolute;left:50%;top:50%;width:1px;height:6px;background:#3B82F6;box-shadow:0 0 4px #3B82F6;transform:translate(-50%, -50%) rotate(180deg) translateY(-32px);opacity:0.85"></div><div style="position:absolute;left:50%;top:50%;width:1px;height:6px;background:#3B82F6;box-shadow:0 0 4px #3B82F6;transform:translate(-50%, -50%) rotate(270deg) translateY(-32px);opacity:0.85"></div></div><div style="position:absolute;left:50%;bottom:-10px;transform:translateX(-50%);width:6px;height:34px;background:linear-gradient(to bottom, rgba(191,255,0,0.7) 0%, rgba(191,255,0,0.3) 50%, transparent 100%);border-radius:3px;filter:blur(2px);pointer-events:none;z-index:0"></div><div style="position:absolute;top:-8%;left:18%;width:4px;height:4px;border-radius:50%;background:#3B82F6;box-shadow:0 0 6px #3B82F6, 0 0 14px #3B82F688;animation:cv-data-blink 2.4s ease-in-out 0s infinite;pointer-events:none;z-index:4"></div><div style="position:absolute;top:22%;left:-6%;width:3px;height:3px;border-radius:50%;background:#00D4E8;box-shadow:0 0 6px #00D4E8, 0 0 14px #00D4E888;animation:cv-data-blink 2.4s ease-in-out 0.7s infinite;pointer-events:none;z-index:4"></div><div style="position:absolute;top:60%;left:96%;width:3px;height:3px;border-radius:50%;background:#A78BFA;box-shadow:0 0 6px #A78BFA, 0 0 14px #A78BFA88;animation:cv-data-blink 2.4s ease-in-out 1.4s infinite;pointer-events:none;z-index:4"></div><div style="position:absolute;top:84%;left:8%;width:4px;height:4px;border-radius:50%;background:#3B82F6;box-shadow:0 0 6px #3B82F6, 0 0 14px #3B82F688;animation:cv-data-blink 2.4s ease-in-out 2.1s infinite;pointer-events:none;z-index:4"></div><div style="position:absolute;top:12%;left:88%;width:3px;height:3px;border-radius:50%;background:#EC4899;box-shadow:0 0 6px #EC4899, 0 0 14px #EC489988;animation:cv-data-blink 2.4s ease-in-out 2.8s infinite;pointer-events:none;z-index:4"></div><div class="cv-breathe" style="position:absolute;inset:-35px;border-radius:50%;background:radial-gradient(circle, rgba(200,100,255,0.22) 0%, rgba(80,180,255,0.12) 35%, rgba(255,80,200,0.07) 60%, transparent 75%);pointer-events:none;will-change:transform, opacity"></div><div class="cv-sphere" style="width:min(420px, 82vw);height:min(420px, 82vw);border-radius:50%;position:relative;overflow:hidden;background:radial-gradient(
                circle at 30% 24%,
                rgba(255,255,255,0.92) 0%,
                rgba(220,230,255,0.55) 5%,
                rgba(140,160,220,0.32) 14%,
                rgba(60,55,140,0.42)   28%,
                rgba(35,20,95,0.72)    48%,
                rgba(18,8,55,0.92)     72%,
                rgba(4,2,18,1)         100%
              );box-shadow:0 0 80px 25px rgba(120,90,255,0.32),
                0 0 160px 60px rgba(60,40,180,0.18),
                0 0 240px 100px rgba(180,140,255,0.08),
                0 100px 160px rgba(0,0,0,0.85),
                inset 0 0 60px rgba(80,60,180,0.16),
                inset 0 -60px 100px rgba(8,4,30,0.62);transition:box-shadow 0.5s ease"><div class="cv-swirl-1" style="position:absolute;inset:-25%;will-change:transform;background:radial-gradient(
                  circle at 40% 38%,
                  rgba(130,90,255,0.22) 0%,
                  rgba(80,140,220,0.14) 28%,
                  rgba(200,180,255,0.08) 52%,
                  transparent 80%
                )"></div><div class="cv-swirl-2" style="position:absolute;inset:0;border-radius:50%;will-change:transform;background:conic-gradient(
                  from 60deg,
                  rgba(150,120,255,0.10) 0%,
                  transparent 18%,
                  rgba(80,180,255,0.08)  36%,
                  transparent 52%,
                  rgba(191,255,0,0.06)   68%,
                  transparent 84%,
                  rgba(150,120,255,0.10) 100%
                )"></div><div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 52% 70%, rgba(0,0,0,0.55) 0%, transparent 55%)"></div><div style="position:absolute;inset:0;border-radius:50%;background:repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(180,200,255,0.05) 3px, rgba(180,200,255,0.05) 4px);pointer-events:none;z-index:2;mix-blend-mode:screen"></div><svg viewBox="0 0 200 200" style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:88%;height:88%;pointer-events:none;z-index:2;opacity:0.92"><defs><radialGradient id="cv-eye-iris" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#E5FFB8"></stop><stop offset="55%" stop-color="#3B82F6"></stop><stop offset="100%" stop-color="#5E7C00"></stop></radialGradient><clipPath id="cv-eye-shape"><path d="M 20 100 Q 100 28 180 100 Q 100 172 20 100 Z"></path></clipPath></defs><path d="M 20 100 Q 100 28 180 100 Q 100 172 20 100 Z" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.45)" stroke-width="1.2"></path><path d="M 20 100 Q 100 28 180 100" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="1.5" stroke-linecap="round"></path><path d="M 20 100 Q 100 172 180 100" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" stroke-linecap="round"></path><g class="cv-eye-pupil" clip-path="url(#cv-eye-shape)"><circle cx="100" cy="100" r="28" fill="url(#cv-eye-iris)"></circle><circle cx="100" cy="100" r="28" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="0.8"></circle><circle cx="100" cy="100" r="13" fill="#050507"></circle><ellipse cx="92" cy="92" rx="4.5" ry="3" fill="rgba(255,255,255,0.9)"></ellipse><circle cx="106" cy="106" r="1.5" fill="rgba(255,255,255,0.55)"></circle></g><path class="cv-eye-lid" d="M 20 100 Q 100 28 180 100 Q 100 172 20 100 Z" fill="#050507" opacity="0"></path></svg><div style="position:absolute;inset:0;border-radius:50%;z-index:6;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(30,0,60,0.68) 0%, rgba(10,0,30,0.55) 100%);opacity:0;transition:opacity 0.32s ease;gap:0.75rem;pointer-events:none"><div style="width:68px;height:68px;border-radius:50%;border:2.5px solid rgba(255,255,255,0.92);display:flex;align-items:center;justify-content:center;box-shadow:0 0 28px rgba(190,100,255,0.6), 0 0 60px rgba(190,100,255,0.25)"><svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="8,4 21,12 8,20"></polygon></svg></div><div style="color:rgba(255,255,255,0.88);font-size:0.5rem;font-weight:700;letter-spacing:0.55em;text-transform:uppercase;text-shadow:0 0 20px rgba(200,100,255,0.7)">Reveal</div></div><div style="position:absolute;top:8%;left:12%;width:42%;height:34%;border-radius:50%;background:radial-gradient(circle at 35% 35%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.32) 28%, rgba(240,230,255,0.12) 55%, transparent 75%);pointer-events:none;z-index:4"></div><div style="position:absolute;top:13%;left:20%;width:10%;height:7%;border-radius:50%;background:radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 50%, transparent 100%);pointer-events:none;z-index:5"></div><div style="position:absolute;top:18%;right:18%;width:18%;height:12%;border-radius:50%;background:radial-gradient(circle, rgba(140,160,255,0.28) 0%, transparent 70%);pointer-events:none;z-index:3"></div><div style="position:absolute;bottom:5%;left:50%;transform:translateX(-50%);width:52%;height:12%;border-radius:50%;background:radial-gradient(ellipse, rgba(120,90,255,0.18) 0%, rgba(60,80,200,0.08) 55%, transparent 100%);pointer-events:none;z-index:3"></div></div><div class="cv-particle" style="position:absolute;top:10%;left:107%;width:4px;height:4px;border-radius:50%;background:#A78BFA;animation-delay:0s;pointer-events:none"></div><div class="cv-particle" style="position:absolute;top:3%;left:6%;width:3px;height:3px;border-radius:50%;background:#60EFFF;animation-delay:0.7s;pointer-events:none"></div><div class="cv-particle" style="position:absolute;top:84%;left:2%;width:3px;height:3px;border-radius:50%;background:#EC4899;animation-delay:1.4s;pointer-events:none"></div><div class="cv-particle" style="position:absolute;top:90%;left:95%;width:4px;height:4px;border-radius:50%;background:#A78BFA;animation-delay:0.3s;pointer-events:none"></div><div class="cv-particle" style="position:absolute;top:48%;left:-5%;width:2px;height:2px;border-radius:50%;background:#80FFDB;animation-delay:1.1s;pointer-events:none"></div><div class="cv-particle" style="position:absolute;top:20%;left:110%;width:2px;height:2px;border-radius:50%;background:#F4D03F;animation-delay:1.8s;pointer-events:none"></div><div class="cv-particle" style="position:absolute;top:65%;left:106%;width:3px;height:3px;border-radius:50%;background:#EC4899;animation-delay:0.9s;pointer-events:none"></div></div><div style="margin-top:2.6rem;display:flex;flex-direction:column;align-items:center;gap:1.1rem;opacity:1;transform:translateY(0)"><div class="cv-cta" style="position:relative;border-radius:100px"><div style="position:absolute;inset:-3px;border-radius:100px;pointer-events:none;box-shadow:0 0 38px rgba(140,110,255,0.42), 0 0 80px rgba(80,100,220,0.18), 0 0 40px rgba(191,255,0,0.18);transition:box-shadow 0.4s ease;will-change:opacity"></div><button tabindex="0" style="position:relative;padding:1.05rem 2.6rem;border-radius:100px;background:#3B82F6;border:1px solid rgba(191,255,0,0);color:#050507;font-size:0.7rem;font-weight:800;letter-spacing:0.42em;text-transform:uppercase;cursor:pointer;display:flex;align-items:center;gap:0.95rem;transition:background 0.32s ease;will-change:background"><span style="display:inline-flex;align-items:center;color:#050507;will-change:transform"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></span>See Your Future<span style="color:#050507;font-size:1rem;line-height:1;will-change:transform">→</span></button></div><div style="will-change:transform"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div></div><button style="margin-top:1.1rem;padding:0.65rem 1.6rem;border-radius:100px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:rgba(255,255,255,0.3);font-size:0.58rem;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;cursor:pointer;display:flex;align-items:center;gap:0.55rem;transition:color 0.25s, border-color 0.25s;opacity:0"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>Or see yourself in the future<span style="color:inherit;opacity:0.6">→</span></button></div><style>
          @keyframes cv-float {
            0%, 100% { transform: translateY(0px);    }
            50%       { transform: translateY(-16px);  }
          }
          @keyframes cv-swirl-1 {
            from { transform: rotate(0deg);   }
            to   { transform: rotate(360deg); }
          }
          @keyframes cv-swirl-2 {
            from { transform: rotate(0deg);    }
            to   { transform: rotate(-360deg); }
          }
          @keyframes cv-breathe {
            0%, 100% { transform: scale(1);     opacity: 0.55; }
            50%       { transform: scale(1.14);  opacity: 1;    }
          }
          @keyframes cv-particle {
            0%, 100% { transform: translateY(0px)  translateX(0px);  opacity: 0.28; }
            33%       { transform: translateY(-9px)  translateX(5px);  opacity: 0.85; }
            66%       { transform: translateY(-4px)  translateX(-7px); opacity: 0.45; }
          }
          @keyframes cv-twinkle {
            0%, 100% { opacity: 0.15; }
            50%       { opacity: 0.72; }
          }
          .cv-float    { animation: cv-float   6.5s ease-in-out infinite; will-change: transform; }
          .cv-swirl-1  { animation: cv-swirl-1 20s   linear     infinite; will-change: transform; }
          .cv-swirl-2  { animation: cv-swirl-2 13s   linear     infinite; will-change: transform; }
          .cv-breathe  { animation: cv-breathe  4.5s ease-in-out infinite; will-change: transform, opacity; }
          .cv-particle { animation: cv-particle 3.8s ease-in-out infinite; will-change: transform, opacity; }
          .cv-moon     { will-change: transform; }
          @keyframes cv-shake {
            0%,  100% { transform: rotate(0deg)    scale(1);    }
            15%        { transform: rotate(-3.5deg) scale(1.04); }
            30%        { transform: rotate(3.5deg)  scale(1.02); }
            45%        { transform: rotate(-2.5deg) scale(1.03); }
            60%        { transform: rotate(2deg)    scale(1.02); }
            75%        { transform: rotate(-1deg)   scale(1.01); }
          }
          /* Shake plays 0–30% of a 2s loop so the ball shakes then rests */
          @keyframes cv-shake-loop {
            0%   { transform: rotate(0deg)    scale(1);    }
            4%   { transform: rotate(-3.5deg) scale(1.04); }
            8%   { transform: rotate(3.5deg)  scale(1.02); }
            12%  { transform: rotate(-2.5deg) scale(1.03); }
            16%  { transform: rotate(2deg)    scale(1.02); }
            20%  { transform: rotate(-1deg)   scale(1.01); }
            26%, 100% { transform: rotate(0deg) scale(1); }
          }
          @keyframes cv-moon {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          .cv-moon { animation: cv-moon 18s linear infinite; }
          @keyframes cv-platform-pulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50%      { opacity: 1;   transform: scale(1.04); }
          }
          @keyframes cv-platform-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes cv-data-blink {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50%      { opacity: 1;   transform: scale(1.5); }
          }
          /* All-seeing eye — pupil glances around: center → left → center → right → center → up → center */
          @keyframes cv-eye-look {
            0%,  8%   { transform: translate(0px, 0px); }
            14%, 24%  { transform: translate(-26px, 0px); }    /* look LEFT */
            30%, 32%  { transform: translate(0px, 0px); }
            38%, 48%  { transform: translate(26px, 0px); }     /* look RIGHT */
            54%, 56%  { transform: translate(0px, 0px); }
            62%, 72%  { transform: translate(0px, -16px); }    /* look UP */
            78%, 100% { transform: translate(0px, 0px); }
          }
          .cv-eye-pupil { animation: cv-eye-look 9s cubic-bezier(0.65, 0, 0.35, 1) infinite; transform-origin: center; }
          /* Eyelid blink — quick close every ~7s */
          @keyframes cv-eye-blink {
            0%, 92%, 100% { opacity: 0; }
            94%, 96%      { opacity: 1; }
          }
          .cv-eye-lid { animation: cv-eye-blink 7s ease-in-out infinite; }
          @keyframes film-scan {
            from { transform: translateY(-4px); }
            to   { transform: translateY(100vh); }
          }
          .film-scan-beam { animation: film-scan 3s linear infinite; }
          .cv-sphere.is-hovering {
            animation: cv-shake-loop 2.2s ease-in-out infinite !important;
            box-shadow:
              0 0 100px 30px rgba(170,80,255,0.6),
              0 0 200px 60px rgba(80,180,255,0.3),
              0 0 300px 100px rgba(255,80,200,0.18),
              0 90px 140px rgba(0,0,0,0.95),
              inset 0 0 80px rgba(130,60,255,0.3),
              inset 0 -55px 90px rgba(20,0,70,0.6) !important;
          }
        </style>`;

const services = [
  {
    id: '01',
    title: 'LEARN',
    description: 'Understand the fundamentals of Social Media.',
    details: ['Algorithms', 'Reach vs Engagement', 'Platform Psychology'],
    icon: '🧠',
    accentColor: '#10B981',
  },
  {
    id: '02',
    title: 'THINK',
    description: 'Understand the business and audience.',
    details: ['Target Audience', 'Pain Points', 'Business USP'],
    icon: '💡',
    accentColor: '#0EA5E9',
  },
  {
    id: '03',
    title: 'FIND HOOK',
    description: 'Find something people would actually stop scrolling for.',
    details: ['Visual Hooks', 'Audio Hooks', 'Text Hooks'],
    icon: '🪝',
    accentColor: '#F43F5E',
  },
  {
    id: '04',
    title: 'CREATE',
    description: 'Build the Reel concept/script.',
    details: ['Storyboarding', 'Scripting', 'Shot List'],
    icon: '📝',
    accentColor: '#8B5CF6',
  },
  {
    id: '05',
    title: 'SHOOT',
    description: 'Create the actual footage.',
    details: ['Angles', 'Lighting', 'Audio Capture'],
    icon: '🎥',
    accentColor: '#F59E0B',
  },
  {
    id: '06',
    title: 'EDIT',
    description: 'Edit the Reel practically.',
    details: ['Cutting', 'Transitions', 'Captions'],
    icon: '✂️',
    accentColor: '#EC4899',
  },
  {
    id: '07',
    title: 'PUBLISH',
    description: 'Complete the Instagram-ready content.',
    details: ['Cover Image', 'Caption Writing', 'Hashtags'],
    icon: '🚀',
    accentColor: '#3B82F6',
  },
  {
    id: '08',
    title: 'REVIEW',
    description: 'Get feedback and improve.',
    details: ['Analytics', 'Mentor Feedback', 'Iteration'],
    icon: '📊',
    accentColor: '#3B82F6',
  }
];

export default function CrystalVision({ onOpenOnboarding }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [futureIndex, setFutureIndex] = useState(0);

  const handleReveal = () => {
    setFutureIndex((prev) => (prev + 1) % services.length);
    setModalOpen(true);
  };

  const active = services[futureIndex];

  return (
    <section className="relative bg-[#07001a] overflow-hidden border-t border-white/[0.04] py-24 md:py-32">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(130, 60, 255, 0.18) 0%, rgba(0, 212, 232, 0.08) 40%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#3B82F6] text-xs font-bold uppercase tracking-[0.3em] mb-6">
          <Sparkles size={12} />
          <span>Up Digital × BanaviAeBrand</span>
        </div>

        {/* Animated Letter Headline */}
        <div className="mb-8">
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              marginBottom: '0.4rem',
            }}
          >
            {"THE BIG IDEA".split("").map((ch, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  opacity: 0,
                  animation: `fv-char-land 0.65s cubic-bezier(0.16,1,0.3,1) ${0.3 + idx * 0.045}s forwards`,
                  whiteSpace: ch === ' ' ? 'pre' : 'normal',
                }}
              >
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </h2>

          <h2
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: 'transparent',
              WebkitTextStroke: '2px rgba(255,255,255,0.3)',
            }}
          >
            {"BanaviAeBrand".split("").map((ch, idx) => (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  opacity: 0,
                  animation: `fv-char-land 0.65s cubic-bezier(0.16,1,0.3,1) ${0.85 + idx * 0.045}s forwards`,
                  whiteSpace: ch === ' ' ? 'pre' : 'normal',
                }}
              >
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
          </h2>
        </div>

        <p className="text-white/60 text-lg leading-relaxed max-w-md mx-auto mb-10">
          The exact sequence of practical execution you will follow during the 1-day event.
        </p>

        {/* ── The Celestial Crystal Orb (Exact Original HTML & Keyframes) ── */}
        <div
          className="relative my-4 flex items-center justify-center cursor-pointer select-none"
          onClick={handleReveal}
          data-cursor-label="Reveal"
          dangerouslySetInnerHTML={{ __html: ORB_HTML }}
        />

        {/* Action Button */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={handleReveal}
            data-cursor-label="See Steps"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#00D4E8] text-black font-black text-sm uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_30px_rgba(191,255,0,0.5)] transform hover:scale-105 active:scale-95"
          >
            <Wand2 size={16} />
            <span>View Action Steps →</span>
          </button>
        </div>
      </div>

      {/* ── Interactive Prediction Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div
            className="relative w-full max-w-lg bg-[#0A0A0F] border border-purple-500/40 rounded-2xl p-8 shadow-[0_0_60px_rgba(130,60,255,0.4)] text-left"
            style={{
              background: 'radial-gradient(circle at top right, rgba(130,60,255,0.2), #0A0A0F 70%)',
            }}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles size={12} />
              <span>Step {active.id}</span>
            </div>

            <h3 className="text-3xl font-black text-white mb-2" style={{ color: active.accentColor }}>
              {active.icon} {active.title}
            </h3>

            <p className="text-white/80 text-base leading-relaxed mb-6">
              {active.description}
            </p>

            <div className="mb-8">
              <div className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Key Details:</div>
              <div className="flex flex-wrap gap-2">
                {active.details.map((detail, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/90 text-xs font-medium">
                    {detail}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setModalOpen(false);
                  onOpenOnboarding();
                }}
                className="w-full sm:w-auto flex-1 px-6 py-3 rounded-xl bg-[#3B82F6] text-black font-bold text-sm text-center hover:bg-[#2563EB] shadow-[0_0_20px_rgba(191,255,0,0.4)] transition-colors"
              >
                Make This Your Future →
              </button>

              <button
                onClick={() => setFutureIndex((prev) => (prev + 1) % services.length)}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw size={14} />
                <span>Next Prophecy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
