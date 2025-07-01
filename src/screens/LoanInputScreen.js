import React, { useState } from 'react';
import {
    FlatList, StyleSheet
} from 'react-native';
import {
    Appbar, Button, Dialog, Portal, TextInput, List, Provider as PaperProvider
} from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';

const allUsersMock = [
    { id: 1, name: 'User A' },
    { id: 2, name: 'User B' },
    { id: 3, name: 'User C' },
];

export default function LoanInputScreen() {
    const navigation = useNavigation();

    const [users, setUsers] = useState([]); // [{id, name, amount}]
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDropdownValue, setUserDropdownValue] = useState(null);
    const [amount, setAmount] = useState('');
    const [editMode, setEditMode] = useState(false);

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

    const handleSave = () => {
        if (!selectedUser || !amount) return;

        const existing = users.find(u => u.id === selectedUser.id);
        if (existing) {
            // Update
            setUsers(prev =>
                prev.map(u =>
                    u.id === selectedUser.id ? { ...u, amount: parseFloat(amount) } : u
                )
            );
        } else {
            // Add
            setUsers(prev => [...prev, { ...selectedUser, amount: parseFloat(amount) }]);
        }

        hideDialog();
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
                <Appbar.Content title="Агаар засах" />
                <Appbar.Action icon="plus" onPress={showAddDialog} />
            </Appbar.Header>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
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
                                data={allUsersMock.map(user => ({ label: user.name, value: user.id }))}
                                search
                                labelField="label"
                                valueField="value"
                                placeholder="Хэрэглэгч сонгох"
                                searchPlaceholder="Хайх..."
                                value={userDropdownValue}
                                onChange={item => {
                                    setUserDropdownValue(item.value);
                                    const selected = allUsersMock.find(u => u.id === item.value);
                                    setSelectedUser(selected);
                                }}
                            />
                        )}

                        <TextInput
                            label="Дүн"
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
