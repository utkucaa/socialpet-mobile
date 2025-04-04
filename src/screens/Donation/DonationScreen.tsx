import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useTheme from '@/theme/hooks/useTheme';
import { useStyles } from '@/theme/useStyles';
import type { Theme } from '@/theme/types';
import adminService, { DonationOrganization } from '@/services/adminService';

const DonationScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [organizations, setOrganizations] = useState<DonationOrganization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add a cache-busting parameter to the request
      const timestamp = new Date().getTime();
      const data = await adminService.getActiveDonationOrganizations();
      
      // Check if data is valid
      if (!data || !Array.isArray(data)) {
        throw new Error('Bağış kurumları verisi geçersiz');
      }
      
      // Add timestamp to image URLs to prevent caching
      const processedData = data.map(org => ({
        ...org,
        imageUrl: org.imageUrl ? `${org.imageUrl}?t=${timestamp}` : org.imageUrl
      }));
      
      setOrganizations(processedData);
    } catch (err: any) {
      console.error('Error fetching donation organizations:', err);
      setError(err.message || 'Bağış kurumları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrganizations();
  }, []);

  const openUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const styles = useStyles((theme: Theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.default,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginLeft: theme.spacing.m,
    },
    backButton: {
      padding: theme.spacing.s,
    },
    heroSection: {
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    heroContent: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: theme.spacing.m,
    },
    titleBox: {
      marginBottom: theme.spacing.s,
      alignItems: 'center',
    },
    heroTitle: {
      fontSize: theme.typography.fontSize.xxl || 32,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    heroSubtitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: '500',
      color: 'white',
      textAlign: 'center',
      marginTop: theme.spacing.s,
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    contentSection: {
      padding: theme.spacing.m,
    },
    infoSection: {
      marginBottom: theme.spacing.l,
      alignItems: 'center',
    },
    infoTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    loadingContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      minHeight: 200,
    },
    loadingText: {
      marginTop: theme.spacing.m,
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    errorContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
    },
    errorText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.error,
      marginBottom: theme.spacing.m,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: theme.colors.primary.main,
      paddingHorizontal: theme.spacing.l,
      paddingVertical: theme.spacing.s,
      borderRadius: theme.borderRadius.m,
      marginTop: theme.spacing.m,
    },
    retryButtonText: {
      color: theme.colors.primary.contrast,
      fontSize: theme.typography.fontSize.s,
      fontWeight: '600',
    },
    emptyContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
    },
    emptyText: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    donationCard: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: theme.borderRadius.m,
      marginBottom: theme.spacing.l,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.divider,
    },
    cardTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: 'bold',
      color: theme.colors.primary.contrast,
      textAlign: 'center',
      padding: theme.spacing.s,
    },
    cardImage: {
      height: 200,
      width: '100%',
      backgroundColor: theme.colors.background.default,
    },
    noImage: {
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background.default,
    },
    noImageText: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text.disabled,
    },
    cardInfo: {
      padding: theme.spacing.l,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.m,
      paddingHorizontal: theme.spacing.s,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary.main,
      backgroundColor: theme.colors.background.default,
      padding: theme.spacing.s,
      borderRadius: theme.borderRadius.s,
    },
    infoText: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text.primary,
      marginLeft: theme.spacing.s,
      flex: 1,
      lineHeight: 20,
    },
    addressInfo: {
      marginTop: theme.spacing.s,
    },
    descriptionInfo: {
      marginTop: theme.spacing.s,
    },
    socialLinks: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing.m,
      paddingTop: theme.spacing.m,
      borderTopWidth: 1,
      borderTopColor: theme.colors.divider,
      gap: 15,
    },
    socialButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary.main,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    socialIcon: {
      color: theme.colors.primary.contrast,
    },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bağış Yap</Text>
      </View>

      <ScrollView 
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary.main]}
            tintColor={theme.colors.primary.main}
          />
        }
      >
        {/* Hero Section */}
        <ImageBackground 
          source={require('@/assets/images/bagıs.jpg')} 
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <View style={styles.titleBox}>
              <Text style={styles.heroTitle}>Barınaklara Bağış</Text>
            </View>
            <Text style={styles.heroSubtitle}>Bağışınızla Umut Işığı Olun!</Text>
          </View>
        </ImageBackground>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>BAĞIŞ ALAN KURUMLAR</Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary.main} />
              <Text style={styles.loadingText}>Bağış kurumları yükleniyor...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchOrganizations}
              >
                <Text style={styles.retryButtonText}>Tekrar Dene</Text>
              </TouchableOpacity>
            </View>
          ) : organizations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Henüz bağış kurumu bulunmamaktadır.</Text>
            </View>
          ) : (
            <View>
              {organizations.map((org) => (
                <View key={org.id} style={styles.donationCard}>
                  <View style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    backgroundColor: theme.colors.primary.main, 
                    padding: theme.spacing.m,
                    justifyContent: 'center'
                  }}>
                    <Text style={styles.cardTitle}>{org.name}</Text>
                  </View>
                  
                  {org.imageUrl ? (
                    <Image 
                      source={{ uri: org.imageUrl }} 
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.noImage}>
                      <Icon name="image" size={50} color={theme.colors.text.disabled} />
                      <Text style={styles.noImageText}>Resim Yok</Text>
                    </View>
                  )}
                  
                  <View style={styles.cardInfo}>
                    <View style={styles.infoRow}>
                      <FontAwesome name="phone" size={16} color={theme.colors.text.primary} style={{marginTop: 3}} />
                      <Text style={styles.infoText}>{org.phoneNumber}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                      <FontAwesome5 name="university" size={16} color={theme.colors.text.primary} style={{marginTop: 3}} />
                      <Text style={styles.infoText}>{org.iban}</Text>
                    </View>
                    
                    {org.address && (
                      <View style={[styles.infoRow]}>
                        <FontAwesome name="map-marker" size={16} color={theme.colors.text.primary} style={{marginTop: 3}} />
                        <Text style={styles.infoText}>
                          <Text style={{ fontWeight: 'bold' }}>Adres: </Text>
                          {org.address}
                        </Text>
                      </View>
                    )}
                    
                    {org.description && (
                      <View style={[styles.infoRow]}>
                        <FontAwesome name="info-circle" size={16} color={theme.colors.text.primary} style={{marginTop: 3}} />
                        <Text style={styles.infoText}>
                          <Text style={{ fontWeight: 'bold' }}>Açıklama: </Text>
                          {org.description}
                        </Text>
                      </View>
                    )}
                    
                    <View style={styles.socialLinks}>
                      {org.instagramUrl && (
                        <TouchableOpacity 
                          style={styles.socialButton}
                          onPress={() => openUrl(org.instagramUrl)}
                        >
                          <FontAwesome name="instagram" size={20} style={styles.socialIcon} />
                        </TouchableOpacity>
                      )}
                      
                      {org.facebookUrl && (
                        <TouchableOpacity 
                          style={styles.socialButton}
                          onPress={() => openUrl(org.facebookUrl)}
                        >
                          <FontAwesome name="facebook" size={20} style={styles.socialIcon} />
                        </TouchableOpacity>
                      )}
                      
                      {org.twitterUrl && (
                        <TouchableOpacity 
                          style={styles.socialButton}
                          onPress={() => openUrl(org.twitterUrl)}
                        >
                          <FontAwesome name="twitter" size={20} style={styles.socialIcon} />
                        </TouchableOpacity>
                      )}
                      
                      {org.website && (
                        <TouchableOpacity 
                          style={styles.socialButton}
                          onPress={() => openUrl(org.website)}
                        >
                          <FontAwesome name="globe" size={20} style={styles.socialIcon} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default DonationScreen; 