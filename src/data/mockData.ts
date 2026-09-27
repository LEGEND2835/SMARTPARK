export interface ParkingSlot {
  id: string;
  slotNumber: string;
  level: string;
  type: 'standard' | 'ev' | 'compact' | 'handicapped';
  status: 'available' | 'reserved' | 'occupied' | 'disabled';
  pricePerHour: number;
}

export interface ParkingLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  distance: string;
  operatingHours: string;
  pricePerHour: number;
  totalSlots: number;
  availableSlots: number;
  rating: number;
  reviewsCount: number;
  features: string[];
  description: string;
  slots: ParkingSlot[];
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  parkingId: string;
  parkingName: string;
  parkingAddress: string;
  slotNumber: string;
  level: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  totalAmount: number;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  vehicleNumber?: string;
  createdAt: string;
}

export interface UserStats {
  activeBookings: number;
  totalBookings: number;
  hoursParked: number;
  favoriteParking: string;
  totalSpent: number;
}

export interface AdminStats {
  totalLocations: number;
  totalSlots: number;
  activeReservations: number;
  totalRevenueToday: number;
  occupancyRate: number;
}

// Generate realistic slots for a parking lot
export const generateSlots = (prefix: string, count: number): ParkingSlot[] => {
  const types: ('standard' | 'ev' | 'compact' | 'handicapped')[] = [
    'standard', 'standard', 'standard', 'ev', 'compact', 'standard', 'handicapped'
  ];
  const statuses: ('available' | 'reserved' | 'occupied' | 'disabled')[] = [
    'available', 'available', 'occupied', 'available', 'reserved', 'occupied', 'available', 'disabled'
  ];

  return Array.from({ length: count }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    const level = i < count / 2 ? 'L1' : 'L2';
    const type = types[i % types.length];
    const status = statuses[i % statuses.length];
    return {
      id: `${prefix}-${level}-${num}`,
      slotNumber: `${prefix}-${num}`,
      level,
      type,
      status,
      pricePerHour: type === 'ev' ? 5.5 : 4.0,
    };
  });
};

