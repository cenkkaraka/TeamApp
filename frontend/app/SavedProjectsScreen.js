import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import ProjectCard from "../components/ProjectCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:8000";

export default function SavedProjectsScreen() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedProjects();
  }, []);

  const loadSavedProjects = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/saved-projects/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();// Benzersiz id'li projeleri al
      const uniqueProjects = [];
      const seenIds = new Set();
      for (const p of data.map(sp => sp.project)) {
        if (p && p.id && !seenIds.has(p.id)) {
          uniqueProjects.push(p);
          seenIds.add(p.id);
        }
      }

      if (res.ok) setProjects(uniqueProjects); // Backend'de saved_projects.project ilişkisi olmalı!
    } catch (err) {}
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={projects}
          keyExtractor={item => (item?.id ? item.id.toString() : Math.random().toString())}
          renderItem={({ item }) =>
            item && item.title
              ? <ProjectCard project={item} />
              : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
});