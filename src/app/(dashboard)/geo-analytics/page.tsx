"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, AlertCircle } from "lucide-react";
import GeoMap from "./components/GeoMap";
import LocationInfo from "./components/LocationInfo";
import PunchControl from "./components/PunchControl";
import { useGeoLocation } from "./hooks/useGeoLocation";
import { useGeoFence } from "./hooks/useGeoFence";
import { ScheduleLocation } from "./types";
import { useUserStore } from "@/store/userStore";
import { useTranslations } from "@/hooks/use-translations";

function GeoAnalyticsPage() {
  const { t } = useTranslations();
  const [scheduleLocation, setScheduleLocation] =
    useState<ScheduleLocation | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const user = useUserStore((state) => state.user);
  const isGeofenceEnabled = user?.isGeofence ?? false;

  const {
    userLocation,
    error: locationError,
    isLoading: isLoadingLocation,
  } = useGeoLocation();

  // Memoize geoFenceStatus to prevent recalculation on every render
  const geoFenceStatus = useGeoFence(scheduleLocation, userLocation);

  // Memoize schedule location setup to prevent unnecessary recalculations
  useEffect(() => {
    if (!user) {
      setScheduleError(t("geoAnalytics.errors.userDataNotAvailable"));
      setScheduleLocation(null);
      return;
    }

    if (!isGeofenceEnabled) {
      setScheduleError(t("geoAnalytics.errors.geofencingNotEnabled"));
      setScheduleLocation(null);
      return;
    }

    if (
      !user.scheduledgeocoordinates ||
      user.scheduledgeocoordinates.length !== 2
    ) {
      setScheduleError(t("geoAnalytics.errors.noCoordinates"));
      setScheduleLocation(null);
      return;
    }

    const [latitude, longitude] = user.scheduledgeocoordinates;

    // Only update if coordinates or radius changed
    setScheduleLocation((prev) => {
      if (
        prev &&
        prev.latitude === latitude &&
        prev.longitude === longitude &&
        prev.radius === (user.radius || 100)
      ) {
        return prev; // No change needed
      }

      return {
        location_id: 0, // Not needed from store
        location_code: "user-schedule",
        location_eng: t("geoAnalytics.locationInfo.scheduleLocation.title"),
        location_arb: t("geoAnalytics.locationInfo.scheduleLocation.title"),
        radius: user.radius || 100,
        geolocation: `${latitude},${longitude}`,
        latitude,
        longitude,
      };
    });
    setScheduleError(null);
  }, [user?.scheduledgeocoordinates, user?.radius, isGeofenceEnabled, t, user]);

  return (
    <div className="py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MapPin className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{t("geoAnalytics.title")}</h1>
          <p className="text-gray-500 text-sm">{t("geoAnalytics.subtitle")}</p>
        </div>
      </div>

      {scheduleError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{scheduleError}</AlertDescription>
        </Alert>
      )}

      {locationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Map Section - Takes 2 columns on large screens */}
        <div className="xl:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t("geoAnalytics.map.title")}</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {scheduleLocation || userLocation ? (
                <GeoMap
                  scheduleLocation={scheduleLocation}
                  userLocation={userLocation}
                  isWithinRadius={geoFenceStatus.isWithinRadius}
                />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[500px] bg-gray-100 rounded-lg">
                  <p className="text-gray-600">Loading location data...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Punch Control Section - Takes 1 column */}
        <div className="space-y-4">
          <PunchControl
            isWithinRadius={geoFenceStatus.isWithinRadius}
            userLocation={userLocation}
            disabled={isLoadingLocation || !scheduleLocation}
          />
        </div>
      </div>

      {/* Location Information Cards */}
      <LocationInfo
        scheduleLocation={scheduleLocation}
        userLocation={userLocation}
        geoFenceStatus={geoFenceStatus}
        isLoadingLocation={isLoadingLocation}
        locationError={locationError}
      />
    </div>
  );
}

export default GeoAnalyticsPage;
