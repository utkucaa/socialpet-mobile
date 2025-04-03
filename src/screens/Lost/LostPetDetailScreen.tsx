import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import useTheme from '@/theme/hooks/useTheme';
import { useStyles } from '@/theme/useStyles';
import type { Theme } from '@/theme/types';
import lostPetService from '@/services/lostPetService';
import type { LostPet } from '@/services/lostPetService';

export const LostPetDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const [lostPet, setLostPet] = useState<LostPet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchLostPet();
  }, []);

  const fetchLostPet = async () => {
    try {
      const { id } = route.params as { id: string };
      if (!id) {
        setError("İlan ID'si bulunamadı");
        setLoading(false);
        return;
      }

      const data = await lostPetService.getLostPetById(id);
      setLostPet(data);
    } catch (err) {
      setError('İlan yüklenirken bir hata oluştu');
      console.error('Error fetching lost pet:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const styles = useStyles((theme: Theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.default,
    },
    header: {
      padding: theme.spacing.m,
      backgroundColor: theme.colors.background.paper,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: {
      padding: theme.spacing.s,
    },
    title: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: '600',
      color: theme.colors.text.primary,
      flex: 1,
      textAlign: 'center',
    },
    content: {
      padding: theme.spacing.m,
    },
    image: {
      width: '100%',
      height: 300,
      borderRadius: theme.borderRadius.m,
      marginBottom: theme.spacing.m,
    },
    section: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: theme.borderRadius.m,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.m,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.s,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    infoText: {
      marginLeft: theme.spacing.s,
      color: theme.colors.text.secondary,
      fontSize: theme.typography.fontSize.s,
    },
    description: {
      color: theme.colors.text.secondary,
      fontSize: theme.typography.fontSize.s,
      lineHeight: 20,
    },
    contactButton: {
      backgroundColor: theme.colors.primary.main,
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.m,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.m,
    },
    contactButtonText: {
      color: theme.colors.primary.contrast,
      fontSize: theme.typography.fontSize.m,
      fontWeight: '600',
      marginLeft: theme.spacing.s,
    },
    favoriteButton: {
      backgroundColor: isFavorite ? theme.colors.error : theme.colors.background.paper,
      padding: theme.spacing.s,
      borderRadius: theme.borderRadius.m,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.s,
    },
    favoriteButtonText: {
      color: isFavorite ? theme.colors.error.contrast : theme.colors.text.primary,
      fontSize: theme.typography.fontSize.s,
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
    },
    warningBox: {
      backgroundColor: theme.colors.warning.light,
      borderColor: theme.colors.warning.main,
      borderWidth: 1,
      borderRadius: theme.borderRadius.m,
      padding: theme.spacing.m,
      marginTop: theme.spacing.m,
    },
    warningText: {
      color: theme.colors.warning.dark,
      fontSize: theme.typography.fontSize.s,
      lineHeight: 20,
    },
    contactSection: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: theme.borderRadius.m,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.m,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    contactTitle: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.s,
    },
    contactButtons: {
      gap: theme.spacing.s,
    },
    phoneButton: {
      backgroundColor: theme.colors.primary.main,
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.m,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    whatsappButton: {
      backgroundColor: '#25D366',
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.m,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    messageButton: {
      backgroundColor: theme.colors.background.paper,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.m,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: theme.colors.primary.contrast,
      fontSize: theme.typography.fontSize.m,
      fontWeight: '600',
      marginLeft: theme.spacing.s,
    },
    messageButtonText: {
      color: theme.colors.text.primary,
      fontSize: theme.typography.fontSize.m,
      fontWeight: '600',
      marginLeft: theme.spacing.s,
    },
    contactInfo: {
      marginTop: theme.spacing.m,
      padding: theme.spacing.m,
      backgroundColor: theme.colors.background.default,
      borderRadius: theme.borderRadius.m,
    },
    contactInfoText: {
      color: theme.colors.text.secondary,
      fontSize: theme.typography.fontSize.s,
      lineHeight: 20,
    },
  }));

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  if (error || !lostPet) {
    return (
      <View style={styles.container}>
        <Text style={{ color: theme.colors.error, textAlign: 'center', padding: theme.spacing.m }}>
          {error || 'İlan bulunamadı'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{lostPet.title}</Text>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <Icon 
            name="heart" 
            size={20} 
            color={isFavorite ? theme.colors.error.contrast : theme.colors.text.primary} 
          />
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? 'Favorilerimde' : 'Favorilere Ekle'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Image 
          source={{ uri: lostPet.imageUrl || lostPet.image || 'https://via.placeholder.com/300' }} 
          style={styles.image}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hayvan Bilgileri</Text>
          <View style={styles.infoRow}>
            <Icon name="info" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.infoText}>Tür: {lostPet.animalType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="map-pin" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.infoText}>Konum: {lostPet.lastSeenLocation || lostPet.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.infoText}>
              Son Görülme: {new Date(lostPet.lastSeenDate || lostPet.timestamp).toLocaleDateString('tr-TR')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detaylar</Text>
          <Text style={styles.description}>{lostPet.details}</Text>
        </View>

        {lostPet.additionalInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ek Bilgiler</Text>
            <Text style={styles.description}>{lostPet.additionalInfo}</Text>
          </View>
        )}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>İletişim</Text>
          <View style={styles.contactButtons}>
            {lostPet.contactInfo && (
              <>
                <TouchableOpacity 
                  style={styles.phoneButton}
                  onPress={() => Linking.openURL(`tel:${lostPet.contactInfo}`)}
                >
                  <Icon name="phone" size={24} color={theme.colors.primary.contrast} />
                  <Text style={styles.buttonText}>Telefon ile Ara</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.whatsappButton}
                  onPress={() => Linking.openURL(`https://wa.me/${lostPet.contactInfo.replace(/\D/g, '')}`)}
                >
                  <Icon name="message-circle" size={24} color={theme.colors.primary.contrast} />
                  <Text style={styles.buttonText}>WhatsApp ile İletişim</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.messageButton}
                  onPress={() => navigation.navigate('Chat', { userId: lostPet.userId })}
                >
                  <Icon name="message-square" size={24} color={theme.colors.text.primary} />
                  <Text style={styles.messageButtonText}>Mesaj Gönder</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.contactInfoText}>
              İlan Sahibi: {lostPet.userName || 'Belirtilmemiş'}{'\n'}
              İletişim: {lostPet.contactInfo}{'\n'}
              İlan Tarihi: {new Date(lostPet.timestamp).toLocaleDateString('tr-TR')}
            </Text>
          </View>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Kayıp hayvanınızı bulduğunuzda lütfen ilanı güncelleyiniz. Socialpet.com, kayıp hayvanların bulunmasına yardımcı olmak için bir platform sağlamaktadır.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default LostPetDetailScreen; 