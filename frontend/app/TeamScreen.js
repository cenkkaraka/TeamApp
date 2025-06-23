import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

const API_URL = "http://localhost:8000";

export default function TeamScreen() {
  const { projectId } = useLocalSearchParams();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      // 1. Proje detayını çek (owner_id için)
      const resProject = await fetch(`${API_URL}/projects/${projectId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const project = await resProject.json();

      // 2. Proje sahibinin user datasını çek (Varsa böyle bir endpoint!)
      let owner = null;
      try {
        const resOwner = await fetch(`${API_URL}/users/${project.owner_id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (resOwner.ok) {
          owner = await resOwner.json();
        }
      } catch (e) {
        // Eğer user endpoint'in yoksa owner null kalır ve aşağıda fallback uygulanır.
      }

      // 3. Takım üyelerini çek
      const resTeam = await fetch(`${API_URL}/projects/${projectId}/team`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const teamData = await resTeam.json();

      // 4. Owner'ı takımın başına ekle (owner endpoint varsa user objesiyle, yoksa sadece id ve name ile)
      const ownerUser = {
        user: owner
          ? owner
          : {
              id: project.owner_id,
              name: project.owner_name || "Proje Sahibi",
              skills: project.owner_skills || "",
              school: project.owner_school || "",
              bio: project.owner_bio || "",
            },
        role: { name: "Proje Sahibi", skills: owner?.skills || project.owner_skills || "" },
        is_owner: true,
      };

      // Takımın başına proje sahibini ekle, tekrar eden kullanıcıları filtrele
      const allMembers = [ownerUser, ...teamData.map(member => ({ ...member, is_owner: false }))];

      // Tekilleştirme: sadece ilk karşılaşılan user'ı ekle
      const seen = new Set();
      const uniqueTeam = [];
      for (const member of allMembers) {
        if (!seen.has(member.user.id)) {
          uniqueTeam.push(member);
          seen.add(member.user.id);
        }
      }

      setTeam(uniqueTeam);
    } catch (e) {
      setTeam([]);
    }
    setLoading(false);
  };

  const renderMember = ({ item }) => (
    <View style={[styles.card, item.is_owner && styles.ownerCard]}>
      <Text style={styles.name}>
        {item.user.name} {item.is_owner ? "(Proje Sahibi)" : ""}
      </Text>
      <Text>Rol: {item.role.name}</Text>
      <Text>Yetenekler: {item.user.skills}</Text>
      <Text>Okul: {item.user.school}</Text>
      {item.user.bio ? <Text>{item.user.bio}</Text> : null}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Takım yükleniyor...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={team}
      keyExtractor={item => `${item.user.id}-${item.role.name}`}
      renderItem={renderMember}
      contentContainerStyle={team.length === 0 ? styles.center : undefined}
      ListEmptyComponent={<Text>Takımda kimse yok.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f6f6fc",
    borderRadius: 12,
    margin: 12,
    padding: 16,
  },
  ownerCard: {
    borderColor: "#ffa000",
    borderWidth: 2,
    backgroundColor: "#fffde7",
  },
  name: { fontWeight: "bold", fontSize: 16, marginBottom: 2 },
  center: {
    flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff"
  }
});