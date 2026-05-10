"use client";

import { create } from "zustand";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  isLocating: boolean;
  locationError: string | null;
  isVerified: boolean;
  distance: number | null;
}

interface AttendanceState {
  location: LocationState;
  isMarkingAttendance: boolean;
  lastResult: {
    success: boolean;
    message: string;
    geofenceVerified: boolean;
    distance?: number;
  } | null;

  setLocation: (lat: number, lng: number, accuracy: number) => void;
  setLocating: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;
  setLocationVerified: (verified: boolean, distance?: number) => void;
  setMarkingAttendance: (loading: boolean) => void;
  setLastResult: (result: AttendanceState["lastResult"]) => void;
  resetLocation: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  location: {
    latitude: null,
    longitude: null,
    accuracy: null,
    isLocating: false,
    locationError: null,
    isVerified: false,
    distance: null,
  },
  isMarkingAttendance: false,
  lastResult: null,

  setLocation: (lat, lng, accuracy) =>
    set((s) => ({
      location: { ...s.location, latitude: lat, longitude: lng, accuracy, locationError: null, isLocating: false },
    })),

  setLocating: (loading) =>
    set((s) => ({ location: { ...s.location, isLocating: loading } })),

  setLocationError: (error) =>
    set((s) => ({ location: { ...s.location, locationError: error, isLocating: false } })),

  setLocationVerified: (verified, distance) =>
    set((s) => ({ location: { ...s.location, isVerified: verified, distance: distance ?? null } })),

  setMarkingAttendance: (loading) => set({ isMarkingAttendance: loading }),

  setLastResult: (result) => set({ lastResult: result }),

  resetLocation: () =>
    set({
      location: {
        latitude: null,
        longitude: null,
        accuracy: null,
        isLocating: false,
        locationError: null,
        isVerified: false,
        distance: null,
      },
    }),
}));
