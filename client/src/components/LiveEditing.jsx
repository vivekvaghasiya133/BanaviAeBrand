import React from 'react';
import { Scissors, Play, Layers, Sparkles, MoveHorizontal, Volume2, Type } from 'lucide-react';

export default function LiveEditing() {
  const topics = [
    { name: "Selecting clips", icon: <Layers className="w-4 h-4 text-[#3B82F6]" /> },
    { name: "Cutting & Trimming", icon: <Scissors className="w-4 h-4 text-[#00D4E8]" /> },
    { name: "Perfect Timing", icon: <Play className="w-4 h-4 text-[#F43F5E]" /> },
    { name: "Dynamic Text", icon: <Type className="w-4 h-4 text-[#8B5CF6]" /> },
    { name: "Auto Captions", icon: <Sparkles className="w-4 h-4 text-[#F59E0B]" /> },
    { name: "Music Sync", icon: <Volume2 className="w-4 h-4 text-[#EC4899]" /> },
    { name: "Basic Transitions", icon: <MoveHorizontal className="w-4 h-4 text-[#3B82F6]" /> },
    { name: "Hook Placement", icon: <Sparkles className="w-4 h-4 text-[#00D4E8]" /> }
  ];

  return (
    <section className="py-24 bg-[#050507] border-y border-white/5 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#00D4E8]/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Text Content */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
              <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse"></span>
              <span className="text-white/80 text-xs font-bold tracking-[0.2em] uppercase">Practical Session</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
              LIVE EDITING. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-green-400 to-[#00D4E8]">
                WATCH LESS. <br/>EDIT MORE.
              </span>
            </h2>
            
            <p className="text-lg text-white/60 mb-10 leading-relaxed max-w-lg font-medium">
              Participants will <strong className="text-white">NOT</strong> simply watch someone edit. They will edit their own content. We will guide you step-by-step through the entire process on your own phone.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {topics.map((topic, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                  <div className="p-2 bg-black/50 rounded-lg shadow-inner">
                    {topic.icon}
                  </div>
                  <span className="text-white/90 font-bold text-sm tracking-wide">{topic.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Phone Mockup */}
          <div className="flex-1 w-full max-w-md relative flex justify-center perspective-[1000px]">
            {/* Phone Frame */}
            <div className="aspect-[9/19] w-[300px] bg-black border-[6px] border-[#1a1a24] rounded-[3rem] shadow-[0_0_50px_rgba(191,255,0,0.15)] relative overflow-hidden flex flex-col transform rotate-y-[-5deg] hover:rotate-y-[0deg] transition-transform duration-700">
              
              {/* Notch */}
              <div className="absolute top-0 w-32 h-7 bg-[#1a1a24] rounded-b-2xl left-1/2 -translate-x-1/2 z-20"></div>
              
              {/* Screen Content */}
              <div className="w-full h-full bg-[#0a0a0f] relative overflow-hidden flex flex-col justify-between">
                
                {/* Video Preview Area */}
                <div className="flex-1 bg-gradient-to-b from-[#151522] to-[#0a0a0f] relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                  <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md shadow-[0_0_30px_rgba(191,255,0,0.2)]">
                    <Play className="w-10 h-10 text-[#3B82F6] ml-2" />
                  </div>
                  
                  {/* Floating UI Elements */}
                  <div className="absolute top-12 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-white text-[10px] font-bold">00:14 / 00:30</span>
                  </div>
                </div>
                
                {/* Timeline Editor Area */}
                <div className="h-64 bg-[#050507] border-t border-white/10 p-4 relative z-10 flex flex-col">
                  {/* Playhead */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-red-500 z-30 shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                    <div className="w-3 h-3 bg-red-500 rounded-sm absolute -top-1.5 left-1/2 -translate-x-1/2"></div>
                  </div>
                  
                  {/* Tools */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-4 text-white/50">
                      <Scissors className="w-5 h-5 hover:text-white cursor-pointer" />
                      <Layers className="w-5 h-5 hover:text-white cursor-pointer" />
                      <Type className="w-5 h-5 hover:text-white cursor-pointer" />
                    </div>
                    <div className="text-white/30 text-xs font-mono">1080x1920</div>
                  </div>
                  
                  {/* Tracks */}
                  <div className="flex-1 space-y-2 relative overflow-hidden flex flex-col justify-center">
                    {/* Video Track */}
                    <div className="h-12 bg-white/5 rounded-lg border border-white/10 flex overflow-hidden">
                      <div className="w-1/3 h-full bg-[#3B82F6]/20 border-r border-[#3B82F6]/50 relative"></div>
                      <div className="w-1/2 h-full bg-[#00D4E8]/20 border-r border-[#00D4E8]/50 relative"></div>
                    </div>
                    {/* Audio Track */}
                    <div className="h-8 bg-white/5 rounded-lg border border-white/10 flex overflow-hidden opacity-80">
                      <div className="w-full h-full bg-[#F43F5E]/20 relative flex items-center px-1">
                        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjEwIiB2aWV3Qm94PSIwIDAgNCAxMCI+PHJlY3QgeD0iMCIgeT0iNCIgd2lkdGg9IjIiIGhlaWdodD0iMiIgZmlsbD0icmdiYSgyNDQsIDYzLCA5NCwgMC41KSIvPjwvc3ZnPg==')]"></div>
                      </div>
                    </div>
                    {/* Text Track */}
                    <div className="h-6 bg-white/5 rounded-lg border border-white/10 flex overflow-hidden opacity-60">
                      <div className="w-1/4 h-full bg-[#8B5CF6]/40 ml-4 rounded flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white tracking-widest">TEXT</span>
                      </div>
                    </div>
                  </div>
                  
                </div>
                
              </div>
            </div>
            
            {/* Ambient Shadow for Phone */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-[#3B82F6]/20 blur-2xl rounded-full"></div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
