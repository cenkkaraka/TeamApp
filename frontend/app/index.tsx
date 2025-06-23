import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

const API_URL = "http://localhost:8000";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      });
      const data = await res.json();
      if (res.ok) {
        await localStorage.setItem("token", data.access_token);
        router.replace("/ProfileScreen");
      } else {
        Alert.alert("Hata", data.detail || "Giriş başarısız.");
      }
    } 
    catch (error) {
      console.error("Login error:", error);
      Alert.alert("Hata", "Giriş sırasında bir hata oluştu.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? "Giriş Yapılıyor..." : "Giriş Yap"} onPress={handleLogin} disabled={loading} />
    
      <Text style={styles.link} onPress={() => router.push("/SignUpScreen")}>
        Hesabın yok mu? Kayıt ol
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 12, padding: 10, borderRadius: 6 },
  link: { color: "#1e90ff", marginTop: 16, textAlign: "center" },
});