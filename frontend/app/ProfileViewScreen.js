import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, ActivityIndicator, ScrollView, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const API_URL = "http://localhost:8000";

export default function ProfileViewScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (res.ok) setProfile(data);
      else Alert.alert("Hata", data.detail || "Profil bilgisi yüklenemedi.");
    } catch (err) {
      Alert.alert("Bağlantı Hatası", err.message);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Profil yükleniyor...</Text>
      </View>
    );
  }

  if (!profile) return (
    <View style={styles.center}>
      <Text>Profil bilgisi alınamadı.</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{profile.name}</Text>
      <Text style={styles.label}>E-posta:</Text>
      <Text style={styles.value}>{profile.email}</Text>
      <Text style={styles.label}>Telefon:</Text>
      <Text style={styles.value}>{profile.phone || "-"}</Text>
      <Text style={styles.label}>Rol:</Text>
      <Text style={styles.value}>{profile.role || "-"}</Text>
      <Text style={styles.label}>Okul:</Text>
      <Text style={styles.value}>{profile.school || "-"}</Text>
      <Text style={styles.label}>Yetkinlikler:</Text>
      <View style={{flexDirection: "row", flexWrap: "wrap", marginBottom: 8}}>
        {(profile.skills ? profile.skills.split(",") : []).map((skill, idx) => (
          <Text key={idx} style={styles.skillBadge}>{skill.trim()}</Text>
        ))}
      </View>
      <Text style={styles.label}>Biyografi:</Text>
      <Text style={styles.value}>{profile.bio || "-"}</Text>
      <Text style={styles.label}>CV:</Text>
      <Text style={styles.value}>{profile.cv_url ? profile.cv_url.split("/").pop() : "-"}</Text>
      <Text style={styles.label}>Portfolio:</Text>
      <Text style={styles.value}>{profile.portfolio_url || "-"}</Text>

      <View style={styles.buttonRow}>
        <Button title="Profil Düzenle" onPress={() => router.push("/ProfileScreen")} />
        <TouchableOpacity
          style={styles.createProjectBtn}
          onPress={() => router.push("/MenuScreen")}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Menü</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#fff", flexGrow: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  label: { fontWeight: "bold", marginTop: 10 },
  value: { marginBottom: 6, color: "#444" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 30, gap: 10, alignItems: "center" },
  skillBadge: { backgroundColor: "#e0e0e0", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8, marginBottom: 8, fontSize: 14 },
  createProjectBtn: { backgroundColor: "#8e24aa", paddingVertical: 12, paddingHorizontal: 18, borderRadius: 8 }
});