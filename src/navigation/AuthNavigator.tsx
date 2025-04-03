import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Welcome } from '@/screens/Auth/Welcome';
import { Login } from '@/screens/Auth/Login';
import { Register } from '@/screens/Auth/Register';
import { ForgotPassword } from '@/screens/Auth/ForgotPassword';

const Stack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    </Stack.Navigator>
  );
};
