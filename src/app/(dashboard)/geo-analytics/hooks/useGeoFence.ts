"use client";
import { useMemo } from "react";
import { ScheduleLocation, UserLocation, GeoFenceStatus } from "../types";

/**
 * Calculate distance between two points using Haversine formula
 * @returns distance in meters
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Parse geolocation string to extract latitude and longitude
 * Format: "latitude,longitude" or "longitude latitude"
 */
const parseGeolocation = (
  geolocation?: string
): { lat: number; lng: number } | null => {
  if (!geolocation) return null;

  try {
    // Try comma-separated format first
    if (geolocation.includes(",")) {
      const [lat, lng] = geolocation
        .split(",")
        .map((s) => parseFloat(s.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }

    // Try space-separated format
    const parts = geolocation.trim().split(/\s+/);
    if (parts.length === 2) {
      const [lng, lat] = parts.map((s) => parseFloat(s));
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
  } catch (error) {
    console.error("Error parsing geolocation:", error);
  }

  return null;
};

export const useGeoFence = (
  scheduleLocation: ScheduleLocation | null,
  userLocation: UserLocation | null
): GeoFenceStatus => {
  const geoFenceStatus = useMemo((): GeoFenceStatus => {
    if (!scheduleLocation || !userLocation) {
      return {
        isWithinRadius: false,
        distance: 0,
        scheduleLocation: null,
      };
    }

    // Parse the geolocation string from schedule location
    const scheduleCoords = parseGeolocation(scheduleLocation.geolocation);

    if (!scheduleCoords) {
      return {
        isWithinRadius: false,
        distance: 0,
        scheduleLocation,
      };
    }

    // Calculate distance between user and schedule location
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      scheduleCoords.lat,
      scheduleCoords.lng
    );

    // Check if user is within the allowed radius (default to 100 meters if not specified)
    const allowedRadius = scheduleLocation.radius || 100;
    const isWithinRadius = distance <= allowedRadius;

    return {
      isWithinRadius,
      distance,
      scheduleLocation: {
        ...scheduleLocation,
        latitude: scheduleCoords.lat,
        longitude: scheduleCoords.lng,
      },
    };
  }, [scheduleLocation, userLocation]);

  return geoFenceStatus;
};
