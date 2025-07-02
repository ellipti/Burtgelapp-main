import React, { useEffect, useState } from 'react';
import {
    FlatList, StyleSheet, Alert
} from 'react-native';
import {
    Appbar, Button, Dialog, Portal, TextInput, List, Provider as PaperProvider
} from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../config/config';

export default function LoanInputScreen() {
    const navigation = useNavigation();

    const [loanUsers, setLoanUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDropdownValue, setUserDropdownValue] = useState(null);
    const [amount, setAmount] = useState('');
    const [editMode, setEditMode] = useState(false);

    // 🔁 Load loan list
    const loadLoanUsers = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/loan/list`);
            const data = await res.json();
            setLoanUsers(data);
        } catch (err) {
            console.error('Failed to fetch loan users:', err);
        }
    };

    // 🔁 Load all available users from /api/users/list
    const loadAllUsers = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/users/list`);
            const data = await res.json();
            setAllUsers(data);
        } catch (err) {
            console.error('Failed to fetch user list:', err);
        }
    };

    useEffect(() => {
        loadLoanUsers();
        loadAllUsers();
    }, []);

    const showAddDialog = () => {
        setDialogVisible(true);
        setSelectedUser(null);
        setUserDropdownValue(null);
        setAmount('');
        setEditMode(false);
    };

    const hideDialog = () => {
        setDialogVisible(false);
    };

    const handleSave = async () => {
        if (!selectedUser || !amount) return;

        const payload = {
            id: selectedUser._id,
            name: selectedUser.name,
            amount: parseFloat(amount),
        };

        console.log(payload);

        try {
            if (editMode) {
                const res = await fetch(`${BASE_URL}/api/loan/edit/${selectedUser._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: payload.amount }),
                });
                if (!res.ok) throw new Error('Failed to update');
            } else {
                const res = await fetch(`${BASE_URL}/api/loan/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (res.status === 409) {
                    Alert.alert('Already Exists', 'User already exists. Use "Засах" to edit.');
                } else if (!res.ok) {
                    console.log(res.json())
                    throw new Error('Failed to save');
                }
            }

            await loadLoanUsers();
            hideDialog();
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to save user');
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setAmount(user.amount.toString());
        setUserDropdownValue(user.id);
        setDialogVisible(true);
        setEditMode(true);
    };

    return (
        <PaperProvider>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Агаар харах" />
                <Appbar.Action icon="plus" onPress={showAddDialog} />
            </Appbar.Header>

            <FlatList
                data={loanUsers}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <List.Item
                        title={`${item.name} - ${item.amount}`}
                        right={() => (
                            <Button mode="text" onPress={() => handleEdit(item)}>
                                Засах
                            </Button>
                        )}
                    />
                )}
            />

            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                    <Dialog.Title>{editMode ? 'Засах' : 'Агаар нэмэх'}</Dialog.Title>
                    <Dialog.Content>
                        {!editMode && (
                            <Dropdown
                                style={styles.dropdown}
                                data={allUsers.map(user => ({ label: user.name, value: user._id }))}
                                search
                                labelField="label"
                                valueField="value"
                                placeholder="Хэрэглэгч сонгох"
                                searchPlaceholder="Хайх..."
                                value={userDropdownValue}
                                onChange={item => {
                                    setUserDropdownValue(item.value);
                                    const selected = allUsers.find(u => u._id === item.value);
                                    setSelectedUser(selected);
                                }}
                            />
                        )}

                        <TextInput
                            label="Хэмжээ"
                            value={amount}
                            keyboardType="numeric"
                            onChangeText={setAmount}
                            style={{ marginTop: 10 }}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Болих</Button>
                        <Button onPress={handleSave}>Хадгалах</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 10,
    },
    dropdown: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 10,
    },
});
