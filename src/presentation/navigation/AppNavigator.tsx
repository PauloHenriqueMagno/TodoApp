import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TodoListScreen from "@presentation/screens/TodoListScreen";
import TodoFormScreen from "@presentation/screens/TodoFormScreen";

export type RootStackParamList = {
  Todos: undefined;
  TodoForm: { id?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Todos" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Todos"
        component={TodoListScreen}
        options={{
          title: "My Todos",
        }}
      />
      <Stack.Screen name="TodoForm" component={TodoFormScreen} />
    </Stack.Navigator>
  );
}
