/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, ShieldAlert, Cpu, Heart, Check } from 'lucide-react';

export default function Footer() {
  const [hudMessage, setHudMessage] = React.useState<string | null>(null);

  const triggerHudNotify = (text: string) => {
    setHudMessage(text);
    setTimeout(() => {
      setHudMessage(null);
    }, 4500);
  };

  const handleSocialClick = (platform: string) => {
    triggerHudNotify(`Secure proxy routing socket initialized for ${platform}. Link active.`);
  };

  return (
    <footer className="w-full py-16 px-6 md:px-20 bg-surface-container-lowest border-t-2 border-surface-container-highest">
      <div className="max-w-[1440px] mx-auto">
        
        {/* HUD Notification Area if active */}
        {hudMessage && (
          <div className="mb-8 p-4 bg-hyper-blue/10 border-l-4 border-hyper-blue rounded-r text-xs font-mono text-hyper-blue flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
            <span>[MAIN DEPLOY PORT] {hudMessage}</span>
            <button onClick={() => setHudMessage(null)} className="text-white hover:text-hyper-blue font-bold">✕</button>
          </div>
        )}

        {/* Core grid directories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand block */}
          <div className="col-span-1 md:col-span-1">
            <div className="font-headline text-[32px] md:text-[36px] text-pure-white mb-6 italic tracking-tighter font-extrabold font-headline uppercase">
              HOTBOX
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6 font-normal">
              Mumbai's premier high-end gaming sanctuary. Pushing the boundaries of competitive play and immersion through elite hardware and technical excellence.
            </p>
            
            {/* Social credentials icons */}
            <div className="flex gap-4">
              {['Instagram', 'Facebook', 'X / Twitter'].map((platform) => (
                <button 
                  key={platform}
                  onClick={() => handleSocialClick(platform)}
                  className="font-mono text-xs text-on-surface-variant/70 hover:text-electric-ruby font-semibold border border-white/5 py-1 px-2.5 rounded bg-white/5 transition-colors cursor-pointer"
                >
                  {platform.substring(0, 3).toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Navigate column */}
          <div>
            <h4 className="font-mono text-xs text-hyper-blue mb-6 uppercase tracking-widest font-semibold">NAVIGATE</h4>
            <ul className="space-y-4">
              <li>
                <a onClick={() => triggerHudNotify("Routing system configurations. Loading calibration models...")} className="font-mono text-xs text-on-surface-variant hover:text-hyper-blue transition-colors uppercase font-medium cursor-pointer block">
                  HARDWARE SPECS
                </a>
              </li>
              <li>
                <a onClick={() => triggerHudNotify("Loading Elite Lounge membership tiers & pricing models...")} className="font-mono text-xs text-on-surface-variant hover:text-hyper-blue transition-colors uppercase font-medium cursor-pointer block">
                  MEMBERSHIP
                </a>
              </li>
              <li>
                <a onClick={() => triggerHudNotify("Scanning active mechanical & server engineer vacancies near Mumbai...")} className="font-mono text-xs text-on-surface-variant hover:text-hyper-blue transition-colors uppercase font-medium cursor-pointer block">
                  CAREERS
                </a>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="font-mono text-xs text-hyper-blue mb-6 uppercase tracking-widest font-semibold">LEGAL</h4>
            <ul className="space-y-4">
              <li>
                <a onClick={() => triggerHudNotify("Opening secure Terms of Inscription documentations...")} className="font-mono text-xs text-on-surface-variant hover:text-hyper-blue transition-colors uppercase font-medium cursor-pointer block">
                  TERMS OF SERVICE
                </a>
              </li>
              <li>
                <a onClick={() => triggerHudNotify("Decrypting system privacy protocols & security cookies cache logs...")} className="font-mono text-xs text-on-surface-variant hover:text-hyper-blue transition-colors uppercase font-medium cursor-pointer block">
                  PRIVACY POLICY
                </a>
              </li>
            </ul>
          </div>

          {/* Operations timing column */}
          <div>
            <h4 className="font-mono text-xs text-electric-ruby mb-6 uppercase tracking-widest font-semibold">OPERATIONS</h4>
            <div className="text-on-surface-variant font-mono text-xs space-y-2 font-medium">
              <p>MON - FRI: 10:00 - 04:00 (MIDNIGHT RAID)</p>
              <p>SAT - SUN: 09:00 - 06:00 (MARATHON)</p>
              <p className="text-electric-ruby font-bold bg-electric-ruby/5 p-2 rounded border border-electric-ruby/10 inline-block mt-2">
                24/7 SQUAD ACCESS AVAILABLE
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright footer bar */}
        <div className="pt-8 border-t border-surface-variant flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider text-center md:text-left">
            © 2026 HOTBOX GAMING LOUNGE. PRECISION ENGINEERED FOR ELITE PERFORMANCE.
          </p>
          
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-electric-ruby rounded-full animate-pulse" />
            <span className="font-mono text-[10px] text-pure-white uppercase font-bold tracking-widest">
              SYSTEMS ACTIVE
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
