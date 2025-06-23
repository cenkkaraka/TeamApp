import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

const API_URL = "http://localhost:8000";

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Başarılı", "Kayıt başarılı! Giriş yapabilirsin.");
        router.replace("/");
      } else {
        Alert.alert("Hata", data.detail || "Kayıt başarısız.");
      }
    } catch (err) {
      Alert.alert("Bağlantı Hatası", err.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput
        style={styles.input}
        placeholder="İsim"
        value={form.name}
        onChangeText={v => setForm(f => ({ ...f, name: v }))}
      />
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        autoCapitalize="none"
        value={form.email}
        onChangeText={v => setForm(f => ({ ...f, email: v }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={form.password}
        onChangeText={v => setForm(f => ({ ...f, password: v }))}
      />
      <Button title={loading ? "Kayıt Olunuyor..." : "Kayıt Ol"} onPress={handleRegister} disabled={loading} />
      <Text style={styles.link} onPress={() => router.replace("/")}>
        Zaten hesabın var mı? Giriş Yap
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