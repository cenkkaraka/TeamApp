import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

const API_URL = "http://localhost:8000";

export default function ChatMenuScreen() {
  const { projectId } = useLocalSearchParams();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    const res = await fetch(`${API_URL}/projects/${projectId}/team-chat`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    setTeam(data || []);
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: "/ChatScreen", params: { projectId, userId: item.id, userName: item.name } })}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Takım üyeleri yükleniyor...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={team}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      ListEmptyComponent={<Text>Takımda başka kullanıcı yok.</Text>}
      contentContainerStyle={team.length === 0 ? styles.center : undefined}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 1,
  },
  name: { fontWeight: "bold", fontSize: 15 },
  email: { color: "#666", fontSize: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});