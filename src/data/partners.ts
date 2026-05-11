export type Partner = {
  id: string;
  name: string;
  category: "Café" | "Pool" | "Museum" | "Garden" | "Library" | "Shop";
  reward: string;
  cost: number;
  address: string;
  hours: string;
  lat: number;
  lng: number;
};

// Approximate coordinates of real Reykjavík locations.
export const PARTNERS: Partner[] = [
  {
    id: "roasters",
    name: "Reykjavík Roasters",
    category: "Café",
    reward: "Free filter coffee",
    cost: 40,
    address: "Kárastígur 1, 101 Reykjavík",
    hours: "Mon–Fri 8:00–18:00 · Sat–Sun 9:00–18:00",
    lat: 64.1429,
    lng: -21.9302,
  },
  {
    id: "sundhollin",
    name: "Sundhöllin",
    category: "Pool",
    reward: "Day pass",
    cost: 80,
    address: "Barónsstígur 45a, 101 Reykjavík",
    hours: "Mon–Fri 6:30–22:00 · Sat–Sun 8:00–22:00",
    lat: 64.1432,
    lng: -21.9259,
  },
  {
    id: "vesturbaejarlaug",
    name: "Vesturbæjarlaug",
    category: "Pool",
    reward: "Day pass",
    cost: 80,
    address: "Hofsvallagata, 107 Reykjavík",
    hours: "Mon–Fri 6:30–22:00 · Sat–Sun 9:00–22:00",
    lat: 64.1448,
    lng: -21.9522,
  },
  {
    id: "listasafn",
    name: "Listasafn Reykjavíkur — Hafnarhús",
    category: "Museum",
    reward: "Entry",
    cost: 120,
    address: "Tryggvagata 17, 101 Reykjavík",
    hours: "Daily 10:00–17:00 · Thu until 22:00",
    lat: 64.1494,
    lng: -21.9412,
  },
  {
    id: "kjarvalsstadir",
    name: "Kjarvalsstaðir",
    category: "Museum",
    reward: "Entry",
    cost: 120,
    address: "Flókagata 24, 105 Reykjavík",
    hours: "Daily 10:00–17:00",
    lat: 64.1395,
    lng: -21.9189,
  },
  {
    id: "grasagardur",
    name: "Grasagarður Reykjavíkur",
    category: "Garden",
    reward: "Native plant seedling",
    cost: 60,
    address: "Laugardalur, 104 Reykjavík",
    hours: "Open daily · Café 10:00–17:00",
    lat: 64.1405,
    lng: -21.8758,
  },
  {
    id: "borgarbokasafn",
    name: "Borgarbókasafn — Grófin",
    category: "Library",
    reward: "Late-fee waiver",
    cost: 30,
    address: "Tryggvagata 15, 101 Reykjavík",
    hours: "Mon–Thu 10:00–19:00 · Fri 11:00–18:00",
    lat: 64.1492,
    lng: -21.9405,
  },
  {
    id: "stofan",
    name: "Stofan Café",
    category: "Café",
    reward: "10% off",
    cost: 25,
    address: "Vesturgata 3, 101 Reykjavík",
    hours: "Daily 10:00–23:00",
    lat: 64.1478,
    lng: -21.9433,
  },
];

// Reykjavík city centre roughly
export const REYKJAVIK_CENTER = { lat: 64.1466, lng: -21.9426 };

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}