import React, { useState, useEffect } from 'react';
import { StationType, Booking } from '../types';
import { CheckCircle2, User, HelpCircle, Calendar, ShieldCheck, CreditCard, Smartphone, Building2 } from 'lucide-react';

interface BookingSectionProps {
  selectedStationType: StationType;
  onStationTypeChange: (type: StationType) => void;
  onNewBookingCreated: (booking: Booking) => void;
}

const PRICING_MAP: Record<StationType, number> = {
  '240HZ GAMING PC': 150,
  'PS5 LOUNGE': 120,
};

export default function BookingSection({ 
  selectedStationType = '240HZ GAMING PC', 
  onStationTypeChange, 
  onNewBookingCreated 
}: BookingSectionProps) {
  
  // Field Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('14:00 - 16:00');
  const [hours, setHours] = useState(2);
  const [missionDetails, setMissionDetails] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'after_booking'>('after_booking');
  
  // Gateway states
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [razorpayMethod, setRazorpayMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [razorpayPhone, setRazorpayPhone] = useState('');
  const [razorpayCardNo, setRazorpayCardNo] = useState('4111 2222 3333 4444');
  const [razorpayCardExpiry, setRazorpayCardExpiry] = useState('12/28');
  const [razorpayCardCvv, setRazorpayCardCvv] = useState('123');
  const [razorpayUpiId, setRazorpayUpiId] = useState('');
  const [razorpayBank, setRazorpayBank] = useState('SBI');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  // Dialog/Outcome states
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Price estimate calculations
  const pricePerHour = PRICING_MAP[selectedStationType] || 150;
  const estimatedCost = pricePerHour * hours;

  // Sync state if selectedStationType is mutated externally
  const handleTypeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStationTypeChange(e.target.value as StationType);
  };

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingUnit: Booking = {
      id: `booking-${Date.now()}`,
      firstName,
      lastName,
      email,
      stationType: selectedStationType,
      date,
      timeSlot,
      hours,
      missionDetails,
      paymentMethod,
      estimatedCost,
      timestamp: Date.now(),
      status: 'confirmed'
    };

    if (paymentMethod === 'razorpay') {
      // Trigger simulated Razorpay Modal
      setRazorpayPhone(phone || '9876543210');
      setShowRazorpay(true);
      return;
    }

    // Direct booking flow
    onNewBookingCreated(bookingUnit);
    setCreatedBooking(bookingUnit);
    setIsSuccess(true);
    setMissionDetails('');
  };

  const executeSimulatedRazorpayPayment = () => {
    setIsProcessingPayment(true);
    
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentSuccess(true);
      
      setTimeout(() => {
        // Complete the reservation
        const bookingUnit: Booking = {
          id: `booking-${Date.now()}`,
          firstName,
          lastName,
          email,
          stationType: selectedStationType,
          date,
          timeSlot,
          hours,
          missionDetails,
          paymentMethod: 'razorpay',
          estimatedCost,
          timestamp: Date.now(),
          status: 'confirmed'
        };

        onNewBookingCreated(bookingUnit);
        setCreatedBooking(bookingUnit);
        setShowRazorpay(false);
        setIsSuccess(true);
        setIsPaymentSuccess(false);
        setMissionDetails('');
      }, 1500);
    }, 1500);
  };

  const closeOutcomeModal = () => {
    setIsSuccess(false);
    setCreatedBooking(null);
  };

  // Preset tomorrow as default reservation date
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    setDate(dateString);
  }, []);

  return (
    <section id="booking" className="py-24 px-6 md:px-20 bg-surface-container-low scroll-mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Reservation details description pane - Left */}
        <div>
          <p className="font-mono text-xs text-electric-ruby tracking-[0.4em] uppercase mb-3">BOOK YOUR SESSION</p>
          <h2 className="font-headline text-headline-xl text-pure-white mb-6 uppercase tracking-tighter italic">
            RESERVE YOUR <span className="text-electric-ruby font-extrabold shadow-sm">STATION</span>
          </h2>
          <p className="font-sans text-on-surface-variant text-base md:text-lg mb-8 leading-relaxed font-normal">
            Secure a high-performance 240Hz PC gaming setup at Arcadia's premier lounge. Whether training with your squad or gaming solo, choose your hours and book instantly. No complex terms.
          </p>

          <ul className="space-y-4 mb-10">
            <li className="flex items-center gap-3 text-on-surface font-headline font-semibold tracking-wider text-base sm:text-lg uppercase">
              <CheckCircle2 size={20} className="text-electric-ruby shrink-0" />
              <span>REAL-TIME SEAT ASSIGNMENT</span>
            </li>
            <li className="flex items-center gap-3 text-on-surface font-headline font-semibold tracking-wider text-base sm:text-lg uppercase">
              <CheckCircle2 size={20} className="text-electric-ruby shrink-0" />
              <span>SMOOTH 240HZ REFRESH RUNTIMES</span>
            </li>
            <li className="flex items-center gap-3 text-on-surface font-headline font-semibold tracking-wider text-base sm:text-lg uppercase">
              <CheckCircle2 size={20} className="text-electric-ruby shrink-0" />
              <span>PAY VIA RAZORPAY OR PAY ON ARRIVAL</span>
            </li>
          </ul>

          <div className="p-6 border-l-4 border-electric-ruby bg-electric-ruby/5 rounded-r">
            <p className="font-mono text-[10px] text-electric-ruby mb-1.5 tracking-widest uppercase font-semibold">PRICING RATE</p>
            <p className="font-headline text-5xl text-pure-white font-extrabold font-black">
              ₹{pricePerHour} <span className="text-lg font-sans text-on-surface-variant font-normal">/ HOUR</span>
            </p>
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-on-surface-variant/60">
              <span>HOURS SELECTED: {hours}H</span>
              <span className="text-emerald-400 font-bold">TOTAL ESTIMATED COST: ₹{estimatedCost}</span>
            </div>
          </div>
        </div>

        {/* Dynamic booking sheet form - Right */}
        <div className="glass-panel p-6 sm:p-10 rounded-lg neon-border-ruby">
          <form onSubmit={handleFormSubmission} className="space-y-6">
            
            {/* Double Column name controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase block">
                  FIRST NAME
                </label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Aarav"
                  required
                  className="w-full bg-deep-void border border-surface-variant focus:border-electric-ruby focus:ring-0 text-pure-white rounded py-2.5 px-4 transition-all focus:outline-none placeholder-white/10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase block">
                  LAST NAME
                </label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Kudva"
                  required
                  className="w-full bg-deep-void border border-surface-variant focus:border-electric-ruby focus:ring-0 text-pure-white rounded py-2.5 px-4 transition-all focus:outline-none placeholder-white/10"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase block">
                EMAIL ADDRESS
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. customer@mumbai.com"
                required
                className="w-full bg-deep-void border border-surface-variant focus:border-electric-ruby focus:ring-0 text-pure-white rounded py-2.5 px-4 transition-all focus:outline-none placeholder-white/10"
              />
            </div>

            {/* Phone Number input */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase block">
                PHONE NUMBER
              </label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 98765 43210"
                required
                className="w-full bg-deep-void border border-surface-variant focus:border-electric-ruby focus:ring-0 text-pure-white rounded py-2.5 px-4 transition-all focus:outline-none placeholder-white/10"
              />
            </div>

            {/* Configuration Details Grid (Station Type Selector) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase block">
                  STATION RIG
                </label>
                <select
                  value={selectedStationType}
                  onChange={(e) => onStationTypeChange(e.target.value as StationType)}
                  className="w-full bg-deep-void border border-surface-variant focus:border-electric-ruby focus:ring-0 text-pure-white rounded py-2.5 px-4 transition-all uppercase text-xs font-bold"
                >
                  <option value="240HZ GAMING PC">240HZ GAMING PC (₹150/hr)</option>
                  <option value="PS5 LOUNGE">PS5 LOUNGE BAY (₹120/hr)</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase block">
                  BOOKING DATE
                </label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-deep-void border border-surface-variant focus:border-electric-ruby focus:ring-0 text-pure-white rounded py-2.5 px-4 transition-all text-sm"
                />
              </div>
            </div>

            {/* Time Slot & Multiplication hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase block">
                  TIME SLOT
                </label>
                <select 
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-deep-void border border-surface-variant focus:border-electric-ruby focus:ring-0 text-pure-white rounded py-2.5 px-4 transition-all"
                >
                  <option value="10:00 - 12:00">10:00 - 12:00 (MORNING GRIND)</option>
                  <option value="12:00 - 14:00">12:00 - 14:00 (MIDDAY SHOOTOUT)</option>
                  <option value="14:00 - 16:00">14:00 - 16:00 (AFTERNOON LAN)</option>
                  <option value="16:00 - 18:00">16:00 - 18:00 (PRIME HOUR)</option>
                  <option value="18:00 - 20:00">18:00 - 20:00 (SUNSET SESSION)</option>
                  <option value="20:00 - 23:00">20:00 - 23:00 (NIGHT SQUAD)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase block">
                  DURATION ({hours} Hours)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 4, 8].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setHours(val)}
                      className={`flex-1 py-2 rounded font-mono text-xs border ${
                        hours === val 
                          ? 'bg-electric-ruby border-electric-ruby text-pure-white font-bold' 
                          : 'bg-black/40 border-surface-variant text-on-surface-variant hover:text-white hover:border-white/20'
                      }`}
                    >
                      {val}H
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mission Details notes */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase block">
                SPECIAL COMMENTS / PREFERRED GAMES
              </label>
              <textarea 
                rows={2}
                value={missionDetails}
                onChange={(e) => setMissionDetails(e.target.value)}
                placeholder="Any special requests or pre-installed games?"
                className="w-full bg-deep-void border border-surface-variant focus:border-electric-ruby focus:ring-0 text-pure-white rounded py-2.5 px-4 transition-all placeholder-white/5"
              />
            </div>

            {/* Payment options design cards */}
            <div className="space-y-3">
              <label className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase block">
                PAYMENT OPTION
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="relative flex flex-col p-4 cursor-pointer bg-deep-void border border-surface-variant rounded-lg hover:border-electric-ruby/50 transition-all">
                  <input 
                    type="radio" 
                    name="payment_method" 
                    value="razorpay" 
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="sr-only"
                  />
                  <span className={`font-headline text-lg font-extrabold uppercase italic ${paymentMethod === 'razorpay' ? 'text-electric-ruby' : 'text-on-surface'}`}>
                    PAY VIA RAZORPAY
                  </span>
                  <span className="text-[10px] font-mono text-on-surface-variant/60 uppercase">Instant Payment</span>
                  {paymentMethod === 'razorpay' && (
                    <div className="absolute inset-0 border-2 border-electric-ruby rounded-lg pointer-events-none shadow-[0_0_15px_rgba(0,255,102,0.3)] duration-200" />
                  )}
                </label>
                
                <label className="relative flex flex-col p-4 cursor-pointer bg-deep-void border border-surface-variant rounded-lg hover:border-electric-ruby/50 transition-all">
                  <input 
                    type="radio" 
                    name="payment_method" 
                    value="after_booking" 
                    checked={paymentMethod === 'after_booking'}
                    onChange={() => setPaymentMethod('after_booking')}
                    className="sr-only"
                  />
                  <span className={`font-headline text-lg font-extrabold uppercase italic ${paymentMethod === 'after_booking' ? 'text-electric-ruby' : 'text-on-surface'}`}>
                    PAY AFTER BOOKING
                  </span>
                  <span className="text-[10px] font-mono text-on-surface-variant/60 uppercase">Pay at Lounge</span>
                  {paymentMethod === 'after_booking' && (
                    <div className="absolute inset-0 border-2 border-electric-ruby rounded-lg pointer-events-none shadow-[0_0_15px_rgba(0,255,102,0.3)] duration-200" />
                  )}
                </label>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-electric-ruby text-deep-void font-headline text-xl font-bold py-4 rounded hover:brightness-110 active:scale-95 transition-all duration-200 uppercase tracking-wide italic shadow-[0_0_15px_rgba(0,255,102,0.4)] md:cursor-pointer"
            >
              {paymentMethod === 'razorpay' ? 'PROCEED TO PAY WITH RAZORPAY' : 'CONFIRM RESERVATION'}
            </button>
          </form>
        </div>
      </div>

      {/* RAZORPAY PAYMENT GATEWAY GATE-PASS OVERLAY MODAL */}
      {showRazorpay && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden font-sans border border-blue-500/20">
            {/* Razorpay Banner Header */}
            <div className="bg-[#0b1e4a] py-6 px-6 text-white relative">
              <button 
                onClick={() => setShowRazorpay(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-sans text-xs font-bold text-blue-400 uppercase tracking-wide">ARCADIA GAMING LOUNGE</h4>
                  <p className="text-xl font-semibold mt-1">₹{estimatedCost}.00</p>
                </div>
                <div className="text-right">
                  <span className="bg-blue-600/30 text-blue-300 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-500/20">TEST MODE</span>
                  <p className="text-[10px] text-gray-400 mt-1">{email}</p>
                </div>
              </div>
            </div>

            {/* Checkout Body */}
            <div className="p-6 space-y-6">
              
              {isProcessingPayment ? (
                <div className="py-12 flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-[#117bf3] border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <h5 className="font-semibold text-lg text-gray-800">Processing secure payment...</h5>
                    <p className="text-xs text-gray-500 mt-1">Refrain from reloading or navigating back.</p>
                  </div>
                </div>
              ) : isPaymentSuccess ? (
                <div className="py-12 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl animate-bounce">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-xl text-green-600">Payment Successful!</h5>
                    <p className="text-xs text-gray-500 mt-1">Transaction ID: pay_sim_{Math.floor(Math.random() * 900000) + 100000}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Contact Number Prefill */}
                  <div className="p-3 bg-gray-50 rounded border border-gray-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-gray-400 block uppercase font-bold text-[9px]">Contact Mobile</span>
                      <span className="text-gray-800 font-semibold">{razorpayPhone}</span>
                    </div>
                    <button 
                      onClick={() => {
                        const newP = prompt("Enter mobile number:", razorpayPhone);
                        if(newP) setRazorpayPhone(newP);
                      }} 
                      className="text-[#117bf3] hover:underline font-semibold"
                    >
                      Change
                    </button>
                  </div>

                  {/* Tab options for payment type */}
                  <div className="border-b border-gray-100 flex text-center">
                    <button 
                      type="button" 
                      onClick={() => setRazorpayMethod('upi')}
                      className={`flex-1 pb-3 text-xs font-semibold border-b-2 flex flex-col items-center gap-1 transition-all ${razorpayMethod === 'upi' ? 'border-[#117bf3] text-[#117bf3]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                      <Smartphone size={16} />
                      UPI / QR
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setRazorpayMethod('card')}
                      className={`flex-1 pb-3 text-xs font-semibold border-b-2 flex flex-col items-center gap-1 transition-all ${razorpayMethod === 'card' ? 'border-[#117bf3] text-[#117bf3]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                      <CreditCard size={16} />
                      Card
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setRazorpayMethod('netbanking')}
                      className={`flex-1 pb-3 text-xs font-semibold border-b-2 flex flex-col items-center gap-1 transition-all ${razorpayMethod === 'netbanking' ? 'border-[#117bf3] text-[#117bf3]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                      <Building2 size={16} />
                      Netbanking
                    </button>
                  </div>

                  {/* Tab Body Contents */}
                  <div className="min-h-[140px] flex flex-col justify-center">
                    {razorpayMethod === 'upi' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                          <button 
                            type="button" 
                            onClick={() => setRazorpayUpiId('customer@gpay')} 
                            className="p-2 border border-gray-200 rounded text-center text-xs hover:border-[#117bf3]/50 hover:bg-gray-50 flex flex-col items-center gap-1 font-medium"
                          >
                            <span className="text-blue-500 font-extrabold text-[10px]">Google Pay</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setRazorpayUpiId('customer@ybl')} 
                            className="p-2 border border-gray-200 rounded text-center text-xs hover:border-[#117bf3]/50 hover:bg-gray-50 flex flex-col items-center gap-1 font-medium"
                          >
                            <span className="text-purple-600 font-extrabold text-[10px]">PhonePe</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setRazorpayUpiId('customer@paytm')} 
                            className="p-2 border border-gray-200 rounded text-center text-xs hover:border-[#117bf3]/50 hover:bg-gray-50 flex flex-col items-center gap-1 font-medium"
                          >
                            <span className="text-sky-500 font-extrabold text-[10px]">Paytm</span>
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          <input 
                            type="text" 
                            value={razorpayUpiId}
                            onChange={(e) => setRazorpayUpiId(e.target.value)}
                            placeholder="Enter custom UPI ID (e.g. name@okhdfc)"
                            className="w-full text-xs text-gray-800 border border-gray-200 rounded p-2.5 outline-none focus:border-[#117bf3]"
                          />
                        </div>
                      </div>
                    )}

                    {razorpayMethod === 'card' && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 uppercase font-medium">Card Number</span>
                          <input 
                            type="text" 
                            value={razorpayCardNo}
                            onChange={(e) => setRazorpayCardNo(e.target.value)}
                            className="w-full text-xs text-gray-800 border border-gray-200 rounded p-2 outline-none focus:border-[#117bf3] font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 uppercase font-medium">Expiry Date</span>
                            <input 
                              type="text" 
                              value={razorpayCardExpiry}
                              onChange={(e) => setRazorpayCardExpiry(e.target.value)}
                              className="w-full text-xs text-gray-800 border border-gray-200 rounded p-2 outline-none focus:border-[#117bf3] text-center font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 uppercase font-medium">Card CVV</span>
                            <input 
                              type="password" 
                              value={razorpayCardCvv}
                              onChange={(e) => setRazorpayCardCvv(e.target.value)}
                              className="w-full text-xs text-gray-800 border border-gray-200 rounded p-2 outline-none focus:border-[#117bf3] text-center font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {razorpayMethod === 'netbanking' && (
                      <div className="space-y-4">
                        <label className="text-[10px] text-gray-400 uppercase font-medium block">Select Preferred Bank</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['SBI', 'HDFCB', 'ICICI', 'AXIS', 'PNB', 'KOTAK'].map((bankOpt) => (
                            <button
                              key={bankOpt}
                              type="button"
                              onClick={() => setRazorpayBank(bankOpt)}
                              className={`p-2 rounded border text-xs font-bold transition-all text-center ${razorpayBank === bankOpt ? 'bg-blue-50 border-[#117bf3] text-[#117bf3]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                              {bankOpt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pay button */}
                  <button
                    type="button"
                    onClick={executeSimulatedRazorpayPayment}
                    className="w-full bg-[#117bf3] hover:bg-blue-600 text-white font-sans text-sm font-bold py-3.5 rounded transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>PAY ₹{estimatedCost}.00 SECURELY</span>
                  </button>
                </>
              )}
            </div>

            {/* Bottom secure layout bar */}
            <div className="bg-gray-50 border-t border-gray-100 py-3.5 px-6 flex items-center justify-center text-[10px] text-gray-400 gap-1.5">
              <ShieldCheck size={14} className="text-green-500" />
              <span>Secure checkout powered by Razorpay. SSL encrypted.</span>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog Modal window */}
      {isSuccess && createdBooking && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-surface-container border border-surface-container-highest p-6 md:p-8 rounded-lg shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <span className="text-5xl text-emerald-500 mb-4 block">🔥</span>
            <h4 className="font-headline text-3xl text-pure-white uppercase italic tracking-tight mb-2 text-center">BOOKING SUCCESSFUL</h4>
            <div className="w-16 h-0.5 bg-electric-ruby mx-auto mb-6"></div>

            <div className="bg-black/40 border border-white/5 p-4 rounded-md text-left space-y-2 mb-6 font-mono text-xs text-on-surface-variant leading-relaxed">
              <p>• <strong className="text-white">NAME:</strong> {createdBooking.firstName} {createdBooking.lastName}</p>
              <p>• <strong className="text-white">STATION TYPE:</strong> {createdBooking.stationType}</p>
              <p>• <strong className="text-white">BOOKING DATE:</strong> {createdBooking.date}</p>
              <p>• <strong className="text-white">HOURS:</strong> {createdBooking.hours} Hours ({createdBooking.timeSlot})</p>
              <p>• <strong className="text-white">PAYMENT METHOD:</strong> {createdBooking.paymentMethod === 'razorpay' ? 'Paid via Razorpay' : 'Pay After Booking (at lounge)'}</p>
              <p>• <strong className="text-white">TOTAL VALUE:</strong> <span className="text-emerald-400 font-bold">₹{createdBooking.estimatedCost}</span></p>
            </div>

            <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-6">
              Your PC is successfully reserved. Please arrive 10 minutes prior to your selected time slot to inspect the hardware.
            </p>

            <button 
              onClick={closeOutcomeModal}
              className="w-full bg-electric-ruby text-deep-void font-headline text-base font-bold py-3 rounded active:scale-95 transition-all uppercase cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
