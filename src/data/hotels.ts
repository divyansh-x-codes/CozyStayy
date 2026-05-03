import h1 from "@/assets/hotel-1.jpg";
import h2 from "@/assets/hotel-2.jpg";
import h3 from "@/assets/hotel-3.jpg";
import h4 from "@/assets/hotel-4.jpg";

export type Hotel = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: string;
  image: string;
  images: string[];
  amenities: string[];
  isVerified: boolean;
  safetyScore: number;
  has360: boolean;
  description: string;
  rooms: { id: string; name: string; price: number; beds: string; size: string; guests: number; safety: number }[];
};

export const hotels: Hotel[] = [
  {
    id: "sea-breeze",
    name: "Sea Breeze Resort",
    location: "Calangute, Goa · Beachfront",
    price: 4290,
    rating: 4.8,
    reviews: "1.2K",
    image: h1,
    images: [h1, h2, h3],
    amenities: ["Free Wi-Fi", "Pool", "Breakfast", "Parking", "CCTV", "Verified Staff"],
    isVerified: true,
    safetyScore: 98,
    has360: true,
    description: "Beachfront resort with beautiful sea-view rooms, infinity pool, and verified staff.",
    rooms: [
      { id: "r1", name: "Deluxe Sea View Room", price: 4290, beds: "1 King Bed", size: "320 sq.ft", guests: 2, safety: 98 },
      { id: "r2", name: "Premium Pool View Room", price: 5290, beds: "1 King Bed", size: "350 sq.ft", guests: 2, safety: 96 },
      { id: "r3", name: "Family Suite", price: 7490, beds: "2 King Beds", size: "520 sq.ft", guests: 4, safety: 95 },
    ],
  },
  {
    id: "lagoon-villa",
    name: "The Lagoon Villa",
    location: "Candolim, Goa · 5 mins to beach",
    price: 3890,
    rating: 4.7,
    reviews: "892",
    image: h2,
    images: [h2, h1, h3],
    amenities: ["Free Wi-Fi", "Pool", "Parking", "CCTV"],
    isVerified: true,
    safetyScore: 96,
    has360: true,
    description: "Glass-walled lagoon villa with private deck and 24/7 verified concierge.",
    rooms: [
      { id: "r1", name: "Lagoon View Room", price: 3890, beds: "1 Queen Bed", size: "300 sq.ft", guests: 2, safety: 96 },
      { id: "r2", name: "Garden Suite", price: 4890, beds: "1 King Bed", size: "420 sq.ft", guests: 3, safety: 95 },
    ],
  },
  {
    id: "ocean-palm",
    name: "Ocean Palm Resort",
    location: "Calangute, Goa",
    price: 3290,
    rating: 4.6,
    reviews: "651",
    image: h3,
    images: [h3, h1, h2],
    amenities: ["Free Wi-Fi", "Pool", "Breakfast", "CCTV"],
    isVerified: true,
    safetyScore: 94,
    has360: true,
    description: "Calm beachfront retreat with palm-lined pools and ocean breezes.",
    rooms: [
      { id: "r1", name: "Classic Room", price: 3290, beds: "1 Queen Bed", size: "280 sq.ft", guests: 2, safety: 94 },
      { id: "r2", name: "Ocean View Suite", price: 4990, beds: "1 King Bed", size: "440 sq.ft", guests: 3, safety: 95 },
    ],
  },
  {
    id: "pine-lodge",
    name: "Pine Mountain Lodge",
    location: "Manali, Himachal",
    price: 5120,
    rating: 4.9,
    reviews: "402",
    image: h4,
    images: [h4, h1, h2],
    amenities: ["Free Wi-Fi", "Heating", "Breakfast", "CCTV", "Verified Staff"],
    isVerified: true,
    safetyScore: 99,
    has360: false,
    description: "Cozy log lodge in the pines with warm interiors and verified hosts.",
    rooms: [
      { id: "r1", name: "Pine View Cabin", price: 5120, beds: "1 King Bed", size: "360 sq.ft", guests: 2, safety: 99 },
    ],
  },
];

export const getHotel = (id: string) => hotels.find((h) => h.id === id);
