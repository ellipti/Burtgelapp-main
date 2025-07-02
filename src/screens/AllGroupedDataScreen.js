import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../config/config';
import { Provider as PaperProvider, Appbar, Menu, Button } from 'react-native-paper';

const AllGroupedDataScreen = () => {
    const [groupedData, setGroupedData] = useState([]);
    const [expandedDates, setExpandedDates] = useState({});
    const [expandedUsers, setExpandedUsers] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        fetch(`${BASE_URL}/api/exchange/grouped-all`)
            .then(res => res.json())
            .then(setGroupedData)
            .catch(console.error);
    }, []);

    const toggleDate = (date) => {
        setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }));
    };

    const toggleUser = (date, username, userId) => {
        const key = `${date}-${userId}`;
        console.log(userId);
        console.log(date);
        navigation.navigate('UserDailyDataScreen', {
            userId: userId,
            username: username,
            date: date,
        });
    };

    const renderUserEntry = (date, user) => {
        const key = `${date}-${user.userId}`;
        return (
            <View key={key}>
                <TouchableOpacity onPress={() => toggleUser(date, user.username, user.userId)} style={styles.userHeader}>
                    <Text style={styles.userText}>👤 {user.username}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <PaperProvider>
            <View style={styles.headerWrapper}>
                <View style={styles.containerHeader}>
                    <Appbar.Header style={styles.appbar}>
                        <Appbar.BackAction color="#000" onPress={() => navigation.goBack()} />
                        <Appbar.Content title="Мэдээ харах" titleStyle={styles.title} />

                    </Appbar.Header>
                </View>
                <FlatList
                    data={groupedData}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.dateSection}>
                            <TouchableOpacity onPress={() => toggleDate(item._id)} style={styles.dateHeader}>
                                <Text style={styles.dateText}>📅 {item._id}</Text>
                                <Text>{expandedDates[item._id] ? '▲' : '▼'}</Text>
                            </TouchableOpacity>

                            {expandedDates[item._id] && item.users.map(user => renderUserEntry(item._id, user))}
                        </View>
                    )}
                />
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    dateSection: { marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc' },
    dateHeader: { backgroundColor: '#eee', padding: 10, flexDirection: 'row', justifyContent: 'space-between' },
    dateText: { fontWeight: 'bold' },
    userHeader: { paddingHorizontal: 15, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f6f6f6' },
    userText: { fontWeight: '600' },
    entryRow: { paddingHorizontal: 20, paddingVertical: 6, borderBottomWidth: 0.5, borderColor: '#ccc' },
});

export default AllGroupedDataScreen;
