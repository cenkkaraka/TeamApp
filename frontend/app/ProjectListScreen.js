import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

const API_URL = "http://localhost:8000";

export default function ProjectListScreen() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/projects/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (res.ok) setProjects(data);
    } catch (err) {
      // Hata yönetimi (isteğe bağlı)
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  };
  const ignoreProject = async (projectId) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:8000/projects/${projectId}/ignore`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (res.ok) {
      Alert.alert("Başarılı", "Bu proje bir daha karşınıza çıkmayacak!");
      fetchProjects(); // Listeyi tazele
    } else {
      const data = await res.json();
      Alert.alert("Hata", data.detail || "Bir hata oluştu.");
    }
  } catch (err) {
    Alert.alert("Bağlantı Hatası", err.message);
  }
};
  const renderProject = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: "/ProjectDetailScreen", params: { id: item.id } })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.stage}>{item.stage} - {item.category}</Text>
      <Text numberOfLines={2} style={styles.desc}>{item.description}</Text>
      <Text style={styles.owner}>Sahip: {item.owner_name || item.owner_id}</Text>
      <TouchableOpacity
        style={{ backgroundColor: "#c62828", padding: 7, borderRadius: 8, marginTop: 8, alignSelf: "flex-end" }}
        onPress={() => ignoreProject(item.id)}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>İlgilenmiyorum</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Projeler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={projects}
      keyExtractor={item => item.id.toString()}
      renderItem={renderProject}
      contentContainerStyle={projects.length === 0 ? styles.center : undefined}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <Text>Hiç proje bulunamadı.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f6f6fc",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 2
  },
  title: { fontSize: 19, fontWeight: "bold", marginBottom: 6 },
  stage: { color: "#7c4dff", fontWeight: "bold", marginBottom: 4 },
  desc: { color: "#444", marginBottom: 7 },
  owner: { fontSize: 12, color: "#888" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }
});