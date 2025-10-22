import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Appbar, Button, Card, TextInput, Snackbar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useTodos } from "../context/TodoContext";
import { pickImage } from "@app/utils/image";
import { save as saveFile, deleteFile } from "@app/infra/FileStorage";
import type { FileType, LocationType } from "@app/types/global";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAppTheme } from "@app/app";
import MapSelect from "../components/MapSelect";
import { usePermissions } from "../context/PermissionsContext";

export default function TaskFormScreen({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "TodoForm">) {
  const { add, remove, update, items } = useTodos();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [pendingFile, setPendingFile] = useState<FileType | null>(null);
  const [error, setError] = useState<string>("");

  const { colors } = useAppTheme();

  const { withCameraPermission, withGalleryPermission } = usePermissions();

  const todoSelected = useMemo(
    () => items.find(t => t.id === route.params?.id),
    [items, route.params?.id],
  );

  const disabledToEdit = !!todoSelected?.id && !isEditing;

  function onSelectGallery() {
    withGalleryPermission(async () => {
      const file: FileType | null = await pickImage();

      if (file) {
        // keep selected file pending until user saves the form
        setPendingFile(file);
        setImageUri(file.uri);
      }
    });
  }

  function onSelectCamera() {
    withCameraPermission(async () => {
      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });
      if (!res.canceled && res.assets?.length) {
        const asset = res.assets[0];
        const name = asset.fileName ?? asset.uri.split("/").pop() ?? `img_${Date.now()}.jpg`;
        const type = (asset as unknown as { mimeType?: string }).mimeType ?? "image/jpeg";

        const file: FileType = { uri: asset.uri, name, type };
        setPendingFile(file);
        setImageUri(asset.uri);
      }
    });
  }

  function onEdit() {
    setIsEditing(true);
  }

  function onCancel() {
    setIsEditing(false);
  }

  function onRemove() {
    if (todoSelected?.id) remove(todoSelected.id);
    navigation?.goBack?.();
  }

  async function onSave() {
    let finalImageUri = imageUri;
    if (pendingFile) {
      try {
        const saved = await saveFile(pendingFile);
        finalImageUri = saved;
        if (todoSelected?.imageUri) {
          try {
            await deleteFile(todoSelected.imageUri);
          } catch {
            // ignore deletion errors
          }
        }
      } catch {
        setError("Não foi possível salvar a imagem. Tente novamente.");
        return;
      }
    }

    if (todoSelected?.id) {
      await update({
        title: title.trim(),
        description: description?.trim() || undefined,
        imageUri: finalImageUri,
        id: todoSelected?.id,
        completed: todoSelected.completed,
        longitude: location?.longitude,
        latitude: location?.latitude,
        createdAt: 0,
        updatedAt: 0,
      });
    } else {
      await add({
        title: title.trim(),
        description: description?.trim() || undefined,
        imageUri: finalImageUri,
        id: "",
        completed: false,
        longitude: location?.longitude,
        latitude: location?.latitude,
        createdAt: 0,
        updatedAt: 0,
      });
      navigation?.goBack?.();
    }

    // clear pending after successful save
    setPendingFile(null);
  }

  useEffect(() => {
    if (todoSelected?.id) {
      setTitle(todoSelected.title);
      setDescription(todoSelected.description || "");
      setImageUri(todoSelected.imageUri);
      if (typeof todoSelected.longitude === "number" && typeof todoSelected.latitude === "number")
        setLocation({ latitude: todoSelected.latitude, longitude: todoSelected.longitude });
      setPendingFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoSelected?.id]);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation?.goBack?.()} />
        <Appbar.Content
          color={colors.neutral900}
          titleStyle={{ fontWeight: "bold", fontSize: 18 }}
          title={
            isEditing ? "Editar Tarefa" : todoSelected?.id ? "Detalhes da Tarefa" : "Nova Tarefa"
          }
        />
        {disabledToEdit && <Appbar.Action icon="square-edit-outline" onPress={onEdit} />}
        {isEditing && <Appbar.Action icon="close" onPress={onCancel} />}
      </Appbar.Header>

      <ScrollView style={{ padding: 16 }}>
        <View style={{ gap: 12 }}>
          <TextInput
            label="Title"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
            disabled={disabledToEdit}
          />

          <TextInput
            label="Description"
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            disabled={disabledToEdit}
          />

          <Card>
            {imageUri ? (
              <Card.Cover source={{ uri: imageUri }} />
            ) : (
              <Card.Title title="Nenhuma imagem selecionada" />
            )}

            {!disabledToEdit && (
              <Card.Actions>
                <Button icon="image" onPress={onSelectGallery}>
                  Choose Image
                </Button>
                <Button icon="camera" onPress={onSelectCamera}>
                  Take Photo
                </Button>
              </Card.Actions>
            )}
          </Card>

          <MapSelect picked={location} setPicked={setLocation} />

          <View style={{ padding: 16, gap: 12 }}>
            {!disabledToEdit && (
              <Button mode="contained" icon="content-save-outline" onPress={onSave}>
                Salvar
              </Button>
            )}

            {disabledToEdit && (
              <Button
                mode="contained"
                icon="square-edit-outline"
                textColor={colors.white}
                onPress={onEdit}
              >
                Editar
              </Button>
            )}

            <Button
              mode="contained"
              icon="close-outline"
              buttonColor={colors.danger500}
              textColor={colors.white}
              onPress={onRemove}
            >
              Excluir
            </Button>

            <Button
              mode="contained"
              icon="check-circle-outline"
              buttonColor={colors.success}
              textColor={colors.white}
              onPress={onEdit}
            >
              Concluir
            </Button>
          </View>
        </View>
      </ScrollView>

      <Snackbar visible={!!error} onDismiss={() => setError("")} duration={3000}>
        {error}
      </Snackbar>
    </>
  );
}
