import { createUserWithEmailAndPassword, type UserCredential } from "firebase/auth";
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
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential;
}
