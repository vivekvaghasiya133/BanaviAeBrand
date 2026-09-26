import React, { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, ArrowRight, Menu, X, ExternalLink } from 'lucide-react';

export default function Navbar({ onOpenOnboarding }) {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e) => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next === 7) {
      setEasterEggActive(true);
      setTimeout(() => setEasterEggActive(false), 4000);
      setLogoClicks(0);
    }
  };

  const servicesList = [
    { title: 'Content Strategy', desc: 'Deep research, hook psychology & scriptwriting', id: 'services' },
    { title: 'Pro Shooting', desc: 'Cinematic framing, movement & lighting mastery', id: 'services' },
    { title: 'Live Editing', desc: 'High-retention cuts, captions & sound design', id: 'services' },
    { title: 'Social Growth', desc: 'Instagram algorithms & community building hacks', id: 'services' },
    { title: 'Paid Ads', desc: 'Scaling with Meta Ads & high-ROI targeting', id: 'services' },
  ];

  const handleBookSlot = (e) => {
    e?.preventDefault?.();
    if (window.location.pathname !== '/') {
      window.location.href = '/#register';
      return;
    }
    const el = document.getElementById('register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const input = el.querySelector('input');
        if (input) input.focus({ preventScroll: true });
      }, 500);
    } else {
      window.location.hash = 'register';
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050507]/90 backdrop-blur-md border-b border-white/[0.08] shadow-2xl py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between relative">
        {/* Logo with interactive orbit */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          data-cursor-label={easterEggActive ? '✦ SECRET!' : 'click me ✦'}
        >
          {/* Orbit ring on hover */}
          <div
            className={`absolute pointer-events-none transition-opacity duration-300 ${
              isLogoHovered || easterEggActive ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: '50%',
              top: '50%',
              width: '140px',
              height: '42px',
              transform: 'translate(-50%, -50%) rotate(-12deg)',
              borderRadius: '50%',
              border: '1px dashed rgba(59,130,246,0.6)',
              animation: 'logo-orbit-spin 6s linear infinite',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #fff 0%, #3B82F6 50%, #1d4ed8 100%)',
                boxShadow: '0 0 8px #3B82F6, 0 0 16px rgba(59,130,246,0.8)',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 relative z-10 transition-transform duration-300 hover:scale-105 active:scale-95"
            aria-label="BanaviAeBrand Home"
          >
            <span className="text-2xl font-black tracking-tighter text-white">
              Banavi<span className="text-[#3B82F6]">Ae</span>Brand
            </span>
          </a>

          {/* Easter egg toast */}
          {easterEggActive && (
            <div className="absolute top-12 left-0 bg-[#3B82F6] text-black text-xs font-black px-3 py-1.5 rounded-md whitespace-nowrap shadow-[0_0_20px_#3B82F6] animate-bounce z-50">
              ⚡ Secret Unlocked! BanaviAeBrand Action Matrix!
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 text-sm font-medium">
          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/75 hover:text-white transition-colors duration-200"
              onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Services</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180 text-[#3B82F6]' : ''}`}
              />
            </button>

            {servicesOpen && (
              <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-fadeIn">
                <div className="bg-[#0A0A0F]/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl space-y-1">
                  {servicesList.map((s, idx) => (
                    <a
                      key={idx}
                      href={`#${s.id}`}
                      className="block p-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="text-white text-xs font-semibold group-hover:text-[#3B82F6] transition-colors flex items-center justify-between">
                        <span>{s.title}</span>
                        <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-[11px] text-white/50 line-clamp-1 mt-0.5">{s.desc}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a
            href="#workshops"
            className="px-3 py-2 rounded-lg text-white/75 hover:text-white transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('workshops')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Workshops
          </a>

          <a
            href="#team"
            className="px-3 py-2 rounded-lg text-white/75 hover:text-white transition-colors duration-200"
          >
            Team
          </a>

          <a
            href="#register"
            onClick={handleBookSlot}
            className="px-3 py-2 rounded-lg text-white/75 hover:text-white transition-colors duration-200"
          >
            Apply
          </a>

          <a
            href="#footer"
            className="px-3 py-2 rounded-lg text-white/75 hover:text-white transition-colors duration-200"
          >
            Contact
          </a>
        </div>

        {/* Start Your Project / Book Slot CTA Button */}
        <div className="hidden md:flex items-center">
          <button
            onClick={handleBookSlot}
            data-cursor-label="Let's Go"
            className="px-5 py-2 rounded-lg bg-[#3B82F6] text-black text-sm font-bold tracking-wide hover:bg-[#2563EB] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Book Slot
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:text-[#3B82F6] focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#050507]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4">
          <div className="flex flex-col gap-3 text-base font-medium">
            <a
              href="#services"
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-white/80 hover:text-[#3B82F6] py-2 border-b border-white/5"
            >
              Services
            </a>
            <a
              href="#workshops"
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('workshops')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-white/80 hover:text-[#3B82F6] py-2 border-b border-white/5"
            >
              Workshops
            </a>
            <a
              href="#team"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 hover:text-[#3B82F6] py-2 border-b border-white/5"
            >
              Team
            </a>
            <a
              href="#register"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleBookSlot(e);
              }}
              className="text-white/80 hover:text-[#3B82F6] py-2 border-b border-white/5 flex items-center justify-between"
            >
              <span>Apply Now</span>
            </a>
            <a
              href="#footer"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 hover:text-[#3B82F6] py-2"
            >
              Contact
            </a>
          </div>

          <button
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleBookSlot(e);
            }}
            className="w-full py-3 rounded-lg bg-[#3B82F6] text-black font-bold text-center mt-4 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            Book Slot
          </button>
        </div>
      )}
    </header>
  );
}
