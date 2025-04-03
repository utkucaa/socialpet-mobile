import React from 'react';
import { View, Text, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeScreen } from '@/components/templates';
import { useStyles } from '@/theme/useStyles';
import { Theme } from '@/theme/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Welcome = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const styles = useStyles((theme: Theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.default,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingBottom: insets.bottom + 16,
    },
    topContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    bottomContent: {
      width: '100%',
      paddingHorizontal: 16,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 24,
    },
    title: {
      fontSize: 40,
      fontWeight: Platform.select({ ios: '700', android: 'bold' }),
      color: theme.colors.text.primary,
      marginBottom: 12,
      textAlign: 'center',
      letterSpacing: 0.35,
    },
    subtitle: {
      fontSize: 17,
      color: theme.colors.text.secondary,
      marginBottom: 48,
      textAlign: 'center',
      paddingHorizontal: 24,
      lineHeight: 22,
      letterSpacing: -0.41,
    },
    button: {
      backgroundColor: theme.colors.primary.main,
      borderRadius: 14,
      paddingVertical: 16,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.primary.main,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    buttonText: {
      color: theme.colors.primary.contrast,
      fontSize: 17,
      fontWeight: '600',
      letterSpacing: -0.41,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
    },
    secondaryButtonText: {
      color: theme.colors.primary.main,
      fontWeight: '600',
    },
  }));

  return (
    <SafeScreen style={styles.container}>
      <StatusBar
        barStyle={Platform.select({
          ios: 'dark-content',
          android: 'light-content',
        })}
      />
      <View style={styles.content}>
        <View style={styles.topContent}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>{t('welcome.title')}</Text>
          <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>
        </View>

        <View style={styles.bottomContent}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>{t('welcome.login')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              {t('welcome.register')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
};
