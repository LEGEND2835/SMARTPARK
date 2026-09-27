import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  type Timestamp,
  type FieldValue,
} from "firebase/firestore";
import { db } from "./firestore";

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  createdAt?: Timestamp | FieldValue | Date | string;
}

export interface CreateUserProfileInput {
  fullName: string;
  email: string;
  role?: "user" | "admin";
}

/**
 * Creates or updates a user profile document in Firestore at users/{uid}
 */
export async function createUserProfile(
  uid: string,
  data: CreateUserProfileInput
): Promise<void> {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      uid,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      role: "user", // Security constraint: default role is always 'user'
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Retrieves a user profile document from Firestore at users/{uid}
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile from Firestore:", error);
    return null;
  }
}

/**
 * Updates a user profile in Firestore
 */
export async function updateUserProfile(
  uid: string,
  data: { fullName: string; email?: string }
): Promise<void> {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      fullName: data.fullName.trim(),
    },
    { merge: true }
  );
}

