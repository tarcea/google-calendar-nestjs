export type BookingContent = {
  title: string;
  startTime: string;
  endTime: string;
  location: {
    address: string;
    postalCode: string;
    city: string;
    geo?: { lat: number; lon: number };
  };
};
