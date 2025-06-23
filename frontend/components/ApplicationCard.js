import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ApplicationCard({ application, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>Başvuru No: {application.id}</Text>
      <Text>Kullanıcı: {application.user_id}</Text>
      <Text>Proje: {application.project_id}</Text>
      <Text>Rol: {application.role_id}</Text>
      <Text>Durum: {application.status}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, marginVertical: 8, backgroundColor: "#fafafa", borderRadius: 8, elevation: 2 },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
});