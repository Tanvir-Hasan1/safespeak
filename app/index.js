// Silence benign Expo keep-awake promise warnings and errors in development
if (__DEV__) {
  try {
    const rejectionTracking = require("promise/setimmediate/rejection-tracking");
    rejectionTracking.enable({
      allRejections: true,
      onUnhandled: (id, error) => {
        if (error && error.message && error.message.includes("Unable to activate keep awake")) {
          return;
        }
        console.warn("Possible Unhandled Promise Rejection (id: " + id + "):", error);
      },
      onHandled: () => {},
    });
  } catch (e) {
    // ignore
  }

  if (global.ErrorUtils) {
    const originalHandler = global.ErrorUtils.getGlobalHandler();
    global.ErrorUtils.setGlobalHandler((error, isFatal) => {
      if (error && error.message && error.message.includes("Unable to activate keep awake")) {
        return;
      }
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
  }
}

import React, { useState, useEffect } from "react";
import SplashScreen from "../components/SplashScreen";
import WelcomeScreen from "../components/WelcomeScreen";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";
import api from "../context/api";

export default function App() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const startTime = Date.now();
      let shouldRedirectHome = false;

      try {
        // Wait for Zustand persisted store to hydrate
        while (!useAuthStore.persist.hasHydrated()) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        const { refreshToken, user } = useAuthStore.getState();

        if (refreshToken) {
          try {
            // Attempt silent login / token refresh to verify session
            const res = await api.post("/auth/refresh", { refreshToken });
            const tokens = res.data?.data?.tokens;

            if (tokens?.accessToken && active) {
              // Update store with fresh tokens
              useAuthStore.getState().setAuth(user || res.data?.data?.user, tokens);
              shouldRedirectHome = true;
            }
          } catch (err) {
            console.warn("Auto-login / token refresh failed:", err);
            // Refresh token might be expired/invalid, clear auth
            if (active) {
              useAuthStore.getState().clearAuth();
            }
          }
        }
      } catch (err) {
        console.error("Session rehydration check error:", err);
      }

      // Hold splash screen until loading bar finishes (2000ms)
      const elapsedTime = Date.now() - startTime;
      const remainingTime = 2000 - elapsedTime;
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      if (active) {
        if (shouldRedirectHome) {
          router.replace("/(tabs)/home");
        } else {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  return <>{isLoading ? <SplashScreen /> : <WelcomeScreen />}</>;
}
