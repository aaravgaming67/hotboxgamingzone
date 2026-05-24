/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Cpu, Calendar, Star, MapPin, Sliders, User, Terminal } from 'lucide-react';

interface HeaderProps {
  onNavClick: (sectionId: string) => void;
  activeSection: string;
  onOpenMyBookings: () => void;
  bookingCount: number;
}

export default function Header({ onNavClick, activeSection, onOpenMyBookings, bookingCount }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'stations', label: 'THE ARSENAL', icon: Shield },
    { id: 'simulator', label: 'SPECS SIMULATOR', icon: Cpu },
    { id: 'booking', label: 'BOOKING', icon: Calendar },
    { id: 'reviews', label: 'REVIEWS', icon: Star },
    { id: 'tournaments', label: 'TOURNAMENTS', icon: Terminal },
    { id: 'location', label: 'LOUNGE', icon: MapPin },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-black/95 backdrop-blur-md border-b border-surface-container-highest shadow-[0_4px_25px_rgba(255,0,60,0.15)]' 
          : 'py-5 bg-deep-void/90 backdrop-blur-sm border-b border-surface-container-high'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-20 flex justify-between items-center">
        {/* Logo */}
        <div 
          onClick={() => onNavClick('hero')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded bg-electric-ruby flex items-center justify-center font-bold text-lg text-pure-white transition-transform group-hover:rotate-12">H</div>
          <span className="font-headline text-2xl font-extrabold tracking-tighter text-electric-ruby group-hover:text-pure-white transition-colors duration-300">
            HOTBOX GAMING
          </span>
        </div>

        {/* Desktop Navbar */}
        <nav className="hidden xl:flex items-center gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`flex items-center gap-1.5 font-headline text-lg tracking-wider font-semibold transition-all duration-300 relative py-1 ${
                  isActive 
                    ? 'text-electric-ruby' 
                    : 'text-on-surface-variant hover:text-pure-white hover:translate-y-[-1px]'
                }`}
              >
                <Icon size={16} className={`opacity-80 ${isActive ? 'text-electric-ruby' : 'text-on-surface-variant hover:text-pure-white'}`} />
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-electric-ruby rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Header CTA & Actions */}
        <div className="flex items-center gap-4">
          {/* Active Bookings Micro-badge */}
          {bookingCount > 0 && (
            <button
              onClick={onOpenMyBookings}
              className="relative p-2 bg-surface-container-high hover:bg-surface-container-highest rounded border border-surface-container-highest transition-all duration-200"
              title="My Reserved Stations"
            >
              <User size={18} className="text-electric-ruby" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-electric-ruby text-[9px] font-mono text-pure-white rounded-full flex items-center justify-center font-bold animate-bounce">
                {bookingCount}
              </span>
            </button>
          )}

          <button 
            onClick={() => onNavClick('booking')}
            className="hidden sm:block bg-electric-ruby text-pure-white font-headline text-lg font-bold px-5 py-1.5 rounded hover:bg-electric-ruby/80 active:scale-95 transition-all duration-200 shadow-[0_0_15px_rgba(255,0,60,0.35)]"
          >
            BOOK NOW
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden text-on-surface hover:text-electric-ruby transition-colors p-1"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-y-0 right-0 w-64 bg-surface-container border-l border-surface-container-highest z-50 p-6 shadow-2xl flex flex-col justify-between pt-24 animate-in slide-in-from-right duration-200">
          <div className="flex flex-col gap-6">
            <p className="font-mono text-[10px] text-on-surface-variant/50 tracking-widest uppercase">HUD DIRECTORIES</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavClick(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 font-headline text-xl text-left font-semibold py-2 transition-colors ${
                    isActive ? 'text-electric-ruby' : 'text-on-surface-variant hover:text-pure-white'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-electric-ruby' : 'text-on-surface-variant'} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {bookingCount > 0 && (
              <button
                onClick={() => {
                  onOpenMyBookings();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-surface-container-high border border-surface-container-highest font-headline text-lg font-bold py-2.5 rounded hover:bg-surface-container-highest text-pure-white flex items-center justify-center gap-2"
              >
                <User size={16} /> MY BOOKINGS ({bookingCount})
              </button>
            )}
            <button
              onClick={() => {
                onNavClick('booking');
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-electric-ruby font-headline text-lg font-bold py-2.5 rounded hover:bg-electric-ruby/95 text-pure-white tracking-wider"
            >
              BOOK STATION NOW
            </button>
            <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-mono text-on-surface-variant/40">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span>DEV SERVER ONLINE</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
