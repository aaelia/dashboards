import React, { useState, useEffect } from 'react';

const SpaceshipLoader = () => {
  const [position, setPosition] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * dimensions.width * 0.5,
        y: (e.clientY / window.innerHeight - 0.5) * dimensions.height * 0.5
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animationFrame = () => {
      setPosition(prev => (prev + 1) % 360);
    };

    const animation = setInterval(animationFrame, 16);

    // Force component to stay mounted for at least 5 seconds
    const minDisplayTime = setTimeout(() => {
      // This is just to ensure the state update happens after 5 seconds
      // The actual unmounting is controlled by the parent component
      setPosition(prev => prev);
    }, 5000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(animation);
      clearTimeout(minDisplayTime);
    };
  }, []);

  // Get window dimensions for full screen movement
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Update dimensions when window resizes
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Complex movement pattern utilizing full screen
  const baseX = Math.sin(position * Math.PI / 180 * 2) * (dimensions.width * 0.4);
  const baseY = Math.sin(position * Math.PI / 180) * (dimensions.height * 0.4);
  
  // Add secondary motion
  const wobbleX = Math.sin(position * Math.PI / 90) * (dimensions.width * 0.05);
  const wobbleY = Math.cos(position * Math.PI / 45) * (dimensions.height * 0.05);
  
  // Add circular motion
  const circularX = Math.cos(position * Math.PI / 180) * (dimensions.width * 0.2);
  const circularY = Math.sin(position * Math.PI / 180) * (dimensions.height * 0.2);
  
  // Combine all movements including mouse influence
  const x = baseX + wobbleX + circularX + mousePosition.x;
  const y = baseY + wobbleY + circularY + mousePosition.y;

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
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * dimensions.width}px`,
              top: `${Math.random() * dimensions.height}px`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.3,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`
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
    0% { opacity: 1; transform: scale(1.02); }
    50% { opacity: 0.8; transform: scale(0.98); }
    100% { opacity: 1; transform: scale(1.02); }
  }
  @keyframes trail {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8) translate(0, 5px); }
    100% { opacity: 0; transform: scale(0.5) translate(0, 10px); }
  }
  @keyframes pulse {
    0% { filter: brightness(1); }
    50% { filter: brightness(1.2); }
    100% { filter: brightness(1); }
  }
  .animate-twinkle {
    animation: twinkle 2s ease-in-out infinite;
  }
  .animate-trail {
    animation: trail 1s ease-out infinite;
  }
  .animate-pulse {
    animation: pulse 1.5s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

export default SpaceshipLoader;