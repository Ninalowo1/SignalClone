import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo'
import { SafeAreaProvider } from "react-native-safe-area-context";
import Constants from "expo-constants";
import InitialLayout from "../src/components/constants/InitialLayout";
import ClerkAndConvexProvider from "../src/providers/ClerkAndConvexProvider";
import { SplashScreen } from "expo-router";
import {useFonts} from "expo-font"
import { useCallback } from "react";


SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
const [fontsLoaded] = useFonts({
  "JetBrainsMono-Medium":  require("../assets/fonts/JetBrainsMono-Medium.ttf"),
})

const onLayoutRootView = useCallback(async () =>  {
  if (fontsLoaded) await SplashScreen.hideAsync();
}, [fontsLoaded]);

  return (
    <ClerkAndConvexProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#000"   }} onLayout={onLayoutRootView}>
          <InitialLayout/>
          </SafeAreaView>
        </SafeAreaProvider>
        </ClerkAndConvexProvider>

  );
}
