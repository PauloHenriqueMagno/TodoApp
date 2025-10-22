import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import type { FileType } from "@app/types/global";

export async function pickImage(): Promise<FileType | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    Alert.alert("Permissão negada", "Não foi possível acessar a galeria de imagens.");
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: "images",
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  const name = asset.fileName ?? asset.uri.split("/").pop() ?? `img_${Date.now()}.jpg`;
  const type = asset.mimeType ?? "image/jpeg";

  return { uri: asset.uri, name, type };
}
