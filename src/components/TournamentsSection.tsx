/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Tournament } from '../types';
import { INITIAL_TOURNAMENTS } from '../data';
import { Trophy, Calendar, Users, Search, Club, ArrowUpRight, Zap } from 'lucide-react';

export default function TournamentsSection() {
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [registeringTourneyId, setRegisteringTourneyId] = useState<string | null>(null);
  const [viewParticipantsId, setViewParticipantsId] = useState<string | null>(null);
  
  // Registration form states
  const [teamName, setTeamName] = useState('');
  const [captainEmail, setCaptainEmail] = useState('');
  const [discordTag, setDiscordTag] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Countdown timer for primary tournament
  const [timeLeft, setTimeLeft] = useState({ days: 18, hours: 5, minutes: 17, seconds: 43 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRegister = (e: React.FormEvent, tourneyId: string) => {
    e.preventDefault();
    if (!teamName || !captainEmail) return;

    setTournaments((prev) => 
      prev.map((t) => {
        if (t.id === tourneyId) {
          return {
            ...t,
            slotsRegistered: Math.min(t.slotsTotal, t.slotsRegistered + 1),
            participants: [...t.participants, teamName]
          };
        }
        return t;
      })
    );

    setSuccessMessage(`Team "${teamName}" registered successfully! Check email for discord coordinate keys.`);
    setTeamName('');
    setCaptainEmail('');
    setDiscordTag('');
    
    setTimeout(() => {
      setSuccessMessage(null);
      setRegisteringTourneyId(null);
    }, 4000);
  };

  const filteredTourneys = tournaments.filter((t) => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="tournaments" className="py-24 px-6 md:px-20 bg-deep-void scroll-mt-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 border-b border-white/5 pb-8">
          <div>
            <p className="font-mono text-xs text-electric-ruby tracking-[0.4em] uppercase mb-2">ARENA SHOWDOWN</p>
            <h2 className="font-headline text-headline-xl text-pure-white italic uppercase tracking-tighter">
              CHAMPIONSHIPS & <span className="text-electric-ruby">TOURNAMENTS</span>
            </h2>
            <p className="font-sans text-on-surface-variant text-sm mt-2 max-w-xl">
              Unleash competitive intensity. Register your squad for our recurring high-octane LAN events and claim your slice of the prize pools.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 text-on-surface-variant/50" size={16} />
            <input 
              type="text" 
              placeholder="Search championships or games..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container border border-surface-container-highest rounded pl-10 pr-4 py-2 font-sans text-sm text-pure-white placeholder-on-surface-variant/40 focus:border-electric-ruby focus:ring-0 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Primary countdown card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 bg-surface-container border border-surface-container-highest rounded-lg overflow-hidden mb-12 shadow-md">
          {/* Cover image area */}
          <div className="lg:col-span-4 relative h-64 lg:h-auto select-none min-h-[250px]">
            <img 
              className="absolute inset-0 w-full h-full object-cover opacity-80" 
              alt="Valorant group focus" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXYLCwOLw8UmXkdecYzYdFgWGs1EdIAB_gO1U-8rMa4O_Yb53RWM_0tmkPqdL4VTjaS0WIa7Mn2QLj50mIB3JGaaZw2Qqc2XprnTDhMYr9pv8oxEqCX_t8fx-toHaOR6klnTlTNGAX_E3RuxxAJq-KAl6z9V8z1JUDniQr-QUNulqNYNFj6tY271V4o7uJmN_acmf_fCXwofp9s58JK9ypgc-A_ZR_pAySvanYj-LWSbNBJ_3-ZDVlB1GmM1JXzsC00M3fnokvXqE"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-surface-container via-transparent to-transparent" />
            <div className="absolute top-6 left-6 bg-electric-ruby text-white font-mono text-[9px] font-bold py-1 px-2 uppercase rounded-sm">
              UPCOMING MAJOR LAN
            </div>
          </div>

          {/* Timing detail stats */}
          <div className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="font-mono text-xs text-electric-ruby font-semibold uppercase">{tournaments[0].game}</span>
                <span className="text-on-surface-variant/30 text-xs">•</span>
                <span className="font-sans text-xs text-on-surface-variant/60">June 12, 2026</span>
              </div>
              <h3 className="font-headline text-3xl md:text-4xl text-pure-white uppercase italic font-bold mb-4">{tournaments[0].title}</h3>
              
              {/* Counter Display */}
              <div className="flex gap-4 mb-6">
                <div className="bg-black/40 border border-white/5 p-3 rounded text-center w-16 sm:w-20">
                  <span className="font-headline text-2xl sm:text-3xl font-extrabold text-pure-white block">{timeLeft.days}</span>
                  <span className="font-mono text-[9px] text-on-surface-variant/60 uppercase">DAYS</span>
                </div>
                <div className="bg-black/40 border border-white/5 p-3 rounded text-center w-16 sm:w-20">
                  <span className="font-headline text-2xl sm:text-3xl font-extrabold text-pure-white block">{timeLeft.hours}</span>
                  <span className="font-mono text-[9px] text-on-surface-variant/60 uppercase">HOURS</span>
                </div>
                <div className="bg-black/40 border border-white/5 p-3 rounded text-center w-16 sm:w-20">
                  <span className="font-headline text-2xl sm:text-3xl font-extrabold text-pure-white block">{timeLeft.minutes}</span>
                  <span className="font-mono text-[9px] text-on-surface-variant/60 uppercase font-semibold">MINS</span>
                </div>
                <div className="bg-black/40 border border-white/5 p-3 rounded text-center w-16 sm:w-20 inline-block">
                  <span className="font-headline text-2xl sm:text-3xl font-extrabold text-electric-ruby block">{timeLeft.seconds}</span>
                  <span className="font-mono text-[9px] text-on-surface-variant/60 uppercase font-semibold">SECS</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 border-t border-white/5 gap-4">
              <div className="flex gap-6">
                <div>
                  <span className="font-mono text-[9px] text-on-surface-variant/50 block uppercase">PRIZE POOL</span>
                  <span className="font-headline text-xl text-emerald-400 font-bold uppercase">{tournaments[0].prizePool}</span>
                </div>
                <div>
                  <span className="font-mono text-[9px] text-on-surface-variant/50 block uppercase">REMAINING SLOTS</span>
                  <span className="font-headline text-xl text-pure-white font-bold uppercase">
                    {tournaments[0].slotsTotal - tournaments[0].slotsRegistered} / {tournaments[0].slotsTotal} LEFT
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setRegisteringTourneyId(tournaments[0].id)}
                className="bg-electric-ruby text-deep-void font-headline text-base font-bold px-6 py-2.5 rounded hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,102,0.3)] uppercase"
              >
                DEPLOY REGISTER <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Grid Championships list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTourneys.slice(1).map((tournament) => {
            const slotsLeft = tournament.slotsTotal - tournament.slotsRegistered;
            return (
              <div key={tournament.id} className="bg-surface-container-low border border-surface-variant p-6 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-[10px] text-hyper-blue bg-hyper-blue/10 border border-hyper-blue/20 py-0.5 px-2 rounded uppercase font-semibold">
                      {tournament.game}
                    </span>
                    <span className="font-mono text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                      <Calendar size={12} />
                      {tournament.date}
                    </span>
                  </div>

                  <h4 className="font-headline text-xl text-pure-white font-bold uppercase tracking-tight mb-2">
                    {tournament.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant/80 font-sans mb-4">
                    Format: {tournament.format} • Starting time: {tournament.time} IST.
                  </p>

                  <div className="grid grid-cols-2 gap-4 bg-black/30 border border-white/5 p-3 rounded-md mb-6">
                    <div>
                      <span className="font-mono text-[9px] text-on-surface-variant/60 block uppercase">PRIZES</span>
                      <span className="font-headline font-bold text-base text-emerald-400">{tournament.prizePool}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-on-surface-variant/60 block uppercase">REGISTRANTS</span>
                      <span className="font-headline font-bold text-base text-white">{tournament.slotsRegistered} / {tournament.slotsTotal} Clans</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-2">
                  <button 
                    onClick={() => {
                      setViewParticipantsId(tournament.id);
                    }}
                    className="font-mono text-[10px] text-on-surface-variant/70 hover:text-white underline cursor-pointer"
                  >
                    VIEW PARTICIPANTS ({tournament.participants.length})
                  </button>
                  <button
                    onClick={() => setRegisteringTourneyId(tournament.id)}
                    className="bg-hyper-blue hover:bg-hyper-blue/80 text-white font-headline text-sm font-bold py-2 px-4 rounded transition-all focus:outline-none"
                  >
                    REGISTER TEAM
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tournament Registration Modal Dialog */}
      {registeringTourneyId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-surface-container border border-surface-container-highest p-6 md:p-8 rounded-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setRegisteringTourneyId(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white p-1 hover:bg-white/5 rounded font-mono font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <Trophy className="text-electric-ruby" size={24} />
              <h4 className="font-headline text-2xl text-pure-white uppercase tracking-tight">TEAM DEPLOYMENT</h4>
            </div>

            {successMessage ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-md text-center py-10">
                <span className="text-4xl">👑</span>
                <p className="font-sans text-emerald-400 font-semibold mt-4">{successMessage}</p>
                <p className="font-mono text-[10px] text-on-surface-variant/60 mt-2">SECURE SHELL TOKEN GENERATED AND TRANSMITTED</p>
              </div>
            ) : (
              <form onSubmit={(e) => handleRegister(e, registeringTourneyId)} className="space-y-4">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Provide team tags and coordinate details below. Registration forms are free, however team seating during actual lan dates has base hourly rates.
                </p>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-on-surface-variant/80 tracking-wider block uppercase">TEAM NAME / CLAN TAG</label>
                  <input 
                    type="text" 
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. MUMBAI REAPERS"
                    className="w-full bg-black/40 border border-white/10 rounded py-2 px-3 font-sans text-sm text-pure-white focus:border-electric-ruby focus:ring-0"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-on-surface-variant/80 tracking-wider block uppercase">CAPTAIN EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    required
                    value={captainEmail}
                    onChange={(e) => setCaptainEmail(e.target.value)}
                    placeholder="e.g. captain@gamelan.in"
                    className="w-full bg-black/40 border border-white/10 rounded py-2 px-3 font-sans text-sm text-pure-white focus:border-electric-ruby"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-on-surface-variant/80 tracking-wider block uppercase">DISCORD HANDLE (COORDINATES)</label>
                  <input 
                    type="text" 
                    value={discordTag}
                    onChange={(e) => setDiscordTag(e.target.value)}
                    placeholder="e.g. agentX#1234"
                    className="w-full bg-black/40 border border-white/10 rounded py-2 px-3 font-sans text-sm text-pure-white focus:border-electric-ruby"
                  />
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setRegisteringTourneyId(null)}
                    className="font-headline text-base text-on-surface-variant hover:text-white py-2 px-4"
                  >
                    ABORT COMS
                  </button>
                  <button 
                    type="submit"
                    className="bg-electric-ruby hover:brightness-110 text-deep-void font-headline text-base font-bold py-2.5 px-6 rounded transition-all shadow-[0_0_10px_rgba(0,255,102,0.3)] uppercase"
                  >
                    INITIATE INSCRIPTION
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Participants Detail view Drawer overlay */}
      {viewParticipantsId && (() => {
        const item = tournaments.find(t => t.id === viewParticipantsId);
        if (!item) return null;
        return (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="relative w-full max-w-sm bg-surface-container border border-surface-container-highest p-6 md:p-8 rounded-lg shadow-2xl animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setViewParticipantsId(null)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-white p-1 hover:bg-white/5 rounded font-mono font-bold"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-6">
                <Users className="text-hyper-blue" size={20} />
                <h4 className="font-headline text-xl text-pure-white uppercase tracking-tight font-bold">REGISTERED CLANS</h4>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto mb-6 pr-2">
                {item.participants.length > 0 ? (
                  item.participants.map((clan, idx) => (
                    <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded flex items-center gap-2 font-mono text-xs text-white">
                      <span className="text-electric-ruby font-bold">#{idx + 1}</span>
                      <span className="uppercase">{clan}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sans text-xs text-on-surface-variant italic text-center py-6">No custom clans verified yet.</p>
                )}
              </div>

              <button 
                onClick={() => setViewParticipantsId(null)}
                className="w-full bg-white/5 hover:bg-white/10 text-pure-white font-headline font-bold text-sm py-2.5 rounded transition-all uppercase"
              >
                CLOSE BOARD
              </button>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
