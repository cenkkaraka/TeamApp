import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

const API_URL = "http://localhost:8000";

const CATEGORY_OPTIONS = [
  { label: "E-Commerce", value: "ecommerce" },
  { label: "Health", value: "health" },
  { label: "Education", value: "education" },
  { label: "Other", value: "other" }
];

const STAGE_OPTIONS = [
  { label: "idea", value: "idea" },
  { label: "prototype", value: "prototype" },
  { label: "launched", value: "launched" }
];

export default function CreateProjectScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].value);
  const [stage, setStage] = useState(STAGE_OPTIONS[0].value);
  const [roles, setRoles] = useState([]);
  const [roleInput, setRoleInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [roleSkills, setRoleSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddRole = () => {
    const role = roleInput.trim();
    if (role && !roles.some(r => r.name === role)) {
      setRoles([...roles, { name: role, skills: [...roleSkills] }]);
      setRoleInput("");
      setRoleSkills([]);
      setSkillInput("");
    }
  };

  const handleRemoveRole = (roleName) => {
    setRoles(roles.filter(r => r.name !== roleName));
  };

  const handleRoleSkillAdd = () => {
    const s = skillInput.trim();
    if (s && !roleSkills.includes(s)) {
      setRoleSkills([...roleSkills, s]);
      setSkillInput("");
    }
  };

  const handleRoleSkillRemove = (s) => {
    setRoleSkills(roleSkills.filter(x => x !== s));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setMessage("Proje adı zorunlu.");
      return;
    }
    if (roles.length === 0) {
      setMessage("En az bir rol eklemelisin.");
      return;
    }
    setLoading(true);
    setMessage("");
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          stage,
          roles // [{ name, skills }]
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Proje başarıyla oluşturuldu!");
        setTimeout(() => router.replace("/MenuScreen"), 1000);
      } else {
        setMessage(data.detail || "Proje oluşturulamadı.");
      }
    } catch (err) {
      setMessage("Bağlantı hatası.");
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Proje Oluştur</Text>
      <TextInput
        placeholder="Proje Adı"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Kısa Açıklama"
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Kategori</Text>
      <Picker selectedValue={category} onValueChange={setCategory} style={styles.picker}>
        {CATEGORY_OPTIONS.map(opt => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>
      <Text style={styles.label}>Aşama</Text>
      <Picker selectedValue={stage} onValueChange={setStage} style={styles.picker}>
        {STAGE_OPTIONS.map(opt => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>
      <Text style={styles.label}>Roller</Text>
      {/* Rol ekleme */}
      <TextInput
        placeholder="Rol adı (örn: Backend Developer)"
        style={[styles.input, { marginBottom: 4 }]}
        value={roleInput}
        onChangeText={setRoleInput}
      />
      {/* Rol için skill ekleme */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
        <TextInput
          placeholder="Rol için skill ekle"
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          value={skillInput}
          onChangeText={setSkillInput}
          onSubmitEditing={handleRoleSkillAdd}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleRoleSkillAdd}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Ekle</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
        {roleSkills.map((skill, idx) => (
          <View key={idx} style={styles.roleBadge}>
            <Text style={styles.roleText}>{skill}</Text>
            <TouchableOpacity onPress={() => handleRoleSkillRemove(skill)}>
              <Text style={styles.removeX}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <Button title="Rolü Ekle" onPress={handleAddRole} />
      {/* Eklenen roller */}
      <View style={{ marginTop: 14 }}>
        {roles.map((role, idx) => (
          <View key={idx} style={styles.roleBlock}>
            <Text style={{ fontWeight: "bold" }}>{role.name}</Text>
            <Text>Yetenekler: {(role.skills || []).join(", ")}</Text>
            <TouchableOpacity onPress={() => handleRemoveRole(role.name)}>
              <Text style={{ color: "red" }}>Kaldır</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <Button title={loading ? "Kaydediliyor..." : "Kaydet"} onPress={handleSave} disabled={loading} color="#1e90ff" />
      {message ? <Text style={{ color: message.includes("başarı") ? "green" : "red", marginTop: 16 }}>{message}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "flex-start", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 18, textAlign: "center" },
  label: { fontWeight: "bold", marginTop: 8, marginBottom: 4, fontSize: 16 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 16 },
  picker: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 12 },
  addBtn: { backgroundColor: "#1e90ff", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16, marginLeft: 8 },
  roleBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#e0e0e0", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 8 },
  roleText: { fontSize: 15, color: "#333" },
  removeX: { color: "red", fontWeight: "bold", marginLeft: 6, fontSize: 16 },
  roleBlock: { backgroundColor: "#f5f5f5", borderRadius: 8, padding: 8, marginBottom: 10 }
});