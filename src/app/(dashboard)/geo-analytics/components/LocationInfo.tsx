"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Radio, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { ScheduleLocation, UserLocation, GeoFenceStatus } from "../types";

interface LocationInfoProps {
  scheduleLocation: ScheduleLocation | null;
  userLocation: UserLocation | null;
  geoFenceStatus: GeoFenceStatus;
  isLoadingLocation: boolean;
  locationError: string | null;
}

const LocationInfo: React.FC<LocationInfoProps> = React.memo(
  ({
    scheduleLocation,
    userLocation,
    geoFenceStatus,
    isLoadingLocation,
    locationError,
  }) => {
    const formatDistance = (meters: number): string => {
      if (meters < 1000) {
        return `${Math.round(meters)} m`;
      }
      return `${(meters / 1000).toFixed(2)} km`;
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Schedule Location Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Schedule Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scheduleLocation ? (
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Location Name</p>
                  <p className="font-semibold">
                    {scheduleLocation.location_eng}
                  </p>
                  <p className="text-sm text-gray-600">
                    {scheduleLocation.location_arb}
                  </p>
                </div>

                {scheduleLocation.latitude && scheduleLocation.longitude && (
                  <div>
                    <p className="text-sm text-gray-500">Coordinates</p>
                    <p className="text-sm font-mono">
                      {scheduleLocation.latitude.toFixed(6)},{" "}
                      {scheduleLocation.longitude.toFixed(6)}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Allowed Radius</p>
                  <p className="font-semibold">
                    {scheduleLocation.radius || 100} meters
                  </p>
                </div>

                {scheduleLocation.city && (
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-semibold">{scheduleLocation.city}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No schedule location available
              </p>
            )}
          </CardContent>
        </Card>

        {/* User Location Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-red-500" />
              Your Current Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingLocation ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Detecting your location...</span>
              </div>
            ) : locationError ? (
              <div className="text-red-500 text-sm">
                <p className="font-semibold">Location Error</p>
                <p>{locationError}</p>
              </div>
            ) : userLocation ? (
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Coordinates</p>
                  <p className="text-sm font-mono">
                    {userLocation.latitude.toFixed(6)},{" "}
                    {userLocation.longitude.toFixed(6)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Accuracy</p>
                  <p className="font-semibold">
                    ±{Math.round(userLocation.accuracy)} meters
                  </p>
                </div>

                {scheduleLocation && geoFenceStatus.distance > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">
                      Distance from Schedule Location
                    </p>
                    <p className="font-semibold">
                      {formatDistance(geoFenceStatus.distance)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Location not available</p>
            )}
          </CardContent>
        </Card>

        {/* Geo-Fence Status Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {geoFenceStatus.isWithinRadius ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Geo-Fence Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scheduleLocation && userLocation ? (
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-lg ${
                    geoFenceStatus.isWithinRadius
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <p
                    className={`text-lg font-semibold ${
                      geoFenceStatus.isWithinRadius
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {geoFenceStatus.isWithinRadius
                      ? "✓ You are within the allowed area"
                      : "✗ You are outside the allowed area"}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      geoFenceStatus.isWithinRadius
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {geoFenceStatus.isWithinRadius
                      ? "You can punch in/out from this location"
                      : "Please move closer to the schedule location to punch in/out"}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="text-lg font-semibold">
                      {formatDistance(geoFenceStatus.distance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Allowed Radius</p>
                    <p className="text-lg font-semibold">
                      {scheduleLocation.radius || 100}m
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p
                      className={`text-lg font-semibold ${
                        geoFenceStatus.isWithinRadius
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {geoFenceStatus.isWithinRadius ? "Inside" : "Outside"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                {!scheduleLocation
                  ? "No schedule location configured"
                  : "Waiting for your location..."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
);

LocationInfo.displayName = "LocationInfo";

export default LocationInfo;
