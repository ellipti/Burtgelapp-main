
// src/screens/AdminHomeScreen.js
import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, LayoutAnimation, Platform,
  UIManager, Alert, Linking, Modal, ToastAndroid
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { PlayerContext } from '../contexts/PlayerContext';
import { AuthContext } from '../contexts/AuthContext';
import { BASE_URL } from '../config/config';
import { Provider as PaperProvider, Appbar, Menu } from 'react-native-paper';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AdminHomeScreen() {
  const { userType, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const [search, setSearch] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editFacebook, setEditFacebook] = useState('');

  const [players, setPlayers] = useState([]);

  const [visible, setVisible] = useState(false);

  // Functions to control menu visibility
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // Example action for menu items
  const handleMenuItemPress = (option) => {
    navigation.navigate('Report');
    closeMenu();
  };


  const fetchUsers = () => {
    fetch(`${BASE_URL}/api/users/list`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setPlayers(data);
      })
      .catch(err => console.error('❌ Хэрэглэгч авахад алдаа:', err.message));
  }

  const updatePlayer = (id, name, phone, facebook, note) => {
    fetch(`${BASE_URL}/api/users/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, phone, facebook, note })
    })
      .then(res => res.json())
      .then(data => {
        console.log('update: ', data);
        Alert.alert('Амжилттай', 'Хэрэглэгч zaslaa');
        fetchUsers();
      })
      .catch(err => console.error('❌ Хэрэглэгч zasahad алдаа:', err.message));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const openEditModal = (player) => {
    setSelectedPlayer(player);
    setEditName(player.name);
    setEditPhone(player.phone);
    setEditNote(player.note || '');
    setEditFacebook(player.facebook || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    updatePlayer(
      selectedPlayer._id,
      editName,
      editPhone,
      editFacebook,
      editNote,
    );
    setShowEditModal(false);
    ToastAndroid.show("✅ Амжилттай заслаа", ToastAndroid.SHORT);
  };

  const handleDeleteRequest = (player) => {
    setSelectedPlayer(player);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedPlayer) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowDeleteModal(false);
      setSelectedPlayer(null);
      fetch(`${BASE_URL}/api/users/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPlayer._id })
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          Alert.alert('Амжилттай', 'Хэрэглэгч устгалаа');
          fetchUsers();
        })
        .catch(err => {
          console.error('❌ Хэрэглэгч устгахад алдаа алдаа:', err.message);
          Alert.alert('Алдаа', 'Хэрэглэгч устгахад алдаа гарлаа');
        });
    }
  };

  const handleToggleFavorite = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    fetch(`${BASE_URL}/api/users/favourite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        Alert.alert('Амжилттай', 'Хэрэглэгч favourite bolloo');
        fetchUsers();
      })
      .catch(err => {
        console.error('❌ Хэрэглэгч favourite болгоход алдаа гарлаа:', err.message);
        Alert.alert('Алдаа', 'Хэрэглэгч favourite болгоход алдаа гарлаа');
      });
  };

  const handleToggleBlacklist = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    fetch(`${BASE_URL}/api/users/blacklist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        Alert.alert('Амжилттай', 'Хэрэглэгч blacklist orloo');
        fetchUsers();
      })
      .catch(err => {
        console.error('❌ Хэрэглэгч blacklist nemehed алдаа гарлаа:', err.message);
        Alert.alert('Алдаа', 'Хэрэглэгч blacklist nemehed алдаа гарлаа');
      });
  };

  const openFacebook = async (link) => {
    if (link && link.startsWith('http')) {
      const supported = await Linking.canOpenURL(link);
      if (supported) {
        Linking.openURL(link).catch(err => console.error('Failed to open FB:', err));
      } else {
        Alert.alert('⚠️ Боломжгүй', 'Facebook линк нээгдэх боломжгүй байна.');
      }
    }
  };

  const filteredPlayers = players
    .filter(p => (showFavorites ? p.favourite : showBlacklist ? p.blacklist : true))
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      {/* Delete Modal */}
      <Modal visible={showDeleteModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Устгах уу?</Text>
            <Text style={styles.modalMessage}>
              {selectedPlayer?.name} тоглогчийг бүр мөсөн устгах уу?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={styles.modalCancel}>
                <Text style={styles.modalBtnText}>Цуцлах</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete} style={styles.modalDelete}>
                <Text style={styles.modalBtnText}>Устгах</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✏️ Тоглогч засах</Text>

            <Text style={styles.inputLabel}>ID</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="ID оруулна уу"
            />

            <Text style={styles.inputLabel}>Утас</Text>
            <TextInput
              style={styles.input}
              value={editPhone}
              onChangeText={setEditPhone}
              keyboardType="phone-pad"
              placeholder="Утасны дугаар"
            />

            <Text style={styles.inputLabel}>Тайлбар</Text>
            <TextInput
              style={styles.input}
              value={editNote}
              onChangeText={setEditNote}
              placeholder="Тайлбар"
            />

            <Text style={styles.inputLabel}>Facebook линк</Text>
            <TextInput
              style={styles.input}
              value={editFacebook}
              onChangeText={setEditFacebook}
              placeholder="https://facebook.com/..."
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowEditModal(false)} style={styles.modalCancel}>
                <Text style={styles.modalBtnText}>Болих</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveEdit} style={styles.modalSave}>
                <Text style={styles.modalBtnText}>Хадгалах</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* Header */}
      <Appbar.Header style={styles.headerWrapper}>
        <Appbar.Content title="Админ самбар" />
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="dots-vertical" color="#000" onPress={openMenu} />}
          contentStyle={styles.menuContent}
        >
          <Menu.Item
            onPress={() => handleMenuItemPress()}
            title="Мэдээ өгөх"
            leadingIcon="cog"
          />
          <Menu.Item
            onPress={() => {
              logout();
              navigation.replace('Login'); // Uncomment if using navigation
            }}
            title="Гарах"
            leadingIcon="logout"
          />
        </Menu>
      </Appbar.Header>

      <TextInput
        style={styles.search}
        placeholder="ID-гаар хайх..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tab} onPress={() => setShowFavorites(false)}>
          <Text style={styles.tabText}>📋 Бүх тоглогч</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabDark} onPress={() => setShowFavorites(true)}>
          <Text style={styles.tabDarkText}>Blacklist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setShowFavorites(true)}>
          <Text style={styles.tabText}>❤️ favourite</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddUser')}>
        <Text style={styles.addButtonText}>➕ Тоглогч нэмэх</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => openEditModal(item)}>
              <View style={styles.cardHeader}>
                <Text style={styles.playerName}>{item.name}</Text>
                <Text style={styles.favoriteIcon}>{item.favourite ? '❤️' : '🤍'}</Text>
              </View>
              <Text style={styles.playerPhone}>📞 {item.phone}</Text>
              {item.note ? <Text style={styles.playerNote}>📝 {item.note}</Text> : null}
              {item.facebook && (
                <TouchableOpacity onPress={() => openFacebook(item.facebook)}>
                  <Text style={styles.fbLink}>🌐 Facebook линк харах</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleToggleBlacklist(item._id)} style={styles.actionBtnDark}>
                <Text style={styles.actionText}>{item.blacklist ? 'Remove blacklist' : 'Blacklist'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleToggleFavorite(item._id)} style={styles.actionBtn}>
                <Text style={styles.actionText}>{item.favourite ? '🌟 Remove favourite' : '🌟 favourite'}</Text>
              </TouchableOpacity>
              {userType === 'admin' && (
                <TouchableOpacity onPress={() => handleDeleteRequest(item)} style={styles.actionBtnDanger}>
                  <Text style={styles.actionText}>🗑️ Устгах</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>📭 Тоглогч бүртгэгдээгүй байна</Text>}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginTop: 8
  },
  input: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14
  },
  modalSave: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8
  },
  container: { flex: 1, backgroundColor: '#fefefe', padding: 16 },
  headerWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  containerHeader: {
    zIndex: 1000, // Ensure the app bar and menu are above other components
  },
  appbar: {
    marginTop: 0,
    padding: 0,
    backgroundColor: '#ecf0f1', // Optional: Customize app bar color
    height: 50
  },
  menuContent: {
    backgroundColor: '#fff', // Optional: Customize menu background
    zIndex: 1000, // Ensure menu appears above other elements
  },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  tab: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#ecf0f1', borderRadius: 8 },
  tabDark: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#000', borderRadius: 8 },
  tabText: { fontWeight: '600', color: '#333' },
  tabDarkText: { fontWeight: '600', color: '#fff' },
  addButton: { backgroundColor: '#2ecc71', paddingVertical: 12, borderRadius: 10, marginBottom: 16 },
  addButtonText: { textAlign: 'center', color: 'white', fontSize: 16, fontWeight: 'bold' },
  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  playerName: { fontSize: 18, fontWeight: '600', color: '#111' },
  favoriteIcon: { fontSize: 20 },
  playerPhone: { marginTop: 6, fontSize: 14, color: '#444' },
  playerNote: { marginTop: 4, fontSize: 13, color: '#888', fontStyle: 'italic' },
  fbLink: { marginTop: 6, color: '#2980b9', fontSize: 14, fontWeight: '500' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  actionBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#3498db', borderRadius: 8, marginRight: 10 },
  actionBtnDark: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#000', borderRadius: 8, marginRight: 10 },
  actionBtnDanger: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#e74c3c', borderRadius: 8 },
  actionText: { color: '#fff', fontWeight: '500' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 50, fontSize: 16, fontStyle: 'italic' },

  // Modal styles
  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: '#fff', padding: 20, borderRadius: 10,
    width: '80%', alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#c0392b'
  },
  modalMessage: {
    fontSize: 14, color: '#333', marginBottom: 20, textAlign: 'center'
  },
  modalButtons: {
    flexDirection: 'row', justifyContent: 'space-between', width: '100%'
  },
  modalCancel: {
    backgroundColor: '#bdc3c7', padding: 10, borderRadius: 6, flex: 1, marginRight: 8
  },
  modalDelete: {
    backgroundColor: '#e74c3c', padding: 10, borderRadius: 6, flex: 1
  },
  modalBtnText: {
    color: '#fff', textAlign: 'center', fontWeight: '600'
  }
});
