import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button, StyleSheet } from 'react-native';


// Second Screen (Report Screen)
export default function ReportScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button
                    title="Орлого бүртгэх"
                    onPress={() => alert('Орлого бүртгэх clicked')}
                    color="#007AFF"
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Шагнал бүртгэх"
                    onPress={() => alert('Шагнал бүртгэх clicked')}
                    color="#007AFF"
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Зарлага бүртгэх"
                    onPress={() => alert('Зарлага бүртгэх clicked')}
                    color="#007AFF"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    buttonContainer: {
        marginVertical: 10,
        width: '80%',
    },
});