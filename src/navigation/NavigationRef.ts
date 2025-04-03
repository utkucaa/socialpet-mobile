import { createRef } from 'react';
import { CommonActions } from '@react-navigation/native';
import type { NavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

// Create a navigation reference
export const navigationRef = createRef<NavigationContainerRef<RootStackParamList>>();

// Function to navigate to different screens from outside of React components
export function navigate(name: keyof RootStackParamList, params?: Record<string, unknown>) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(CommonActions.navigate({ name, params }));
  } else {
    // Handle the case where the navigation ref isn't ready yet
    // eslint-disable-next-line no-console
    console.warn('Navigation is not ready yet, navigation action queued.');
    // You could also implement a queue system if needed
  }
}

// Reset navigation state completely
export function resetRoot(routeName: keyof RootStackParamList) {
  if (navigationRef.current) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      })
    );
  }
} 