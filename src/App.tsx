/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Booking, StationType } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import Stations from './components/Stations';
import SpecsSimulator from './components/SpecsSimulator';
import BookingSection from './components/BookingSection';
import Gallery from './components/Gallery';
import ReviewsSection from './components/ReviewsSection';
import TournamentsSection from './components/TournamentsSection';
import LocationSection from './components/LocationSection';
import Footer from './components/Footer';
import MyBookingsModal from './components/MyBookingsModal';
import { Bolt } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, onSnapshot, setDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';

export default function App() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedStationType, setSelectedStationType] = useState<StationType>('240HZ GAMING PC');
  const [activeSection, setActiveSection] = useState('hero');
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);

  // Synchronize with Firestore Database in real-time (with localStorage fallback)
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const q = query(collection(db, 'bookings'), orderBy('timestamp', 'desc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedBookings: Booking[] = [];
        snapshot.forEach((docRef) => {
          loadedBookings.push(docRef.data() as Booking);
        });
        setBookings(loadedBookings);
        
        // Cache to local space for high resiliency
        try {
          localStorage.setItem('hotbox_session_bookings', JSON.stringify(loadedBookings));
        } catch (storageErr) {
          console.error("Local storage sync error:", storageErr);
        }
      }, (error) => {
        console.warn("Firestore subscription failed, using offline fallback:", error);
        
        // Offline Fallback parsing
        try {
          const stored = localStorage.getItem('hotbox_session_bookings');
          if (stored) {
            setBookings(JSON.parse(stored));
          }
        } catch (storageErr) {
          console.error("Unreadable storage fallback:", storageErr);
        }
      });
    } catch (e) {
      console.warn("Could not attach real-time listener, defaulting to offline storage", e);
      try {
        const stored = localStorage.getItem('hotbox_session_bookings');
        if (stored) {
          setBookings(JSON.parse(stored));
        }
      } catch (storageErr) {
        console.error("Unreadable storage fallback:", storageErr);
      }
    }

    return () => unsubscribe();
  }, []);

  // Update storage and commit to Firestore on bookings change
  const handleNewBookingCreated = async (booking: Booking) => {
    // Optimistically update UI
    setBookings((prev) => [booking, ...prev]);
    
    // Attempt Firebase sync
    try {
      await setDoc(doc(db, 'bookings', booking.id), booking);
    } catch (firebaseErr: any) {
      console.error("Failed to sync booking with Firebase Firestore:", firebaseErr);
      try {
        handleFirestoreError(firebaseErr, OperationType.WRITE, `bookings/${booking.id}`);
      } catch (transformedErr) {
        // Log formatted error to console for tracing
      }
    }

    // Always update localStorage as a robust local copy
    try {
      const stored = localStorage.getItem('hotbox_session_bookings');
      const loaded: Booking[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('hotbox_session_bookings', JSON.stringify([booking, ...loaded]));
    } catch (storageErr) {
      console.error("Failed to commit legacy local cache:", storageErr);
    }
  };

  const handleCancelBooking = async (id: string) => {
    // Optimistically update UI
    setBookings((prev) => prev.filter((b) => b.id !== id));

    // Attempt Firebase cancel
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (firebaseErr: any) {
      console.error("Failed to purge reservation from Firebase Firestore:", firebaseErr);
      try {
        handleFirestoreError(firebaseErr, OperationType.DELETE, `bookings/${id}`);
      } catch (transformedErr) {
        // Log formatted error
      }
    }

    // Update fallback cache local copy
    try {
      const stored = localStorage.getItem('hotbox_session_bookings');
      if (stored) {
        const loaded: Booking[] = JSON.parse(stored);
        const filtered = loaded.filter((b) => b.id !== id);
        localStorage.setItem('hotbox_session_bookings', JSON.stringify(filtered));
      }
    } catch (storageErr) {
      console.error("Failed to sync legacy cancel cache:", storageErr);
    }
  };

  // Pre-fill selection from Stations grid & scroll smoothly
  const handleStationSelectionPreset = (type: string) => {
    setSelectedStationType(type as StationType);
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Smooth scroll handler for Navbar links
  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('hero');
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Intersection scroll spy to highlight header links
  useEffect(() => {
    const sections = ['stations', 'simulator', 'booking', 'reviews', 'tournaments', 'location'];
    
    const handleScrollSpy = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      
      if (window.scrollY < 150) {
        setActiveSection('hero');
        return;
      }

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy);
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  return (
    <div className="bg-deep-void text-on-surface font-sans overflow-x-hidden min-h-screen">
      
      {/* Precision Header navigation */}
      <Header 
        onNavClick={handleScrollToSection}
        activeSection={activeSection}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        bookingCount={bookings.length}
      />

      {/* Main Container flow */}
      <main className="pt-16 sm:pt-20">
        
        {/* Cinematic Hero */}
        <Hero 
          onReserveClick={() => handleScrollToSection('booking')}
          onExploreClick={() => handleScrollToSection('stations')}
        />

        {/* Stations Bento overview Grid */}
        <Stations onStationSelect={handleStationSelectionPreset} />

        {/* Dynamic Sandbox specs simulator benchmarks */}
        <SpecsSimulator />

        {/* Immersive vibe gallery */}
        <Gallery />

        {/* Booking dominion form details panel */}
        <BookingSection 
          selectedStationType={selectedStationType}
          onStationTypeChange={(type) => setSelectedStationType(type)}
          onNewBookingCreated={handleNewBookingCreated}
        />

        {/* Player logs & verification reviews feed */}
        <ReviewsSection />

        {/* Tournaments championships register boards */}
        <TournamentsSection />

        {/* Base of Operations coordinate details and maps */}
        <LocationSection />

      </main>

      {/* Legal & calendar operations footer */}
      <Footer />

      {/* FAB - Booking direct shortcut */}
      <button 
        onClick={() => handleScrollToSection('booking')}
        className="fixed bottom-6 right-6 z-[90] p-4 bg-electric-ruby hover:scale-110 hover:rotate-6 active:scale-95 text-pure-white rounded-full shadow-[0_0_20px_rgba(255,0,60,0.6)] hover:shadow-[0_0_30px_rgba(255,0,60,0.9)] transition-all duration-300"
        title="Reserve Station Now"
      >
        <Bolt size={24} className="fill-pure-white" />
      </button>

      {/* User Reserved Bookings status drawer overlay */}
      <MyBookingsModal 
        bookings={bookings}
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        onCancelBooking={handleCancelBooking}
      />

    </div>
  );
}
