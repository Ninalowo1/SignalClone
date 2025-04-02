import { Text, View, StyleSheet } from "react-native";
import { Link } from 'expo-router'

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
       alignItems: "center",
        justifyContent: "center",
       
      }}
    >
      <Link href={"/notifications"}>visit notification screen</Link>
    </View>
  );
}
