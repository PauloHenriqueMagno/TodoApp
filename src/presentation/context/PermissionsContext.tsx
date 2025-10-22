import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Alert, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import * as Location from "expo-location";

type Status = ImagePicker.PermissionStatus | "unavailable";

interface PermissionsState {
  cameraStatus: Status;
  galleryStatus: Status;
  locationStatus: Status;
  refresh: () => Promise<void>;
  openSettings: () => Promise<void>;
  ensureLocationPermission: () => Promise<boolean>;
  ensureCameraPermission: () => Promise<boolean>;
  ensureGalleryPermission: () => Promise<boolean>;
  withCameraPermission: <T>(fn: () => Promise<T> | T) => Promise<T | null>;
  withGalleryPermission: <T>(fn: () => Promise<T> | T) => Promise<T | null>;
  withLocationPermission: <T>(fn: () => Promise<T> | T) => Promise<T | null>;
}

const PermissionsContext = createContext<PermissionsState | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cameraStatus, setCameraStatus] = useState<Status>("unavailable");
  const [galleryStatus, setGalleryStatus] = useState<Status>("unavailable");
  const [locationStatus, setLocationStatus] = useState<Status>("unavailable");

  const refresh = useCallback(async () => {
    try {
      const cam = await Camera.getCameraPermissionsAsync();
      setCameraStatus(cam.status);
    } catch {
      setCameraStatus("unavailable");
    }
    try {
      const gal = await ImagePicker.getMediaLibraryPermissionsAsync();
      setGalleryStatus(gal.status);
    } catch {
      setGalleryStatus("unavailable");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const openSettings = useCallback(async () => {
    await Linking.openSettings();
  }, []);

  const promptSettings = (what: "Câmera" | "Galeria" | "Localização") => {
    Alert.alert(
      `${what} bloqueada`,
      `Você negou a permissão anteriormente. Vá em Configurações para permitir o acesso à ${what.toLowerCase()} para utilizar essa funcionalidade.`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Abrir Configurações", onPress: () => void openSettings() },
      ],
    );
  };

  const ensureCameraPermission = useCallback(async () => {
    let perm = await Camera.getCameraPermissionsAsync();

    if (perm.granted) {
      setCameraStatus(perm.status);
      return true;
    }

    if (perm.canAskAgain) {
      perm = await Camera.requestCameraPermissionsAsync();
      setCameraStatus(perm.status);
      if (perm.granted) return true;
    }

    // negado e não pode perguntar de novo
    setCameraStatus(perm.status);
    promptSettings("Câmera");
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureLocationPermission = useCallback(async () => {
    let perm = await Location.requestForegroundPermissionsAsync();
    if (perm.granted) {
      perm = await Location.getForegroundPermissionsAsync();
    }
    if (perm.granted) {
      setLocationStatus(perm.status);
      return true;
    }

    if (perm.canAskAgain) {
      perm = await Location.getForegroundPermissionsAsync();
      setLocationStatus(perm.status);
      if (perm.granted) return true;
    }

    // negado e não pode perguntar de novo
    setLocationStatus(perm.status);
    promptSettings("Localização");
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureGalleryPermission = useCallback(async () => {
    let perm = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (perm.granted) {
      setGalleryStatus(perm.status);
      return true;
    }

    if (perm.canAskAgain) {
      perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryStatus(perm.status);
      if (perm.granted) return true;
    }

    setGalleryStatus(perm.status);
    promptSettings("Galeria");
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const withCameraPermission = useCallback(
    async <T,>(fn: () => Promise<T> | T) => {
      const ok = await ensureCameraPermission();
      if (!ok) return null;
      return await fn();
    },
    [ensureCameraPermission],
  );

  const withLocationPermission = useCallback(
    async <T,>(fn: () => Promise<T> | T) => {
      const ok = await ensureLocationPermission();
      if (!ok) return null;
      return await fn();
    },
    [ensureLocationPermission],
  );

  const withGalleryPermission = useCallback(
    async <T,>(fn: () => Promise<T> | T) => {
      const ok = await ensureGalleryPermission();
      if (!ok) return null;
      return await fn();
    },
    [ensureGalleryPermission],
  );

  return (
    <PermissionsContext.Provider
      value={{
        cameraStatus,
        galleryStatus,
        locationStatus,
        refresh,
        openSettings,
        ensureLocationPermission,
        ensureCameraPermission,
        ensureGalleryPermission,
        withLocationPermission,
        withCameraPermission,
        withGalleryPermission,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export function usePermissions() {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionsProvider");
  return ctx;
}
