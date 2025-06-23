import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const API_URL = "http://localhost:8000";

export default function MyProjectsScreen() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/my-projects/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      let data = await res.json();
      if (res.ok) setProjects(data);
    } catch (err) {}
    setLoading(false);
  };

  const renderProject = ({ item }) => (
    <View
      style={[
        styles.card,
        item.relation === "owner" && styles.ownerCard,
        item.relation === "team" && styles.teamCard,
      ]}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push({ pathname: "/TeamScreen", params: { projectId: item.id } })}
        >
          <Text style={styles.buttonText}>Takım</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push({ pathname: "/ChatMenuScreen", params: { projectId: item.id } })}
        >
          <Text style={styles.buttonText}>Mesajlaşma</Text>
        </TouchableOpacity>
        {item.relation === "owner" && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push({ pathname: "/ProjectApplicationsScreen", params: { projectId: item.id } })}
          >
            <Text style={styles.buttonText}>Başvurular</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.relationText}>
        {item.relation === "owner" ? "Sahibi Olduğunuz Proje" : "Takım Üyesi Olduğunuz Proje"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Projeleriniz yükleniyor...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={projects}
      keyExtractor={item => item.id.toString()}
      renderItem={renderProject}
      contentContainerStyle={projects.length === 0 ? styles.center : undefined}
      ListEmptyComponent={<Text>Henüz proje oluşturmadınız veya takım üyesi olduğunuz proje yok.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f6f6fc",
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 18,
    elevation: 2
  },
  ownerCard: { borderColor: "#7c4dff", borderWidth: 2, backgroundColor: "#ede7f6" },
  teamCard: { borderColor: "#42a5f5", borderWidth: 2, backgroundColor: "#e3f2fd" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  desc: { color: "#444", marginBottom: 10 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    backgroundColor: "#7c4dff",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  relationText: { marginTop: 8, fontStyle: "italic", color: "#888" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }
});