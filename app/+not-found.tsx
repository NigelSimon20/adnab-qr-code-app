import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Page not found</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600" as const,
    marginBottom: 16,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#000",
    borderRadius: 8,
  },
  linkText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500" as const,
  },
});
