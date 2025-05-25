import { useAuth, useUser } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@../../convex/api";

export default function InitialLayout() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const segments = useSegments();
  const router = useRouter();
  const createUser = useMutation(api.users.createUser);
  const [hasCreatedUser, setHasCreatedUser] = useState(false);

  const inAuthScreen = segments[0] === "(auth)";

  useEffect(() => {
    if (!authLoaded || !userLoaded) return;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)/login");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [authLoaded, isSignedIn, segments, userLoaded]);

  useEffect(() => {
    const run = async () => {
      if (authLoaded && userLoaded && isSignedIn && user && !hasCreatedUser) {
        try {
          await createUser({
            username: user.username ?? user.id,
            fullname: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
            email: user.primaryEmailAddress?.emailAddress ?? "",
            bio: "",
            image: user.imageUrl,
            clerkId: user.id,
          });
          setHasCreatedUser(true);
        } catch (e) {
          console.error("Failed to create user in Convex", e);
        }
      }
    };
    run();
  }, [authLoaded, userLoaded, isSignedIn, user, hasCreatedUser]);

  if (!authLoaded || !userLoaded || (isSignedIn && !hasCreatedUser)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
