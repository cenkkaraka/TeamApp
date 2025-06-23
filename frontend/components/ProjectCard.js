import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function ProjectCard({ project, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{project.title}</Text>
      <Text style={styles.sub}>{project.category} | {project.stage}</Text>
      <Text numberOfLines={2}>{project.description}</Text>
      <View style={styles.roles}>
        {(project.roles || []).map((role, i) => (
          <View key={i} style={styles.roleBadge}><Text>{role.name}</Text></View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#f5f5f5", borderRadius: 10, padding: 14, marginBottom: 13 },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 2 },
  sub: { color: "#888", fontSize: 14, marginBottom: 3 },
  roles: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  roleBadge: { backgroundColor: "#d0e8ff", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, marginRight: 7, marginBottom: 7 }
});