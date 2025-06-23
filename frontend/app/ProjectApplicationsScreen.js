import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

const API_URL = "http://localhost:8000";

export default function ProjectApplicationsScreen() {
  // Eğer expo-router kullanıyorsan:
  const { projectId } = useLocalSearchParams();
  // Eğer klasik navigation kullanıyorsan, props.route.params.projectId şeklinde alabilirsin.

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/applications`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      let data = await res.json();
      if (res.ok && Array.isArray(data)) {
        // Eğer backend sıralamadıysa burada sıralayabiliriz:
        const seen = new Set();
        const uniqueApplications = [];
        for (const app of data.sort((a, b) => (b.match_score || 0) - (a.match_score || 0))) {
        // rol id ve kullanıcı id birlikte anahtar:
          const key = `${app.user?.id || app.user_id}-${app.role?.id || app.role_id}`;
          if (!seen.has(key)) {
            uniqueApplications.push(app);
            seen.add(key);
          }
        }
      
      setApplications(uniqueApplications);
    } else {
      setApplications([]);
    }
  } catch (err) {
    Alert.alert("Hata", "Başvurular yüklenemedi.");
    setApplications([]);
  }
  setLoading(false);
};
  const matchApplication = async (applicationId) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/projects/${projectId}/applications/${applicationId}/match`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        Alert.alert("Başarılı", "Başvuru eşleştirildi!");
        fetchApplications();
      } else {
        const data = await res.json();
        Alert.alert("Hata", data.detail || "Bir hata oluştu.");
      }
    } catch (err) {
      Alert.alert("Bağlantı Hatası", err.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.user}>
        Kullanıcı: {item.user?.name || item.user?.email || item.user_id}
      </Text>
      <Text>Rol: {item.role?.name || item.role_id}</Text>
      <Text>Durum: {item.status}</Text>
      <Text style={styles.score}>
        Eşleşme Skoru: {item.match_score ?? 0}%
      </Text>
      {item.status !== "matched" && (
        <TouchableOpacity
          style={styles.matchBtn}
          onPress={() => matchApplication(item.id)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Eşleştir</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Başvurular yükleniyor...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={applications}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={applications.length === 0 ? styles.center : undefined}
      ListEmptyComponent={<Text>Bu projeye henüz başvuru yok.</Text>}
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
  user: { fontWeight: "bold", fontSize: 15, marginBottom: 4 },
  score: { color: "#7c4dff", fontWeight: "bold", marginBottom: 6 },
  matchBtn: {
    backgroundColor: "#8e24aa",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 6,
    alignSelf: "flex-end"
  },
  center: {
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff"
  }
});