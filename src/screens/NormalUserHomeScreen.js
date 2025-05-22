// src/screens/NormalUserHomeScreen.js (with Facebook link if available)
import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, LayoutAnimation, Platform, UIManager, Linking } from 'react-native';
import { PlayerContext } from '../contexts/PlayerContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function NormalUserHomeScreen() {
  const { players, toggleFavorite } = useContext(PlayerContext);
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredPlayers = players
    .filter(p => (showFavorites ? p.favorite : true))
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  const handleToggleFavorite = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleFavorite(id);
  };

  const openFacebook = (link) => {
    if (link && link.startsWith('http')) {
      Linking.openURL(link).catch(err => console.error('Failed to open FB:', err));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.title}>📋 Самбар</Text>
        <TouchableOpacity onPress={() => { logout(); navigation.replace('Login'); }}>
          <Text style={styles.logout}>🚪 Гарах</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Хайх..."
        value={search}
        onChangeText={setSearch}
      />
    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddUser')}>
  <Text style={styles.addButtonText}>➕ Тоглогч нэмэх</Text>
</TouchableOpacity>

      <View style={styles.toggleRow}>
        <TouchableOpacity style={styles.toggleBtn} onPress={() => setShowFavorites(false)}>
          <Text style={[styles.toggleText, !showFavorites && styles.activeToggle]}>📋 Бүгд</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleBtn} onPress={() => setShowFavorites(true)}>
          <Text style={[styles.toggleText, showFavorites && styles.activeToggle]}>❤️ Фаворит</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.sortButton} onPress={() => setSortAsc(!sortAsc)}>
        <Text style={styles.sortText}>🔃 Эрэмбэлэх ({sortAsc ? 'A-Z' : 'Z-A'})</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => Alert.alert('Тоглогчийн мэдээлэл', `Нэр: ${item.name}\nУтас: ${item.phone}\nТайлбар: ${item.note || 'Байхгүй'}`)}>
            <View style={styles.cardHeader}>
              <Text style={styles.playerName}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleToggleFavorite(item.id)}>
                <Text style={styles.favoriteIcon}>{item.favorite ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.playerPhone}>📞 {item.phone}</Text>
            {item.note ? <Text style={styles.playerNote}>📝 {item.note}</Text> : null}
            {item.facebook && (
              <TouchableOpacity onPress={() => openFacebook(item.facebook)}>
                <Text style={styles.fbLink}>🌐 Facebook линк харах</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>📭 Тоглогч бүртгэгдээгүй байна</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    addButton: {
  backgroundColor: '#2ecc71',
  paddingVertical: 12,
  borderRadius: 10,
  marginBottom: 10,
  alignItems: 'center'
},
addButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600'
},

  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  headerWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  logout: { fontSize: 16, color: '#e74c3c', fontWeight: '500' },
  search: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10
  },
  sortButton: {
    backgroundColor: '#ecf0f1',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  sortText: { fontSize: 14, color: '#333', fontWeight: '500' },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  toggleText: { fontSize: 14, color: '#999', fontWeight: '600' },
  activeToggle: { color: '#3498db' },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerName: { fontSize: 16, fontWeight: '600', color: '#111' },
  playerPhone: { fontSize: 14, color: '#444', marginTop: 6 },
  playerNote: { fontSize: 13, fontStyle: 'italic', color: '#777', marginTop: 4 },
  favoriteIcon: { fontSize: 20 },
  fbLink: { marginTop: 6, color: '#2980b9', fontSize: 14, fontWeight: '500' },
  empty: { textAlign: 'center', color: '#aaa', fontStyle: 'italic', fontSize: 16 },
});
