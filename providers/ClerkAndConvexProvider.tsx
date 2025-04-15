import {tokenCache} from "@/cache"
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo'
import Constants from 'expo-constants'
import { useAuth } from "@clerk/clerk-expo"
import {ConvexReactClient} from "convex/react"

import {ConvexProviderWithClerk} from "convex/react-clerk"

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
})

const publishableKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_PUBLISHABLE_KEY;

if(!publishableKey) {
  throw new Error ( 
  "Missing Publishable Key. please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export default function ClerkAndConvexProvider({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
    <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
    <ClerkLoaded>{children}</ClerkLoaded>
    </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}