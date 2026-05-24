import React, { useState, useEffect } from 'react';
import { Sliders, Check, Flame, Zap, Gauge, Play } from 'lucide-react';

interface BenchmarkGame {
  name: string;
  genre: string;
  standardFps: number;
  eliteFps: number;
}

const BENCHMARK_GAMES: BenchmarkGame[] = [
  { name: 'Counter-Strike 2', genre: 'Competitive Shooter', standardFps: 240, eliteFps: 480 },
  { name: 'Valorant', genre: 'Tactical Shooter', standardFps: 340, eliteFps: 620 },
  { name: 'EA Sports FC 26', genre: 'Sports', standardFps: 144, eliteFps: 240 },
  { name: 'GTA V / GTA Online', genre: 'Action/Adventure', standardFps: 120, eliteFps: 180 },
  { name: 'Cyberpunk 2077 (High Tech)', genre: 'Open World RPG', standardFps: 80, eliteFps: 140 }
];

export default function SpecsSimulator() {
  const [isLiquidCooled, setIsLiquidCooled] = useState(true);
  const [isMagneticSwitches, setIsMagneticSwitches] = useState(true);
  const [selectedGame, setSelectedGame] = useState<BenchmarkGame>(BENCHMARK_GAMES[0]);

  // Calculate dynamic outputs
  const [fpsVal, setFpsVal] = useState(0);
  const [latencyVal, setLatencyVal] = useState(0);
  const [thermalVal, setThermalVal] = useState(0);

  useEffect(() => {
    let baseFps = isLiquidCooled ? selectedGame.eliteFps : selectedGame.standardFps;
    if (isMagneticSwitches) baseFps *= 1.05;

    const finalFps = Math.round(baseFps);

    // Latency calculations in ms
    let baseLatency = 4.5;
    if (isMagneticSwitches) baseLatency -= 1.8;
    if (isLiquidCooled) baseLatency -= 0.5;

    const finalLatency = Number(Math.max(1.2, baseLatency).toFixed(1));

    // Temperature calculations in Celcius
    let baseTemp = 72;
    if (isLiquidCooled) baseTemp -= 18;
    if (selectedGame.name.includes('Cyberpunk')) baseTemp += 11;

    setFpsVal(finalFps);
    setLatencyVal(finalLatency);
    setThermalVal(baseTemp);
  }, [isLiquidCooled, isMagneticSwitches, selectedGame]);

  return (
    <section id="simulator" className="py-24 px-6 md:px-20 bg-deep-void border-t border-b border-surface-container-highest scroll-mt-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-electric-ruby tracking-[0.4em] uppercase mb-3 text-center">PERFORMANCE SIMULATOR</p>
          <h2 className="font-headline text-headline-xl text-pure-white italic uppercase tracking-tighter">
            PC PERFORMANCE <span className="text-electric-ruby">BENCHMARKER</span>
          </h2>
          <div className="w-24 h-[2px] bg-electric-ruby mx-auto mt-4"></div>
          <p className="text-on-surface-variant font-sans max-w-2xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
            Test different games to see the expected frame rate (FPS), system latency, and temperatures on our premium 240Hz gaming PCs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Controls Sandbox panel - left */}
          <div className="lg:col-span-5 bg-surface-container border border-surface-container-highest p-6 md:p-8 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sliders size={20} className="text-electric-ruby" />
                <h3 className="font-headline text-xl text-pure-white uppercase tracking-wider font-semibold">PREMIUM CONFIGURATION</h3>
              </div>

              {/* Station display info */}
              <div className="p-4 bg-black/40 border border-white/5 rounded-md mb-6">
                <span className="font-mono text-[10px] text-on-surface-variant/70 block uppercase mb-1">SELECTED HARDWARE</span>
                <p className="font-sans text-sm text-pure-white font-bold uppercase">240Hz Gaming Rig (RTX 4090 / i9 Processor)</p>
                <p className="font-mono text-[10px] text-on-surface-variant/50 mt-1">High-end specifications optimized for competitive play.</p>
              </div>

              {/* Advanced Cooling specs toggle */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[10px] text-on-surface-variant/70 tracking-widest block uppercase">
                    COOLING SYSTEM
                  </label>
                  <span className="font-mono text-[10px] text-electric-ruby uppercase font-semibold">
                    {isLiquidCooled ? 'Liquid Cooled (Elite)' : 'Standard Airflow'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLiquidCooled(true)}
                    className={`p-2.5 rounded border font-mono text-xs transition-all flex items-center justify-center gap-1.5 ${
                      isLiquidCooled 
                        ? 'border-electric-ruby/50 bg-electric-ruby/10 text-white' 
                        : 'border-white/5 bg-black/30 text-on-surface-variant'
                    }`}
                  >
                    <Check size={12} className={isLiquidCooled ? 'text-electric-ruby' : 'opacity-0'} />
                    LIQUID COOLING
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLiquidCooled(false)}
                    className={`p-2.5 rounded border font-mono text-xs transition-all flex items-center justify-center gap-1.5 ${
                      !isLiquidCooled 
                        ? 'border-electric-ruby/50 bg-electric-ruby/10 text-white' 
                        : 'border-white/5 bg-black/30 text-on-surface-variant'
                    }`}
                  >
                    <Check size={12} className={!isLiquidCooled ? 'text-electric-ruby' : 'opacity-0'} />
                    AIR COOLING
                  </button>
                </div>
              </div>

              {/* Input Peripheral switches */}
              <div className="space-y-4 mb-6">
                <label className="font-mono text-[10px] text-on-surface-variant/70 tracking-widest block uppercase">
                  KEYBOARD SWITCH TYPE
                </label>
                <label className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-all ${
                  isMagneticSwitches 
                    ? 'border-electric-ruby/30 bg-electric-ruby/5 text-white' 
                    : 'border-white/5 bg-black/30 text-on-surface-variant'
                }`}>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      className="rounded border-white/10 text-electric-ruby focus:ring-0 focus:ring-offset-0 bg-black/60"
                      checked={isMagneticSwitches}
                      onChange={(e) => setIsMagneticSwitches(e.target.checked)}
                    />
                    <div className="text-left">
                      <p className="font-headline text-sm font-bold tracking-wider">MAGNETIC RAPID TRIGGER</p>
                      <p className="font-mono text-[9px] text-on-surface-variant/60 leading-none">Increases responsiveness in tactical games</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-500 font-semibold uppercase">ACTIVE</span>
                </label>
              </div>
            </div>

            {/* Quick note */}
            <div className="pt-4 border-t border-white/5 flex gap-2 items-start mt-6">
              <span className="font-mono text-emerald-500 text-sm">💡</span>
              <p className="font-mono text-[10px] text-on-surface-variant/60 leading-relaxed font-normal">
                Every PC setup runs at a native 240Hz refresh rate to ensure the smoothest gaming experience possible.
              </p>
            </div>
          </div>

          {/* Interactive Benchmarking Metrics & Visualization - right */}
          <div className="lg:col-span-7 bg-surface-container-low border border-surface-variant p-6 md:p-8 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Gauge size={20} className="text-hyper-blue animate-pulse" />
                  <h3 className="font-headline text-xl text-pure-white uppercase tracking-wider font-semibold">PERFORMANCE STATS</h3>
                </div>
                <div className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
                  LIVE BENCHMARK ACTIVE
                </div>
              </div>

              {/* Game selection bar */}
              <div className="mb-8">
                <label className="font-mono text-[10px] text-on-surface-variant/70 tracking-widest block uppercase mb-3">
                  SELECT GAME TO TEST
                </label>
                <div className="flex flex-wrap gap-2">
                  {BENCHMARK_GAMES.map((game) => (
                    <button
                      key={game.name}
                      type="button"
                      onClick={() => setSelectedGame(game)}
                      className={`px-3 py-2 rounded font-sans text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        selectedGame.name === game.name
                          ? 'bg-electric-ruby text-white font-semibold shadow-[0_0_10px_rgba(255,0,60,0.25)]'
                          : 'bg-black/40 text-on-surface-variant border border-white/5 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <Play size={10} className={selectedGame.name === game.name ? 'fill-white' : ''} />
                      {game.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic HUD gauges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* FPS Gauge */}
                <div className="bg-black/60 border border-white/5 p-5 rounded-md text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-electric-ruby" />
                  <span className="font-mono text-[9px] text-on-surface-variant/60 block uppercase mb-1">FRAME RATE</span>
                  <div className="flex items-baseline justify-center gap-1 mt-2">
                    <span className="font-headline text-5xl font-extrabold text-pure-white transition-all duration-300">
                      {fpsVal}
                    </span>
                    <span className="font-mono text-xs text-electric-ruby font-semibold">FPS</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
                    <div 
                      className="bg-electric-ruby h-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, (fpsVal / 620) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Latency Gauge */}
                <div className="bg-black/60 border border-white/5 p-5 rounded-md text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-hyper-blue" />
                  <span className="font-mono text-[9px] text-on-surface-variant/60 block uppercase mb-1">SYSTEM LATENCY</span>
                  <div className="flex items-baseline justify-center gap-1 mt-2">
                    <span className="font-headline text-5xl font-extrabold text-pure-white transition-all duration-300">
                      {latencyVal}
                    </span>
                    <span className="font-mono text-xs text-hyper-blue font-semibold">MS</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
                    <div 
                      className="bg-hyper-blue h-full transition-all duration-500" 
                      style={{ width: `${Math.max(10, 100 - (latencyVal / 6) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Thermal Gauge */}
                <div className="bg-black/60 border border-white/5 p-5 rounded-md text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
                  <span className="font-mono text-[9px] text-on-surface-variant/60 block uppercase mb-1">TEMPERATURE</span>
                  <div className="flex items-baseline justify-center gap-1 mt-2">
                    <span className="font-headline text-5xl font-extrabold text-pure-white transition-all duration-300">
                      {thermalVal}
                    </span>
                    <span className="font-mono text-xs text-amber-500 font-semibold">°C</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, (thermalVal / 90) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Performance description statement */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/5 flex gap-3 items-center">
                <Flame className="text-electric-ruby shrink-0" size={24} />
                <div className="text-left text-xs text-on-surface-variant font-sans">
                  <strong className="text-white block font-bold mb-0.5 pointer-events-none">PERFORMANCE ANALYSIS:</strong>
                  {fpsVal > 300 ? (
                    <span>Exceptional performance! This configuration provides professional esports capabilities with minimal latency and high thermal stability.</span>
                  ) : (
                    <span>Highly recommended custom build. Runs games smoothly at high frame rates, perfectly matching our 240Hz premium display arrays with zero stutters.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick reservation action */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-left">
                <p className="font-mono text-[9px] text-on-surface-variant/50 leading-none">READY PRESET CONFIGURATION</p>
                <p className="font-headline text-lg font-bold text-pure-white uppercase mt-1">LOCK IN PREMIUM 240HZ RIG</p>
              </div>
              <a 
                href="#booking"
                className="w-full sm:w-auto bg-electric-ruby text-pure-white font-headline font-bold text-base px-6 py-3 rounded hover:bg-electric-ruby/90 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,0,60,0.3)]"
              >
                BOOK THIS RIG NOW
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
