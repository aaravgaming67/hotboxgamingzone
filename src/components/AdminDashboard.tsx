/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Booking, StationType } from '../types';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { 
  ShieldAlert, 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  CircleDollarSign, 
  Users, 
  TrendingUp, 
  Monitor, 
  Gamepad2, 
  Unlock, 
  RefreshCw, 
  LogOut, 
  CalendarRange, 
  Clock, 
  Mail, 
  BookOpen, 
  CheckSquare, 
  Play,
  FileSpreadsheet,
  Building
} from 'lucide-react';

interface AdminDashboardProps {
  bookings: Booking[];
  onClose: () => void;
  onCancelBooking: (id: string) => void;
}

export default function AdminDashboard({ bookings, onClose, onCancelBooking }: AdminDashboardProps) {
  // Simple administrative lock gate for visual realism
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(true); // Default bypass/unlock for instant usability
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStation, setFilterStation] = useState<string>('ALL');
  const [filterPayment, setFilterPayment] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isActionPending, setIsActionPending] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  // Authentication gate handler
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'admin' || passcode === 'hotbox' || passcode === '1234') {
      setIsUnlocked(true);
      setErrorFeedback(null);
    } else {
      setErrorFeedback('ACCESS DENIED: INVALID AUTHORIZATION SIGNATURE');
    }
  };

  // Synchronize update back to Firestore database safely
  const updateBookingField = async (booking: Booking, updates: Partial<Booking>) => {
    const updatedBooking = { ...booking, ...updates };
    setIsActionPending(booking.id);
    
    try {
      await setDoc(doc(db, 'bookings', booking.id), updatedBooking);
      // If modal detail is open, synchronize local state modal details
      if (selectedBooking && selectedBooking.id === booking.id) {
        setSelectedBooking(updatedBooking);
      }
    } catch (err: any) {
      console.error("Firestore database status update failed:", err);
      setErrorFeedback(`Failed to update booking on server: ${err.message || err}`);
    } finally {
      setIsActionPending(null);
    }
  };

  // Permanently delete a booking from database
  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this booking from the live Firestore database?")) {
      return;
    }
    
    setIsActionPending(id);
    try {
      await deleteDoc(doc(db, 'bookings', id));
      if (selectedBooking?.id === id) {
        setSelectedBooking(null);
      }
    } catch (err: any) {
      console.error("Firestore purge failed:", err);
      setErrorFeedback(`Failed to purge booking: ${err.message || err}`);
    } finally {
      setIsActionPending(null);
    }
  };

  // Inject a mock booking for testing & demonstration
  const handleCreateMockBooking = async () => {
    const names = [
      { first: 'Siddharth', last: 'Mehta', email: 'sid.m@gmail.com' },
      { first: 'Rohan', last: 'Sharma', email: 'rohan.s@yahoo.com' },
      { first: 'Nisha', last: 'Patel', email: 'nisha.p@outlook.com' },
      { first: 'Arjun', last: 'Nair', email: 'arjun.n@gmail.com' }
    ];
    const pickedName = names[Math.floor(Math.random() * names.length)];
    const stations: StationType[] = ['240HZ GAMING PC', 'PS5 LOUNGE'];
    const station = stations[Math.floor(Math.random() * stations.length)];
    const currentTS = Date.now();
    const mockId = `MOCK_${currentTS.toString().slice(-6)}`;
    
    const mockBooking: Booking = {
      id: mockId,
      firstName: pickedName.first,
      lastName: pickedName.last,
      email: pickedName.email,
      stationType: station,
      date: new Date(Date.now() + 86400000 * Math.floor(Math.random() * 5)).toISOString().split('T')[0],
      timeSlot: `${10 + Math.floor(Math.random() * 8)}:00 - ${12 + Math.floor(Math.random() * 8)}:00`,
      hours: Math.floor(Math.random() * 4) + 1,
      missionDetails: 'VALORANT scrimmage session with friends',
      paymentMethod: Math.random() > 0.4 ? 'razorpay' : 'after_booking',
      estimatedCost: (station === '240HZ GAMING PC' ? 150 : 100) * (Math.floor(Math.random() * 4) + 1),
      timestamp: currentTS,
      status: 'confirmed'
    };

    try {
      await setDoc(doc(db, 'bookings', mockBooking.id), mockBooking);
    } catch (err: any) {
      console.error("Mock generation failed:", err);
      setErrorFeedback(`Failed to inject mock record: ${err.message}`);
    }
  };

  // Derived Statistics from Live Firestore Sync
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let pendingRevenue = 0;
    let pcCount = 0;
    let ps5Count = 0;
    let completedCount = 0;
    let activeCount = 0;
    let cancelledCount = 0;

    bookings.forEach(b => {
      // Calculate revenue
      if (b.status !== 'cancelled') {
        if (b.paymentMethod === 'razorpay' || b.status === 'completed') {
          totalRevenue += b.estimatedCost;
        } else {
          pendingRevenue += b.estimatedCost;
        }
      }

      // Counts
      if (b.stationType === '240HZ GAMING PC') pcCount++;
      else ps5Count++;

      if (b.status === 'completed') completedCount++;
      else if (b.status === 'cancelled') cancelledCount++;
      else activeCount++;
    });

    return {
      totalBookingCount: bookings.length,
      totalRevenue,
      pendingRevenue,
      pcCount,
      ps5Count,
      completedCount,
      activeCount,
      cancelledCount
    };
  }, [bookings]);

  // Search and Filter booking computation
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Search Box matcher
      const matchText = `${b.firstName} ${b.lastName} ${b.email} ${b.id}`.toLowerCase();
      const matchesSearch = matchText.includes(searchQuery.toLowerCase());

      // Station type filter
      const matchesStation = filterStation === 'ALL' || b.stationType === filterStation;

      // Payment platform filters
      let matchesPayment = true;
      if (filterPayment === 'RAZORPAY') {
        matchesPayment = b.paymentMethod === 'razorpay';
      } else if (filterPayment === 'AFTER_BOOKING') {
        matchesPayment = b.paymentMethod === 'after_booking';
      }

      // Status filters
      const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus.toLowerCase();

      return matchesSearch && matchesStation && matchesPayment && matchesStatus;
    });
  }, [bookings, searchQuery, filterStation, filterPayment, filterStatus]);

  if (!isUnlocked) {
    return (
      <div className="min-h-[85vh] py-16 px-4 flex items-center justify-center bg-deep-void">
        <div className="w-full max-w-md bg-surface-dim border border-electric-ruby/30 p-8 rounded relative overflow-hidden shadow-[0_0_50px_rgba(255,0,60,0.15)] group">
          {/* Cyber accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-electric-ruby"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-electric-ruby"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-electric-ruby"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-electric-ruby"></div>

          <div className="text-center mb-6">
            <ShieldAlert className="mx-auto text-electric-ruby animate-pulse mb-3" size={48} />
            <h2 className="font-headline text-3xl font-extrabold tracking-widest text-pure-white uppercase">COMMAND GATEWAY</h2>
            <p className="font-mono text-xs text-on-surface-variant/70 mt-1">SECURE ACCESS TO THE HOTBOX REALTIME BACKEND</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-on-surface-variant tracking-wider mb-2">Security Authority Signature (Passcode)</label>
              <input 
                type="password"
                placeholder="ENTER ACCESS CREDENTIAL"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-deep-void border border-surface-container-highest text-pure-white font-mono placeholder-on-surface-variant/40 rounded px-4 py-3 text-sm focus:outline-none focus:border-electric-ruby focus:ring-1 focus:ring-electric-ruby transition-all duration-200"
                autoFocus
              />
              <span className="block mt-2 text-[10px] text-on-surface-variant/40 font-mono">Demo Hint: use &quot;admin&quot; or click bypass below</span>
            </div>

            {errorFeedback && (
              <p className="text-xs font-mono text-electric-ruby bg-electric-ruby/10 p-2 border border-electric-ruby/20 rounded text-center">
                {errorFeedback}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-electric-ruby hover:bg-electric-ruby/80 text-pure-white font-headline text-lg font-bold tracking-widest rounded transition-all duration-200 shadow-[0_0_15px_rgba(255,0,60,0.3)]"
            >
              AUTHENTICATE HUD
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-surface-container-highest flex items-center justify-between text-xs font-mono text-on-surface-variant/50">
            <button 
              onClick={() => setIsUnlocked(true)}
              className="hover:text-electric-ruby transition-colors flex items-center gap-1 font-bold"
            >
              <Unlock size={12} /> BYPASS SECURE LOCK
            </button>
            <button 
              onClick={onClose}
              className="hover:text-pure-white transition-colors"
            >
              CANCEL HUD
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-8 bg-deep-void min-h-[90vh]">
      
      {/* Standalone Repository Isolation Banner */}
      <div className="mb-8 p-4 bg-indigo-950/40 border border-indigo-500/30 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h4 className="text-white font-headline text-lg font-bold tracking-wide uppercase flex items-center gap-2">
            <Building className="text-indigo-400 animate-pulse" size={18} />
            STANDALONE REPOSITORY CONFIGURATION COMPLETED
          </h4>
          <p className="text-xs text-on-surface-variant/70 font-sans mt-1">
            As requested, the administrative console has been modularized and isolated as a **completely separate React + Vite SPA** inside the <code className="bg-black/60 px-1 py-0.5 rounded text-indigo-400 border border-indigo-900/30 font-mono">/admin-deck</code> directory. You can run, build, and deploy it independently on any host (like GitHub Pages or Vercel).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded tracking-widest font-bold uppercase">
            ISOLATED MODULE READY
          </span>
        </div>
      </div>
      
      {/* Control Status Bar Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-surface-container-high pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="px-2 py-0.5 bg-electric-ruby font-mono text-[10px] font-bold text-pure-white rounded uppercase tracking-wider animate-pulse">
              LIVE BROADCAST
            </div>
            <span className="font-mono text-xs text-on-surface-variant/50">FIREBASE REAL-TIME INTERACTION ROUTED</span>
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-wider text-pure-white uppercase mt-1">
            COMMAND DECK <span className="text-electric-ruby">BACKEND</span>
          </h1>
          <p className="font-sans text-on-surface-variant/80 text-sm mt-1">
            Browse and coordinate player bookings, verify secure payments, and control administrative status schedules in-situ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCreateMockBooking}
            className="flex items-center gap-2 bg-surface-container-high border border-surface-container-highest hover:bg-surface-container-highest text-pure-white font-headline text-base font-bold px-4 py-2 rounded transition-all"
            title="Conveniently insert a realistic booking for test metrics"
          >
            <Play size={15} className="text-emerald-500 animate-pulse fill-emerald-500" />
            SIMULATE LIVE BOOKING
          </button>
          
          <button
            onClick={() => setIsUnlocked(false)}
            className="flex items-center gap-2 bg-surface-container-high border border-surface-container-highest hover:border-electric-ruby hover:text-electric-ruby text-on-surface-variant font-mono text-xs font-bold px-3 py-2 rounded transition-all"
          >
            <LogOut size={14} />
            LOCK HUB
          </button>

          <button
            onClick={onClose}
            className="bg-electric-ruby hover:bg-electric-ruby/80 text-pure-white font-headline text-base font-bold px-5 py-2 rounded shadow-[0_0_15px_rgba(255,0,60,0.3)] transition-all"
          >
            RETURN TO LOUNGE
          </button>
        </div>
      </div>

      {errorFeedback && (
        <div className="mb-6 bg-electric-ruby/15 border border-electric-ruby/40 p-4 rounded flex justify-between items-center text-sm font-mono text-on-surface text-electric-ruby">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} />
            <span>{errorFeedback}</span>
          </div>
          <button 
            onClick={() => setErrorFeedback(null)} 
            className="text-pure-white hover:text-electric-ruby font-bold px-2 py-1"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Cyberdeck Analytics Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Metric Card: Estimated Total Cash Flow */}
        <div className="bg-surface-dim border border-surface-container-highest rounded p-5 relative overflow-hidden group hover:border-surface-container-high transition-transform hover:-translate-y-0.5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs text-on-surface-variant/60 tracking-wider">SECURE CASH FLOW REGISTER</span>
            <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CircleDollarSign size={18} />
            </div>
          </div>
          <p className="font-headline text-3xl font-bold text-pure-white tracking-wide">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center gap-2 justify-between">
            <span className="font-mono text-[11px] text-emerald-500 font-bold">SETTLED IN FULL</span>
            {stats.pendingRevenue > 0 && (
              <span className="font-mono text-[10px] text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded">
                ₹{stats.pendingRevenue.toLocaleString()} PENDING AT DOOR
              </span>
            )}
          </div>
        </div>

        {/* Metric Card: Real-time Active Sessions */}
        <div className="bg-surface-dim border border-surface-container-highest rounded p-5 relative overflow-hidden group hover:border-surface-container-high transition-transform hover:-translate-y-0.5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-electric-ruby/5 to-transparent rounded-bl-full pointer-events-none"></div>
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs text-on-surface-variant/60 tracking-wider">ACTIVE RESERVATIONS</span>
            <div className="w-8 h-8 rounded bg-electric-ruby/10 flex items-center justify-center text-electric-ruby">
              <Users size={18} />
            </div>
          </div>
          <p className="font-headline text-3xl font-bold text-pure-white tracking-wide">
            {stats.activeCount} <span className="text-sm font-sans font-normal text-on-surface-variant/50">OF {stats.totalBookingCount} TOTAL</span>
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="font-mono text-[11px] text-on-surface-variant/60">
              {stats.completedCount} COMPLETE | {stats.cancelledCount} VOIDED
            </span>
          </div>
        </div>

        {/* Metric Card: 240Hz PC Utilization */}
        <div className="bg-surface-dim border border-surface-container-highest rounded p-5 relative overflow-hidden group hover:border-surface-container-high transition-transform hover:-translate-y-0.5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs text-on-surface-variant/60 tracking-wider">240HZ PC RIG DEMAND</span>
            <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Monitor size={18} />
            </div>
          </div>
          <p className="font-headline text-3xl font-bold text-pure-white tracking-wide">
            {stats.pcCount} <span className="text-xs font-mono text-on-surface-variant/40">BOOKINGS</span>
          </p>
          <div className="mt-3 bg-surface-container-low h-1.5 w-full rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full transition-all duration-500" 
              style={{ width: `${stats.totalBookingCount > 0 ? (stats.pcCount / stats.totalBookingCount) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Metric Card: PS5 Lounge Utilization */}
        <div className="bg-surface-dim border border-surface-container-highest rounded p-5 relative overflow-hidden group hover:border-surface-container-high transition-transform hover:-translate-y-0.5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none"></div>
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs text-on-surface-variant/60 tracking-wider">PS5 LOUNGE DEMAND</span>
            <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Gamepad2 size={18} />
            </div>
          </div>
          <p className="font-headline text-3xl font-bold text-pure-white tracking-wide">
            {stats.ps5Count} <span className="text-xs font-mono text-on-surface-variant/40">BOOKINGS</span>
          </p>
          <div className="mt-3 bg-surface-container-low h-1.5 w-full rounded-full overflow-hidden">
            <div 
              className="bg-purple-500 h-full transition-all duration-500" 
              style={{ width: `${stats.totalBookingCount > 0 ? (stats.ps5Count / stats.totalBookingCount) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Control Filter Bar */}
      <div className="bg-surface-dim border border-surface-container-high rounded p-5 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          
          {/* Real-time Search Box */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface-variant/40 pointer-events-none">
              <Search size={18} />
            </span>
            <input 
              type="text"
              placeholder="SEARCH BOOKINGS BY NAME, EMAIL, OR ID CODES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-deep-void border border-surface-container-highest text-pure-white rounded pl-10 pr-4 py-3 text-sm font-mono focus:outline-none focus:border-electric-ruby focus:ring-1 focus:ring-electric-ruby tracking-wider placeholder-on-surface-variant/30"
            />
          </div>

          {/* Core Select Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Station dropdown filter */}
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-on-surface-variant/40 mb-1 tracking-widest uppercase">HUD APPARATUS</span>
              <select
                value={filterStation}
                onChange={(e) => setFilterStation(e.target.value)}
                className="bg-deep-void border border-surface-container-highest rounded px-3 py-2 text-xs font-mono text-pure-white focus:outline-none focus:border-electric-ruby"
              >
                <option value="ALL">ALL HARDWARE</option>
                <option value="240HZ GAMING PC">240HZ GAMING PC</option>
                <option value="PS5 LOUNGE">PS5 LOUNGE</option>
              </select>
            </div>

            {/* Payment status filter */}
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-on-surface-variant/40 mb-1 tracking-widest uppercase">PAY APPROACH</span>
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="bg-deep-void border border-surface-container-highest rounded px-3 py-2 text-xs font-mono text-pure-white focus:outline-none focus:border-electric-ruby"
              >
                <option value="ALL">ALL PAYMENT PROTOCOLS</option>
                <option value="RAZORPAY">ONLINE GATEWAY (RAZORPAY)</option>
                <option value="AFTER_BOOKING">PAY LATER (AT DOOR)</option>
              </select>
            </div>

            {/* Overall status filter */}
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-on-surface-variant/40 mb-1 tracking-widest uppercase">HUD SECURITY STATE</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-deep-void border border-surface-container-highest rounded px-3 py-2 text-xs font-mono text-pure-white focus:outline-none focus:border-electric-ruby"
              >
                <option value="ALL">ALL SCHEDULE STATES</option>
                <option value="CONFIRMED">CONFIRMED (ACTIVE)</option>
                <option value="COMPLETED">COMPLETED (SETTLED)</option>
                <option value="CANCELLED">CANCELLED (VOIDED)</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStation('ALL');
                setFilterPayment('ALL');
                setFilterStatus('ALL');
              }}
              className="mt-4 px-3 py-2 hover:bg-surface-container-highest text-on-surface-variant text-xs font-mono font-bold uppercase transition rounded border border-surface-container-highest"
              title="Reset Filters"
            >
              CLEAR
            </button>

          </div>
        </div>
      </div>

      {/* Main Content Layout Splitter: Main Table + Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Bookings Live Registry Table */}
        <div className="lg:col-span-2 bg-surface-dim border border-surface-container-highest rounded overflow-hidden">
          <div className="p-4 border-b border-surface-container-high bg-surface-dim/40 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-electric-ruby" />
              <h2 className="font-headline text-lg font-bold text-pure-white tracking-widest uppercase">REGISTRY DATABASE</h2>
            </div>
            <span className="font-mono text-[11px] text-on-surface-variant/40">
              SHOWING {filteredBookings.length} OF {bookings.length} BOOKINGS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs text-on-surface">
              <thead>
                <tr className="border-b border-surface-container-high bg-deep-void text-on-surface-variant/40 tracking-wider">
                  <th className="p-4 uppercase font-bold text-left">PLAYER</th>
                  <th className="p-4 uppercase font-bold text-left">DESTINATION APPARATUS</th>
                  <th className="p-4 uppercase font-bold text-left">SCHEDULE SLOT</th>
                  <th className="p-4 uppercase font-bold text-right">VALUATION</th>
                  <th className="p-4 uppercase font-bold text-center">PAY STATUS</th>
                  <th className="p-4 uppercase font-bold text-center">STATE</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-on-surface-variant/30 font-mono">
                      NO BOOKING RECORD IDENTIFIED UNDER ACTIVE CONSTRAINTS.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const isPc = b.stationType === '240HZ GAMING PC';
                    const isPaid = b.paymentMethod === 'razorpay' || b.status === 'completed';
                    
                    return (
                      <tr 
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className={`border-b border-surface-container-high hover:bg-surface-container-low transition-colors cursor-pointer ${
                          selectedBooking?.id === b.id ? 'bg-surface-container-high/60 border-l-2 border-l-electric-ruby' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="font-sans font-semibold text-pure-white text-sm">
                            {b.firstName} {b.lastName}
                          </div>
                          <div className="text-[10px] text-on-surface-variant/50 tracking-wider mt-0.5">
                            ID: {b.id}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isPc ? 'bg-indigo-950 text-indigo-400 border border-indigo-900' : 'bg-purple-950 text-purple-400 border border-purple-900'
                          }`}>
                            {isPc ? <Monitor size={10} /> : <Gamepad2 size={10} />}
                            {b.stationType}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 font-bold text-pure-white">
                            <CalendarRange size={11} className="text-on-surface-variant/40" />
                            {b.date}
                          </div>
                          <div className="text-[10px] text-on-surface-variant/60 flex items-center gap-1 mt-0.5">
                            <Clock size={10} />
                            {b.timeSlot} ({b.hours}h)
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-pure-white text-sm">
                          ₹{b.estimatedCost}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-extrabold tracking-wider ${
                            isPaid 
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900' 
                              : 'bg-amber-950/80 text-amber-500 border border-amber-900 animate-pulse'
                          }`}>
                            {isPaid ? 'PAID SETTLED' : 'DUE AT DOOR'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                            b.status === 'completed' 
                              ? 'bg-emerald-500' 
                              : b.status === 'cancelled' 
                              ? 'bg-electric-ruby' 
                              : 'bg-indigo-500 animate-ping'
                          }`} title={b.status.toUpperCase()} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Detail Bento Control Panel */}
        <div className="bg-surface-dim border border-surface-container-highest rounded p-6 sticky top-24">
          {selectedBooking ? (
            <div>
              {/* Card Header */}
              <div className="flex justify-between items-start border-b border-surface-container-high pb-4 mb-4">
                <div>
                  <span className="font-mono text-[9px] text-on-surface-variant/40 tracking-widest uppercase">HUD DIRECT RECORD</span>
                  <h3 className="font-headline text-2xl font-bold tracking-wider text-pure-white mt-1 uppercase">
                    {selectedBooking.firstName} {selectedBooking.lastName}
                  </h3>
                  <p className="font-mono text-[10px] text-electric-ruby mt-0.5 font-bold">
                    RECORD CODE: {selectedBooking.id}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)} 
                  className="font-mono text-xs text-on-surface-variant/40 hover:text-pure-white p-1 border border-surface-container-highest rounded"
                >
                  DESELECT
                </button>
              </div>

              {/* Bento Grid Parameter Properties */}
              <div className="space-y-4 font-mono text-xs text-on-surface">
                
                {/* Contact Coordinates */}
                <div className="bg-deep-void p-3 rounded border border-surface-container-highest">
                  <div className="text-[9px] text-on-surface-variant/40 tracking-wider mb-1 uppercase flex items-center gap-1">
                    <Mail size={10} /> COMMUNICATIONS ROUTER
                  </div>
                  <p className="font-sans font-medium text-pure-white text-sm break-all">
                    {selectedBooking.email}
                  </p>
                </div>

                {/* Apparatus Specs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-deep-void p-3 rounded border border-surface-container-highest">
                    <span className="text-[9px] text-on-surface-variant/40 tracking-wider mb-1 block uppercase">STATION TYPE</span>
                    <span className="font-bold text-pure-white block text-[11px]">
                      {selectedBooking.stationType}
                    </span>
                  </div>
                  <div className="bg-deep-void p-3 rounded border border-surface-container-highest">
                    <span className="text-[9px] text-on-surface-variant/40 tracking-wider mb-1 block uppercase">DURATION / RATE</span>
                    <span className="font-bold text-emerald-400 block text-[11px]">
                      {selectedBooking.hours} Hours (₹{selectedBooking.estimatedCost})
                    </span>
                  </div>
                </div>

                {/* Timeline calendar details */}
                <div className="bg-deep-void p-3 rounded border border-surface-container-highest">
                  <span className="text-[9px] text-on-surface-variant/40 tracking-wider mb-1 block uppercase">RESERVATION TIMELINE SLOT</span>
                  <div className="flex items-center gap-1.5 font-bold text-pure-white text-[11px]">
                    <Clock size={12} className="text-electric-ruby" />
                    <span>{selectedBooking.date} @ {selectedBooking.timeSlot}</span>
                  </div>
                </div>

                {/* Mission briefings (Games chosen) */}
                <div className="bg-deep-void p-3 rounded border border-surface-container-highest">
                  <span className="text-[9px] text-on-surface-variant/40 tracking-wider mb-1 block uppercase">TACTICAL BRIEFING / SELECTED GAMES</span>
                  <p className="font-sans text-on-surface-variant text-xs leading-relaxed italic">
                    &quot;{selectedBooking.missionDetails || 'No auxiliary instructions recorded.'}&quot;
                  </p>
                </div>

                {/* Payment Configuration Log */}
                <div className="bg-deep-void p-3 rounded border border-surface-container-highest flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-on-surface-variant/40 tracking-wider block uppercase">PAYMENT SCHEME</span>
                    <span className="font-bold text-pure-white text-[11px] block mt-0.5">
                      {selectedBooking.paymentMethod === 'razorpay' ? 'ONLINE DIGITAL GATEWAY' : 'CASH PROTOCOL AT DOOR'}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedBooking.paymentMethod === 'razorpay' || selectedBooking.status === 'completed'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                      : 'bg-amber-950 text-amber-500 border border-amber-900'
                  }`}>
                    {selectedBooking.paymentMethod === 'razorpay' || selectedBooking.status === 'completed' ? 'SETTLED' : 'DUE'}
                  </span>
                </div>

                {/* Current operational status info */}
                <div className="p-3 bg-surface-container/50 border border-surface-container-highest rounded flex justify-between items-center text-[11px]">
                  <span className="text-on-surface-variant/60 uppercase">CURRENT BOOKING STATUS</span>
                  <span className={`font-bold px-2 py-0.5 rounded uppercase ${
                    selectedBooking.status === 'completed' 
                      ? 'text-emerald-400 bg-emerald-500/10' 
                      : selectedBooking.status === 'cancelled' 
                      ? 'text-electric-ruby bg-electric-ruby/10' 
                      : 'text-indigo-400 bg-indigo-500/10 animate-pulse'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>

                {/* Cyber Action Control Terminal */}
                <div className="border-t border-surface-container-high pt-4 mt-6">
                  <span className="text-[9px] text-on-surface-variant/40 tracking-widest block uppercase mb-3">ADMINISTRATIVE INTERPRETATIONS</span>
                  
                  {isActionPending === selectedBooking.id ? (
                    <div className="text-center py-4 text-xs font-mono text-electric-ruby animate-pulse">
                      COMMITTING CHANGES TO DATABASE OVERLAY SYSTEM...
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {/* Mark Session and Payment Completed */}
                      {selectedBooking.status !== 'completed' && (
                        <button
                          onClick={() => updateBookingField(selectedBooking, { status: 'completed' })}
                          className="w-full bg-emerald-900/50 text-emerald-400 border border-emerald-800 hover:bg-emerald-800 hover:text-pure-white font-headline text-sm font-bold tracking-wider py-2 rounded flex items-center justify-center gap-2 transition"
                        >
                          <CheckCircle size={15} />
                          MARK COMPLETED &amp; SETTLED
                        </button>
                      )}

                      {/* Mark Active (Reconfirm) */}
                      {selectedBooking.status !== 'confirmed' && (
                        <button
                          onClick={() => updateBookingField(selectedBooking, { status: 'confirmed' })}
                          className="w-full bg-indigo-950 text-indigo-400 border border-indigo-900 hover:bg-indigo-900 hover:text-pure-white font-headline text-sm font-bold tracking-wider py-2 rounded flex items-center justify-center gap-2 transition"
                        >
                          <RefreshCw size={14} />
                          REINSTATE / CONFIRM ACTIVE
                        </button>
                      )}

                      {/* Cancel Booking session */}
                      {selectedBooking.status !== 'cancelled' && (
                        <button
                          onClick={() => updateBookingField(selectedBooking, { status: 'cancelled' })}
                          className="w-full bg-amber-950/80 text-amber-500 border border-amber-900 hover:bg-amber-900 hover:text-pure-white font-headline text-sm font-bold tracking-wider py-2 rounded flex items-center justify-center gap-2 transition"
                        >
                          <XCircle size={15} />
                          VOID / CANCEL BOOKING
                        </button>
                      )}

                      {/* Live Firestore Document PURGE */}
                      <button
                        onClick={() => handleDeleteBooking(selectedBooking.id)}
                        className="w-full bg-deep-void hover:bg-electric-ruby/10 text-on-surface-variant hover:text-electric-ruby border border-surface-container-highest hover:border-electric-ruby/60 font-headline text-sm font-bold tracking-wider py-2 rounded flex items-center justify-center gap-2 transition"
                      >
                        <Trash2 size={14} />
                        DELETE RECORD FROM DB
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-on-surface-variant/30 font-mono">
              <BookOpen className="mx-auto text-on-surface-variant/20 mb-3 animate-pulse" size={40} />
              <p className="text-sm">SELECT A BOOKING IN THE REGISTRY TABLE TO DECRYPT DATA AND COMMAND OVERRIDES.</p>
              <div className="mt-4 border border-dashed border-surface-container-highest p-3 rounded inline-block text-[11px] text-on-surface-variant/50 max-w-xs text-left leading-normal">
                💡 Admin commands write-sync directly with the <b>hotboxgaming</b> Firebase project. Select a record to toggle payments from unpaid to settled.
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
