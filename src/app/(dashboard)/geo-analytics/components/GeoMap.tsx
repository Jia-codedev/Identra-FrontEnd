"use client";
import React, { useEffect, useState } from "react";
import { ScheduleLocation, UserLocation } from "../types";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

interface GeoMapProps {
  scheduleLocation: ScheduleLocation | null;
  userLocation: UserLocation | null;
  isWithinRadius: boolean;
}

const defaultCenter: [number, number] = [11.84042, 79.706314];
const GeoMap: React.FC<GeoMapProps> = React.memo(
  ({ scheduleLocation, userLocation, isWithinRadius }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [customIcons, setCustomIcons] = useState<{
      scheduleIcon: any;
      userIcon: any;
    } | null>(null);

    useEffect(() => {
      setIsMounted(true);
      if (typeof window !== "undefined") {
        import("leaflet").then((L) => {
          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            iconUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          });
          const scheduleIcon = new L.Icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

          const userIcon = new L.Icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
            shadowUrl:
              "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

          setCustomIcons({ scheduleIcon, userIcon });
        });
      }
    }, []);

    const mapCenter: [number, number] = React.useMemo(() => {
      if (scheduleLocation?.latitude && scheduleLocation?.longitude) {
        return [scheduleLocation.latitude, scheduleLocation.longitude];
      }
      if (userLocation) {
        return [userLocation.latitude, userLocation.longitude];
      }
      return defaultCenter;
    }, [
      scheduleLocation?.latitude,
      scheduleLocation?.longitude,
      userLocation?.latitude,
      userLocation?.longitude,
    ]);

    if (!isMounted) {
      return (
        <div className="flex items-center justify-center h-full min-h-[500px] bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading map...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full min-h-[500px] rounded-lg overflow-hidden">
        <style jsx global>{`
          @import url("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");

          .leaflet-container {
            height: 100%;
            width: 100%;
            min-height: 500px;
            border-radius: 0.5rem;
          }

          /* Hide Leaflet attribution and branding */
          .leaflet-control-attribution {
            display: none !important;
          }

          .leaflet-bottom.leaflet-right {
            display: none !important;
          }
        `}</style>

        <MapContainer
          className="z-0"
          center={mapCenter}
          zoom={15}
          style={{ height: "100%", width: "100%", minHeight: "500px" }}
          attributionControl={false}
          zoomControl={true}
        >
          <TileLayer
            attribution=""
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {scheduleLocation?.latitude &&
            scheduleLocation?.longitude &&
            customIcons && (
              <>
                <Marker
                  position={[
                    scheduleLocation.latitude,
                    scheduleLocation.longitude,
                  ]}
                  icon={customIcons.scheduleIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>Schedule Location</strong>
                      <br />
                      {scheduleLocation.location_eng}
                      <br />
                      {scheduleLocation.location_arb}
                    </div>
                  </Popup>
                </Marker>

                {/* Radius Circle - Shows allowed geo-fence area */}
                <Circle
                  center={[
                    scheduleLocation.latitude,
                    scheduleLocation.longitude,
                  ]}
                  radius={scheduleLocation.radius || 100}
                  pathOptions={{
                    fillColor: isWithinRadius ? "#4ade80" : "#f87171",
                    fillOpacity: 0.3,
                    color: isWithinRadius ? "#22c55e" : "#ef4444",
                    weight: 3,
                    opacity: 0.9,
                  }}
                />
              </>
            )}
          {userLocation && customIcons && (
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={customIcons.userIcon}
            >
              <Popup>
                <div className="text-sm">
                  <strong>Your Location</strong>
                  <br />
                  Lat: {userLocation.latitude.toFixed(6)}
                  <br />
                  Lng: {userLocation.longitude.toFixed(6)}
                  <br />
                  Accuracy: ±{Math.round(userLocation.accuracy)}m
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md text-xs z-[1000] space-y-1">
          <div className="font-semibold text-gray-700 mb-2">Map Legend:</div>
          <div className="flex items-center gap-2">
            <div className="w-3 text-black h-3 rounded-full bg-blue-500"></div>
            <span className="text-black">Schedule Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 text-black h-3 rounded-full bg-red-500"></div>
            <span className="text-black">Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full border-2 ${
                isWithinRadius
                  ? "border-green-500 bg-green-100"
                  : "border-red-500 bg-red-100"
              }`}
            ></div>
            <span className="text-black">
              Allowed Radius ({scheduleLocation?.radius || 100}m)
            </span>
          </div>
        </div>
      </div>
    );
  }
);

GeoMap.displayName = "GeoMap";

export default GeoMap;
