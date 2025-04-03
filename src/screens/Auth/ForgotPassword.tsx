import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeScreen } from '@/components/templates';
import { useStyles } from '@/theme/useStyles';
import { Theme } from '@/theme/types';
import { authService } from '@/services/api/auth';

export const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const styles = useStyles((theme: Theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.default,
      padding: theme.spacing.m,
    },
    header: {
      marginBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.text.secondary,
    },
    form: {
      marginBottom: 24,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.colors.text.primary,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    error: {
      color: theme.colors.error,
      marginBottom: 16,
    },
    success: {
      color: theme.colors.success,
      marginBottom: 16,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.primary.main,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    buttonText: {
      color: theme.colors.primary.contrast,
      fontSize: 18,
      fontWeight: '600',
      marginRight: 8,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 24,
    },
    footerText: {
      color: theme.colors.text.secondary,
      marginRight: 4,
    },
    loginLink: {
      color: theme.colors.primary.main,
      fontWeight: '600',
    },
  }));

  const handleSubmit = async () => {
    if (!email) return;

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      await authService.forgotPassword({ email });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || t('forgotPassword.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeScreen style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('forgotPassword.title')}</Text>
        <Text style={styles.subtitle}>{t('forgotPassword.subtitle')}</Text>
      </View>

      <View style={styles.form}>
        {error && <Text style={styles.error}>{error}</Text>}
        {isSuccess && (
          <Text style={styles.success}>{t('forgotPassword.success')}</Text>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('forgotPassword.email')}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={t('forgotPassword.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!isSuccess}
          />
        </View>
      </View>

      {!isSuccess && (
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={styles.buttonText.color} />
          ) : (
            <>
              <Text style={styles.buttonText}>{t('forgotPassword.submit')}</Text>
              <Icon name="send" size={20} color={styles.buttonText.color} />
            </>
          )}
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('forgotPassword.rememberPassword')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>{t('forgotPassword.login')}</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
};
