/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GamingStation, Tournament, Review } from './types';

export const INITIAL_STATIONS: GamingStation[] = [
  {
    id: 'station-alpha',
    name: 'PREMIUM 240HZ GAMING PC',
    type: '240HZ GAMING PC',
    tag: 'HIGH-END ESPORTS RIG',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4DyPS87Wb7bu5p0NRSIy9psrl3jhPIkoiy90WykR8kzWwyaIW4UgpmbJ2WAn_uWxYcm3RzytDUrPWX1NSpJNIwRnfpnzb_IjZqVFzk5hy_DM5iBaxwujEZCJfLTBJPqDeXomInjqT1vatMFr0IMpNmcSb4yg1fnfq8Wd9Texxb02pL70AZS1neRCUM1KGNFXv5vnREvjyNCfimLno4x_UlfUYj2u9mmdxPrg5mI9PZjJQF4sNOe2jwnnCXrKnSGV3asAbsbqpm9Q',
    description: 'Equipped with NVIDIA RTX 4070/4090, 240Hz Gaming Monitors, and high-performance mechanical peripherals.',
    pricePerHour: 150,
    specs: [
      'Intel Core i9-14900K Processor',
      'NVIDIA GeForce RTX 4090 (24GB VRAM)',
      '64GB Kingston FURY DDR5 RAM',
      'BenQ ZOWIE 24.5" 240Hz esports Monitor',
      'Custom Mechanical Keyboard & Logitech G Pro X Superlight'
    ],
    hardware: {
      cpu: 'i9-14900K @ 5.8 GHz',
      gpu: 'RTX 4090 (24GB GDDR6X)',
      ram: '64GB DDR5 6000MHz Dual-Channel',
      monitor: 'BenQ ZOWIE XL2546K esports 240Hz',
      peripherals: 'Logitech G Pro X Superlight, Razer Huntsman V3 Pro'
    },
    status: 'available'
  },
  {
    id: 'console-elite',
    name: 'PS5 LOUNGE BAYS',
    type: 'PS5 LOUNGE',
    tag: 'CONSOLE ELITE',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uj7cdE2ISO5IvqciEnJJTxeSVWDh65UHdRD_2_Xu4uWc8lFnOlOoXcfMQMemZIzXEdnzNBCtOsVND43aLtT0iAQTKmX803NwOBrADuyc8k1xj73aedqxriDe229uPtoIlak_18yrkvKzFIiJSuLRZLLg92poaObb-SBVE25FiHhck9s005ok_PcQpKp9U0Unv8LDBfxAZpOlqgA6KskQRx2DI9WE8csvqdn-q_XHf004ASUowG8BS012tY',
    description: '4K HDR Cinema displays and plush seating for immersive campaign marathons and local multiplayer.',
    pricePerHour: 120,
    specs: [
      'PlayStation 5 Disc Edition Console',
      'Sony Bravia XR 55" 4K HDR High-Refresh TV',
      'Dolby Atmos 5.1 Dynamic Surround Theatre Sound',
      'Plush Italian Leather Recliners with cup holders',
      'DualSense Wireless & Pro Controllers'
    ],
    hardware: {
      cpu: 'Custom AMD Zen 2 (8 Cores)',
      gpu: 'Custom AMD RDNA 2 Graphics Engine',
      ram: '16GB GDDR6 Unified System RAM',
      monitor: 'Sony Bravia XR 55" XR-55X90K (120Hz, 4K)',
      peripherals: '2x DualSense Wireless, Astro A40 TR Headset'
    },
    status: 'available'
  }
];

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'tourney-1',
    title: 'MUMBAI VALORANT CLASH',
    game: 'Valorant',
    date: '2026-06-12',
    time: '14:00',
    prizePool: '₹50,000 INR',
    format: '5v5 Double Elimination',
    slotsTotal: 16,
    slotsRegistered: 12,
    participants: ['Sky Esports Clan', 'A1 Gaming', 'Vanguard Esports', 'Mumbai Mavericks'],
    status: 'registering'
  },
  {
    id: 'tourney-2',
    title: 'FIFA 26 INDIVIDUAL CUP',
    game: 'EA Sports FC 26',
    date: '2026-06-19',
    time: '11:00',
    prizePool: '₹20,000 INR',
    format: '1v1 Single Elimination',
    slotsTotal: 32,
    slotsRegistered: 24,
    participants: ['RonaldoFan99', 'FC_GamerX', 'Aman_FC'],
    status: 'registering'
  },
  {
    id: 'tourney-3',
    title: 'COUNTER-STRIKE 2 SHOWDOWN',
    game: 'Counter-Strike 2',
    date: '2026-06-25',
    time: '16:00',
    prizePool: '₹30,000 INR',
    format: '5v5 Single Elimination',
    slotsTotal: 16,
    slotsRegistered: 8,
    participants: ['Delta Squad', 'Mumbai Kings', 'FragMasters'],
    status: 'registering'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'review-1',
    author: 'Rajesh Kumar',
    rating: 5,
    text: 'RTX 4090 and 240Hz monitors are absolutely mental. I played CS2 with effectively zero input latency. Staff are very helpful and the place is comfortable!',
    date: 'May 18, 2026',
    stationType: '240HZ GAMING PC',
    gamePlayed: 'Counter-Strike 2'
  },
  {
    id: 'review-2',
    author: 'Alisha Gomes',
    rating: 5,
    text: 'The PS5 lounge bays are amazing. Very comfortable leather chairs, dual controllers, and a great screen. Perfect for a FC 26 or Tekken 8 local session with friends.',
    date: 'May 22, 2026',
    stationType: 'PS5 LOUNGE',
    gamePlayed: 'EA Sports FC 26'
  },
  {
    id: 'review-3',
    author: 'Kabir Sen',
    rating: 5,
    text: 'The PCs here are professional esports level. Playing Dota 2 at consistent high frames makes a massive difference. Highly recommended.',
    date: 'May 23, 2026',
    stationType: '240HZ GAMING PC',
    gamePlayed: 'Dota 2'
  }
];
