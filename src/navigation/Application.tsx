import type { RootStackParamList } from '@/navigation/types';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from '@/theme';
import { Paths } from '@/navigation/paths';
import { DrawerNavigator } from './DrawerNavigator';
import { AuthNavigator } from './AuthNavigator';
import { navigationRef } from './NavigationRef';

import { Startup } from '@/screens';
import { storage } from '@/App';
import { useAuthStore } from '@/store/auth.store';

const Stack = createStackNavigator<RootStackParamList>();

const NavigationContent = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen component={AuthNavigator} name="Auth" />
      ) : (
        <>
          <Stack.Screen component={Startup} name={Paths.Startup} />
          <Stack.Screen component={DrawerNavigator} name="MainApp" />
        </>
      )}
    </Stack.Navigator>
  );
};

function ApplicationNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaProvider>
        <ThemeProvider storage={storage}>
          <NavigationContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default ApplicationNavigator;
