import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@hot_tub_tracker:disclaimer_accepted_version";

export default function useDisclaimerAcceptance() {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptedVersion, setAcceptedVersion] = useState(null);

  useEffect(() => {
    checkAcceptance();
  }, []);

  const checkAcceptance = async () => {
    try {
      const version = await AsyncStorage.getItem(STORAGE_KEY);
      setAcceptedVersion(version);
      setHasAccepted(!!version);
    } catch (error) {
      console.error("Error checking disclaimer acceptance:", error);
      setHasAccepted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptDisclaimer = async (version) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, version);
      setAcceptedVersion(version);
      setHasAccepted(true);
    } catch (error) {
      console.error("Error saving disclaimer acceptance:", error);
    }
  };

  const resetAcceptance = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setAcceptedVersion(null);
      setHasAccepted(false);
    } catch (error) {
      console.error("Error resetting disclaimer acceptance:", error);
    }
  };

  return {
    hasAccepted,
    isLoading,
    acceptedVersion,
    acceptDisclaimer,
    resetAcceptance,
  };
}
