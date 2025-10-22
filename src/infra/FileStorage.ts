import type { FileType } from "@app/types/global";
import * as FileSystem from "expo-file-system/legacy";
import * as Crypto from "expo-crypto";

export async function deleteFile(uri: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) return;
  await FileSystem.deleteAsync(uri, { idempotent: true });
}

export async function save(file: FileType): Promise<string> {
  const folder = `${FileSystem.documentDirectory}images`;
  await FileSystem.makeDirectoryAsync(folder, { intermediates: true });

  const nameParts = file.name.split(".");
  const fileName = `${Crypto.randomUUID()}.${nameParts[nameParts.length - 1]}`;
  const dest = `${folder}/${fileName}`;

  await FileSystem.copyAsync({ from: file.uri, to: dest });

  return dest;
}

export async function exist(uri: string): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(uri);
  return info.exists;
}
