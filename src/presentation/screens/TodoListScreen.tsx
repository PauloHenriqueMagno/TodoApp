import React, { useState } from "react";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Text, Appbar } from "react-native-paper";

import { useTodos } from "@presentation/context/TodoContext";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@presentation/navigation/AppNavigator";
import type { FilterType } from "@app/types/filter";
import { useAppTheme } from "@app/app";
import { TodoItem } from "../components/TodoItem";
import { defaultFilters, FilterModal } from "../components/FilterModal";

export default function TodoListScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Todos">) {
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState<FilterType>(defaultFilters);

  const { items, loading, refresh } = useTodos();
  const { colors } = useAppTheme();

  const onApply = (values: FilterType) => {
    setFilters(values);
    refresh(values);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content
          color={colors.neutral900}
          titleStyle={{ fontWeight: "bold", fontSize: 18 }}
          title={"Tarefas"}
        />

        <Appbar.Action
          icon="filter-plus"
          color={colors.interact}
          size={30}
          onPress={() => setFilterVisible(true)}
        />
        <Appbar.Action
          icon="plus-box"
          color={colors.interact}
          size={30}
          onPress={() => navigation.navigate("TodoForm")}
        />
      </Appbar.Header>

      {items.length === 0 && (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
          <Text variant="titleMedium">Nenhuma tarefa encontrada</Text>
          <Text>Adicione sua primeira tarefa com o botão +</Text>
        </View>
      )}

      {items.length > 0 && (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          contentContainerStyle={{ paddingVertical: 20 }}
          renderItem={({ item }) => <TodoItem todo={item} />}
        />
      )}

      <FilterModal
        visible={filterVisible}
        onDismiss={() => setFilterVisible(false)}
        onApply={onApply}
        initialValues={filters}
      />
    </>
  );
}
