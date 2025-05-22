// src/screens/FavoritePlayersScreen.js (Search, Sort, Detail)
import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert } from 'react-native';
import { PlayerContext } from '../contexts/PlayerContext';
import { useNavigation } from '@react-navigation/native';

export default function FavoritePlayersScreen() {
  const { players } = useContext(PlayerContext);
  const navigation = useNavigation();

  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const favorites = players.filter(p => p.favorite);
  const filteredFavorites = favorites
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  const showDetails = (player) => {
    Alert.alert('Тоглогчийн мэдээлэл', `Нэр: ${player.name}\nУтас: ${player.phone}\nТайлбар: ${player.note || 'Байхгүй'}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>❤️ Фаворит тоглогчид</Text>
        <TextInput
          style={styles.search}
          placeholder="Хайх..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.sortButton} onPress={() => setSortAsc(!sortAsc)}>
          <Text style={styles.sortText}>🔃 Эрэмбэлэх ({sortAsc ? 'A-Z' : 'Z-A'})</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={filteredFavorites.length === 0 && { flexGrow: 1, justifyContent: 'center' }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => showDetails(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.phone}>📞 {item.phone}</Text>
            {item.note ? <Text style={styles.note}>📝 {item.note}</Text> : null}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Фаворит тоглогч олдсонгүй</Text>}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Буцах</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefefe', padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  search: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  sortButton: {
    backgroundColor: '#ecf0f1',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  sortText: { fontSize: 14, color: '#333', fontWeight: '500' },
  card: { backgroundColor: '#f9f9f9', padding: 14, borderRadius: 10, marginBottom: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#111' },
  phone: { fontSize: 14, color: '#444', marginTop: 4 },
  note: { fontSize: 13, fontStyle: 'italic', color: '#777', marginTop: 4 },
  empty: { textAlign: 'center', color: '#aaa', fontStyle: 'italic', fontSize: 16 },
  backButton: {
    backgroundColor: '#ddd',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
});