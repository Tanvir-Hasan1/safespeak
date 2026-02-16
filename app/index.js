import React, { useState, useEffect } from "react";
import SplashScreen from "../components/SplashScreen";
import WelcomeScreen from "../components/WelcomeScreen";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return <>{isLoading ? <SplashScreen /> : <WelcomeScreen />}</>;
}
