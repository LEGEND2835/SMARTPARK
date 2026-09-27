import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
  type User,
} from "firebase/auth";
import { auth } from "./auth";

/**
 * Registers a new user with email and password using Firebase Authentication.
 *
 * @param email - The user's email address
 * @param password - The user's password
 * @returns A promise resolving to the created UserCredential
 */
export async function registerUser(
  email: string,
  password: string
): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  return userCredential;
}

/**
 * Signs in an existing user with email and password.
 *
 * @param email - The user's email address
 * @param password - The user's password
 * @returns A promise resolving to the UserCredential
 */
export async function loginUser(
  email: string,
  password: string
): Promise<UserCredential> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return userCredential;
}

/**
 * Signs out the currently authenticated Firebase user.
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Gets the current authenticated Firebase user synchronously, if any.
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Translates Firebase Auth error codes into clean, user-friendly messages.
 *
 * @param errorCode - The Firebase error code (e.g. 'auth/invalid-credential')
 * @returns A user-facing friendly error description
 */
export function getFriendlyAuthErrorMessage(errorCode?: string): string {
  if (!errorCode) {
    return "An unexpected authentication error occurred. Please try again.";
  }

  const normalizedCode = errorCode.toLowerCase();

  if (
    normalizedCode.includes("api-key-not-valid") ||
    normalizedCode.includes("invalid-api-key")
  ) {
    return "Firebase API configuration is missing or invalid. Please check your environment variables (.env.local).";
  }

  switch (errorCode) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please log in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please choose a stronger password (at least 6 characters).";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password. Please check your credentials and try again.";
    case "auth/user-disabled":
      return "This user account has been disabled. Please contact SmartPark support.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Access has been temporarily restricted. Please try again shortly.";
    case "auth/network-request-failed":
      return "Unable to connect. Please check your internet connection and try again.";
    case "auth/operation-not-allowed":
      return "Email/Password sign-in is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized for OAuth/Authentication in Firebase Console.";
    default:
      return "Authentication failed. Please verify your details and try again.";
  }
}
