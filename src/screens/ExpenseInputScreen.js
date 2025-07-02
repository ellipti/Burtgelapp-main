import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Provider as PaperProvider, Appbar, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from '../config/config';
import { AuthContext } from '../contexts/AuthContext';

const ExpenseInputScreen = () => {
    const { user, userType, logout } = useContext(AuthContext);
    const navigation = useNavigation();
    const [rows, setRows] = React.useState([{ id: 1, name: '', amount: '' }]);

    const handleInputChange = (id, field, value) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const addRow = () => {
        const newId = rows.length + 1;
        setRows([...rows, { id: newId, name: '', amount: '' }]);
    };

    const removeRow = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    const saveData = () => {
        const hasEmpty = rows.some((row) => !row.name.trim() || !row.amount.trim());
        if (hasEmpty) {
            Alert.alert('Алдаа', 'Бүх талбарыг бөглөх ёстой');
            return;
        }
        const dataToSave = rows.map((row) => ({
            username: row.name,
            amount: row.amount,
        }));
        console.log('Хадгалах мэдээлэл:', dataToSave);
        fetch(`${BASE_URL}/api/exchange/expense?userId=${user._id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSave),
        })
            .then((response) => response.json())
            .then((data) => {
                navigation.goBack();
                Alert.alert('Амжилт', 'Мэдээлэл хадгалагдлаа');
            })
            .catch((error) => Alert.alert('Алдаа', 'Мэдээлэл хадгалахад алдаа гарлаа'));
    };

    return (
        <PaperProvider>
            <View style={styles.headerWrapper}>
                <View style={styles.containerHeader}>
                    <Appbar.Header style={styles.appbar}>
                        <Appbar.BackAction color="#000" onPress={() => navigation.goBack()} />
                        <Appbar.Content title="Зарлага бүртгэх" titleStyle={styles.title} />
                    </Appbar.Header>
                </View>
                <View style={styles.container}>
                    {rows.map((row) => (
                        <View key={row.id} style={styles.row}>
                            <TextInput
                                label="Нэр"
                                value={row.name}
                                onChangeText={(value) => handleInputChange(row.id, 'name', value)}
                                style={styles.input}
                                mode="outlined"
                            />
                            <TextInput
                                label="Дүн"
                                value={row.amount}
                                onChangeText={(value) => handleInputChange(row.id, 'amount', value)}
                                style={styles.input}
                                keyboardType="numeric"
                                mode="outlined"
                            />
                            <Button
                                mode="contained"
                                onPress={() => removeRow(row.id)}
                                style={styles.removeButton}
                                icon={() => <Ionicons name="trash" size={12} color="#FFFFFF" />}
                            />
                        </View>
                    ))}
                    <Button mode="contained" onPress={addRow} style={styles.addButton}>
                        Нэмэх
                    </Button>
                    <Button mode="contained" onPress={saveData} style={styles.saveButton}>
                        Хадгалах
                    </Button>
                </View>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    headerWrapper: { flex: 1, backgroundColor: '#F5F5F5' },
    containerHeader: { zIndex: 1000 },
    appbar: { backgroundColor: '#fff', height: 48, justifyContent: 'center' },
    title: { fontSize: 18, color: '#000' },
    container: { padding: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    input: { flex: 1, marginHorizontal: 5 },
    addButton: { marginVertical: 10, backgroundColor: '#007AFF' },
    saveButton: { marginVertical: 15, backgroundColor: '#007AFF' },
    removeButton: { backgroundColor: '#FF4444', padding: 3, minWidth: 25, justifyContent: 'center' },
});

export default ExpenseInputScreen;