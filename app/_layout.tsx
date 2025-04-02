import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { tokenCache } from "@/cache";
import Constants from "expo-constants";
import InitialLayout from "@/componets/InitialLayout";


const publishableKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_PUBLISHABLE_KEY;




export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#000"   }}>
          <InitialLayout/>
          </SafeAreaView>
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>

  );
}
