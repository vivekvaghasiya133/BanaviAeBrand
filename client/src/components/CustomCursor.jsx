import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [label, setLabel] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if cursor target or ancestor has data-cursor-label or is a link/button
      const target = e.target.closest('[data-cursor-label], a, button, [role="button"]');
      if (target) {
        setIsHovering(true);
        const customLabel = target.getAttribute('data-cursor-label');
        if (customLabel) {
          setLabel(customLabel);
        } else if (target.tagName.toLowerCase() === 'a') {
          setLabel('Visit');
        } else if (target.tagName.toLowerCase() === 'button') {
          setLabel('Select');
        } else {
          setLabel('');
        }
      } else {
        setIsHovering(false);
        setLabel('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Outer follow circle */}
      <div
        className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out hidden md:flex items-center justify-center"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.6 : 1})`,
        }}
      >
        <div
          className={`rounded-full transition-all duration-300 flex items-center justify-center px-2 py-1 ${
            label
              ? 'bg-[#3B82F6] text-[#0A0A0F] shadow-[0_0_20px_#3B82F6]'
              : isHovering
              ? 'w-10 h-10 border border-[#3B82F6] bg-[#3B82F6]/10 backdrop-blur-sm'
              : 'w-4 h-4 rounded-full border border-white/40'
          }`}
        >
          {label && (
            <span className="text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
              {label}
            </span>
          )}
        </div>
      </div>

      {/* Inner tiny dot */}
      <div
        className="fixed pointer-events-none z-[9999] w-1.5 h-1.5 bg-[#3B82F6] rounded-full hidden md:block"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: 'translate(-50%, -50%)',
          opacity: label ? 0 : 1,
        }}
      />
    </>
  );
}
