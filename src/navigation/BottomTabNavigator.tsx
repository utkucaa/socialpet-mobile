import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { Profile } from '@/screens/Profile/Profile';
import useTheme from '@/theme/hooks/useTheme';
import { useStyles } from '@/theme/useStyles';
import { Theme } from '@/theme/types';

const Tab = createBottomTabNavigator();

// Screens
import { HomeScreen } from '@/screens/Home/HomeScreen';
import { LostScreen } from '@/screens/Lost/LostScreen';
import { AdoptionScreen } from '@/screens/Adoption/AdoptionScreen';
import { MetScreen } from '@/screens/Met/MetScreen';

export const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const styles = useStyles((theme: Theme) => ({
    tabBar: {
      backgroundColor: theme.colors.background.paper,
      borderTopWidth: 1,
      borderTopColor: theme.colors.divider,
    },
  }));

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: [styles.tabBar, { height: 60 + insets.bottom, paddingBottom: insets.bottom }],
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.text.disabled,
        headerShown: false,
        tabBarItemStyle: {
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Lost"
        component={LostScreen}
        options={{
          tabBarLabel: 'Kayıp İlanları',
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Adoption"
        component={AdoptionScreen}
        options={{
          tabBarLabel: 'Sahiplendir',
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Met"
        component={MetScreen}
        options={{
          tabBarLabel: 'MET',
          tabBarIcon: ({ color, size }) => (
            <Icon name="activity" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
