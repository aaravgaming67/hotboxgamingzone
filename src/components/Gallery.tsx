/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';

interface GalleryFrame {
  id: string;
  image: string;
  alt: string;
  description: string;
}

const GALLERY_FRAMES: GalleryFrame[] = [
  {
    id: 'frame-1',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIIMTqPX5sQ5Vv5d4xqsM3eeVMVR3CvDhjYYc_3HIOCjnej0Veb6dNMUk_OJ9cjTyX7vgjz_kYqJnNVjEKpkHAHrAlYYTIddOvTm5s2N7hN5IWagtzS0cLCEP6HtiZg5QKaG3oaH68QqH1n0GpYBdlztBIjAiUc7XCDMcMxBrhxpAKwriGBnRYOEk13JQIRrjp3pgzINfJzg4lKVp2s2gCnRN3pJO_rdgttJnLQwt1isRMxBIUwlEXyinT9MEEnusGb98RLpOEhTo',
    alt: 'Geometric hexagonal corporate-gaming ceiling glowing in red neon strips',
    description: 'COHESIVE GEOMETRY & RED NEON RIG SYSTEMS'
  },
  {
    id: 'frame-2',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE5OtNnaq4-uDaJLE2Pb-2bMQ5Kq3GqhPpUetW28gEpN6fLMH_pwo1shAXel5UXggpzBx7PmczrGv8II4OrzYiZMbNKuCVn59N1zshL2vOk5ThOEOflHdXclrO6E2iqH8b8MPUpikYxv23L-Ab4ucP7rui7gwEgZ0KVFTgbO8_tdXl4drdvtH4XIh6qseHgg8gpTVCC4P7x1Q3uzzmVRc3eBfFGJc9AuLdIhYZwzsdKZstpFpgWYpstDRn7yrRcFKDprCXGGYr9nw',
    alt: 'High-end gaming backlighting keyboard and mouse accessories',
    description: 'CALIBRATED MECHANICAL FEED MECHANICAL INPUTS'
  },
  {
    id: 'frame-3',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhXoxN1iGQ6PmFtQVGdS0sd5UfydQLzGTJX-AD_83yuhr9nMgKOtOcyWa6WNjT2NE3OpedYdafCYmP-6fOr0bmlEmidwOAVyseOAPoO9vN1svyJOum3tDJrQAhhP7DysJ7tkfm8JkDGWSGx9s7I323wfd_DmCJmiHEeUQKarkvUpqTPt1bsapkEFfF5J8yGFG1a6I6toYfE5XX0_r4D24d_vw4AXEZfcuJsr6cmcx_kI_w9CQbeRFXm7zucr8U1SYXVu5_ahVYaWE',
    alt: 'Rows of professional esports gaming setups under magenta and blue glows',
    description: 'HIGH-INTENSITY SPECTATOR LAN ARENA SHIELDS'
  }
];

export default function Gallery() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-deep-void relative overflow-hidden">
      <div className="text-center mb-16 px-6">
        <h2 className="font-headline text-[32px] md:text-[48px] tracking-tighter text-pure-white italic uppercase font-extrabold">
          IMMERSIVE <span className="text-electric-ruby">VIBE</span>
        </h2>
        <div className="w-24 h-[2px] bg-electric-ruby mx-auto mt-4"></div>
        <p className="font-sans text-xs text-on-surface-variant/70 tracking-wider uppercase mt-4 max-w-sm mx-auto">
          Atmospheric hardware loops & interior configurations
        </p>
      </div>

      {/* Horizontal Scroll Layout with custom arrows */}
      <div className="relative max-w-[1440px] mx-auto px-6 md:px-20 group">
        
        {/* Navigation Arrows */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-8 md:left-24 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-black/80 hover:bg-electric-ruby hover:text-white rounded-full border border-white/10 transition-colors duration-200 text-on-surface-variant focus:outline-none"
          title="Pan left"
        >
          <ArrowLeft size={18} />
        </button>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-8 md:right-24 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-black/80 hover:bg-electric-ruby hover:text-white rounded-full border border-white/10 transition-colors duration-200 text-on-surface-variant focus:outline-none"
          title="Pan right"
        >
          <ArrowRight size={18} />
        </button>

        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory scroll-smooth hide-scrollbar px-2"
        >
          {GALLERY_FRAMES.map((frame) => (
            <div 
              key={frame.id} 
              className="flex-none w-[280px] sm:w-[450px] md:w-[600px] snap-center"
            >
              <div className="h-[280px] sm:h-[350px] md:h-[400px] bg-surface-container rounded-lg overflow-hidden relative group/card border border-white/5 shadow-lg select-none">
                
                {/* Full-bleed Photo */}
                <img 
                  className="w-full h-full object-cover transition-transform duration-[800ms] group-hover/card:scale-105 select-none" 
                  alt={frame.alt} 
                  src={frame.image}
                  referrerPolicy="no-referrer"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                {/* Info Overlay bottom */}
                <div className="absolute bottom-0 left-0 p-6 md:p-8 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Compass size={14} className="text-electric-ruby animate-pulse" />
                    <span className="font-mono text-[9px] text-white/50 tracking-wider">SPECTRAL LOG UNIT ID: {frame.id.toUpperCase()}</span>
                  </div>
                  <h4 className="font-headline text-lg sm:text-xl text-pure-white font-extrabold tracking-wide uppercase italic">
                    {frame.description}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HUD Scroll indicators at bottom center */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-8 h-1 bg-electric-ruby rounded-full" />
          <div className="w-2 h-1 bg-surface-container-highest rounded-full" />
          <div className="w-2 h-1 bg-surface-container-highest rounded-full" />
        </div>

      </div>
    </section>
  );
}
