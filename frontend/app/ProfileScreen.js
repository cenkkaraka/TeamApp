import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// Not: Eğer localStorage kullanıyorsan, onu kullanabilirsin.
// Burada örnek olarak AsyncStorage kullanıldı.
const API_URL = "http://localhost:8000";

export default function ProfileScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "",
    school: "",
    skills: [],
    bio: "",
    portfolio_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [cvUrl, setCvUrl] = useState(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvMessage, setCvMessage] = useState("");
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (res.ok) {
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          role: data.role || "",
          school: data.school || "",
          skills: data.skills ? data.skills.split(",").filter(s => s.trim() !== "") : [],
          bio: data.bio || "",
          portfolio_url: data.portfolio_url || "",
        });
        setCvUrl(data.cv_url || null);
      } else {
        Alert.alert("Hata", data.detail || "Profil yüklenemedi.");
      }
    } catch (err) {
      Alert.alert("Bağlantı Hatası", err.message);
    }
    setLoading(false);
  };

  const handleSkillAdd = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm(f => ({ ...f, skills: [...f.skills, s] }));
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skill) => {
    setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
  };

  const handleSave = async () => {
    setMessage("");
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          skills: form.skills.join(","),
          cv_url: cvUrl || ""
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profil kaydedildi!");
        setTimeout(() => router.replace("/ProfileViewScreen"), 1000);
      } else {
        let msg = data.detail;
        if (Array.isArray(msg)) msg = msg.map(e => e.msg).join(", ");
        else if (typeof msg === "object") msg = JSON.stringify(msg);
        setMessage(msg || "Kaydetme başarısız.");
      }
    } catch (err) {
      setMessage("Bağlantı hatası.");
    }
    setLoading(false);
  };

  // Web için dosya yükleme örneği (React Native'de DocumentPicker ile yapabilirsin)
  const uploadCV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCvUploading(true);
    setCvMessage("");
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("cv", file);

      const res = await fetch(`${API_URL}/users/me/upload_cv`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setCvUrl(data.cv_url);
        setCvMessage("CV başarıyla yüklendi!");
      } else {
        let msg = data.detail;
        if (Array.isArray(msg)) msg = msg.map(e => e.msg).join(", ");
        else if (typeof msg === "object") msg = JSON.stringify(msg);
        setCvMessage(msg || "CV yüklenemedi.");
      }
    } catch (err) {
      setCvMessage("CV yükleme sırasında bağlantı hatası.");
    }
    setCvUploading(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" />
        <Text>Profil yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profilini Düzenle</Text>
      <TextInput
        placeholder="İsim"
        style={styles.input}
        value={form.name}
        onChangeText={v => setForm(f => ({ ...f, name: v }))}
      />
      <TextInput
        placeholder="Telefon"
        style={styles.input}
        value={form.phone}
        onChangeText={v => setForm(f => ({ ...f, phone: v }))}
      />
      <TextInput
        placeholder="Rol"
        style={styles.input}
        value={form.role}
        onChangeText={v => setForm(f => ({ ...f, role: v }))}
      />
      <TextInput
        placeholder="Okul"
        style={styles.input}
        value={form.school}
        onChangeText={v => setForm(f => ({ ...f, school: v }))}
      />
      <TextInput
        placeholder="Biyografi"
        style={styles.input}
        value={form.bio}
        onChangeText={v => setForm(f => ({ ...f, bio: v }))}
        multiline
      />
      <TextInput
        placeholder="Portfolio Linki"
        style={styles.input}
        value={form.portfolio_url}
        onChangeText={v => setForm(f => ({ ...f, portfolio_url: v }))}
      />
      {/* Skill input ve listesi */}
      <View style={styles.skillRow}>
        <TextInput
          placeholder="Skill Ekle"
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          value={skillInput}
          onChangeText={setSkillInput}
          onSubmitEditing={handleSkillAdd}
        />
        <TouchableOpacity style={styles.skillAddBtn} onPress={handleSkillAdd}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Ekle</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}>
        {form.skills.map((skill, idx) => (
          <View key={idx} style={styles.skillBadge}>
            <Text style={styles.skillText}>{skill}</Text>
            <TouchableOpacity onPress={() => handleSkillRemove(skill)}>
              <Text style={styles.removeX}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {/* CV yükleme */}
      <View style={{ marginVertical: 20 }}>
        {/* Web için örnek, React Native için DocumentPicker kullanman gerekir! */}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: "none" }}
          id="cv-upload"
          onChange={uploadCV}
        />
        <Button
          title={cvUploading ? "CV Yükleniyor..." : "CV Yükle"}
          onPress={() => document.getElementById('cv-upload').click()}
          disabled={cvUploading}
        />
        {cvUrl ? (
          <Text style={{ marginTop: 8, color: "green" }}>Yüklenen CV: {cvUrl.split("/").pop()}</Text>
        ) : (
          <Text style={{ marginTop: 8, color: "#555" }}>CV yüklenmedi</Text>
        )}
        {cvMessage ? (
          <Text style={{ color: cvMessage.includes("başarı") ? "green" : "red" }}>{cvMessage}</Text>
        ) : null}
      </View>
      <Button title={loading ? "Kaydediliyor..." : "Kaydet"} onPress={handleSave} disabled={loading} color="#1e90ff" />
      {message ? (
        <Text style={{ color: message.includes("kaydedildi") ? "green" : "red", marginTop: 8, textAlign: "center" }}>
          {message}
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "flex-start", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 18, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 12, padding: 10, borderRadius: 6, fontSize: 16 },
  skillRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  skillAddBtn: { backgroundColor: "#1e90ff", borderRadius: 8, padding: 10, marginLeft: 8 },
  skillBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#e0e0e0", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 8 },
  skillText: { fontSize: 15, color: "#333" },
  removeX: { color: "red", fontWeight: "bold", marginLeft: 6, fontSize: 16 },
});