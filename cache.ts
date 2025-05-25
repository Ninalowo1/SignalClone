import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { TokenCache } from "@clerk/clerk-expo";

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was used 🔐\n`);
        } else {
          console.log("No value stored under key:", key);
        }
        return item;
      } catch (error) {
        console.error("SecureStore getItem error:", error);
        await SecureStore.deleteItemAsync(key); // Clean up the key if there's an error
        return null;
      }
    },

    saveToken: async (key: string, token: string) => {
      try {
        await SecureStore.setItemAsync(key, token);
        console.log(`${key} was saved 🔐\n`);
      } catch (error) {
        console.error("SecureStore setItem error:", error);
      }
    },
  };
};

// Export the tokenCache for non-web platforms
export const tokenCache = Platform.OS !== "web" ? createTokenCache() : undefined;