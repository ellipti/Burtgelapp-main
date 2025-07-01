import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import NormalUserHomeScreen from '../screens/NormalUserHomeScreen';
import AddUserScreen from '../screens/AddPlayerScreen';
import UserListScreen from '../screens/UserListScreen';
import ReportScreen from '../screens/ReportScreen';
import TableInputScreen from '../screens/TableInputScreen';
import PrizeInputScreen from '../screens/PrizeInputScreen';
import ExpenseInputScreen from '../screens/ExpenseInputScreen';
import LoanInputScreen from '../screens/LoanInputScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
      <Stack.Screen name="NormalUserHome" component={NormalUserHomeScreen} />
      <Stack.Screen name="AddUser" component={AddUserScreen} />
      <Stack.Screen name="UserList" component={UserListScreen} />
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="TableInputScreen" component={TableInputScreen} />
      <Stack.Screen name="PrizeInputScreen" component={PrizeInputScreen} />
      <Stack.Screen name="ExpenseInputScreen" component={ExpenseInputScreen} />
      <Stack.Screen name="LoanInputScreen" component={LoanInputScreen} />
    </Stack.Navigator>
  );
}
