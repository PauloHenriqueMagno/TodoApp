import React from "react";
import { Card, Icon, Text } from "react-native-paper";
import type { Todo } from "@domain/entities/Todo";
import { useTodos } from "../context/TodoContext";
import { ImageBackground, Pressable, StyleSheet, View } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useAppTheme } from "@app/app";

type Props = {
  todo: Todo;
};

export function TodoItem({ todo }: Props) {
  const { toggle } = useTodos();
  const { colors } = useAppTheme();

  type RootStackParamList = {
    TodoForm: { id?: string } | undefined;
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  function onToggle() {
    toggle(todo.id);
  }

  return (
    <Card style={styles.card} onPress={() => navigation.navigate("TodoForm", { id: todo.id })}>
      <ImageBackground
        source={{ uri: todo.imageUri }}
        style={{
          ...styles.imageBackground,
          paddingTop: todo.imageUri ? 70 : 15,
        }}
        resizeMode="cover"
      >
        {!!todo.imageUri && <View style={styles.overlay} />}
        <Pressable
          onPress={onToggle}
          style={{
            ...styles.checkbox,
          }}
        >
          <Icon
            size={20}
            source={todo.completed ? "checkbox-marked" : "checkbox-blank-outline"}
            color={todo.completed ? colors.success : colors.neutral900}
          />
        </Pressable>

        <Card.Content>
          <Text
            variant="titleLarge"
            style={{ color: todo.imageUri ? colors.white : colors.neutral900 }}
          >
            {todo.title}
          </Text>

          {!!todo.description && (
            <Text
              variant="bodyMedium"
              style={{ color: todo.imageUri ? colors.white : colors.neutral900 }}
            >
              {todo.description}
            </Text>
          )}
        </Card.Content>
      </ImageBackground>
    </Card>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    position: "relative",
    justifyContent: "flex-end",
    paddingVertical: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  checkbox: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 4,
    zIndex: 1,
    position: "absolute",
    top: 10,
    right: 10,
  },
  card: {
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 16,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
