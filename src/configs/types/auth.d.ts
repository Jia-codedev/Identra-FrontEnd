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
    scheduledgeocoordinates: [number, number] | null;
    radius: number;
    email: string | null;
    isGeofence: boolean;
    role: string;
  }
}

export {};
