import React, { useState } from 'react';
import { Terminal, ShieldCheck, Activity, ChevronRight, Layers, Target, Search, Video, Bot } from 'lucide-react';

export default function PortfolioCockpit({ onSelectServicePod }) {
  const [activePod, setActivePod] = useState(0);

  const pods = [
    {
      id: 'UPD-01',
      name: 'Web Design',
      icon: Layers,
      highlight: 'Zero-Template Headless Builds',
      status: 'Nominal 100%',
      metrics: 'Core Vitals 99 | Conversion +240%',
      color: '#3B82F6',
      clientSummary: 'Slavista, Savants AI, Luxury Hospitality platforms'
    },
    {
      id: 'UPD-02',
      name: 'Paid Ads',
      icon: Target,
      highlight: 'Continuous Algorithmic Bidding',
      status: 'Active Matrix',
      metrics: '5.2× Verified ROAS | -38% CAC',
      color: '#0EA5E9',
      clientSummary: 'Pongbot, Direct-to-Consumer eCom brands'
    },
    {
      id: 'UPD-03',
      name: 'AI SEO',
      icon: Search,
      highlight: 'LLM Citations & Search Generative',
      status: 'Ranking Active',
      metrics: '#1 Rank for 14 AI Keywords | 320% Inbound',
      color: '#00D4E8',
      clientSummary: 'Savants AI, SaaS & High-Growth tech'
    },
    {
      id: 'UPD-04',
      name: 'Social UGC',
      icon: Video,
      highlight: 'Viral Retention Ecosystems',
      status: 'Live Stream',
      metrics: '+417K Followers | $100K in 90 Days',
      color: '#EC4899',
      clientSummary: '@dr.remina, Duck English, Lifestyle creators'
    },
    {
      id: 'UPD-05',
      name: 'AI Agents',
      icon: Bot,
      highlight: 'Autonomous Digital Team Members',
      status: '24/7 Deployed',
      metrics: 'Maya Strategist | 70% Overhead Cut',
      color: '#A78BFA',
      clientSummary: 'Enterprise automations, CRM qualification'
    }
  ];

  const current = pods[activePod];
  const Icon = current.icon;

  return (
    <section id="portfolio" className="py-20 md:py-28 bg-black overflow-hidden relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Cockpit HUD Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] text-xs font-mono font-semibold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-ping" />
            <span>Systems Nominal · HUD Cockpit UPD-2026</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 uppercase">
            CHECK OUT <span className="text-[#3B82F6]">OUR WORK.</span>
          </h2>

          <p className="text-white/60 text-sm sm:text-base">
            Switch between mission pods below to explore specialized portfolios across our 5 core services.
          </p>
        </div>

        {/* Pod Selection Buttons Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {pods.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActivePod(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-2 border ${
                activePod === idx
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                  : 'bg-[#0A0A0F] text-white/70 border-white/10 hover:border-white/25 hover:text-white'
              }`}
            >
              <span className="text-[10px] text-black/50 opacity-80">{p.id}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        {/* Active Pod Telemetry Console */}
        <div className="max-w-4xl mx-auto bg-[#07070C] border border-white/10 rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          {/* Cybernetic Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#3B82F6]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#3B82F6]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#3B82F6]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#3B82F6]" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Pod Info */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${current.color}20`, color: current.color }}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-white/40 tracking-widest">
                    MISSION POD // {current.id}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {current.name} Pod
                  </h3>
                </div>
              </div>

              <div className="text-lg font-semibold text-white/90">
                {current.highlight}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-white/80">
                  {current.metrics}
                </span>
                <span className="px-3 py-1 rounded-md bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-xs font-mono text-[#3B82F6]">
                  {current.status}
                </span>
              </div>

              <p className="text-sm text-white/50 pt-2">
                Featured Work: <span className="text-white/80">{current.clientSummary}</span>
              </p>
            </div>

            {/* Right Quick Telemetry */}
            <div className="md:col-span-4 bg-[#0A0A10] border border-white/5 rounded-xl p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-white/40">Status:</span>
                <span className="text-[#3B82F6] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                  ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-white/40">Location:</span>
                <span className="text-white/80">Miami & NYC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/40">AI Engine:</span>
                <span className="text-[#00D4E8]">V4 Autonomous</span>
              </div>

              <a
                href="#selected-work"
                className="w-full mt-4 py-2.5 rounded-lg bg-white/10 hover:bg-[#3B82F6] hover:text-black text-white font-bold text-center block transition-colors tracking-normal text-xs"
              >
                Inspect Case Studies ↓
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
