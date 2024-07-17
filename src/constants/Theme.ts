import {
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import Colors from "./Colors";
import merge from "deepmerge";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const customLightTheme = {
  ...MD3LightTheme,
  roundness: 4,
  colors: Colors.light.colors,
};

const customDarkTheme = {
  ...MD3DarkTheme,
  roundness: 4,
  colors: Colors.dark.colors,
};

export const AppDefaultTheme = merge(LightTheme, customLightTheme);
export const AppDarkTheme = merge(DarkTheme, customDarkTheme);
