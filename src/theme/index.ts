import { MD3LightTheme, configureFonts } from "react-native-paper";

const fonts = configureFonts({
  config: {
    fontFamily: "System",
  },
});

export const theme = {
  ...MD3LightTheme,

  colors: {
    ...MD3LightTheme.colors,
    background: "#F6F6F6",
    white: "#FFFFFF",
    surface: "#FFFFFF",
    interact: "#0083ADFF",
    success: "#23BA7DFF",

    danger500: "#D64651FF",

    neutral900: "#171A1FFF",
    neutral800: "#2C3033FF",
    neutral700: "#43474BFF",

    error: "#B00020",
  },

  fonts,
} as const;
