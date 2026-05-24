/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Review, StationType } from '../types';
import { INITIAL_REVIEWS } from '../data';
import { Star, MessageSquarePlus, PenTool, ShieldAlert, BadgeCheck } from 'lucide-react';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [showAddReview, setShowAddReview] = useState(false);

  // Form states
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [stationType, setStationType] = useState<StationType>('PRO GAMING PC');
  const [gamePlayed, setGamePlayed] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !comment || !gamePlayed) {
      setErrorMessage("Please complete all tactical feed entries.");
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author: authorName,
      rating,
      text: comment,
      date: 'Today',
      stationType,
      gamePlayed
    };

    setReviews([newReview, ...reviews]);
    setAuthorName('');
    setRating(5);
    setComment('');
    setGamePlayed('');
    setErrorMessage(null);
    setShowAddReview(false);
  };

  return (
    <section id="reviews" className="py-24 px-6 md:px-20 bg-surface scroll-mt-20">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6">
          <div>
            <p className="font-mono text-xs text-electric-ruby tracking-[0.4em] uppercase mb-2">PLAYER COMMENDATIONS</p>
            <h2 className="font-headline text-headline-xl text-pure-white italic uppercase tracking-tighter">
              THE INTEL & <span className="text-electric-ruby">REVIEWS</span>
            </h2>
            <p className="font-sans text-on-surface-variant text-sm mt-1 max-w-xl">
              Don't take our word for it. Read verified logs written directly by professional esports competitors and casual players around Mumbai.
            </p>
          </div>

          <button
            onClick={() => setShowAddReview(true)}
            className="bg-electric-ruby hover:brightness-110 text-white font-headline text-base font-bold py-2.5 px-6 rounded transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,0,60,0.25)]"
          >
            <MessageSquarePlus size={16} />
            TRANSMIT DEBRIEF
          </button>
        </div>

        {/* Existing Reviews List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div 
              key={rev.id} 
              className="bg-surface-container-low border border-surface-variant p-6 md:p-8 rounded-lg flex flex-col justify-between hover:border-white/10 transition-colors duration-300 relative group"
            >
              <div>
                {/* Visual quote accent mark */}
                <span className="absolute top-4 right-6 text-on-surface-variant/10 text-6xl font-serif font-bold pointer-events-none group-hover:text-electric-ruby/15 transition-colors">“</span>

                {/* Stars Indicator */}
                <div className="flex gap-1 mb-4 text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star 
                      key={idx} 
                      size={14} 
                      className={idx < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10'} 
                    />
                  ))}
                </div>

                <p className="font-sans text-sm text-on-surface leading-relaxed italic mb-6">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-surface-container-high flex justify-between items-center text-xs">
                <div>
                  <h5 className="font-headline font-bold text-pure-white text-base tracking-wide flex items-center gap-1.5 uppercase">
                    {rev.author}
                    <BadgeCheck size={14} className="text-emerald-500 fill-emerald-500/15" />
                  </h5>
                  <p className="font-mono text-[9px] text-on-surface-variant/50 uppercase mt-0.5">
                    {rev.stationType} • <span className="text-electric-ruby font-semibold">{rev.gamePlayed}</span>
                  </p>
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant/40">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write a review Dialog Modal */}
      {showAddReview && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-surface-container border border-surface-container-highest p-6 md:p-8 rounded-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowAddReview(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white p-1 hover:bg-white/5 rounded font-mono font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <PenTool className="text-electric-ruby" size={24} />
              <h4 className="font-headline text-2xl text-pure-white uppercase tracking-tight">TRANSMIT COM FEEDBACK</h4>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded flex items-center gap-2">
                  <ShieldAlert size={14} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-on-surface-variant/80 tracking-wider block uppercase">Tactical Caller Tag</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Maverick_7"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded py-2 px-3 font-sans text-sm text-pure-white focus:border-electric-ruby focus:ring-0"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-on-surface-variant/80 tracking-wider block uppercase">Action Title Played</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CS2 / Tekken 8"
                    value={gamePlayed}
                    onChange={(e) => setGamePlayed(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded py-2 px-3 font-sans text-sm text-pure-white focus:border-electric-ruby"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] text-on-surface-variant/80 tracking-wider block uppercase">Calibrated Station Bay</label>
                <select 
                  value={stationType}
                  onChange={(e) => setStationType(e.target.value as StationType)}
                  className="w-full bg-black/40 border border-white/10 rounded py-2 px-3 font-sans text-sm text-pure-white focus:border-electric-ruby"
                >
                  <option value="PRO GAMING PC">PRO GAMING PC (STATION ALPHA)</option>
                  <option value="PS5 LOUNGE BAY">PS5 LOUNGE BAY (CONSOLE ELITE)</option>
                  <option value="RACING SIMULATOR">RACING SIMULATOR (ULTRA REALISM)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] text-on-surface-variant/80 tracking-wider block uppercase">Rating Matrix Calibration</label>
                <div className="flex gap-2 p-1 bg-black/30 border border-white/5 rounded-md w-fit">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setRating(stars)}
                      className="p-1 rounded text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star 
                        size={20} 
                        className={stars <= rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'} 
                      />
                    </button>
                  ))}
                  <span className="font-mono text-xs text-on-surface-variant py-1 px-2 uppercase font-semibold">
                    {rating} / 5 UNIT Rating
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] text-on-surface-variant/80 tracking-wider block uppercase">COMMENDATION LOG MESSAGE</label>
                <textarea 
                  rows={4}
                  placeholder="Record your hardware execution details or reviews feedback here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded py-2 px-3 font-sans text-sm text-pure-white focus:border-electric-ruby"
                  required
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setShowAddReview(false)}
                  className="font-headline text-base text-on-surface-variant hover:text-white py-2 px-4"
                >
                  ABORT TRANSACTION
                </button>
                <button 
                  type="submit"
                  className="bg-electric-ruby hover:brightness-110 text-white font-headline text-base font-bold py-2.5 px-6 rounded transition-all shadow-[0_0_10px_rgba(255,0,60,0.3)] uppercase"
                >
                  TRANSMIT TELEMETRY LOG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
