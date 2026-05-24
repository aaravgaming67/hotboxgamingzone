/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Booking } from '../types';
import { User, Calendar, Trash2, ShieldX, Check } from 'lucide-react';

interface MyBookingsModalProps {
  bookings: Booking[];
  isOpen: boolean;
  onClose: () => void;
  onCancelBooking: (id: string) => void;
}

export default function MyBookingsModal({ bookings, isOpen, onClose, onCancelBooking }: MyBookingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-surface-container border border-surface-container-highest p-6 md:p-8 rounded-lg shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-white p-1 hover:bg-white/5 rounded font-mono font-bold"
        >
          ✕
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <User className="text-electric-ruby" size={24} />
          <h4 className="font-headline text-2xl text-pure-white uppercase tracking-tight font-bold">MY RESERVATIONS</h4>
        </div>

        {/* Stored units list */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 h-[400px]">
          {bookings.length === 0 ? (
            <div className="text-center py-20 bg-black/40 border border-white/5 rounded-lg flex flex-col items-center">
              <span className="text-4xl text-on-surface-variant/30 mb-2">⚡</span>
              <p className="font-headline text-xl text-pure-white uppercase">No Active Bookings Found</p>
              <p className="font-sans text-xs text-on-surface-variant/60 max-w-sm mt-1 leading-relaxed">
                You have no active bookings at the moment. Use the booking section to choose your slot and reserve a high-performance PC today.
              </p>
            </div>
          ) : (
            bookings.map((booking) => {
              const bookingSeedCode = booking.id.toUpperCase();
              return (
                <div 
                  key={booking.id} 
                  className="bg-black/50 border border-white/5 p-5 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-4 items-center group relative overflow-hidden"
                >
                  {/* Neon border decoration */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-electric-ruby group-hover:bg-emerald-500 transition-colors" />

                  <div className="md:col-span-8 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        BOOKING CONFIRMED
                      </span>
                      <span className="text-[10px] font-mono text-on-surface-variant/40">ID: {bookingSeedCode}</span>
                    </div>

                    <h5 className="font-headline text-lg text-white font-extrabold uppercase">
                      {booking.stationType}
                    </h5>

                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                      Date: <strong className="text-white font-medium">{booking.date}</strong> at <strong className="text-white font-medium">{booking.timeSlot} ({booking.hours} Hours)</strong><br />
                      Booked for: <span className="text-white">{booking.firstName} {booking.lastName}</span> • {booking.email}
                    </p>
                  </div>

                  {/* QR / Status area */}
                  <div className="md:col-span-4 flex flex-col items-end gap-3 justify-end pt-4 md:pt-0 border-t md:border-t-0 border-white/5 whitespace-nowrap">
                    <div className="text-right">
                      <span className="font-mono text-[10px] text-on-surface-variant/50 uppercase block">Total Cost</span>
                      <span className="font-headline text-xl text-pure-white font-extrabold block">(₹{booking.estimatedCost})</span>
                    </div>

                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="text-red-400 hover:text-white hover:bg-red-500/10 border border-red-500/20 py-1.5 px-3 rounded flex items-center gap-1.5 font-headline font-bold text-xs bg-red-950/20 active:scale-95 transition-all text-center"
                    >
                      <Trash2 size={12} />
                      CANCEL BOOKING
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal footer credentials bar */}
        <div className="pt-6 border-t border-surface-container-high flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <p className="font-mono text-[9px] text-on-surface-variant/60 leading-normal text-left max-w-sm">
            Reservations can be modified or cancelled up to 2 hours prior to your scheduled booking slot. Standard refunds normally reflect in 3-5 working days.
          </p>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 font-headline font-bold text-base text-pure-white py-2 px-6 rounded transition-all"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
}
