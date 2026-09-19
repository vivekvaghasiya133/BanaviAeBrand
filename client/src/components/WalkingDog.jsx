import React from 'react';

export default function WalkingDog() {
  return (
    <div className="relative w-full bg-[#f5f5f0] overflow-hidden" style={{ height: '130px' }}>
      <div
        className="absolute bottom-0 pointer-events-none"
        style={{
          animation: 'dogWalk 18s linear infinite',
          willChange: 'transform',
        }}
      >
        {/* Speech Bubble */}
        <div
          className="absolute whitespace-nowrap text-xs font-black bg-black text-[#3B82F6] px-3 py-1.5 rounded-full tracking-wide uppercase shadow-md"
          style={{
            bottom: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'bubbleFloat 0.9s ease-in-out infinite alternate',
            letterSpacing: '0.05em',
            willChange: 'transform',
          }}
        >
          woof! work with us
          <span
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: '-6px',
              width: 0,
              height: 0,
              display: 'block',
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '7px solid black',
            }}
          />
        </div>

        {/* Astronaut Dog SVG */}
        <svg
          width="128"
          height="86"
          viewBox="-4 -16 128 86"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="helmetGlass" cx="30%" cy="30%" r="80%">
              <stop offset="0%" stopColor="rgba(220,240,255,0.45)" />
              <stop offset="50%" stopColor="rgba(180,220,255,0.18)" />
              <stop offset="100%" stopColor="rgba(160,200,240,0.10)" />
            </radialGradient>
            <linearGradient id="helmetRing" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E5E7EB" />
              <stop offset="50%" stopColor="#9CA3AF" />
              <stop offset="100%" stopColor="#4B5563" />
            </linearGradient>
          </defs>

          {/* Wagging Tail */}
          <g
            style={{
              transformOrigin: '17px 34px',
              animation: 'wagTail 0.38s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          >
            <path
              d="M17 34 C9 26 5 14 11 7"
              stroke="#C8964A"
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Dog Body */}
          <ellipse cx="50" cy="38" rx="30" ry="15" fill="#D4A96A" />
          <ellipse cx="76" cy="32" rx="10" ry="9" fill="#D4A96A" />
          <circle cx="84" cy="24" r="16" fill="#D4A96A" />

          {/* Ear */}
          <ellipse
            cx="89"
            cy="13"
            rx="8"
            ry="10"
            fill="#B8864A"
            transform="rotate(14 89 13)"
          />

          {/* Eye */}
          <circle cx="91" cy="21" r="3.2" fill="#1a0800" />
          <circle cx="92.3" cy="19.7" r="1.2" fill="white" />

          {/* Snout and Nose */}
          <ellipse cx="99" cy="27" rx="4.5" ry="3.5" fill="#1a0800" />
          <path
            d="M95 30 Q99 35 103 30"
            stroke="#1a0800"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="99" cy="35" rx="3.5" ry="3" fill="#FF6B8A" />

          {/* Four Animated Walking Legs */}
          <rect
            x="26"
            y="49"
            width="9"
            height="20"
            rx="4.5"
            fill="#B8864A"
            style={{
              transformOrigin: '30px 49px',
              animation: 'legA 0.38s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          />
          <rect
            x="36"
            y="49"
            width="9"
            height="20"
            rx="4.5"
            fill="#C8964A"
            style={{
              transformOrigin: '40px 49px',
              animation: 'legB 0.38s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          />
          <rect
            x="62"
            y="49"
            width="9"
            height="20"
            rx="4.5"
            fill="#B8864A"
            style={{
              transformOrigin: '66px 49px',
              animation: 'legB 0.38s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          />
          <rect
            x="72"
            y="49"
            width="9"
            height="20"
            rx="4.5"
            fill="#C8964A"
            style={{
              transformOrigin: '76px 49px',
              animation: 'legA 0.38s ease-in-out infinite alternate',
              willChange: 'transform',
            }}
          />

          {/* Astronaut Helmet Glass */}
          <circle
            cx="86"
            cy="22"
            r="28"
            fill="url(#helmetGlass)"
            stroke="rgba(220,240,255,0.55)"
            strokeWidth="1.2"
          />
          <circle
            cx="86"
            cy="22"
            r="27"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.4"
          />
          <ellipse
            cx="72"
            cy="9"
            rx="9"
            ry="4.5"
            fill="rgba(255,255,255,0.5)"
            transform="rotate(-30 72 9)"
          />
          <ellipse
            cx="75"
            cy="7"
            rx="3.5"
            ry="1.6"
            fill="rgba(255,255,255,0.85)"
            transform="rotate(-30 75 7)"
          />

          {/* Helmet Ring Base */}
          <ellipse
            cx="86"
            cy="47"
            rx="14"
            ry="4"
            fill="url(#helmetRing)"
            stroke="#374151"
            strokeWidth="0.8"
          />

          {/* Antenna with pulsing light */}
          <line
            x1="86"
            y1="-6"
            x2="86"
            y2="-1"
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle
            cx="86"
            cy="-7"
            r="2.5"
            fill="#3B82F6"
            style={{
              boxShadow: '0 0 6px #3B82F6',
            }}
          />
        </svg>
      </div>
    </div>
  );
}
