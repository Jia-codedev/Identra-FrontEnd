declare global {
  interface IAuth {
    login: string;
    password: string;
    rememberMe: boolean;
  }
  interface IUser {
    userId: number;
    roleId: number;
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
