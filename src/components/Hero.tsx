/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, Users, Radio, Activity } from 'lucide-react';

interface HeroProps {
  onReserveClick: () => void;
  onExploreClick: () => void;
}

export default function Hero({ onReserveClick, onExploreClick }: HeroProps) {
  // Simulate active gamers online
  const [activeGamers, setActiveGamers] = useState(13);
  const [latency, setLatency] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGamers((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const next = prev + change;
        return next >= 8 && next <= 15 ? next : prev;
      });
      setLatency((prev) => {
        const delta = (Math.random() - 0.5) * 0.5;
        const next = prev + delta;
        return Number(Math.min(Math.max(next, 2.5), 5.5).toFixed(1));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0 select-none">
        <img 
          className="w-full h-full object-cover opacity-50 xl:opacity-60 grayscale hover:scale-105 hover:grayscale-0 transition-all duration-1000 ease-out" 
          alt="Futuristic high-end gaming lounge"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZkTNi1eOzTclDI9egUNXPonv2hTU2Go9skFCFu92pdt2psSTsizudiP97QgTffynUwwX52V6j_NOtXiVsTXcwXsf4aE7LYZSH2ihaOFvX2QYKoJfGYHU5m_jGhiX84NDQ-_lBE_68NbJiVXL2-LEjGmn2jfzXe-ENFDH6qbrtGFXlhk9-Uluyf5WqDRCsC5xMpOr3G4lMWKhnCIiM3Jj-J_Ml05OnOj1Qd-ih6U04m8iC3wunZpaygr3ywyQsla86fcosSwc6J1U"
          referrerPolicy="no-referrer"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-void via-transparent to-deep-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-void/40 via-transparent to-deep-void/40" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        {/* Dynamic Badge */}
        <div className="flex items-center gap-2 mb-4 bg-electric-ruby/10 border border-electric-ruby/30 py-1.5 px-4 rounded-full animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-electric-ruby animate-ping"></span>
          <p className="font-mono text-xs text-electric-ruby font-semibold tracking-[0.35em] uppercase">
            ESTABLISHED 2024 • MUMBAI ELITE
          </p>
        </div>

        {/* Title */}
        <h1 className="font-headline text-[48px] sm:text-[64px] md:text-[80px] leading-none mb-6 font-extrabold tracking-tighter uppercase select-none">
          PRECISION <span className="text-electric-ruby">ENGINEERED</span><br className="hidden sm:block" /> FOR ELITE GAMING
        </h1>

        {/* Description */}
        <p className="font-sans text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-on-surface-variant mb-10 leading-relaxed font-normal">
          Mumbai's premier high-octane gaming destination. Offering state-of-the-art gaming PCs and PlayStation 5 bays for professional and casual players.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <button 
            onClick={onReserveClick}
            className="w-full sm:w-auto bg-electric-ruby text-pure-white font-headline text-xl font-bold px-10 py-4 rounded hover:brightness-110 active:scale-95 neon-glow-ruby transition-all duration-300 uppercase tracking-wide"
          >
            RESERVE YOUR STATION
          </button>
          <button 
            onClick={onExploreClick}
            className="w-full sm:w-auto border border-hyper-blue bg-hyper-blue/10 text-pure-white font-headline text-xl font-bold px-10 py-4 rounded hover:bg-hyper-blue/30 active:scale-95 transition-all duration-300 uppercase tracking-wide"
          >
            EXPLORE THE ARSENAL
          </button>
        </div>
      </div>

      {/* Real-time Status HUD (Visualizing game telemetry style) */}
      <div className="absolute bottom-10 left-6 md:left-20 hidden lg:block z-20">
        <div className="flex items-center gap-6 bg-black/60 backdrop-blur-md border border-surface-container-highest p-3 rounded-lg font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-on-surface-variant/70 uppercase">SYSTEM STATUS: OPTIMAL</span>
          </div>
          <div className="h-4 w-[1px] bg-surface-container-highest" />
          <div className="flex items-center gap-1.5 text-on-surface-variant/70">
            <Users size={14} className="text-electric-ruby" />
            <span><strong className="text-pure-white font-semibold">{activeGamers}/15</strong> BAYS ACTIVE</span>
          </div>
          <div className="h-4 w-[1px] bg-surface-container-highest" />
          <div className="flex items-center gap-1.5 text-on-surface-variant/70">
            <Activity size={14} className="text-hyper-blue" />
            <span>PING: <strong className="text-pure-white font-semibold">{latency} ms</strong></span>
          </div>
        </div>
      </div>

      {/* Decorative Grid Grid Alignments */}
      <div className="absolute bottom-10 right-6 md:right-20 hidden lg:flex items-center gap-2 text-on-surface-variant/30 select-none">
        <Radio size={14} className="animate-spin text-electric-ruby opacity-40" />
        <span className="font-mono text-[9px] tracking-widest uppercase">MUMBAI_NODE // 19.12N 72.82E</span>
      </div>
    </section>
  );
}
