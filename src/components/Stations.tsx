/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GamingStation } from '../types';
import { INITIAL_STATIONS } from '../data';
import { Info, Cpu, Monitor, Keyboard, Gamepad, Compass, Check, CalendarCheck } from 'lucide-react';

interface StationsProps {
  onStationSelect: (stationType: string) => void;
}

export default function Stations({ onStationSelect }: StationsProps) {
  const [selectedStation, setSelectedStation] = useState<GamingStation | null>(null);

  return (
    <section id="stations" className="py-24 px-6 md:px-20 bg-surface scroll-mt-20">
      <div className="max-w-[1440px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="font-headline text-headline-xl text-pure-white mb-2 uppercase italic tracking-tighter col-span-full">
              OUR STATIONS
            </h2>
            <p className="font-sans text-on-surface-variant text-base">
              High-speed specifications optimized for competitive gameplay. View specifications below to see our hardware breakdown.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-1 bg-electric-ruby"></div>
            <div className="w-2 h-1 bg-surface-variant"></div>
            <div className="w-2 h-1 bg-surface-variant"></div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Pro PC Station - Large Alpha Card */}
          <div className="md:col-span-8 group relative overflow-hidden bg-surface-container-low border border-surface-variant hover:border-electric-ruby/50 transition-all duration-500 rounded-lg">
            <img 
              className="w-full h-[380px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700" 
              alt="High-performance gaming PC setup with RGB lighting" 
              src={INITIAL_STATIONS[0].image}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-void via-transparent to-transparent" />
            
            {/* Top Right Specs Toggle Button */}
            <button 
              onClick={() => setSelectedStation(INITIAL_STATIONS[0])}
              className="absolute top-6 right-6 p-2.5 bg-black/80 hover:bg-electric-ruby hover:text-white rounded border border-white/10 transition-colors duration-200 text-on-surface-variant z-20 flex items-center gap-1.5 font-mono text-xs cursor-pointer"
            >
              <Info size={14} />
              <span>VIEW HARDWARE DETAILS</span>
            </button>

            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <div className="bg-electric-ruby text-pure-white text-[10px] font-bold px-2 py-1 mb-3 inline-block tracking-widest uppercase rounded">
                240HZ GAMING PC
              </div>
              <h3 className="font-headline text-3xl md:text-4xl text-pure-white mb-2 italic uppercase">
                {INITIAL_STATIONS[0].name}
              </h3>
              <p className="text-on-surface-variant max-w-md text-sm md:text-base mb-4">
                {INITIAL_STATIONS[0].description}
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onStationSelect('240HZ GAMING PC')}
                  className="bg-electric-ruby hover:bg-electric-ruby/90 text-pure-white font-headline font-bold text-sm px-5 py-2.5 rounded flex items-center gap-1.5 transition-all duration-200"
                >
                  <CalendarCheck size={14} />
                  BOOK BAYS (₹150/hr)
                </button>
                <span className="font-mono text-xs text-on-surface-variant/60 hidden sm:inline">• 240Hz Esports Ready</span>
              </div>
            </div>
            <div className="absolute bottom-6 right-8 text-on-surface-variant/20 font-headline text-[100px] leading-none opacity-10 pointer-events-none font-bold select-none hidden md:block">01</div>
          </div>

          {/* PS5 Lounge Bay Card */}
          <div className="md:col-span-4 group relative overflow-hidden bg-surface-container-low border border-surface-variant hover:border-hyper-blue/50 transition-all duration-500 rounded-lg">
            <img 
              className="w-full h-[380px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-700" 
              alt="Console PS5 Lounge Bays with cozy setup" 
              src={INITIAL_STATIONS[1].image}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-void via-transparent to-transparent" />
            
            <button 
              onClick={() => setSelectedStation(INITIAL_STATIONS[1])}
              className="absolute top-6 right-6 p-2.5 bg-black/80 hover:bg-hyper-blue hover:text-white rounded border border-white/10 transition-colors duration-200 text-on-surface-variant z-20 flex items-center gap-1.5 font-mono text-xs cursor-pointer"
            >
              <Info size={14} />
              <span>EXPLORE SPECS</span>
            </button>

            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <div className="bg-hyper-blue text-pure-white text-[10px] font-bold px-2 py-1 mb-3 inline-block tracking-widest uppercase rounded">
                CONSOLE ELITE
              </div>
              <h3 className="font-headline text-2xl md:text-3xl text-pure-white mb-2 italic uppercase">
                {INITIAL_STATIONS[1].name}
              </h3>
              <p className="text-on-surface-variant text-xs md:text-sm mb-4">
                {INITIAL_STATIONS[1].description}
              </p>
              <button
                onClick={() => onStationSelect('PS5 LOUNGE')}
                className="bg-hyper-blue hover:bg-hyper-blue/90 text-pure-white font-headline font-bold text-sm px-5 py-2.5 rounded flex items-center gap-1.5 transition-all duration-200 text-left cursor-pointer"
              >
                <CalendarCheck size={14} />
                RESERVE BAY (₹120/hr)
              </button>
            </div>
          </div>

          {/* Squad Block Card */}
          <div className="md:col-span-12 group relative overflow-hidden bg-surface-container-low border border-surface-variant hover:border-on-surface/30 transition-all duration-500 rounded-lg">
            <img 
              className="w-full h-[250px] md:h-[300px] object-cover group-hover:scale-105 transition-transform duration-700 opacity-85" 
              alt="esports competitive gaming area" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXYLCwOLw8UmXkdecYzYdFgWGs1EdIAB_gO1U-8rMa4O_Yb53RWM_0tmkPqdL4VTjaS0WIa7Mn2QLj50mIB3JGaaZw2Qqc2XprnTDhMYr9pv8oxEqCX_t8fx-toHaOR6klnTlTNGAX_E3RuxxAJq-KAl6z9V8z1JUDniQr-QUNulqNYNFj6tY271V4o7uJmN_acmf_fCXwofp9s58JK9ypgc-A_ZR_pAySvanYj-LWSbNBJ_3-ZDVlB1GmM1JXzsC00M3fnokvXqE"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-void via-transparent to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="bg-surface-variant text-pure-white text-[10px] font-bold px-2 py-1 mb-3 inline-block tracking-widest uppercase rounded">
                  COMMUNITY AREA
                </div>
                <h3 className="font-headline text-2xl md:text-3xl text-pure-white mb-2 italic uppercase">
                  THE SQUAD BLOCK
                </h3>
                <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed max-w-2xl">
                  Dedicated team setup for LAN training, squad sessions, and local play. Fits up to 10 gamers together with custom discount matrices.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => onStationSelect('240HZ GAMING PC')}
                  className="bg-white/10 hover:bg-white/20 text-pure-white font-headline font-semibold text-xs px-5 py-3 rounded transition-all duration-200 cursor-pointer"
                >
                  DISCUSS SQUAD DISCOUNTS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Config Details Popup Modal */}
      {selectedStation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-surface-container border border-surface-container-highest p-6 md:p-8 rounded-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Close */}
            <button 
              onClick={() => setSelectedStation(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white p-1 hover:bg-white/5 rounded font-mono font-bold"
            >
              ✕
            </button>

            {/* Header specifications */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded bg-electric-ruby/10 border border-electric-ruby/30 flex items-center justify-center text-electric-ruby">
                <Cpu size={20} />
              </div>
              <div>
                <span className="font-mono text-xs text-electric-ruby tracking-wider uppercase font-semibold">{selectedStation.tag}</span>
                <h4 className="font-headline text-2xl text-pure-white uppercase tracking-tight">{selectedStation.name} CONFIG</h4>
              </div>
            </div>

            {/* Config Specs list */}
            <div className="space-y-4 mb-8">
              <p className="text-on-surface-variant text-sm border-b border-surface-container-high pb-4 leading-relaxed">
                The setup is calibrated weekly by certified engineers to achieve state-of-the-art FPS, thermal efficiency, and zero packet loss.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/40 border border-white/5 p-4 rounded-md">
                  <span className="font-mono text-[10px] text-on-surface-variant/60 block uppercase mb-1">Central Processing (CPU)</span>
                  <p className="font-sans text-sm text-pure-white font-semibold">{selectedStation.hardware.cpu}</p>
                </div>
                <div className="bg-black/40 border border-white/5 p-4 rounded-md">
                  <span className="font-mono text-[10px] text-on-surface-variant/60 block uppercase mb-1">Graphics Accelerator (GPU)</span>
                  <p className="font-sans text-sm text-pure-white font-semibold">{selectedStation.hardware.gpu}</p>
                </div>
                <div className="bg-black/40 border border-white/5 p-4 rounded-md">
                  <span className="font-mono text-[10px] text-on-surface-variant/60 block uppercase mb-1">Memory Allocation (RAM)</span>
                  <p className="font-sans text-sm text-pure-white font-semibold">{selectedStation.hardware.ram}</p>
                </div>
                <div className="bg-black/40 border border-white/5 p-4 rounded-md">
                  <span className="font-mono text-[10px] text-on-surface-variant/60 block uppercase mb-1">Visual Monitor Array</span>
                  <p className="font-sans text-sm text-pure-white font-semibold">{selectedStation.hardware.monitor}</p>
                </div>
              </div>

              <div className="bg-black/50 border border-white/5 p-4 rounded-md flex items-start gap-3">
                <Keyboard size={18} className="text-hyper-blue shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[10px] text-on-surface-variant/60 block uppercase">Approved Peripherals</span>
                  <p className="font-sans text-xs text-pure-white mt-1 leading-relaxed">{selectedStation.hardware.peripherals}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-surface-container-high">
              <button 
                onClick={() => setSelectedStation(null)}
                className="font-headline text-base text-on-surface-variant hover:text-white px-5 py-2.5 rounded transition-all"
              >
                CLOSE
              </button>
              <button 
                onClick={() => {
                  onStationSelect(selectedStation.type);
                  setSelectedStation(null);
                }}
                className="bg-electric-ruby text-white font-headline font-bold text-base px-6 py-2.5 rounded hover:brightness-115 transition-all"
              >
                BOOK THIS STATION
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
