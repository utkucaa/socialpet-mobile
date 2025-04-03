import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { BottomTabNavigator } from './BottomTabNavigator';
import { AdoptionDetailScreen } from '@/screens/AdoptionDetail/AdoptionDetailScreen';
import { LostPetDetailScreen } from '@/screens/Lost/LostPetDetailScreen';
import { CreateLostPetScreen, LostScreen } from '@/screens/Lost';
import { AdoptionScreen, CreateAdoptionScreen } from '@/screens/Adoption';

// Navigatör için tip tanımı
export type MainStackParamList = {
  AdoptionDetail: { slug: string };
  Adoption: undefined;
  CreateAdoption: undefined;
  CreateLostPet: undefined;
  Lost: undefined;
  LostPetDetail: { id: string };
  MainTabs: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

export const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen component={BottomTabNavigator} name="MainTabs" />
      <Stack.Screen component={AdoptionScreen} name="Adoption" />
      <Stack.Screen component={AdoptionDetailScreen} name="AdoptionDetail" />
      <Stack.Screen component={CreateAdoptionScreen} name="CreateAdoption" />
      <Stack.Screen component={LostScreen} name="Lost" />
      <Stack.Screen component={LostPetDetailScreen} name="LostPetDetail" />
      <Stack.Screen component={CreateLostPetScreen} name="CreateLostPet" />
    </Stack.Navigator>
  );
};

export default MainStackNavigator; 