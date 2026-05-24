/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Copy, Check, ExternalLink } from 'lucide-react';

export default function LocationSection() {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const addressText = "Shop No. 104, Arcadia Shopping Centre, Hiranandani Estate, Thane West, Maharashtra - 400607";

  return (
    <section id="location" className="py-24 px-6 md:px-20 bg-deep-void border-t border-surface-container-highest scroll-mt-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Base credentials details column - Left */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            <p className="font-mono text-xs text-electric-ruby tracking-[0.4em] uppercase mb-1">HQ COORDINATES</p>
            <h2 className="font-headline text-headline-xl text-pure-white mb-8 tracking-tighter italic uppercase font-extrabold">
              BASE OF <span className="text-hyper-blue">OPERATIONS</span>
            </h2>

            <div className="space-y-8 md:space-y-10">
              
              {/* Arcadia Lounge */}
              <div className="flex gap-4 md:gap-6 items-start relative group">
                <div className="w-10 h-10 rounded-full bg-electric-ruby/10 border border-electric-ruby/30 flex items-center justify-center text-electric-ruby shrink-0 mt-1">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline text-xl text-pure-white uppercase font-bold tracking-wider">ARCADIA LOUNGE</h4>
                    <button 
                      onClick={() => handleCopyText(addressText, 'address')}
                      className="text-on-surface-variant/40 hover:text-white transition-colors py-0.5 px-1.5 rounded bg-white/5 hover:bg-white/10"
                      title="Copy address"
                    >
                      {copiedType === 'address' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed text-sm md:text-base mt-2 max-w-sm">
                    Shop No. 104, Arcadia Shopping Centre, Hiranandani Estate, Thane West, Maharashtra - 400607
                  </p>
                </div>
              </div>

              {/* Direct Line */}
              <div className="flex gap-4 md:gap-6 items-start relative group">
                <div className="w-10 h-10 rounded-full bg-hyper-blue/15 border border-hyper-blue/35 flex items-center justify-center text-hyper-blue shrink-0 mt-1">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline text-xl text-pure-white uppercase font-bold tracking-wider">DIRECT LINE</h4>
                    <button 
                      onClick={() => handleCopyText("+917208782027", 'phone')}
                      className="text-on-surface-variant/40 hover:text-white transition-colors py-0.5 px-1.5 rounded bg-white/5 hover:bg-white/10"
                      title="Copy number"
                    >
                      {copiedType === 'phone' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                  </div>
                  <a 
                    href="tel:+917208782027"
                    className="text-on-surface-variant font-mono text-sm md:text-base mt-1 block hover:text-electric-ruby transition-colors"
                  >
                    +91 7208782027
                  </a>
                </div>
              </div>

              {/* Encrypted Coms */}
              <div className="flex gap-4 md:gap-6 items-start relative group">
                <div className="w-10 h-10 rounded-full bg-tertiary-container/10 border border-tertiary-container/30 flex items-center justify-center text-tertiary shrink-0 mt-1">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline text-xl text-pure-white uppercase font-bold tracking-wider">ENCRYPTED COMS</h4>
                    <button 
                      onClick={() => handleCopyText("amish@gamecraft.in", 'mail')}
                      className="text-on-surface-variant/40 hover:text-white transition-colors py-0.5 px-1.5 rounded bg-white/5 hover:bg-white/10"
                      title="Copy email"
                    >
                      {copiedType === 'mail' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    </button>
                  </div>
                  <a 
                    href="mailto:amish@gamecraft.in"
                    className="text-on-surface-variant font-mono text-sm md:text-base mt-2 block hover:text-electric-ruby transition-colors"
                  >
                    amish@gamecraft.in
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive technical target radar overlay map - Right */}
          <div className="lg:col-span-7 h-[420px] md:h-[500px] rounded-lg overflow-hidden border border-surface-variant relative select-none group">
            <div className="absolute inset-0 bg-blue-900/5 pointer-events-none z-10 transition-colors group-hover:bg-transparent" />
            
            {/* Map image hotlinked directly */}
            <img 
              className="w-full h-full object-cover grayscale opacity-85 group-hover:grayscale-0 group-hover:scale-[1.01] transition-all duration-700 select-none pb-0.5" 
              alt="Geometric coordinate tactical map of DN Nagar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc8PIZvD--SBL2HwmZRNwlrDbWoAtBWRyh-syr5GZ5AJ-lYkZC6FlohXxDF6TyAAwPqNMPp_Zj02pREo5eOTLumheXIww6bEcxFZ1x9giIQR6w40sZvCyXg6cwJ2Nfc8AHXaasyaS4DqUsEdWEdm7v_2SLgdig6cHNTmm9sU3HO0cp6HIcsarQa_p0zbtj5lVmw_5Hz7dFmPDSzMFFIeew7CyG8XM5VDKNLE4UIQ1yNIDWHCX6nDwMqn4yDzlCuFWYYSF8tpF7EBE"
              referrerPolicy="no-referrer"
            />

            {/* Target Reticle Overlay - Sited in DN Nagar complex point */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              
              {/* Ping Ring */}
              <div className="w-14 h-14 bg-electric-ruby/15 border-2 border-electric-ruby rounded-full animate-ping" />
              
              {/* Inner Focus Solid point */}
              <div className="absolute w-4 h-4 bg-electric-ruby rounded-full shadow-[0_0_20px_rgba(0,255,102,1)] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>

              {/* Grid calibration flags */}
              <div className="absolute top-1/2 left-[54%] transform -translate-y-1/2 flex flex-col font-mono text-[9px] bg-black/75 border border-surface-container-highest p-1.5 rounded select-none shadow text-left">
                <span className="text-white font-bold opacity-90">HOTBOX HQ</span>
                <span className="text-on-surface-variant/70">HIRANANDANI ESTATE</span>
              </div>
            </div>

            {/* Dynamic visual grids corners */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-on-surface-variant/30 leading-none pointer-events-none">
              GRID: N_19.255_E_72.977
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-[9px] text-on-surface-variant/30 leading-none pointer-events-none">
              CALIBRATION: STABLE
            </div>

            {/* Active view anchor links */}
            <div className="absolute bottom-4 left-4 z-20">
              <a 
                href="https://maps.google.com/?q=Arcadia+Shopping+Centre+Hiranandani+Estate+Thane+West+400607"
                target="_blank"
                rel="noreferrer"
                className="bg-black/90 hover:bg-electric-ruby hover:text-white border border-surface-container-highest py-1.5 px-3 rounded flex items-center gap-1.5 font-mono text-[10px] text-on-surface-variant transition-all select-all duration-300 pointer-events-auto"
              >
                <span>OPEN EXTERNAL NAVIGATION</span>
                <ExternalLink size={12} />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
