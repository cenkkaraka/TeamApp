import React, { useState, useEffect,useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";

const API_URL = "http://localhost:8000";

export default function CreateProfileScreen() {
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
  const [cvUrl, setCvUrl] = useState(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvMessage, setCvMessage] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setInitialLoading(true);
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
      }
    } catch (err) {}
    setInitialLoading(false);
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
  setLoading(true);
  setMessage("");
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${API_URL}/users/me`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        skills: Array.isArray(form.skills) ? form.skills.join(",") : form.skills,
        cv_url: cvUrl || ""
      })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Profil kaydedildi!");
    } else {
      let msg = data.detail;
      if (Array.isArray(msg)) {
        msg = msg.map(e => e.msg).join(", ");
      } else if (typeof msg === "object") {
        msg = JSON.stringify(msg);
      }
      setMessage(msg || "Kaydetme başarısız.");
    }
  } catch (err) {
    setMessage("Bağlantı hatası.");
  }
  setLoading(false);
};
console.log(JSON.stringify({
  ...form,
  skills: Array.isArray(form.skills) ? form.skills.join(",") : form.skills,
  cv_url: cvUrl || ""
}));
  const uploadCV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCvUploading(true);
    setCvMessage("");
    try {
      const token = localStorage.getItem("token"); // veya AsyncStorage, senin projene göre
      const formData = new FormData();
      formData.append("cv", file);

      const res = await fetch(`${API_URL}/users/me/upload_cv`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          // "Content-Type" elle ekleme!
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setCvUrl(data.cv_url);
        setCvMessage("CV başarıyla yüklendi!");
      } else {
        setCvMessage("CV yüklenemedi.");
      }
    } catch (err) {
      setCvMessage("CV yükleme sırasında bağlantı hatası.");
    }
    setCvUploading(false);
  };

  if (initialLoading) {
    return (
      <View style={[styles.container, {justifyContent: "center"}]}>
        <ActivityIndicator size="large" />
        <Text>Profil yükleniyor...</Text>
      </View>
    );
  }

  const getCvFileName = () => {
    if (!cvUrl) return "";
    const parts = cvUrl.split("_cv_");
    return parts.length > 1 ? parts[1] : cvUrl.split("/").pop();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profili Düzenle</Text>
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
          style={[styles.input, {flex: 1, marginBottom: 0}]}
          value={skillInput}
          onChangeText={setSkillInput}
          onSubmitEditing={handleSkillAdd}
        />
        <TouchableOpacity style={styles.skillAddBtn} onPress={handleSkillAdd}>
          <Text style={{color: "#fff", fontWeight: "bold"}}>Ekle</Text>
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
      <div>
      {/* diğer inputlar */}
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={uploadCV}
      />
      <button
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        disabled={cvUploading}
      >
        {cvUploading ? "CV Yükleniyor..." : "CV Yükle"}
      </button>
      {cvUrl && <div>Yüklenen CV: {cvUrl}</div>}
    </div>
      <Button title={loading ? "Kaydediliyor..." : "Kaydet"} onPress={handleSave} disabled={loading} color="#1e90ff" />
      {message ? <Text style={{ color: message.includes("kaydedildi") ? "green" : "red", marginTop: 8, textAlign: "center" }}>{message}</Text> : null}
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