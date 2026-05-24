/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StationType = '240HZ GAMING PC' | 'PS5 LOUNGE';

export interface HardwareDetails {
  cpu: string;
  gpu: string;
  ram: string;
  monitor: string;
  peripherals: string;
}

export interface GamingStation {
  id: string;
  name: string;
  type: StationType;
  tag: string;
  image: string;
  description: string;
  pricePerHour: number;
  specs: string[];
  hardware: HardwareDetails;
  status: 'available' | 'occupied' | 'maintenance';
}

export interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  stationType: StationType;
  date: string;
  timeSlot: string;
  hours: number;
  missionDetails: string;
  paymentMethod: 'razorpay' | 'after_booking';
  estimatedCost: number;
  timestamp: number;
  status: 'confirmed' | 'cancelled' | 'completed';
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  date: string;
  time: string;
  prizePool: string;
  format: string;
  slotsTotal: number;
  slotsRegistered: number;
  participants: string[];
  status: 'registering' | 'ongoing' | 'completed';
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  stationType: StationType;
  gamePlayed: string;
}
