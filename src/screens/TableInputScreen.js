import * as React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Provider as PaperProvider, Appbar, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TableInputScreen = () => {
    const navigation = useNavigation();
    const [rows, setRows] = React.useState([{ id: 1, name: '', number: '', amount: '' }]);

    const handleInputChange = (id, field, value) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const addRow = () => {
        const newId = rows.length + 1;
        setRows([...rows, { id: newId, name: '', number: '', amount: '' }]);
    };

    const removeRow = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    const saveData = () => {
        const hasEmpty = rows.some((row) => !row.name.trim() || !row.number.trim() || !row.amount.trim());
        if (hasEmpty) {
            Alert.alert('Алдаа', 'Бүх талбарыг бөглөх ёстой');
            return;
        }
        const dataToSave = rows.map((row) => ({
            tableName: row.name,
            tableNumber: row.number,
            tableAmount: row.amount,
        }));
        console.log('Хадгалах мэдээлэл:', dataToSave);
        // Example HTTP request using fetch (uncomment and adjust as needed)
        // fetch('https://your-api-endpoint.com/save', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(dataToSave),
        // })
        //   .then((response) => response.json())
        //   .then((data) => Alert.alert('Амжилт', 'Мэдээлэл хадгалагдлаа'))
        //   .catch((error) => Alert.alert('Алдаа', 'Мэдээлэл хадгалахад алдаа гарлаа'));
    };

    return (
        <PaperProvider>
            <View style={styles.headerWrapper}>
                <View style={styles.containerHeader}>
                    <Appbar.Header style={styles.appbar}>
                        <Appbar.BackAction color="#000" onPress={() => navigation.goBack()} />
                        <Appbar.Content title="Орлого бүртгэх" titleStyle={styles.title} />
                    </Appbar.Header>
                </View>
                <View style={styles.container}>
                    {rows.map((row) => (
                        <View key={row.id} style={styles.row}>
                            <TextInput
                                label="Ш/Нэр"
                                value={row.name}
                                onChangeText={(value) => handleInputChange(row.id, 'name', value)}
                                style={styles.input}
                                mode="outlined"
                            />
                            <TextInput
                                label="Ш/Дугаар"
                                value={row.number}
                                onChangeText={(value) => handleInputChange(row.id, 'number', value)}
                                style={styles.input}
                                keyboardType="numeric"
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

export default TableInputScreen;