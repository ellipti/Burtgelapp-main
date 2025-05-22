import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Image, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Анхааруулга', 'Нэвтрэх нэр болон нууц үгээ оруулна уу');
      return;
    }

    console.log('🔐 LOGIN ➤ Хэрэглэгч нэвтрэх гэж байна:', username);

    try {
      const userData = await login(username, password);

      if (userData.role === 'admin' || userData.role === 'user') {
        navigation.replace('AdminHome');
      } else {
        Alert.alert('Алдаа', 'Энэ төрлийн хэрэглэгч нэвтрэх боломжгүй');
      }

    } catch (err) {
      console.error('❌ LOGIN ➤ Нэвтрэх үед алдаа:', err.message);
      Alert.alert('Сервер алдаа', err.message || 'Сервер холбогдож чадсангүй');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../../assets/img/back.jpg')}
          style={styles.logo}
        />
        <Text style={styles.title}>Нэвтрэх</Text>

        <TextInput
          placeholder="Нэвтрэх нэр"
          placeholderTextColor="#999"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Нууц үг"
          placeholderTextColor="#999"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Нэвтрэх</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f8', justifyContent: 'center', alignItems: 'center' },
  card: {
    width: '85%', backgroundColor: '#fff', padding: 24, borderRadius: 16,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12, elevation: 6, alignItems: 'center'
  },
  logo: { width: 80, height: 80, marginBottom: 16, borderRadius: 8 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, color: '#2c3e50' },
  input: {
    width: '100%', backgroundColor: '#f1f3f6', borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 16, fontSize: 16,
    marginBottom: 14, color: '#333'
  },
  button: {
    width: '100%', backgroundColor: '#3498db', paddingVertical: 14,
    borderRadius: 10, alignItems: 'center', marginTop: 8
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
