import React, {
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase/auth";
import { logoutUser } from "../firebase/authService";
import { getUserProfile, type UserProfile } from "../firebase/userService";
import { AuthContext, type AuthContextType } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      setUserProfile(null);
      return;
    }

    try {
      const profile = await getUserProfile(firebaseUser.uid);
      if (profile) {
        setUserProfile(profile);
      } else {
        // Fallback profile if Firestore document is not yet synced or created
        setUserProfile({
          uid: firebaseUser.uid,
          fullName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          email: firebaseUser.email || "",
          role: "user",
        });
      }
    } catch (err) {
      console.error("Failed to load user profile in AuthContext:", err);
      setUserProfile({
        uid: firebaseUser.uid,
        fullName: firebaseUser.displayName || "User",
        email: firebaseUser.email || "",
        role: "user",
      });
    }
  }, []);

  const refreshUserProfile = useCallback(async () => {
    if (auth.currentUser) {
      await fetchProfile(auth.currentUser);
    }
  }, [fetchProfile]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = userProfile?.role === "admin";

  const contextValue: AuthContextType = {
    user,
    userProfile,
    loading,
    isAuthenticated,
    isAdmin,
    logout,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
