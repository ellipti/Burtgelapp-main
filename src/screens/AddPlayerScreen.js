// src/screens/AddPlayerScreen.js (UI шинэчилсэн загвар)
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { PlayerContext } from '../contexts/PlayerContext';
import { useNavigation } from '@react-navigation/native';

export default function AddPlayerScreen() {
  const { addPlayer } = useContext(PlayerContext);
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [facebook, setFacebook] = useState('');
  const [note, setNote] = useState('');

  const BASE_URL = 'http://192.168.1.92:8000';

  const handleSubmit = () => {
    if (!name || !phone) {
      Alert.alert('⚠️ Алдаа', 'Нэр болон утас заавал бөглөгдөнө.');
      return;
    }
    fetch(`${BASE_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, facebook, note })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        Alert.alert('Амжилттай', 'Хэрэглэгч нэмэгдлээ');
        navigation.goBack();
      })
      .catch(err => {
        console.error('❌ Хэрэглэгч нэмэхэд алдаа:', err.message);
        Alert.alert('Алдаа', 'Хэрэглэгч нэмэхэд алдаа гарлаа');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.title}>➕ Тоглогч бүртгэх</Text>

        <TextInput
          style={styles.input}
          placeholder="Нэр *"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Утасны дугаар *"
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Facebook линк"
          value={facebook}
          onChangeText={setFacebook}
        />
        <TextInput
          style={styles.textArea}
          placeholder="Tайлбар"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Хадгалах</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Буцах</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefefe' },
  form: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, color: '#333' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#ddd',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
});