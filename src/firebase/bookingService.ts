import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firestore';
import { auth } from './auth';
import { mockBookings, type Booking } from '../data/mockData';

const LOCAL_STORAGE_BOOKINGS_KEY = 'smartpark_local_bookings';

/**
 * Helper to retrieve locally cached/created bookings from localStorage
 */
function getLocalBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Booking[];
  } catch {
    return [];
  }
}

/**
 * Helper to save bookings to localStorage
 */
function saveLocalBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.warn('Failed to save bookings to localStorage:', err);
  }
}

export interface CreateBookingInput {
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
  vehicleNumber: string;
}

/**
 * Checks if a specific bay has conflicting active reservations
 */
export async function checkSlotAvailability(
  parkingId: string,
  slotNumber: string,
  date: string
): Promise<boolean> {
  try {
    // Check Firestore for conflicting bookings
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('parkingId', '==', parkingId),
      where('slotNumber', '==', slotNumber),
      where('date', '==', date)
    );
    const snap = await getDocs(q);
    const conflicts = snap.docs.filter((d) => {
      const data = d.data();
      return data.status === 'active' || data.status === 'upcoming';
    });

    if (conflicts.length > 0) {
      return false;
    }
  } catch (err) {
    console.warn('Could not query Firestore for slot availability, checking local state:', err);
  }

  // Fallback to checking local storage and mock bookings
  const localList = [...getLocalBookings(), ...mockBookings];
  const localConflict = localList.some(
    (b) =>
      b.parkingId === parkingId &&
      b.slotNumber === slotNumber &&
      b.date === date &&
      (b.status === 'active' || b.status === 'upcoming')
  );

  return !localConflict;
}

/**
 * Creates a new reservation in Firestore and local storage
 */
export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const currentUser = auth.currentUser;
  const userId = currentUser ? currentUser.uid : 'guest-user';
  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'SmartPark Driver';
  const userEmail = currentUser?.email || 'driver@smartpark.internal';

  // Double-booking check
  const isAvailable = await checkSlotAvailability(input.parkingId, input.slotNumber, input.date);
  if (!isAvailable) {
    throw new Error('SLOT_ALREADY_RESERVED');
  }

  // Generate clean reference ID
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const bookingId = `SP-${randomSuffix}`;

  const newBooking: Booking = {
    id: bookingId,
    userId,
    userName,
    userEmail,
    parkingId: input.parkingId,
    parkingName: input.parkingName,
    parkingAddress: input.parkingAddress,
    slotNumber: input.slotNumber,
    level: input.level,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    durationHours: input.durationHours,
    totalAmount: input.totalAmount,
    status: 'active',
    paymentStatus: 'paid',
    vehicleNumber: input.vehicleNumber,
    createdAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  };

  // 1. Try persisting to Firestore
  try {
    const docRef = doc(db, 'bookings', bookingId);
    await setDoc(docRef, {
      ...newBooking,
      createdAtServer: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Firestore write failed (offline or permission), saving to local storage:', err);
  }

  // 2. Always persist to localStorage for instant client retrieval
  const existingLocal = getLocalBookings();
  saveLocalBookings([newBooking, ...existingLocal]);

  return newBooking;
}

/**
 * Retrieves all bookings for a user
 */
export async function getUserBookings(userId: string): Promise<Booking[]> {
  const localBookings = getLocalBookings();
  let firestoreBookings: Booking[] = [];

  if (userId) {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('userId', '==', userId));
      const snap = await getDocs(q);
      firestoreBookings = snap.docs.map((d) => d.data() as Booking);
    } catch (err) {
      console.warn('Failed to fetch user bookings from Firestore, falling back to local cache:', err);
    }
  }

  // Merge and deduplicate by ID
  const map = new Map<string, Booking>();
  
  // Seed initial demo bookings if present
  mockBookings.forEach((b) => map.set(b.id, b));
  // Local bookings have higher priority
  localBookings.forEach((b) => map.set(b.id, b));
  // Firestore bookings have highest priority
  firestoreBookings.forEach((b) => map.set(b.id, b));

  return Array.from(map.values());
}

/**
 * Retrieves a single booking by ID
 */
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  // 1. Check local storage
  const localList = getLocalBookings();
  const localMatch = localList.find((b) => b.id === bookingId);
  if (localMatch) return localMatch;

  // 2. Check Firestore
  try {
    const docRef = doc(db, 'bookings', bookingId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as Booking;
    }
  } catch (err) {
    console.warn('Failed to fetch booking from Firestore:', err);
  }

  // 3. Check mock bookings
  const mockMatch = mockBookings.find((b) => b.id === bookingId);
  return mockMatch || null;
}

/**
 * Cancels a reservation
 */
export async function cancelBooking(bookingId: string): Promise<void> {
  // 1. Update Firestore
  try {
    const docRef = doc(db, 'bookings', bookingId);
    await updateDoc(docRef, {
      status: 'cancelled',
      paymentStatus: 'refunded',
      cancelledAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Failed to update booking status in Firestore:', err);
  }

  // 2. Update local storage
  const localList = getLocalBookings();
  const updated = localList.map((b) =>
    b.id === bookingId
      ? { ...b, status: 'cancelled' as const, paymentStatus: 'refunded' as const }
      : b
  );
  saveLocalBookings(updated);
}
