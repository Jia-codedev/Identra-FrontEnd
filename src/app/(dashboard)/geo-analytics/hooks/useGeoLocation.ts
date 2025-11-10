"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { UserLocation } from "../types";

// Debounce threshold in milliseconds
const LOCATION_UPDATE_INTERVAL = 5000; // Update every 5 seconds
const MIN_DISTANCE_CHANGE = 10; // Only update if moved more than 10 meters

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

export const useGeoLocation = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const watchIdRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const lastLocationRef = useRef<UserLocation | null>(null);

  const shouldUpdateLocation = useCallback((newLocation: UserLocation): boolean => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;

    // Always update if it's the first location
    if (!lastLocationRef.current) {
      return true;
    }

    // Only update if enough time has passed
    if (timeSinceLastUpdate < LOCATION_UPDATE_INTERVAL) {
      return false;
    }

    // Check if user has moved significantly
    const distance = calculateDistance(
      lastLocationRef.current.latitude,
      lastLocationRef.current.longitude,
      newLocation.latitude,
      newLocation.longitude
    );

    // Only update if moved more than minimum distance
    return distance > MIN_DISTANCE_CHANGE;
  }, []);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // First get current position immediately
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setUserLocation(location);
        lastLocationRef.current = location;
        lastUpdateTimeRef.current = Date.now();
        setError(null);
        setIsLoading(false);
      },
      (error) => {
        setError(`Error getting location: ${error.message}`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false, // Use false for better performance
        timeout: 10000,
        maximumAge: 30000, // Cache for 30 seconds
      }
    );

    // Then watch for position changes with less aggressive settings
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        // Only update if location changed significantly
        if (shouldUpdateLocation(location)) {
          setUserLocation(location);
          lastLocationRef.current = location;
          lastUpdateTimeRef.current = Date.now();
          setError(null);
        }
        setIsLoading(false);
      },
      (error) => {
        setError(`Error getting location: ${error.message}`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false, // Use false for better battery and performance
        timeout: 10000,
        maximumAge: 30000, // Cache position for 30 seconds
      }
    );

    watchIdRef.current = id;
  }, [shouldUpdateLocation]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const getCurrentLocation = useCallback((): Promise<UserLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000, // Allow cached position up to 5 seconds old
        }
      );
    });
  }, []);

  useEffect(() => {
    startWatching();

    return () => {
      stopWatching();
    };
  }, [startWatching, stopWatching]);

  return {
    userLocation,
    error,
    isLoading,
    startWatching,
    stopWatching,
    getCurrentLocation,
  };
};
