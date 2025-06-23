import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

const API_URL = "http://localhost:8000";

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setProject(data);
    } catch (err) {}
    setLoading(false);
  };

  // Projeye başvuru
  const applyToRole = async (roleId) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/applications/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ project_id: project.id, role_id: roleId }),
      });
      if (res.ok) {
        Alert.alert("Başarılı", "Başvurun alındı!");
      } else {
        const data = await res.json();
        Alert.alert("Başvuru Hatası", data.detail || "Başvuru yapılamadı.");
      }
    } catch (err) {
      Alert.alert("Bağlantı Hatası", err.message);
    }
  };

  // Projeyi kaydet
  const saveProject = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/saved-projects/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ project_id: project.id }),
      });
      if (res.ok) {
        Alert.alert("Kaydedildi", "Proje kaydedildi!");
      } else {
        const data = await res.json();
        Alert.alert("Kaydetme Hatası", data.detail || "Kaydedilemedi.");
      }
    } catch (err) {
      Alert.alert("Bağlantı Hatası", err.message);
    }
  };

  if (loading || !project) return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Yükleniyor...</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{project.title}</Text>
      <Text style={styles.stage}>{project.stage} - {project.category}</Text>
      <Text style={styles.desc}>{project.description}</Text>
      <Button title="Projeyi Kaydet" onPress={saveProject} />

      <Text style={styles.subtitle}>Roller:</Text>
      {project.roles && project.roles.map(role => (
        <View key={role.id} style={styles.roleCard}>
          <Text style={{ fontWeight: "bold" }}>{role.name}</Text>
          <Text>Gereken Yetkinlikler: {role.skills}</Text>
          <Button title="Bu Role Başvur" onPress={() => applyToRole(role.id)} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  stage: { fontSize: 15, color: "#1e90ff", marginBottom: 10 },
  desc: { fontSize: 16, marginBottom: 12 },
  subtitle: { fontWeight: "bold", fontSize: 18, marginTop: 18, marginBottom: 8 },
  roleCard: { padding: 10, backgroundColor: "#eee", borderRadius: 8, marginBottom: 8 }
});