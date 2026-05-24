/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StationType = '240HZ GAMING PC' | 'PS5 LOUNGE';

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
