import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import useTheme from '@/theme/hooks/useTheme';
import { useStyles } from '@/theme/useStyles';
import type { Theme } from '@/theme/types';
import lostPetService from '@/services/lostPetService';
import type { LostPet } from '@/services/lostPetService';

export const LostScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [lostPets, setLostPets] = useState<LostPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLostPets();
  }, []);

  const fetchLostPets = async () => {
    try {
      const data = await lostPetService.getLostPets();
      setLostPets(data);
    } catch (err) {
      setError('İlanlar yüklenirken bir hata oluştu');
      console.error('Error fetching lost pets:', err);
    } finally {
      setLoading(false);
    }
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
    },
    headerContent: {
      backgroundColor: theme.colors.primary.light,
      borderRadius: theme.borderRadius.l,
      padding: theme.spacing.m,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: theme.colors.primary.main,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    headerTextContainer: {
      flex: 1,
      marginRight: theme.spacing.m,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: '600',
      color: theme.colors.primary.main,
      marginBottom: theme.spacing.xs,
    },
    headerDescription: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
    createButton: {
      backgroundColor: theme.colors.primary.main,
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      borderRadius: theme.borderRadius.m,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 120,
    },
    createButtonText: {
      color: theme.colors.primary.contrast,
      fontSize: theme.typography.fontSize.s,
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
    },
    listContainer: {
      padding: theme.spacing.m,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.s,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: '600',
      marginBottom: theme.spacing.m,
      color: theme.colors.text.primary,
    },
    petCard: {
      width: '49%',
      backgroundColor: theme.colors.background.paper,
      borderRadius: theme.borderRadius.m,
      overflow: 'hidden',
      marginBottom: theme.spacing.m,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    petImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
    },
    petDetails: {
      padding: theme.spacing.s,
    },
    petTitle: {
      fontSize: theme.typography.fontSize.s,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    petInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    petInfoText: {
      marginLeft: theme.spacing.xs,
      color: theme.colors.text.secondary,
      fontSize: theme.typography.fontSize.xs,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.m,
    },
    errorText: {
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.m,
    },
  }));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={fetchLostPets}
        >
          <Text style={styles.createButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Kayıp Evcil Hayvanınız mı Var?</Text>
            <Text style={styles.headerDescription}>
              Hemen ilan verin, topluluk yardımıyla dostunuzu bulalım.
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateLostPet')}
          >
            <Icon name="plus" size={20} color={theme.colors.primary.contrast} />
            <Text style={styles.createButtonText}>İlan Ver</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Son Kayıp İlanları</Text>
        <View style={styles.gridContainer}>
          {lostPets.map((pet) => (
            <TouchableOpacity 
              key={pet.id} 
              style={styles.petCard}
              onPress={() => navigation.navigate('LostPetDetail', { id: pet.id })}
            >
              <Image 
                source={{ uri: pet.imageUrl || pet.image || 'https://via.placeholder.com/150' }} 
                style={styles.petImage} 
              />
              <View style={styles.petDetails}>
                <Text style={styles.petTitle} numberOfLines={1}>{pet.title}</Text>
                <View style={styles.petInfo}>
                  <Icon name="map-pin" size={12} color={theme.colors.text.secondary} />
                  <Text style={styles.petInfoText} numberOfLines={1}>
                    {pet.lastSeenLocation || pet.location}
                  </Text>
                </View>
                <View style={styles.petInfo}>
                  <Icon name="calendar" size={12} color={theme.colors.text.secondary} />
                  <Text style={styles.petInfoText}>
                    {new Date(pet.lastSeenDate || pet.timestamp).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
                <View style={styles.petInfo}>
                  <Icon name="info" size={12} color={theme.colors.text.secondary} />
                  <Text style={styles.petInfoText} numberOfLines={1}>{pet.animalType}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default LostScreen; 