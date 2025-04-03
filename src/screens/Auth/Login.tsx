import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Platform, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeScreen } from '@/components/templates';
import { useStyles } from '@/theme/useStyles';
import type { Theme } from '@/theme/types';
import { useAuthStore } from '@/store/auth.store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Login = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { login, isLoading, error, clearError } = useAuthStore();
  const insets = useSafeAreaInsets();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const styles = useStyles((theme: Theme) => {
    const colors = {
      iconColor: theme.colors.text.secondary,
      placeholderTextColor: theme.colors.text.disabled,
    };

    return {
      container: {
        backgroundColor: theme.colors.background.default,
        flex: 1,
      },
      scrollContent: {
        flexGrow: 1,
        paddingBottom: insets.bottom + 16,
        paddingHorizontal: 24,
        paddingTop: 24,
      },
      header: {
        marginBottom: 40,
      },
      title: {
        color: theme.colors.text.primary,
        fontSize: 34,
        fontWeight: Platform.select({ ios: '700', android: 'bold' }),
        letterSpacing: 0.37,
        marginBottom: 8,
      },
      subtitle: {
        color: theme.colors.text.secondary,
        fontSize: 17,
        letterSpacing: -0.41,
        lineHeight: 22,
      },
      form: {
        marginBottom: 24,
      },
      inputContainer: {
        marginBottom: 20,
      },
      label: {
        color: theme.colors.text.primary,
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: -0.24,
        marginBottom: 8,
      },
      inputWrapper: {
        backgroundColor: theme.colors.background.paper,
        borderRadius: 10,
        overflow: 'hidden',
        ...Platform.select({
          ios: {
            shadowColor: theme.colors.text.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
          },
          android: {
            elevation: 2,
          },
        }),
      },
      input: {
        color: theme.colors.text.primary,
        fontSize: 17,
        letterSpacing: -0.41,
        paddingHorizontal: 16,
        paddingVertical: 16,
      },
      passwordContainer: {
        alignItems: 'center',
        backgroundColor: theme.colors.background.paper,
        flexDirection: 'row',
      },
      passwordInput: {
        color: theme.colors.text.primary,
        flex: 1,
        fontSize: 17,
        letterSpacing: -0.41,
        paddingHorizontal: 16,
        paddingVertical: 16,
      },
      eyeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      },
      error: {
        color: theme.colors.error,
        fontSize: 13,
        letterSpacing: -0.08,
        marginBottom: 16,
        marginTop: 4,
      },
      success: {
        color: theme.colors.success,
        fontSize: 13,
        letterSpacing: -0.08,
        marginBottom: 16,
        marginTop: 4,
      },
      forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 32,
      },
      forgotPasswordText: {
        color: theme.colors.primary.main,
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: -0.24,
      },
      button: {
        alignItems: 'center',
        backgroundColor: theme.colors.primary.main,
        borderRadius: 14,
        justifyContent: 'center',
        paddingVertical: 16,
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
      footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        opacity: 0.8,
      },
      footerText: {
        color: theme.colors.text.secondary,
        fontSize: 15,
        letterSpacing: -0.24,
        marginRight: 4,
      },
      registerLink: {
        color: theme.colors.primary.main,
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: -0.24,
      },
      colors,
    };
  });

  const handleLogin = async () => {
    clearError();
    setSuccess('');
    
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun!');
      return;
    }
    
    try {
      await login({ email, password });
      setSuccess('Başarıyla giriş yapıldı!');
      
      // Navigate to main screen after successful login
      setTimeout(() => {
        // @ts-ignore - Navigation types will be handled by the navigation setup
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }, 1000);
      
    } catch (error) {
      // Error is already handled by the auth store
      console.log('Login failed:', error);
    }
  };

  return (
    <SafeScreen style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t('socialpet.login.title')}</Text>
            <Text style={styles.subtitle}>{t('socialpet.login.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            {error && <Text style={styles.error}>{error}</Text>}
            {success && <Text style={styles.success}>{success}</Text>}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('socialpet.login.email')}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder={t('socialpet.login.emailPlaceholder')}
                  placeholderTextColor={styles.colors.placeholderTextColor}
                  style={styles.input}
                  value={email}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('socialpet.login.password')}</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    autoCapitalize="none"
                    onChangeText={setPassword}
                    placeholder={t('socialpet.login.passwordPlaceholder')}
                    placeholderTextColor={styles.colors.placeholderTextColor}
                    secureTextEntry={!showPassword}
                    style={styles.passwordInput}
                    value={password}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Icon
                      color={styles.colors.iconColor}
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              // @ts-ignore - Navigation types will be handled by the navigation setup
              navigation.navigate('ForgotPassword');
            }}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>
              {t('socialpet.login.forgotPassword')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isLoading}
            onPress={handleLogin}
            style={styles.button}
          >
            {isLoading ? (
              <ActivityIndicator color={styles.buttonText.color} />
            ) : (
              <Text style={styles.buttonText}>{t('socialpet.login.submit')}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('socialpet.login.noAccount')}</Text>
            <TouchableOpacity 
              onPress={() => {
                // @ts-ignore - Navigation types will be handled by the navigation setup
                navigation.navigate('Register');
              }}
            >
              <Text style={styles.registerLink}>{t('socialpet.login.register')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};
