import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import useTheme from '@/theme/hooks/useTheme';
import { useStyles } from '@/theme/useStyles';
import type { Theme } from '@/theme/types';
import adoptionService from '@/services/adoptionService';
import type { AdoptionListingDetail } from '@/services/adoptionService';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from '@/navigation/MainStackNavigator';

type AdoptionScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Adoption'>;

export const AdoptionScreen = () => {
  const navigation = useNavigation<AdoptionScreenNavigationProp>();
  const { theme } = useTheme();
  const [adoptionListings, setAdoptionListings] = useState<AdoptionListingDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdoptionListings();
  }, []);

  const fetchAdoptionListings = async () => {
    try {
      const data = await adoptionService.getAdoptionListings();
      console.log('Adoption verisi alındı:', data);
      setAdoptionListings(data);
    } catch (err) {
      setError('İlanlar yüklenirken bir hata oluştu');
      console.error('Error fetching adoption listings:', err);
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
          onPress={fetchAdoptionListings}
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
            <Text style={styles.headerTitle}>Sahiplendirmek mi İstiyorsunuz?</Text>
            <Text style={styles.headerDescription}>
              Evcil hayvanınızı güvenilir bir aileye sahiplendirmek için ilan verin.
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateAdoption')}
          >
            <Icon name="plus" size={20} color={theme.colors.primary.contrast} />
            <Text style={styles.createButtonText}>İlan Ver</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Tüm Sahiplendirme İlanları</Text>
        <View style={styles.gridContainer}>
          {adoptionListings.length > 0 ? (
            adoptionListings.map((listing) => (
              <TouchableOpacity 
                key={listing.id} 
                style={styles.petCard}
                onPress={() => navigation.navigate('AdoptionDetail', { slug: listing.slug || listing.id.toString() })}
              >
                <Image 
                  source={{ uri: listing.imageUrl || 'https://via.placeholder.com/150' }} 
                  style={styles.petImage} 
                />
                <View style={styles.petDetails}>
                  <Text style={styles.petTitle} numberOfLines={1}>{listing.title}</Text>
                  <View style={styles.petInfo}>
                    <Icon name="map-pin" size={12} color={theme.colors.text.secondary} />
                    <Text style={styles.petInfoText} numberOfLines={1}>
                      {listing.city} / {listing.district}
                    </Text>
                  </View>
                  <View style={styles.petInfo}>
                    <Icon name="calendar" size={12} color={theme.colors.text.secondary} />
                    <Text style={styles.petInfoText}>
                      {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                  <View style={styles.petInfo}>
                    <Icon name="info" size={12} color={theme.colors.text.secondary} />
                    <Text style={styles.petInfoText} numberOfLines={1}>{listing.breed || listing.animalType}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ width: '100%', alignItems: 'center', padding: 20 }}>
              <Text>Henüz ilan bulunmuyor</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AdoptionScreen; 