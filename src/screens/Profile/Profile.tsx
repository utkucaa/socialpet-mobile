import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import useTheme from '@/theme/hooks/useTheme';
import { useStyles } from '@/theme/useStyles';
import { Theme } from '@/theme/types';
import { SafeScreen } from '@/components/templates';
import Icon from 'react-native-vector-icons/Feather';

export const Profile = () => {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const styles = useStyles((theme: Theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.default,
      padding: theme.spacing.m,
    },
    header: {
      marginBottom: 32,
      alignItems: 'center',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.primary.main,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 40,
      color: theme.colors.background.default,
      fontWeight: 'bold',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    email: {
      fontSize: 16,
      color: theme.colors.text.secondary,
    },
    section: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowIcon: {
      marginRight: 12,
      width: 24,
      textAlign: 'center',
    },
    rowLabel: {
      fontSize: 16,
      color: theme.colors.text.primary,
    },
    rowValue: {
      fontSize: 16,
      color: theme.colors.text.secondary,
    },
  }));

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <SafeScreen style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john@example.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('Appearance')}</Text>
          
          <TouchableOpacity 
            onPress={() => setTheme(theme.id === 'socialpet' ? 'darkTheme' : 'socialpet')}
            style={styles.row}
          >
            <View style={styles.rowLeft}>
              <Icon 
                name={theme.id === 'darkTheme' ? 'moon' : 'sun'} 
                size={24} 
                color={theme.colors.text.primary}
                style={styles.rowIcon}
              />
              <Text style={styles.rowLabel}>{t('Theme')}</Text>
            </View>
            <Text style={styles.rowValue}>
              {theme.id === 'darkTheme' ? t('Dark') : t('Light')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={toggleLanguage}
            style={styles.row}
          >
            <View style={styles.rowLeft}>
              <Icon 
                name="globe" 
                size={24} 
                color={theme.colors.text.primary}
                style={styles.rowIcon}
              />
              <Text style={styles.rowLabel}>{t('Language')}</Text>
            </View>
            <Text style={styles.rowValue}>
              {i18n.language === 'tr' ? 'Türkçe' : 'English'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
};
