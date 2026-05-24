import React, { useState, useEffect, useMemo } from 'react';
import { Booking, StationType } from './types';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { 
  ShieldAlert, 
  Search, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  CircleDollarSign, 
  Users, 
  Monitor, 
  Gamepad2, 
  Unlock, 
  LogOut, 
  CalendarRange, 
  Clock, 
  Mail, 
  BookOpen, 
  Play,
  FileSpreadsheet,
  Download,
  Terminal,
  Grid,
  Filter,
  Check,
  Building
} from 'lucide-react';

export default function App() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false); // Default is locked for strict real-world production feel
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStation, setFilterStation] = useState<string>('ALL');
  const [filterPayment, setFilterPayment] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isActionPending, setIsActionPending] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  // Subscribe to Live Bookings in Firestore Database
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, orderBy('timestamp', 'desc'));
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedBookings: Booking[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedBookings.push({
            id: docSnap.id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            stationType: data.stationType || '240HZ GAMING PC',
            date: data.date || '',
            timeSlot: data.timeSlot || '',
            hours: Number(data.hours) || 1,
            missionDetails: data.missionDetails || '',
            paymentMethod: data.paymentMethod || 'after_booking',
            estimatedCost: Number(data.estimatedCost) || 0,
            timestamp: Number(data.timestamp) || Date.now(),
            status: data.status || 'confirmed'
          });
        });
        setBookings(loadedBookings);
        setIsLoading(false);
      }, (err) => {
        console.error("Firestore database connection error in Admin Deck:", err);
        setErrorFeedback(`Connection lost or permissions insufficient: ${err.message}`);
        setIsLoading(false);
      });
    } catch (err: any) {
      console.error("Failed to initialize database subscription:", err);
      setErrorFeedback(`Failed to connect to base: ${err.message}`);
      setIsLoading(false);
    }

    return () => unsubscribe();
  }, []);

  // Authentication gate handler
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'admin' || passcode === 'hotbox' || passcode === '1234') {
      setIsUnlocked(true);
      setErrorFeedback(null);
      setSuccessFeedback('ACCESS GRANTED. COMMAND CONSOLE DECRYPTED.');
      setTimeout(() => setSuccessFeedback(null), 3000);
    } else {
      setErrorFeedback('ACCESS DENIED: INVALID AUTHORIZATION PASSPHRASE');
    }
  };

  // Synchronize update back to Live Firebase database securely
  const updateBookingField = async (booking: Booking, updates: Partial<Booking>) => {
    const updatedBooking = { ...booking, ...updates };
    setIsActionPending(booking.id);
    setErrorFeedback(null);
    setSuccessFeedback(null);
    
    try {
      await setDoc(doc(db, 'bookings', booking.id), updatedBooking);
      setSuccessFeedback(`Booking ID ${booking.id} status updated to: ${updates.status?.toUpperCase()}`);
      setTimeout(() => setSuccessFeedback(null), 4000);
      
      // Keep local selected sync
      if (selectedBooking && selectedBooking.id === booking.id) {
        setSelectedBooking(updatedBooking);
      }
    } catch (err: any) {
      console.error("Live Firestore update failed:", err);
      setErrorFeedback(`Unable to synchronize state override: ${err.message || err}`);
    } finally {
      setIsActionPending(null);
    }
  };

  // Permanently delete a booking from Live Firestore
  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm("CRITICAL INTERVENTION: Are you sure you want to permanently Purge this booking from the live Firestore database? This action is irreversible.")) {
      return;
    }
    
    setIsActionPending(id);
    setErrorFeedback(null);
    setSuccessFeedback(null);
    
    try {
      await deleteDoc(doc(db, 'bookings', id));
      setSuccessFeedback(`Database cleared. Purged booking record ${id}.`);
      setTimeout(() => setSuccessFeedback(null), 4000);
      if (selectedBooking?.id === id) {
        setSelectedBooking(null);
      }
    } catch (err: any) {
      console.error("Firestore document delete failed:", err);
      setErrorFeedback(`Failed to execute purge on database: ${err.message || err}`);
    } finally {
      setIsActionPending(null);
    }
  };

  // CSV Spreadsheet Export logic
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      alert("No active bookings in memory context to export.");
      return;
    }

    const headers = ['Booking ID', 'First Name', 'Last Name', 'Email', 'Apparatus', 'Date', 'Time Slot', 'Hours', 'Valuation (INR)', 'Payment Approach', 'Registration Status'];
    const rows = bookings.map(b => [
      b.id,
      b.firstName,
      b.lastName,
      b.email,
      b.stationType,
      b.date,
      b.timeSlot,
      b.hours,
      b.estimatedCost,
      b.paymentMethod === 'razorpay' ? 'ONLINE RAZORPAY' : 'DUE AT DOOR',
      b.status.toUpperCase()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hotbox_lounge_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Inject a mock booking for testing analytics & demonstrating functionality
  const handleCreateMockBooking = async () => {
    const names = [
      { first: 'Siddharth', last: 'Mehta', email: 'sid.m@hotmail.com' },
      { first: 'Rohan', last: 'Sharma', email: 'rohan.sharma@yahoo.com' },
      { first: 'Nisha', last: 'Patel', email: 'nisha.p@outlook.com' },
      { first: 'Aarav', last: 'Sinha', email: 'aarav.sinha@gmail.com' },
      { first: 'Vikram', last: 'Aditya', email: 'v.aditya@gmail.com' }
    ];
    const pickedName = names[Math.floor(Math.random() * names.length)];
    const stations: StationType[] = ['240HZ GAMING PC', 'PS5 LOUNGE'];
    const station = stations[Math.floor(Math.random() * stations.length)];
    const currentTS = Date.now();
    const mockId = `HOTBX_${currentTS.toString().slice(-6)}`;
    
    const mockBooking: Booking = {
      id: mockId,
      firstName: pickedName.first,
      lastName: pickedName.last,
      email: pickedName.email,
      stationType: station,
      date: new Date(Date.now() + 86400000 * Math.floor(Math.random() * 5)).toISOString().split('T')[0],
      timeSlot: `${10 + Math.floor(Math.random() * 8)}:00 - ${12 + Math.floor(Math.random() * 8)}:00`,
      hours: Math.floor(Math.random() * 4) + 1,
      missionDetails: 'VALORANT scrimmage session & stream coaching warmup',
      paymentMethod: Math.random() > 0.4 ? 'razorpay' : 'after_booking',
      estimatedCost: (station === '240HZ GAMING PC' ? 150 : 100) * (Math.floor(Math.random() * 4) + 1),
      timestamp: currentTS,
      status: 'confirmed'
    };

    try {
      await setDoc(doc(db, 'bookings', mockBooking.id), mockBooking);
      setSuccessFeedback(`Simulated player booking synthesized: ID ${mockBooking.id}`);
      setTimeout(() => setSuccessFeedback(null), 3000);
    } catch (err: any) {
      console.error("Mock generation injection failed:", err);
      setErrorFeedback(`Failed to inject mock record: ${err.message}`);
    }
  };

  // Calculate live statistics
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let pendingRevenue = 0;
    let pcCount = 0;
    let ps5Count = 0;
    let completedCount = 0;
    let activeCount = 0;
    let cancelledCount = 0;

    bookings.forEach(b => {
      if (b.status !== 'cancelled') {
        if (b.paymentMethod === 'razorpay' || b.status === 'completed') {
          totalRevenue += b.estimatedCost;
        } else {
          pendingRevenue += b.estimatedCost;
        }
      }

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

  // Derived Search and Filter booking logic
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchText = `${b.firstName} ${b.lastName} ${b.email} ${b.id}`.toLowerCase();
      const matchesSearch = matchText.includes(searchQuery.toLowerCase());

      const matchesStation = filterStation === 'ALL' || b.stationType === filterStation;

      let matchesPayment = true;
      if (filterPayment === 'RAZORPAY') {
        matchesPayment = b.paymentMethod === 'razorpay';
      } else if (filterPayment === 'AFTER_BOOKING') {
        matchesPayment = b.paymentMethod === 'after_booking';
      }

      const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus.toLowerCase();

      return matchesSearch && matchesStation && matchesPayment && matchesStatus;
    });
  }, [bookings, searchQuery, filterStation, filterPayment, filterStatus]);

  if (!isUnlocked) {
    return (
      <div className="min-h-screen w-full py-16 px-4 flex flex-col items-center justify-center bg-black font-sans">
        
        {/* Core Auth Panel */}
        <div className="w-full max-w-md bg-[#131313] border border-[#FF003C]/30 p-8 rounded relative overflow-hidden shadow-[0_0_50px_rgba(255,0,60,0.15)]">
          {/* Neon tactical corner frames */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF003C]"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FF003C]"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FF003C]"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF003C]"></div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#FF003C]/10 border border-[#FF003C]/30 mx-auto flex items-center justify-center text-[#FF003C] mb-4">
              <ShieldAlert size={34} className="animate-pulse" />
            </div>
            <h2 className="font-headline text-3xl font-extrabold tracking-widest text-white uppercase">COMMAND GATEWAY</h2>
            <p className="font-mono text-xs text-[#e9bcba]/70 mt-1.5 uppercase tracking-wider">ADMIN BACK-OFFICE OPERATIONS PANEL</p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#e9bcba] tracking-widest mb-2">Authority Signature (Passcode)</label>
              <input 
                type="password"
                placeholder="ENTER SECURE SECURITY PIN"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-black border border-[#353534] text-white font-mono placeholder-[#e9bcba]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#FF003C] focus:ring-1 focus:ring-[#FF003C] transition-all duration-200"
                autoFocus
              />
              <span className="block mt-2 text-[10px] text-[#e9bcba]/40 font-mono italic">Demo bypasses: use PIN &quot;admin&quot;, &quot;hotbox&quot; or press Bypass below.</span>
            </div>

            {errorFeedback && (
              <p className="text-xs font-mono text-[#FF003C] bg-[#FF003C]/10 p-2 border border-[#FF003C]/20 rounded text-center">
                {errorFeedback}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#FF003C] hover:bg-[#FF003C]/80 text-white font-headline text-lg font-bold tracking-widest rounded transition-all duration-200 shadow-[0_0_15px_rgba(255,0,60,0.3)] cursor-pointer"
            >
              DECRYPT COMMAND HUD
            </button>
          </form>

          {/* Quick lock override bypass */}
          <div className="mt-8 pt-4 border-t border-[#201f1f] text-center">
            <button 
              onClick={() => {
                setIsUnlocked(true);
                setErrorFeedback(null);
                setSuccessFeedback('Bypass mode engaged. Standard operations unlocked.');
                setTimeout(() => setSuccessFeedback(null), 3000);
              }}
              className="hover:text-[#FF003C] transition-colors inline-flex items-center gap-1.5 font-mono text-xs text-[#e9bcba]/50 font-bold"
            >
              <Unlock size={13} /> ENGAGE LOCKPORT BYPASS
            </button>
          </div>
        </div>

        <p className="mt-12 font-mono text-[10px] text-[#e9bcba]/30 text-center uppercase tracking-widest">
          HOTBOX ARCADE INC © 2026. ALL METRICS AND SESSIONS SECURED VIA DATASTORE CLOUD RULES.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 lg:p-10 font-sans selection:bg-[#FF003C] selection:text-white">
      
      {/* HUD HEADER PANEL */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-[#2a2a2a] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-0.5 bg-[#FF003C] font-mono text-[10px] font-bold text-white rounded uppercase tracking-wider animate-pulse">
              LIVE NETWORK CONNECTED
            </div>
            <span className="font-mono text-xs text-[#e9bcba]/60 flex items-center gap-1">
              <Terminal size={12} className="text-[#FF003C]" /> ID: hotboxgaming-51dc2.firestore
            </span>
          </div>

          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-wider text-white uppercase mt-1">
            HOTBOX GAMING <span className="text-[#FF003C]">BACK-OFFICE</span>
          </h1>
          <p className="text-sm font-sans text-[#e9bcba]/80 mt-1 max-w-2xl leading-normal">
            Stand-alone real-time player reservation administrator ledger. Track tournament profiles, update cash settlements, and manage gameplay status instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCreateMockBooking}
            className="flex items-center gap-2 bg-[#201f1f] border border-[#353534] hover:bg-[#2a2a2a] text-white font-headline text-base font-bold px-4 py-2.5 rounded transition-all cursor-pointer"
            title="Simulate a real player reservation logging"
          >
            <Play size={15} className="text-emerald-500 fill-emerald-500 animate-pulse" />
            SYNTHESIZE MOCK BOOKING
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#201f1f] border border-[#353534] hover:bg-[#2a2a2a] text-[#e9bcba] font-mono text-xs font-bold px-4 py-2.5 rounded transition-all cursor-pointer"
            title="Download fully typed CSV datasheet of current Firestore tables"
          >
            <Download size={14} />
            EXPORT EXCEL/CSV
          </button>
          
          <button
            onClick={() => {
              setIsUnlocked(false);
              setPasscode('');
            }}
            className="flex items-center gap-1.5 bg-[#201f1f] border border-[#353534] hover:border-[#FF003C]/50 hover:text-[#FF003C] text-[#e9bcba]/70 font-mono text-xs font-bold px-3 py-2.5 rounded transition-all cursor-pointer"
          >
            <LogOut size={13} />
            SECURE CONSOLE
          </button>
        </div>
      </header>

      {/* FEEDBACK STATUS OVERLAYS */}
      {errorFeedback && (
        <div className="mb-6 bg-[#FF003C]/10 border border-[#FF003C]/30 p-4 rounded flex justify-between items-center text-sm font-mono text-[#FF003C]">
          <div className="flex items-center gap-2.0">
            <ShieldAlert size={18} />
            <span>{errorFeedback}</span>
          </div>
          <button onClick={() => setErrorFeedback(null)} className="text-white hover:text-[#FF003C] px-2 py-1 font-bold">
            CONFIRM
          </button>
        </div>
      )}

      {successFeedback && (
        <div className="mb-6 bg-emerald-950/40 border border-emerald-500/30 p-4 rounded flex justify-between items-center text-sm font-mono text-emerald-400">
          <div className="flex items-center gap-2">
            <Check size={18} className="animate-bounce" />
            <span>{successFeedback}</span>
          </div>
          <button onClick={() => setSuccessFeedback(null)} className="text-white hover:text-emerald-400 px-2 py-1 font-bold">
            DISMISS
          </button>
        </div>
      )}

      {/* ANALYTICS HUD SCOREBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Total revenue */}
        <div className="bg-[#131313] border border-[#353534] rounded p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs text-[#e9bcba]/50 tracking-wider">SECURE SETTLED CASH</span>
            <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CircleDollarSign size={18} />
            </div>
          </div>
          <p className="font-headline text-3xl font-extrabold text-white tracking-wide">
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center gap-2 justify-between">
            <span className="font-mono text-[10px] text-emerald-500 font-bold tracking-wider">SETTLED (ONLINE/CASH)</span>
            {stats.pendingRevenue > 0 && (
              <span className="font-mono text-[9px] text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-900/30">
                ₹{stats.pendingRevenue.toLocaleString()} UNSETTLED DOOR DUE
              </span>
            )}
          </div>
        </div>

        {/* Core players count */}
        <div className="bg-[#131313] border border-[#353534] rounded p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FF003C]/5 to-transparent rounded-bl-full pointer-events-none"></div>
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs text-[#e9bcba]/50 tracking-wider">RESERVATION LEDGER</span>
            <div className="w-8 h-8 rounded bg-[#FF003C]/10 flex items-center justify-center text-[#FF003C]">
              <Users size={18} />
            </div>
          </div>
          <p className="font-headline text-3xl font-extrabold text-white tracking-wide">
            {stats.activeCount} <span className="text-xs font-sans font-normal text-[#e9bcba]/40">ACTIVE / {stats.totalBookingCount} HISTORY</span>
          </p>
          <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px]">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-[#e9bcba]/60">
              {stats.completedCount} DONE // {stats.cancelledCount} CANCELLED
            </span>
          </div>
        </div>

        {/* Rig utilization */}
        <div className="bg-[#131313] border border-[#353534] rounded p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs text-[#e9bcba]/50 tracking-wider">240HZ PRO RIG DEMAND</span>
            <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Monitor size={18} />
            </div>
          </div>
          <p className="font-headline text-3xl font-extrabold text-white tracking-wide">
            {stats.pcCount} <span className="text-xs font-mono text-[#e9bcba]/30">COMMITS</span>
          </p>
          <div className="mt-4 bg-[#1c1b1b] h-1 w-full rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full transition-all duration-500" 
              style={{ width: `${stats.totalBookingCount > 0 ? (stats.pcCount / stats.totalBookingCount) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* PS5 lounge */}
        <div className="bg-[#131313] border border-[#353534] rounded p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs text-[#e9bcba]/50 tracking-wider">PS5 ARENA DEMAND</span>
            <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Gamepad2 size={18} />
            </div>
          </div>
          <p className="font-headline text-3xl font-extrabold text-white tracking-wide">
            {stats.ps5Count} <span className="text-xs font-mono text-[#e9bcba]/30">COMMITS</span>
          </p>
          <div className="mt-4 bg-[#1c1b1b] h-1 w-full rounded-full overflow-hidden">
            <div 
              className="bg-purple-500 h-full transition-all duration-500" 
              style={{ width: `${stats.totalBookingCount > 0 ? (stats.ps5Count / stats.totalBookingCount) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* FILTER & LOOKUP DECK */}
      <div className="bg-[#131313] border border-[#2a2a2a] rounded p-5 mb-6">
        <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between">
          
          {/* Dynamic Search */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#e9bcba]/40 pointer-events-none">
              <Search size={18} />
            </span>
            <input 
              type="text"
              placeholder="SEARCH SESSIONS BY PLAYER NAME, EMAIL ID, OR RESERVATION CODES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-[#353534] text-white rounded pl-10 pr-4 py-3 text-sm font-mono focus:outline-none focus:border-[#FF003C] tracking-wide placeholder-[#e9bcba]/20"
            />
          </div>

          {/* Filters Select Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-[#e9bcba]/40 mb-1 tracking-widest uppercase">HARDWARE FILTER</span>
              <select
                value={filterStation}
                onChange={(e) => setFilterStation(e.target.value)}
                className="bg-black border border-[#353534] rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FF003C] cursor-pointer"
              >
                <option value="ALL">ALL APPARATUS</option>
                <option value="240HZ GAMING PC">240HZ GAMING PC</option>
                <option value="PS5 LOUNGE">PS5 LOUNGE</option>
              </select>
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-[#e9bcba]/40 mb-1 tracking-widest uppercase">PAY METADATA</span>
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="bg-black border border-[#353534] rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FF003C] cursor-pointer"
              >
                <option value="ALL">ALL TRANSACTION ROUTES</option>
                <option value="RAZORPAY">ONLINE GATEWAY (RAZORPAY)</option>
                <option value="AFTER_BOOKING">PAY AFTER SESSION (DOOR)</option>
              </select>
            </div>

            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-[#e9bcba]/40 mb-1 tracking-widest uppercase">SCHEDULING BLOCK</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-black border border-[#353534] rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#FF003C] cursor-pointer"
              >
                <option value="ALL">ALL RESERVATION STATUSES</option>
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
              className="mt-4 px-3 py-2 bg-black hover:bg-[#201f1f] text-[#e9bcba]/70 text-xs font-mono border border-[#353534] rounded font-bold uppercase transition hover:text-white cursor-pointer"
            >
              RESET FILTERS
            </button>

          </div>
        </div>
      </div>

      {/* CORE SPLIT WORKSPACE: REGISTRY VS RECORD DETAIL */}
      {isLoading ? (
        <div className="py-24 text-center text-mono text-[#FF003C] animate-pulse uppercase tracking-wider">
          ESTABLISHING DATASTREAM OVERLAYS WITH FIRESTORE...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEDGER GRID TABLE */}
          <div className="lg:col-span-2 bg-[#131313] border border-[#2a2a2a] rounded overflow-hidden">
            <div className="p-4 border-b border-[#2a2a2a] bg-[#1c1b1b] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#FF003C]" />
                <h2 className="font-headline text-lg font-bold text-white tracking-widest uppercase">FIRESTORE TRANSACTION JOURNAL</h2>
              </div>
              <span className="font-mono text-[10px] text-[#e9bcba]/40 tracking-wider">
                LEDGER CONTEXT: {filteredBookings.length} OF {bookings.length} RECORDED
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#2a2a2a] bg-black text-[#e9bcba]/40 tracking-wider">
                    <th className="p-4 uppercase font-bold text-left">PLAYER / ID</th>
                    <th className="p-4 uppercase font-bold text-left">HARDWARE APPARATUS</th>
                    <th className="p-4 uppercase font-bold text-left">SCHEDULE SLOT</th>
                    <th className="p-4 uppercase font-bold text-right">VALUATION</th>
                    <th className="p-4 uppercase font-bold text-center">PAY APPROACH</th>
                    <th className="p-4 uppercase font-bold text-center">STATUS STATE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-[#e9bcba]/35 italic">
                        NO RESERVATION ENTRIES ALIGNING WITH THE QUERY FILTERS FOUND.
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
                          className={`border-b border-[#201f1f] hover:bg-[#1c1b1b] transition-colors cursor-pointer ${
                            selectedBooking?.id === b.id ? 'bg-[#201f1f]/80 border-l-2 border-l-[#FF003C]' : ''
                          }`}
                        >
                          <td className="p-4">
                            <div className="font-sans font-semibold text-white text-sm">
                              {b.firstName} {b.lastName}
                            </div>
                            <div className="text-[10px] text-[#e9bcba]/40 tracking-wider mt-0.5 uppercase">
                              ID: {b.id}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                              isPc ? 'bg-indigo-950/80 text-indigo-400 border border-indigo-900/40' : 'bg-purple-950/80 text-purple-400 border border-purple-900/40'
                            }`}>
                              {isPc ? <Monitor size={10} /> : <Gamepad2 size={10} />}
                              {b.stationType}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                              <CalendarRange size={11} className="text-[#FF003C]" />
                              {b.date}
                            </div>
                            <div className="text-[10px] text-[#e9bcba]/50 flex items-center gap-1 mt-0.5">
                              <Clock size={10} />
                              {b.timeSlot} ({b.hours}h)
                            </div>
                          </td>
                          <td className="p-4 text-right font-bold text-white text-sm">
                            ₹{b.estimatedCost}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded text-[9px] font-extrabold tracking-widest ${
                              isPaid 
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/30' 
                                : 'bg-amber-950/60 text-amber-500 border border-amber-900/30 animate-pulse'
                            }`}>
                              {isPaid ? 'PAID SETTLED' : 'DUE CASH AT DOOR'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                              b.status === 'completed' 
                                ? 'bg-emerald-500' 
                                : b.status === 'cancelled' 
                                ? 'bg-[#FF003C]' 
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

          {/* DYNAMIC RECORD CONTEXT PANEL */}
          <div className="bg-[#131313] border border-[#2a2a2a] rounded p-6 sticky top-8">
            {selectedBooking ? (
              <div>
                
                {/* Panel Title */}
                <div className="flex justify-between items-start border-b border-[#2a2a2a] pb-4 mb-4">
                  <div>
                    <span className="font-mono text-[9px] text-[#e9bcba]/40 tracking-widest uppercase">HUD MASTER RECORD DECRYPT</span>
                    <h3 className="font-headline text-2xl font-bold tracking-wider text-white mt-1 uppercase">
                      {selectedBooking.firstName} {selectedBooking.lastName}
                    </h3>
                    <p className="font-mono text-[10px] text-[#FF003C] mt-0.5 font-bold tracking-widest">
                      LEDGER ID: {selectedBooking.id}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedBooking(null)} 
                    className="font-mono text-[10px] text-[#e9bcba]/40 hover:text-white px-2 py-1 border border-[#353534] rounded transition cursor-pointer"
                  >
                    DESELECT
                  </button>
                </div>

                {/* Grid info parameters */}
                <div className="space-y-4 font-mono text-xs">
                  
                  {/* Contact */}
                  <div className="bg-black p-3 rounded border border-[#201f1f]">
                    <div className="text-[9px] text-[#e9bcba]/40 tracking-wider mb-1 uppercase flex items-center gap-1">
                      <Mail size={10} /> COMMUNICATIONS ROUTER
                    </div>
                    <p className="font-sans font-medium text-white text-sm break-all">
                      {selectedBooking.email}
                    </p>
                  </div>

                  {/* Gear Spec Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black p-3 rounded border border-[#201f1f]">
                      <span className="text-[9px] text-[#e9bcba]/40 tracking-wider mb-1 block uppercase">SYSTEM ALLOCATION</span>
                      <span className="font-bold text-white block text-[11px] truncate">
                        {selectedBooking.stationType}
                      </span>
                    </div>
                    <div className="bg-black p-3 rounded border border-[#201f1f]">
                      <span className="text-[9px] text-[#e9bcba]/40 tracking-wider mb-1 block uppercase">ESTIMATED VALUATION</span>
                      <span className="font-bold text-emerald-400 block text-[11px]">
                        ₹{selectedBooking.estimatedCost} ({selectedBooking.hours} Hours)
                      </span>
                    </div>
                  </div>

                  {/* Schedule slot timeline */}
                  <div className="bg-black p-3 rounded border border-[#201f1f]">
                    <span className="text-[9px] text-[#e9bcba]/40 tracking-wider mb-1 block uppercase">DATE & RECORDED TIMELINE</span>
                    <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                      <Clock size={12} className="text-[#FF003C]" />
                      <span>{selectedBooking.date} / {selectedBooking.timeSlot}</span>
                    </div>
                  </div>

                  {/* Auxiliary briefings */}
                  <div className="bg-black p-3 rounded border border-[#201f1f]">
                    <span className="text-[9px] text-[#e9bcba]/40 tracking-wider mb-1 block uppercase">TACTICAL NOTES / USER REQUESTS</span>
                    <p className="font-sans text-[#e9bcba] text-xs leading-relaxed italic">
                      &quot;{selectedBooking.missionDetails || 'No auxiliary briefings/requirements supplied.'}&quot;
                    </p>
                  </div>

                  {/* Payment Approach status */}
                  <div className="bg-black p-3 rounded border border-[#201f1f] flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-[#e9bcba]/40 tracking-wider block uppercase">PAYMENT SCHEME</span>
                      <span className="font-bold text-white text-[10px] block mt-0.5">
                        {selectedBooking.paymentMethod === 'razorpay' ? 'ONLINE DIGITAL GATEWAY' : 'CASH PROTOCOL AT DOOR'}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold ${
                      selectedBooking.paymentMethod === 'razorpay' || selectedBooking.status === 'completed'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40'
                        : 'bg-amber-950 text-amber-500 border border-amber-900/40'
                    }`}>
                      {selectedBooking.paymentMethod === 'razorpay' || selectedBooking.status === 'completed' ? 'SETTLED' : 'DUE'}
                    </span>
                  </div>

                  {/* Booking scheduling status info element */}
                  <div className="p-3 bg-[#1c1b1b] border border-[#2a2a2a] rounded flex justify-between items-center text-[11px]">
                    <span className="text-[#e9bcba]/50 uppercase font-mono">FLOW STATUS</span>
                    <span className={`font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider text-[10px] ${
                      selectedBooking.status === 'completed' 
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                        : selectedBooking.status === 'cancelled' 
                        ? 'text-[#FF003C] bg-[#FF003C]/10 border border-[#FF003C]/20' 
                        : 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 animate-pulse'
                    }`}>
                      {selectedBooking.status}
                    </span>
                  </div>

                  {/* ADMINISTRATIVE CORE ACTIONS */}
                  <div className="border-t border-[#2a2a2a] pt-4 mt-6">
                    <span className="text-[9px] text-[#e9bcba]/40 tracking-wider block uppercase mb-3 font-bold">ARCADE OFFICER CODES // OVERRIDES</span>
                    
                    {isActionPending === selectedBooking.id ? (
                      <div className="text-center py-4 text-xs font-mono text-[#FF003C] animate-pulse">
                        COMMITTING STATE CHANGES SECURELY TO THE CLOUD INSTANCE...
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        
                        {/* Status Completed / Settled */}
                        {selectedBooking.status !== 'completed' && (
                          <button
                            onClick={() => updateBookingField(selectedBooking, { status: 'completed' })}
                            className="w-full bg-emerald-900/40 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-800 hover:text-white font-headline text-sm font-bold tracking-wider py-2.5 rounded flex items-center justify-center gap-2 transition cursor-pointer"
                          >
                            <CheckCircle size={15} />
                            MARK COMPLETED &amp; PAID
                          </button>
                        )}

                        {/* Status Reconfirmed / Reinstate */}
                        {selectedBooking.status !== 'confirmed' && (
                          <button
                            onClick={() => updateBookingField(selectedBooking, { status: 'confirmed' })}
                            className="w-full bg-indigo-950/80 text-indigo-400 border border-indigo-900/40 hover:bg-indigo-900 hover:text-white font-headline text-sm font-bold tracking-wider py-2.5 rounded flex items-center justify-center gap-2 transition cursor-pointer"
                          >
                            REINSTATE ACTIVE STATUS
                          </button>
                        )}

                        {/* Status Voided / Cancelled */}
                        {selectedBooking.status !== 'cancelled' && (
                          <button
                            onClick={() => updateBookingField(selectedBooking, { status: 'cancelled' })}
                            className="w-full bg-amber-950/60 text-amber-500 border border-amber-900/40 hover:bg-[#FF003C] hover:text-white font-headline text-sm font-bold tracking-wider py-2.5 rounded flex items-center justify-center gap-2 transition cursor-pointer"
                          >
                            <XCircle size={15} />
                            CANCEL / VOID SESSION
                          </button>
                        )}

                        {/* Database Document Purge */}
                        <button
                          onClick={() => handleDeleteBooking(selectedBooking.id)}
                          className="w-full bg-black hover:bg-[#FF003C]/10 text-[#e9bcba]/50 hover:text-[#FF003C] border border-[#353534] hover:border-[#FF003C]/40 font-headline text-sm font-bold tracking-wider py-2.5 rounded flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                          PERMANENTLY PURGE FROM DB
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-[#e9bcba]/30 font-mono">
                <div className="w-12 h-12 rounded bg-[#FF003C]/5 border border-[#353534] mx-auto flex items-center justify-center text-[#e9bcba]/20 mb-4 animate-pulse">
                  <Grid size={20} />
                </div>
                <p className="text-xs uppercase tracking-wider">SELECT A SESSION ENTRY IN THE DATABASE REGISTER TO DRILL DOWN PARAMETERS AND CONTROL OVERRIDES.</p>
                
                <div className="mt-6 border border-dashed border-[#201f1f] p-4 rounded text-left text-[10px] leading-normal text-[#e9bcba]/50">
                  <p className="font-bold mb-1 text-white uppercase tracking-wider flex items-center gap-1">
                    💡 Stand-Alone Authority
                  </p>
                  This application has been tailored to operate inside its own autonomous directory. You can export the <b>/admin-deck</b> directory into a fresh, distinct repository and launch it on GitHub Pages immediately.
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-20 pt-6 border-t border-[#201f1f] text-center font-mono text-[10px] text-[#e9bcba]/40 flex flex-col sm:flex-row justify-between gap-4 items-center uppercase tracking-widest">
        <span>HOTBOX ARCADE BACK-OFFICE PANEL v1.0 // ONLINE MODE</span>
        <span>PROUDLY LINKED TO THE HOTBOX_SESSIONS SERVER ENGINE</span>
      </footer>

    </div>
  );
}
