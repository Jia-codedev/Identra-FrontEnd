export interface ScheduleLocation {
  location_id: number;
  location_code: string;
  location_eng: string;
  location_arb: string;
  city?: string;
  region_name?: string;
  country_code?: string;
  radius?: number;
  geolocation?: string;
  latitude?: number;
  longitude?: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface GeoFenceStatus {
  isWithinRadius: boolean;
  distance: number;
  scheduleLocation: ScheduleLocation | null;
}

export interface PunchEvent {
  event_type: "IN" | "OUT";
  timestamp: Date;
  location: UserLocation;
}
