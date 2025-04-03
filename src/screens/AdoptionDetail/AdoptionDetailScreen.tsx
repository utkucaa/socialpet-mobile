import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
  Linking,
  StyleSheet,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import useTheme from '@/theme/hooks/useTheme';
import { useStyles } from '@/theme/useStyles';
import type { Theme } from '@/theme/types';
import adoptionService from '@/services/adoptionService';
import type { AdoptionListingDetail } from '@/services/adoptionService';
import type { MainStackParamList } from '@/navigation/MainStackNavigator';

// Type tanımlamaları
type AdoptionDetailScreenRouteProp = RouteProp<MainStackParamList, 'AdoptionDetail'>;
type AdoptionDetailScreenNavigationProp = StackNavigationProp<MainStackParamList>;

export const AdoptionDetailScreen = () => {
  const route = useRoute<AdoptionDetailScreenRouteProp>();
  const navigation = useNavigation<AdoptionDetailScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { slug } = route.params;

  // Durum değişkenleri
  const [adDetails, setAdDetails] = useState<AdoptionListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Stiller
  const styles = useStyles((theme: Theme) => ({
    screen: {
      backgroundColor: theme.colors.background.default,
      flex: 1,
    },
    header: {
      alignItems: 'center',
      backgroundColor: theme.colors.background.paper,
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: 1,
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.m,
    },
    headerTitle: {
      color: theme.colors.text.primary,
      flex: 1,
      fontFamily: theme.typography.fontFamily.semibold,
      fontSize: theme.typography.fontSize.l,
      marginLeft: theme.spacing.s,
    },
    backButton: {
      padding: theme.spacing.s,
    },
    headerActions: {
      flexDirection: 'row',
    },
    headerActionButton: {
      padding: theme.spacing.s,
      marginLeft: theme.spacing.xs,
    },
    scrollContent: {
      padding: 0,
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: 250,
      backgroundColor: theme.colors.background.paper,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    imageNavButton: {
      position: 'absolute',
      top: '50%',
      transform: [{ translateY: -20 }],
      backgroundColor: theme.colors.background.paper + 'CC',
      borderRadius: 20,
      padding: theme.spacing.s,
      zIndex: 1,
    },
    prevButton: {
      left: theme.spacing.m,
    },
    nextButton: {
      right: theme.spacing.m,
    },
    contentContainer: {
      padding: theme.spacing.m,
    },
    title: {
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xl,
      marginBottom: theme.spacing.s,
    },
    subtitle: {
      color: theme.colors.text.secondary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.m,
      marginBottom: theme.spacing.m,
    },
    section: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: 8,
      marginBottom: theme.spacing.m,
      padding: theme.spacing.m,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    sectionTitle: {
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.semibold,
      fontSize: theme.typography.fontSize.l,
      marginBottom: theme.spacing.m,
    },
    petInfoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -theme.spacing.xs,
    },
    petInfoItem: {
      width: '50%',
      paddingHorizontal: theme.spacing.xs,
      marginBottom: theme.spacing.s,
    },
    petInfoCard: {
      backgroundColor: theme.colors.background.default,
      borderRadius: 8,
      padding: theme.spacing.m,
    },
    petInfoLabel: {
      color: theme.colors.text.secondary,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.s,
      marginBottom: theme.spacing.xs,
    },
    petInfoValue: {
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.m,
    },
    descriptionText: {
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.m,
      lineHeight: 24,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    locationText: {
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.m,
      marginLeft: theme.spacing.s,
    },
    mapPlaceholder: {
      backgroundColor: theme.colors.background.default,
      borderRadius: 8,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mapPlaceholderText: {
      color: theme.colors.text.secondary,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.s,
    },
    contactSection: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: 8,
      marginBottom: theme.spacing.m,
      padding: theme.spacing.m,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    contactName: {
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.semibold,
      fontSize: theme.typography.fontSize.l,
      marginBottom: theme.spacing.xs,
    },
    contactDate: {
      color: theme.colors.text.secondary,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.s,
      marginBottom: theme.spacing.m,
    },
    contactButton: {
      backgroundColor: theme.colors.primary.main,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.m,
      padding: theme.spacing.m,
    },
    whatsappButton: {
      backgroundColor: '#25D366',
    },
    contactButtonText: {
      color: theme.colors.primary.contrast,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.m,
      marginLeft: theme.spacing.s,
    },
    warningBox: {
      backgroundColor: '#FEF3C7',
      borderRadius: 8,
      flexDirection: 'row',
      padding: theme.spacing.m,
      marginTop: theme.spacing.m,
    },
    warningIcon: {
      marginRight: theme.spacing.m,
      marginTop: theme.spacing.xs,
    },
    warningTitle: {
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.semibold,
      fontSize: theme.typography.fontSize.m,
      marginBottom: theme.spacing.xs,
    },
    warningText: {
      color: theme.colors.text.secondary,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.s,
    },
    shareRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.m,
      marginBottom: theme.spacing.s,
    },
    shareLabel: {
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.m,
      marginRight: theme.spacing.m,
    },
    shareButton: {
      padding: theme.spacing.s,
      marginRight: theme.spacing.s,
      borderRadius: 20,
    },
    loadingContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.l,
    },
    errorContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      padding: theme.spacing.m,
    },
    errorText: {
      color: theme.colors.error,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.m,
      textAlign: 'center',
    },
    retryButton: {
      alignItems: 'center',
      backgroundColor: theme.colors.primary.main,
      borderRadius: 20,
      flexDirection: 'row',
      marginTop: theme.spacing.m,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
    },
    retryButtonText: {
      color: theme.colors.primary.contrast,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.s,
      marginLeft: 5,
    },
    reportButton: {
      alignItems: 'center',
      borderColor: theme.colors.divider,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      padding: theme.spacing.m,
    },
    reportButtonText: {
      color: theme.colors.text.secondary,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.m,
      marginLeft: theme.spacing.s,
    },
  }));

  useEffect(() => {
    const fetchAdDetails = async () => {
      if (!slug) {
        setError('İlan bulunamadı.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching ad details for slug:', slug);
        const data = await adoptionService.getAdoptionListingById(slug);
        console.log('Received ad details:', data);
        
        if (!data) {
          setError('İlan bulunamadı.');
          return;
        }
        
        setAdDetails(data);
      } catch (err: any) {
        console.error('Error fetching ad details:', err);
        setError(err.message || 'İlan detayları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [slug]);

  const handleShare = async () => {
    if (!adDetails) return;
    
    try {
      await Share.share({
        message: `${adDetails.title} - SocialPet'te bir ilan: [Link burada olacak]`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleCall = () => {
    if (!adDetails?.phone) return;
    
    Linking.openURL(`tel:${adDetails.phone}`);
  };

  const handleWhatsApp = () => {
    if (!adDetails?.phone) return;
    
    // WhatsApp formatı için telefon numarasını hazırla
    const phoneNumber = adDetails.phone.replace(/\D/g, '');
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // API çağrısı yapılacak
  };

  // İçeriği render et
  if (loading) {
    return (
      <View style={[styles.screen, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  if (error || !adDetails) {
    return (
      <View style={[styles.screen, styles.errorContainer]}>
        <Text style={styles.errorText}>{error || 'İlan bulunamadı.'}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            adoptionService.getAdoptionListingById(slug)
              .then(data => {
                setAdDetails(data);
                setError(null);
              })
              .catch(err => {
                setError(err.message || 'İlan detayları yüklenirken bir hata oluştu.');
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          <Icon name="refresh-cw" size={16} color={theme.colors.primary.contrast} />
          <Text style={styles.retryButtonText}>Yeniden Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Görseller için dizi (gerçek uygulamada API'den gelecek)
  const images = [adDetails.imageUrl].filter(Boolean);
  if (images.length === 0) {
    images.push('https://via.placeholder.com/300');
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{adDetails.title}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={toggleFavorite}
            style={styles.headerActionButton}
          >
            <Icon 
              name={isFavorite ? 'heart' : 'heart'} 
              size={22} 
              color={isFavorite ? theme.colors.error : theme.colors.text.secondary}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleShare}
            style={styles.headerActionButton}
          >
            <Icon name="share-2" size={22} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContent}
      >
        {/* Görsel Galerisi */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: images[currentImageIndex] }}
            style={styles.image}
          />
          
          {images.length > 1 && (
            <>
              <TouchableOpacity 
                style={[styles.imageNavButton, styles.prevButton]}
                onPress={() => setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
              >
                <MaterialIcons name="navigate-before" size={26} color={theme.colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.imageNavButton, styles.nextButton]}
                onPress={() => setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
              >
                <MaterialIcons name="navigate-next" size={26} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.contentContainer}>
          {/* İlan Detayları */}
          <Text style={styles.title}>{adDetails.title}</Text>
          <Text style={styles.subtitle}>{adDetails.petName}, {adDetails.breed}</Text>

          {/* Pet Bilgileri */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pet Bilgileri</Text>
            <View style={styles.petInfoGrid}>
              <View style={styles.petInfoItem}>
                <View style={styles.petInfoCard}>
                  <Text style={styles.petInfoLabel}>Pet Adı</Text>
                  <Text style={styles.petInfoValue}>{adDetails.petName || 'Belirtilmemiş'}</Text>
                </View>
              </View>
              <View style={styles.petInfoItem}>
                <View style={styles.petInfoCard}>
                  <Text style={styles.petInfoLabel}>Cinsi</Text>
                  <Text style={styles.petInfoValue}>{adDetails.breed || 'Belirtilmemiş'}</Text>
                </View>
              </View>
              <View style={styles.petInfoItem}>
                <View style={styles.petInfoCard}>
                  <Text style={styles.petInfoLabel}>Yaş</Text>
                  <Text style={styles.petInfoValue}>{adDetails.age || 'Belirtilmemiş'}</Text>
                </View>
              </View>
              <View style={styles.petInfoItem}>
                <View style={styles.petInfoCard}>
                  <Text style={styles.petInfoLabel}>Cinsiyet</Text>
                  <Text style={styles.petInfoValue}>{adDetails.gender || 'Belirtilmemiş'}</Text>
                </View>
              </View>
              <View style={styles.petInfoItem}>
                <View style={styles.petInfoCard}>
                  <Text style={styles.petInfoLabel}>Boyut</Text>
                  <Text style={styles.petInfoValue}>{adDetails.size || 'Belirtilmemiş'}</Text>
                </View>
              </View>
              <View style={styles.petInfoItem}>
                <View style={styles.petInfoCard}>
                  <Text style={styles.petInfoLabel}>Durum</Text>
                  <Text style={styles.petInfoValue}>{adDetails.status || 'Belirtilmemiş'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Açıklama */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <Text style={styles.descriptionText}>{adDetails.description}</Text>
          </View>

          {/* Konum */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Konum</Text>
            <View style={styles.locationRow}>
              <Icon name="map-pin" size={18} color={theme.colors.primary.main} />
              <Text style={styles.locationText}>{adDetails.city} / {adDetails.district}</Text>
            </View>
            
            {/* Harita placeholderı - gerçek bir harita komponenti eklenebilir */}
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>Harita burada görüntülenecek</Text>
            </View>
          </View>

          {/* İletişim Bölümü */}
          <View style={styles.contactSection}>
            <Text style={styles.contactName}>{adDetails.fullName}</Text>
            <Text style={styles.contactDate}>
              İlan Tarihi: {new Date(adDetails.createdAt).toLocaleDateString('tr-TR')}
            </Text>

            {/* İletişim Butonları */}
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleCall}
            >
              <Icon name="phone" size={18} color={theme.colors.primary.contrast} />
              <Text style={styles.contactButtonText}>{adDetails.phone}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.contactButton, styles.whatsappButton]}
              onPress={handleWhatsApp}
            >
              <FontAwesome name="whatsapp" size={18} color={theme.colors.primary.contrast} />
              <Text style={styles.contactButtonText}>WhatsApp ile İletişim</Text>
            </TouchableOpacity>

            {/* Paylaş */}
            <View style={styles.shareRow}>
              <Text style={styles.shareLabel}>Bu İlanı Paylaş</Text>
              <TouchableOpacity 
                style={[styles.shareButton, { backgroundColor: '#E7F3FF' }]}
                onPress={handleShare}
              >
                <FontAwesome name="share-alt" size={18} color="#1877F2" />
              </TouchableOpacity>
            </View>

            {/* Uyarı Kutusu */}
            <View style={styles.warningBox}>
              <FontAwesome5 
                name="exclamation-triangle" 
                size={18} 
                color="#F59E0B" 
                style={styles.warningIcon}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.warningTitle}>Tanımadığınız Kişilere Dikkat!</Text>
                <Text style={styles.warningText}>
                  Socialpet, pet arayanlar ve sahiplendirme yapanları buluşturan bir platform olup, satış yapmamaktadır. 
                  Yüz yüze görüşülmeyen kişilere hiçbir şekilde kaparo ya da bir ödeme yapılmamalıdır.
                </Text>
              </View>
            </View>

            {/* Şikayet Butonu */}
            <TouchableOpacity 
              style={styles.reportButton}
              onPress={() => Alert.alert('Bilgi', 'Şikayet formuna yönlendirileceksiniz.')}
            >
              <Icon name="flag" size={18} color={theme.colors.text.secondary} />
              <Text style={styles.reportButtonText}>İlan İle İlgili Şikayetim Var</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AdoptionDetailScreen; 