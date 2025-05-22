import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function AddUserScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [phone, setPhone] = useState('');

  const BASE_URL = 'http://172.20.10.12:8000';

  const handleSubmit = () => {
    fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, phone })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        Alert.alert('Амжилттай', 'Хэрэглэгч нэмэгдлээ');
      })
      .catch(err => {
        console.error('❌ Хэрэглэгч нэмэхэд алдаа:', err.message);
        Alert.alert('Алдаа', 'Хэрэглэгч нэмэхэд алдаа гарлаа');
      });
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Нэр" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Имэйл" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Утас" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Төрөл (user/admin/player)" value={role} onChangeText={setRole} />
      <Button title="Хадгалах" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: {
    borderWidth: 1, marginVertical: 8, padding: 8, borderRadius: 5
  }
});
