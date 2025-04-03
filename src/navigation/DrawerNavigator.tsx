import React from 'react';
import { Dimensions, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Animated, {
  useAnimatedStyle,
  interpolate,
  withSpring,
} from 'react-native-reanimated';
import { MainStackNavigator } from './MainStackNavigator';
import DrawerContent from './DrawerContent';
import useTheme from '@/theme/hooks/useTheme';

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('window');

const CustomDrawerContent = (props: any) => {
  return <DrawerContent {...props} />;
};

const CustomScreenContainer = ({
  children,
  progress,
}: {
  children: React.ReactNode;
  progress: Animated.SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = withSpring(interpolate(progress.value, [0, 1], [1, 0.8]));
    const borderRadius = withSpring(interpolate(progress.value, [0, 1], [0, 25]));
    const translateX = withSpring(interpolate(progress.value, [0, 1], [0, -50]));

    return {
      borderRadius,
      transform: [{ scale }, { translateX }],
      overflow: 'hidden' as 'hidden',
    };
  });

  return (
    <Animated.View style={[styles.stack, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

export const DrawerNavigator = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'slide',
        drawerStyle: {
          width: width * 0.7,
          backgroundColor: theme.colors.background.paper,
          paddingTop: insets.top,
        },
        overlayColor: 'transparent',
        sceneContainerStyle: { backgroundColor: 'transparent' },
        drawerStatusBarAnimation: 'slide',
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      useLegacyImplementation={false}
    >
      <Drawer.Screen
        name="MainStack"
        component={MainStackNavigator}
        options={{
          headerShown: false,
          drawerPosition: 'left',
          sceneContainerStyle: { backgroundColor: theme.colors.background.default },
        }}
      />
    </Drawer.Navigator>
  );
};

const styles: { stack: ViewStyle } = {
  stack: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
};
