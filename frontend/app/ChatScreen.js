import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

const API_URL = "http://localhost:8000";

export default function ChatScreen() {
  const { projectId, userId, userName } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const flatListRef = useRef();

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/messages/${projectId}/messages/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(data || []);
    } catch (e) {
      setMessages([]);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/messages/${projectId}/messages/send`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ receiver_id: userId, content: message })
      });
      if (res.ok) {
        setMessage("");
        fetchMessages();
        setTimeout(() => flatListRef.current?.scrollToEnd?.(), 500);
      }
    } catch (e) {}
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.message,
      item.is_mine ? styles.myMessage : styles.theirMessage
    ]}>
      <Text style={styles.msgText}>{item.content}</Text>
      <Text style={styles.msgTime}>{item.sent_at?.slice(11,16)}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.header}><Text style={styles.headerText}>{userName}</Text></View>
      {loading ? (
        <ActivityIndicator size="large" style={{marginTop:30}} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 60 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd?.()}
        />
      )}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={message}
          placeholder="Mesaj yaz..."
          onChangeText={setMessage}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 12, backgroundColor: "#ab47bc", alignItems: "center" },
  headerText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  message: { marginVertical:4, maxWidth:"80%", borderRadius:16, padding:8 },
  myMessage: { alignSelf: "flex-end", backgroundColor: "#d1c4e9" },
  theirMessage: { alignSelf: "flex-start", backgroundColor: "#f6f6f6" },
  msgText: { fontSize:15 },
  msgTime: { fontSize:10, color:"#888", alignSelf:"flex-end" },
  inputRow: { flexDirection: "row", position:"absolute", bottom:0, left:0, right:0, backgroundColor:"#fff", padding:8 },
  input: { flex:1, borderWidth:1, borderColor:"#ddd", borderRadius:8, padding:8, marginRight:8 },
  sendBtn: { backgroundColor: "#8e24aa", borderRadius:8, padding:12, alignItems:"center", justifyContent:"center" }
});