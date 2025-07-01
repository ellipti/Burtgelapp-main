import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Provider as PaperProvider, Appbar, Menu, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ReportScreen = () => {
    const navigation = useNavigation();
    return (
        <PaperProvider>
            <View style={styles.headerWrapper}>
                <View style={styles.containerHeader}>
                    <Appbar.Header style={styles.appbar}>
                        <Appbar.BackAction color="#000" onPress={() => navigation.goBack()} />
                        <Appbar.Content title="Мэдээ өгөх" titleStyle={styles.title} />

                    </Appbar.Header>
                </View>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            navigation.navigate('TableInputScreen');
                        }}
                    >
                        <Text style={styles.buttonText}>Орлого бүртгэх</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            navigation.navigate('PrizeInputScreen');
                        }}
                    >
                        <Text style={styles.buttonText}>Шагнал бүртгэх</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('ExpenseInputScreen')}
                    >
                        <Text style={styles.buttonText}>Зарлага бүртгэх</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('LoanInputScreen')}
                    >
                        <Text style={styles.buttonText}>Агаар харах</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    headerWrapper: {
        flex: 1,
        backgroundColor: '#fff', // Light background for modern look
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 12,
        textAlign: 'center',
        color: '#333',
    },
    containerHeader: {
        zIndex: 1000, // Ensure app bar and menu are above content
    },
    appbar: {
        backgroundColor: '#fff', // Purple app bar
        height: 48, // Reduced height
        justifyContent: 'center',
    },
    title: {
        fontSize: 18, // Smaller title to fit reduced height
        color: '#000', // Gold title to match icon
    },
    menuContent: {
        backgroundColor: '#fff',
        zIndex: 1000,
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#007AFF', // Blue buttons for consistency
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, // Android shadow
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ReportScreen;