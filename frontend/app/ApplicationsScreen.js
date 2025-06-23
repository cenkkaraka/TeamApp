import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import ApplicationCard from "../components/ApplicationCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:8000";

export default function ApplicationsScreen() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/applications/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setApplications(data);
    } catch (err) {}
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={applications}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <ApplicationCard application={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
});