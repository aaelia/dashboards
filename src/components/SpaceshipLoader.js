import React, { useState, useEffect } from 'react';

const SpaceshipLoader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 50,
        y: (e.clientY / window.innerHeight) * 50
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animationFrame = () => {
      setPosition(prev => (prev + 1) % 360);
    };

    const animation = setInterval(animationFrame, 16);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(animation);
    };
  }, []);

  // Complex movement pattern combining multiple sinusoidal waves
  const baseX = Math.sin(position * Math.PI / 180 * 2) * 150;
  const baseY = Math.sin(position * Math.PI / 180) * 100;
  
  // Add secondary motion
  const wobbleX = Math.sin(position * Math.PI / 90) * 20;
  const wobbleY = Math.cos(position * Math.PI / 45) * 15;
  
  // Combine all movements including mouse influence
  const x = baseX + wobbleX + mousePosition.x;
  const y = baseY + wobbleY + mousePosition.y;

  // Calculate rotation based on movement direction
  const rotation = Math.atan2(
    y - (baseY + wobbleY),
    x - (baseX + wobbleX)
  ) * (180 / Math.PI);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-hidden z-50">
      <div 
        className="relative"
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
      >
        {/* Stars background */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 200 - 100}px`,
              top: `${Math.random() * 200 - 100}px`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}

        {/* Spaceship */}
        <svg
          viewBox="0 0 100 60"
          className="w-32 h-32"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main body with gradient */}
          <path
            d="M20 30 L50 10 L80 30 L50 40 Z"
            fill="url(#shipGradient)"
            className="animate-pulse"
          />
          
          {/* Define gradient */}
          <defs>
            <linearGradient id="shipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Cockpit with glow */}
          <ellipse
            cx="50"
            cy="25"
            rx="10"
            ry="5"
            fill="#BFDBFE"
            filter="url(#glow)"
            className="animate-pulse"
          />
          
          {/* Wings with detail */}
          <path
            d="M30 32 L15 45 L30 40 Z"
            fill="#1D4ED8"
            className="animate-pulse"
          />
          <path
            d="M70 32 L85 45 L70 40 Z"
            fill="#1D4ED8"
            className="animate-pulse"
          />
          
          {/* Enhanced rocket flames */}
          <g className="animate-[flicker_0.2s_ease-in-out_infinite]">
            <path
              d="M40 40 L45 50 L50 45 L55 50 L60 40"
              fill="#FCD34D"
              filter="url(#glow)"
            />
            <path
              d="M43 40 L48 55 L50 48 L52 55 L57 40"
              fill="#F87171"
              filter="url(#glow)"
            />
          </g>

          {/* Engine glow */}
          <circle
            cx="50"
            cy="40"
            r="5"
            fill="#FEF3C7"
            filter="url(#glow)"
            className="animate-pulse"
          />
        </svg>

        {/* Enhanced particle trail */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-trail"
              style={{
                width: `${Math.max(2, 8 - i)}px`,
                height: `${Math.max(2, 8 - i)}px`,
                backgroundColor: i < 3 ? '#93C5FD' : '#BFDBFE',
                top: `${i * 12}px`,
                opacity: 1 - i * 0.1,
                animationDelay: `${i * 0.1}s`,
                filter: 'blur(1px)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Add the necessary keyframe animations
const style = document.createElement('style');
style.textContent = `
  @keyframes twinkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(0.8); }
  }
  @keyframes flicker {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(0.98); }
  }
  @keyframes trail {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.5) translate(0, 10px); }
  }
  .animate-twinkle {
    animation: twinkle 2s ease-in-out infinite;
  }
  .animate-trail {
    animation: trail 0.8s ease-out infinite;
  }
`;
document.head.appendChild(style);

export default SpaceshipLoader;