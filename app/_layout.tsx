import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { tokenCache } from "@/cache";
import Constants from "expo-constants";
import InitialLayout from "@/components/InitialLayout";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";







export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#000"   }}>
          <InitialLayout/>
          </SafeAreaView>
        </SafeAreaProvider>
        </ClerkAndConvexProvider>

  );
}
