
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface BlinkingDotsProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  variant?: 'bounce' | 'pulse' | 'wave' | 'morph';
}

export function BlinkingDots({
  size = 'large',
  color = 'bg-theme',
  variant = 'bounce'
}: BlinkingDotsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    small: 'w-1.5 h-1.5',
    medium: 'w-2.5 h-2.5',
    large: 'w-4 h-4'
  };

  const containerSizeClasses = {
    small: 'space-x-1',
    medium: 'space-x-2',
    large: 'space-x-3'
  };

  useGSAP(() => {
    const dots = gsap.utils.toArray('.dot-animated') as HTMLElement[];
    
    const getColorValue = () => {
      // Extract color for glow effects
      if (color.includes('blue')) return 'rgba(59, 130, 246, 0.5)';
      if (color.includes('red')) return 'rgba(239, 68, 68, 0.5)';
      if (color.includes('green')) return 'rgba(34, 197, 94, 0.5)';
      if (color.includes('purple')) return 'rgba(147, 51, 234, 0.5)';
      return 'rgba(59, 130, 246, 0.5)';
    };

    const glowColor = getColorValue();

    switch(variant) {
      case 'bounce':
        // Energetic bounce animation
        dots.forEach((dot, i) => {
          gsap.to(dot, {
            y: -8,
            duration: 0.4,
            ease: 'power2.out',
            repeat: -1,
            yoyo: true,
            delay: i * 0.15,
          });
        });
        break;

      case 'pulse':
        // Smooth scaling pulse
        dots.forEach((dot, i) => {
          gsap.to(dot, {
            scale: 1.5,
            opacity: 0.5,
            duration: 0.8,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.2,
          });
        });
        break;

      case 'wave':
        // Fluid wave motion
        const waveTl = gsap.timeline({ repeat: -1 });
        
        dots.forEach((dot, i) => {
          waveTl.to(dot, {
            y: -10,
            scale: 1.2,
            duration: 0.3,
            ease: 'power1.inOut',
            boxShadow: `0 0 15px ${glowColor}`,
          }, i * 0.15)
          .to(dot, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power1.inOut',
            boxShadow: `0 0 8px ${glowColor}`,
          }, '>');
        });
        break;

      case 'morph':
        // Shape morphing animation
        dots.forEach((dot, i) => {
          const morphTl = gsap.timeline({ repeat: -1, delay: i * 0.2 });
          
          morphTl.to(dot, {
            borderRadius: '40%',
            scale: 0.8,
            rotate: 45,
            duration: 0.6,
            ease: 'sine.inOut',
          })
          .to(dot, {
            borderRadius: '50%',
            scale: 1.2,
            rotate: 0,
            duration: 0.6,
            ease: 'sine.inOut',
          })
          .to(dot, {
            borderRadius: '50%',
            scale: 1,
            rotate: -45,
            duration: 0.4,
            ease: 'sine.inOut',
          })
          .to(dot, {
            borderRadius: '50%',
            scale: 1,
            rotate: 0,
            duration: 0.4,
            ease: 'sine.inOut',
          });
        });
        break;
    }

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center ${containerSizeClasses[size]}`}
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`${sizeClasses[size]} ${color} dot-animated rounded-full`}
          style={{ 
            boxShadow: `0 0 8px rgba(59, 130, 246, 0.4)` 
          }}
        ></div>
      ))}
    </div>
  );
}