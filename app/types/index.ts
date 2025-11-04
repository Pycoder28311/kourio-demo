// types.ts

export interface Service {
  id: number;
  name: string;
  price: number;
  durationMinutes: number;
  position: number; // <-- used for ordering
}

export interface ServiceCategory {
  id: number;
  name: string;
  services: Service[];
  position: number; // <-- used for ordering
}

export interface Barber {
  id: number;
  name: string;
  experience?: number;
  bio?: string;
  position: number; // <-- used for ordering
}

export interface AddingIds {
  serviceCategory: number[];
  services: number[];
  barbers: number[];
}