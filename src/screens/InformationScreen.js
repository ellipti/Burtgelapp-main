import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button, StyleSheet } from 'react-native';

// First Screen (Home Screen)
export default function InformationScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button
                    title="Мэдээ өгөх"
                    onPress={() => navigation.navigate('ReportScreen')}
                    color="#007AFF"
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Агаар засах"
                    onPress={() => alert('Агаар засах clicked')}
                    color="#007AFF"
                />
            </View>
        </View>
    );
}