export const mockParkingLocations: ParkingLocation[] = [
  {
    id: 'pk-metro-central',
    name: 'Metro Central Smart Tower',
    address: '104 Tech Boulevard, Downtown Core',
    city: 'Metro City',
    distance: '0.4 km away',
    operatingHours: 'Open 24/7',
    pricePerHour: 4.5,
    totalSlots: 120,
    availableSlots: 42,
    rating: 4.9,
    reviewsCount: 328,
    features: ['EV Fast Charging', '24/7 CCTV & Security', 'Automated Boom Barrier', 'Covered Multi-level', 'Elevator Access'],
    description: 'High-tech downtown multi-level parking facility with ultra-fast EV charging hubs, license plate recognition, and direct connection to central transit.',
    slots: generateSlots('A', 24),
  },
  {
    id: 'pk-civic-hub',
    name: 'Civic Hub Plaza Garage',
    address: '55 Republic Ave, Financial District',
    city: 'Metro City',
    distance: '1.1 km away',
    operatingHours: '06:00 AM - 11:30 PM',
    pricePerHour: 3.5,
    totalSlots: 85,
    availableSlots: 18,
    rating: 4.7,
    reviewsCount: 194,
    features: ['Valet Service', 'Covered Parking', 'Security Guard', 'Wheelchair Access'],
    description: 'Convenient underground parking located adjacent to the government civic center and financial towers. Ideal for work commutes and appointments.',
    slots: generateSlots('B', 20),
  },
  {
    id: 'pk-harbor-point',
    name: 'Harbor Point Marina Deck',
    address: '88 Oceanside Walk, Bayfront',
    city: 'Metro City',
    distance: '2.3 km away',
    operatingHours: 'Open 24/7',
    pricePerHour: 5.0,
    totalSlots: 60,
    availableSlots: 9,
    rating: 4.8,
    reviewsCount: 142,
    features: ['Overnight Parking', 'Restrooms', 'Scenic Bayfront Access', 'CCTV Surveillance'],
    description: 'Premium waterfront parking deck right by the marina, dining promenade, and coastal boardwalk. Safe and well-lit with round-the-clock patrol.',
    slots: generateSlots('C', 18),
  },
  {
    id: 'pk-tech-park',
    name: 'Cyber Gateway Tech Park',
    address: '12 Innovation Expressway, Silicon Corridor',
    city: 'Metro City',
    distance: '3.8 km away',
    operatingHours: 'Open 24/7',
    pricePerHour: 2.75,
    totalSlots: 200,
    availableSlots: 95,
    rating: 4.6,
    reviewsCount: 410,
    features: ['EV Solar Charging', 'Touchless QR Gate', 'Wide SUV Slots', 'Motorcycle Zone'],
    description: 'Expansive tech park parking with smart occupancy sensors above every bay and dedicated solar-powered charging for electric vehicles.',
    slots: generateSlots('D', 30),
  },
  {
    id: 'pk-uptown-market',
    name: 'Uptown Promenade Mall Parking',
    address: '310 Grand Ave, Uptown District',
    city: 'Metro City',
    distance: '1.8 km away',
    operatingHours: '08:00 AM - 01:00 AM',
    pricePerHour: 4.0,
    totalSlots: 150,
    availableSlots: 31,
    rating: 4.7,
    reviewsCount: 260,
    features: ['Direct Mall Entry', 'Car Wash & Detailing', 'Covered Bays', '24/7 Security'],
    description: 'Spacious underground and rooftop parking connected directly into the shopping mall, cinema complexes, and gourmet dining district.',
    slots: generateSlots('E', 24),
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'SP-89421',
    userId: 'usr-101',
    userName: 'Kabish Barua',
    userEmail: 'kabishbarua@gmail.com',
    parkingId: 'pk-metro-central',
    parkingName: 'Metro Central Smart Tower',
    parkingAddress: '104 Tech Boulevard, Downtown Core',
    slotNumber: 'A-04',
    level: 'L1',
    date: 'Today, Oct 24, 2026',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    durationHours: 4,
    totalAmount: 18.0,
    status: 'active',
    paymentStatus: 'paid',
    vehicleNumber: 'KA-05-MN-2024',
    createdAt: '2026-10-24 09:15 AM',
  },
  {
    id: 'SP-89104',
    userId: 'usr-101',
    userName: 'Kabish Barua',
    userEmail: 'kabishbarua@gmail.com',
    parkingId: 'pk-civic-hub',
    parkingName: 'Civic Hub Plaza Garage',
    parkingAddress: '55 Republic Ave, Financial District',
    slotNumber: 'B-12',
    level: 'L2',
    date: 'Tomorrow, Oct 25, 2026',
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    durationHours: 3,
    totalAmount: 10.5,
    status: 'upcoming',
    paymentStatus: 'paid',
    vehicleNumber: 'KA-05-MN-2024',
    createdAt: '2026-10-24 11:30 AM',
  },
  {
    id: 'SP-76239',
    userId: 'usr-101',
    userName: 'Kabish Barua',
    userEmail: 'kabishbarua@gmail.com',
    parkingId: 'pk-harbor-point',
    parkingName: 'Harbor Point Marina Deck',
    parkingAddress: '88 Oceanside Walk, Bayfront',
    slotNumber: 'C-08',
    level: 'L1',
    date: 'Oct 20, 2026',
    startTime: '06:00 PM',
    endTime: '09:30 PM',
    durationHours: 3.5,
    totalAmount: 17.5,
    status: 'completed',
    paymentStatus: 'paid',
    vehicleNumber: 'KA-05-MN-2024',
    createdAt: '2026-10-20 04:45 PM',
  },
  {
    id: 'SP-64112',
    userId: 'usr-101',
    userName: 'Kabish Barua',
    userEmail: 'kabishbarua@gmail.com',
    parkingId: 'pk-uptown-market',
    parkingName: 'Uptown Promenade Mall Parking',
    parkingAddress: '310 Grand Ave, Uptown District',
    slotNumber: 'E-15',
    level: 'L1',
    date: 'Oct 14, 2026',
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    durationHours: 3,
    totalAmount: 12.0,
    status: 'completed',
    paymentStatus: 'paid',
    vehicleNumber: 'KA-05-MN-2024',
    createdAt: '2026-10-14 01:20 PM',
  },
  {
    id: 'SP-58902',
    userId: 'usr-101',
    userName: 'Kabish Barua',
    userEmail: 'kabishbarua@gmail.com',
    parkingId: 'pk-tech-park',
    parkingName: 'Cyber Gateway Tech Park',
    parkingAddress: '12 Innovation Expressway, Silicon Corridor',
    slotNumber: 'D-03',
    level: 'L1',
    date: 'Oct 08, 2026',
    startTime: '11:00 AM',
    endTime: '01:00 PM',
    durationHours: 2,
    totalAmount: 5.5,
    status: 'cancelled',
    paymentStatus: 'refunded',
    vehicleNumber: 'KA-05-MN-2024',
    createdAt: '2026-10-08 09:00 AM',
  },
];

export const mockUserStats: UserStats = {
  activeBookings: 1,
  totalBookings: 14,
  hoursParked: 38.5,
  favoriteParking: 'Metro Central Smart Tower',
  totalSpent: 142.5,
};

export const mockAdminStats: AdminStats = {
  totalLocations: 5,
  totalSlots: 615,
  activeReservations: 42,
  totalRevenueToday: 1285.5,
  occupancyRate: 68.3,
};
