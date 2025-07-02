import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Provider as PaperProvider, Appbar, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../config/config';
import { AuthContext } from '../contexts/AuthContext';

const PrizeInputScreen = () => {
    const { user, userType, logout } = useContext(AuthContext);
    const navigation = useNavigation();
    const [categories, setCategories] = React.useState({
        Poker: [{ id: 1, username: '', amount: '' }],
        'Full House': [{ id: 1, username: '', amount: '' }],
    });

    const handleInputChange = (category, id, field, value) => {
        setCategories((prev) => ({
            ...prev,
            [category]: prev[category].map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            ),
        }));
    };

    const addRow = (category) => {
        const newId = categories[category].length + 1;
        setCategories((prev) => ({
            ...prev,
            [category]: [...prev[category], { id: newId, username: '', amount: '' }],
        }));
    };

    const removeRow = (category, id) => {
        setCategories((prev) => ({
            ...prev,
            [category]: prev[category].filter((row) => row.id !== id),
        }));
    };

    const saveData = () => {
        const dataToSave = Object.keys(categories).reduce((acc, category) => {
            const validRows = categories[category].filter(
                (row) => row.username.trim() !== '' || row.amount.trim() !== ''
            );
            if (validRows.length > 0) {
                acc[category] = validRows.map((row) => ({
                    username: row.username,
                    amount: row.amount,
                }));
            }
            return acc;
        }, {});
        if (Object.keys(dataToSave).length === 0) {
            Alert.alert('Анхаар', 'Хадгалах хүчинтэй мэдээлэл байхгүй байна');
            return;
        }
        console.log('Хадгалах мэдээлэл:', dataToSave);
        fetch(`${BASE_URL}/api/exchange/prize?userId=${user._id}`, {
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
                        <Appbar.Content title="Шагнал бүртгэх" titleStyle={styles.title} />
                    </Appbar.Header>
                </View>
                <View style={styles.container}>
                    {Object.keys(categories).map((category) => (
                        <View key={category} style={styles.categorySection}>
                            <Text style={styles.categoryTitle}>{category}</Text>
                            {categories[category].map((row) => (
                                <View key={row.id} style={styles.row}>
                                    <TextInput
                                        label="Нэр"
                                        value={row.username}
                                        onChangeText={(value) => handleInputChange(category, row.id, 'username', value)}
                                        style={styles.input}
                                        mode="outlined"
                                    />
                                    <TextInput
                                        label="Дүн"
                                        value={row.amount}
                                        onChangeText={(value) => handleInputChange(category, row.id, 'amount', value)}
                                        style={styles.input}
                                        keyboardType="numeric"
                                        mode="outlined"
                                    />
                                    <Button
                                        mode="contained"
                                        onPress={() => removeRow(category, row.id)}
                                        style={styles.removeButton}
                                        labelStyle={styles.removeButtonText}
                                    >
                                        Устгах
                                    </Button>
                                </View>
                            ))}
                            <Button mode="contained" onPress={() => addRow(category)} style={styles.addButton}>
                                Нэмэх
                            </Button>
                        </View>
                    ))}
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
    categorySection: { marginBottom: 20 },
    categoryTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 10 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    input: { flex: 1, marginHorizontal: 5 },
    addButton: { marginVertical: 10, backgroundColor: '#007AFF' },
    saveButton: { marginVertical: 15, backgroundColor: '#007AFF' },
    removeButton: { backgroundColor: '#FF4444', paddingVertical: 2, paddingHorizontal: 5 },
    removeButtonText: { fontSize: 12, color: '#FFFFFF' },
});

export default PrizeInputScreen;