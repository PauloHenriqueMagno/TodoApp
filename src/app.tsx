import { useTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";

import AppNavigator from "@presentation/navigation/AppNavigator";
import { PermissionsProvider } from "./presentation/context/PermissionsContext";
import { TodoProvider } from "@presentation/context/TodoContext";

import { theme } from "@theme/index";

export type AppTheme = typeof theme;
export const useAppTheme = () => useTheme<AppTheme>();

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <PermissionsProvider>
        <TodoProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </TodoProvider>
      </PermissionsProvider>
    </PaperProvider>
  );
};

export default App;
