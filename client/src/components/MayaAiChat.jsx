import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, RefreshCw, MessageSquare, ArrowRight } from 'lucide-react';

export default function MayaAiChat({ onOpenOnboarding }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm Maya, Up Digital's AI marketing strategist. ✦ I'm available 24/7 to discuss campaign architectures, AI SEO citations, high-converting paid ads, or custom automations. How can I help scale your brand today?",
      suggestedFollowUps: [
        "How do you optimize for ChatGPT & Perplexity?",
        "How did you achieve 5.2x ROAS for Pongbot?",
        "What services do you recommend for $5K/mo?"
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (userMsg) => {
    const textToSend = userMsg || input;
    if (!textToSend.trim() || loading) return;

    setInput('');
    const newMessages = [...messages, { role: 'user', text: textToSend }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: data.reply,
          suggestedFollowUps: data.suggestedFollowUps || []
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          text: "I'm experiencing a brief network fluctuation with our Miami AI node. However, you can explore our case studies or launch your project onboarding directly!",
          suggestedFollowUps: ["Start Your Project", "View Pongbot Case Study"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="maya" className="py-24 md:py-32 bg-[#050507] border-t border-white/5 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#3B82F6]/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Maya Bio & Heading */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-ping" />
              <span className="text-xs font-mono font-bold tracking-wider text-[#3B82F6] uppercase">
                Live Now · Miami AI Cluster
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-[1.05]">
              MEET MAYA, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#00D4E8]">
                YOUR AI MARKETING
              </span> <br />
              STRATEGIST.
            </h2>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed">
              Available 24/7. Trained on everything Up Digital knows. Ask Maya how to scale paid ads, rank on Perplexity & SGE, produce viral UGC, or automate workflows.
            </p>

            {/* Maya Avatar Preview Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#3B82F6] shadow-[0_0_15px_#3B82F6]/30 shrink-0">
                <img
                  src="/maya-v4.png"
                  alt="Maya AI Strategist"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-white font-bold text-base flex items-center gap-2">
                  <span>Maya V4.2</span>
                  <span className="text-[10px] bg-[#3B82F6] text-black px-2 py-0.5 rounded font-black uppercase">
                    ONLINE
                  </span>
                </div>
                <div className="text-white/50 text-xs mt-0.5">
                  Autonomous Marketing Strategist · Up Digital
                </div>
              </div>
            </div>

            <button
              onClick={onOpenOnboarding}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#3B82F6] hover:underline pt-2"
            >
              <span>Prefer to speak with our human partners? Start onboarding</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Right Column: Live Interactive Chat Terminal */}
          <div className="lg:col-span-7">
            <div className="w-full bg-[#0A0A12] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[560px]">
              {/* Terminal Top Bar */}
              <div className="px-6 py-4 bg-[#10101C] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#3B82F6]/60">
                    <img src="/maya-v4.png" alt="Maya" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Maya AI</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                    </div>
                    <div className="text-[10px] text-white/40 font-mono">
                      Latency: 14ms · Memory: Active
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 text-sm font-sans">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-3.5 leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-[#3B82F6] text-black font-medium shadow-md'
                          : 'bg-[#151522] border border-white/10 text-white/90 shadow-sm'
                      }`}
                    >
                      {/* Formatted markdown text */}
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>

                    {/* Suggested follow-up prompt chips */}
                    {m.suggestedFollowUps && m.suggestedFollowUps.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 ml-1">
                        {m.suggestedFollowUps.map((chip, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => handleSend(chip)}
                            className="text-xs px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-[#3B82F6] hover:text-black text-white/80 border border-white/10 transition-colors flex items-center gap-1"
                          >
                            <Sparkles size={10} className="text-[#3B82F6] hover:text-black" />
                            <span>{chip}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-xs text-white/50 bg-[#151522] border border-white/5 w-fit px-4 py-3 rounded-2xl">
                    <RefreshCw size={14} className="animate-spin text-[#3B82F6]" />
                    <span>Maya is formulating strategy...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-4 bg-[#10101C] border-t border-white/10 flex items-center gap-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Maya anything (e.g. 'How do you achieve 5.2x ROAS?')..."
                  className="flex-1 bg-[#181828] border border-white/10 focus:border-[#3B82F6] rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-3 rounded-xl bg-[#3B82F6] text-black font-bold hover:bg-[#2563EB] disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
