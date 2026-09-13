'use client';

import React, { useRef, useState, useCallback } from 'react';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxAngle?: number; // max tilt in degrees (default 8)
  glareOpacity?: number; // max glare opacity (default 0.22)
}

export default function TiltCard3D({
  children,
  className = '',
  maxAngle = 7,
  glareOpacity = 0.22,
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const px = (x / rect.width) * 2 - 1; // -1 to 1
      const py = (y / rect.height) * 2 - 1; // -1 to 1

      const rotX = -py * maxAngle;
      const rotY = px * maxAngle;

      setTransform(`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);

      // Specular sheen radial gradient positioned at cursor
      const glareX = ((x / rect.width) * 100).toFixed(1);
      const glareY = ((y / rect.height) * 100).toFixed(1);

      setGlareStyle({
        opacity: glareOpacity,
        background: `radial-gradient(circle 220px at ${glareX}% ${glareY}%, rgba(212, 175, 55, 0.35), rgba(255, 255, 255, 0.15) 35%, transparent 70%)`,
      });
    },
    [maxAngle, glareOpacity]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlareStyle({ opacity: 0, transition: 'opacity 0.4s ease' });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group will-change-transform ${className}`}
      style={{
        transform,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Specular Glare Sheen Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl overflow-hidden transition-opacity duration-200"
        style={glareStyle}
      />
      {children}
    </div>
  );
}
