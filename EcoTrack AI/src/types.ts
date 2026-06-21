/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Activity {
  id: string;
  type: 'transport' | 'food' | 'energy' | 'water' | 'other';
  name: string;
  value: number; // impact in kg CO2e (negative is reduction, positive is addition)
  detail: string;
  date: string;
}

export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  badgeText?: string;
  badgeSave?: string;
}

export interface Challenge {
  id: string;
  title: string;
  subtitle: string;
  category: 'daily' | 'weekly' | 'monthly';
  points: number;
  progress: number;
  target: number;
  unit: string;
  joined: boolean;
  completed: boolean;
  icon: string;
}

export interface Badge {
  id: string;
  title: string;
  level: number;
  progress: number; // percentage 0-100
  icon: string;
  color: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  level: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export interface CalculatorData {
  vehicleType: 'electric' | 'gasoline' | 'hybrid' | 'public';
  distance: number;
  electricity: number;
  diet: 'meat' | 'vegetarian' | 'vegan';
  flightHours: number;
}
