declare global {
  interface IAuth {
    login: string;
    password: string;
    rememberMe: boolean;
  }
  interface IUser {
    employeename: {
      firsteng: string;
      lasteng: string;
      firstarb: string;
      lastarb: string;
    };
    employeenumber: number;
    scheduledgeocoordinates: [number, number] | null; // or a more specific type if known
    radius: number;
    email: string | null;
    isGeofence: boolean;
    role: string;
  }
}

export {};
