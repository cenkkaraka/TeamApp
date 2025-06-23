import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const API_URL = "http://localhost:8000";

export default function MenuScreen() {
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
    } catch (err) {
      // hata yönetimi ekleyebilirsin
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileArea}>
        <View style={styles.logoPlaceholder} />
        <Text style={styles.appName}>TeamApp</Text>
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Text style={styles.hello}>Hello</Text>
            <Text style={styles.userName}>{profile ? profile.name : "Kullanıcı"}</Text>
          </>
        )}
      </View>
      <Text style={styles.categoriesTitle}>Categories</Text>
      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.box}
          onPress={() => router.push("/ProjectListScreen")}
        >
          <Text style={styles.boxText}>Projeler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => router.push("/SavedProjectsScreen")}
        >
          <Text style={styles.boxText}>Kaydedilenler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => router.push("/CreateProjectScreen")}
        >
          <Text style={styles.boxText}>Proje Oluştur</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => router.push("/ApplicationsScreen")}
        >
          <Text style={styles.boxText}>Başvurularım</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => router.push("/MyProjectsScreen")}
        >
          <Text style={styles.boxText}>Projelerim</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#181c2f", padding: 24 },
  profileArea: { alignItems: "center", marginBottom: 16 },
  logoPlaceholder: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: "#fff", marginBottom: 6,
    borderWidth: 2, borderColor: "#e14dff"
  },
  appName: { color: "#fff", fontWeight: "bold", fontSize: 18, marginBottom: 2 },
  hello: { color: "#fff", fontSize: 14, marginBottom: 2 },
  userName: { color: "#e14dff", fontWeight: "bold", fontSize: 17 },
  categoriesTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
    fontWeight: "bold"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  box: {
    backgroundColor: "#282d4d",
    borderRadius: 18,
    width: "47%",
    height: 100,
    marginBottom: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#e14dff",
    shadowOpacity: 0.11,
    shadowRadius: 8,
    elevation: 5,
  },
  boxText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});