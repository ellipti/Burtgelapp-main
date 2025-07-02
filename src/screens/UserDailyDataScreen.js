import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Provider as PaperProvider, Appbar, Menu, Button } from 'react-native-paper';
import { BASE_URL } from '../config/config';

const UserDailyDataScreen = ({ route }) => {
    const { userId, username, date } = route.params;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetch(`${BASE_URL}/api/exchange/user-data?userId=${userId}&date=${date}`)
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [userId, date]);

    if (loading) {
        return <ActivityIndicator size="large" style={styles.loading} />;
    }

    if (!data) {
        return <Text style={styles.error}>Алдаа гарлаа. Мэдээлэл олдсонгүй.</Text>;
    }

    const renderItem = (label, items, renderRow) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{label}</Text>
            {items.length === 0 ? (
                <Text style={styles.noData}>Мэдээлэл байхгүй</Text>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <View style={styles.row}>{renderRow(item)}</View>}
                />
            )}
        </View>
    );

    return (
        <PaperProvider>
            <View style={styles.headerWrapper}>
                <View style={styles.containerHeader}>
                    <Appbar.Header style={styles.appbar}>
                        <Appbar.BackAction color="#000" onPress={() => navigation.goBack()} />
                        <Appbar.Content title={username + ' - ' + date} titleStyle={styles.title} />

                    </Appbar.Header>
                </View>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.header}>📅 {data.date}</Text>

                    {renderItem('💰 Зардлууд (Expenses)', data.expenses, (item) => (
                        <>
                            <Text>👤 {item.username}</Text>
                            <Text>Дүн: {item.amount}₮</Text>
                        </>
                    ))}

                    {renderItem('📊 Хүснэгт (Table Entries)', data.tables, (item) => (
                        <>
                            <Text>📝 {item.tableName}</Text>
                            <Text>№: {item.tableNumber}</Text>
                            <Text>💵: {item.tableAmount}₮</Text>
                        </>
                    ))}

                    {renderItem('🏆 Шагналууд (Prize Entries)', data.prizes, (item) => (
                        <>
                            <Text>👤 {item.username}</Text>
                            <Text>Төрөл: {item.category}</Text>
                            <Text>Дүн: {item.amount}₮</Text>
                        </>
                    ))}
                </ScrollView>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    section: { marginVertical: 10 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6, color: '#333' },
    row: { backgroundColor: '#f9f9f9', padding: 10, marginBottom: 6, borderRadius: 5 },
    noData: { fontStyle: 'italic', color: '#999' },
    error: { padding: 20, textAlign: 'center', color: 'red' },
    loading: { flex: 1, justifyContent: 'center' }
});

export default UserDailyDataScreen;
