import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import useTheme from '@/theme/hooks/useTheme';
import { useStyles } from '@/theme/useStyles';
import type { Theme } from '@/theme/types';
import adoptionService from '@/services/adoptionService';
import type { AdoptionListingDetail } from '@/services/adoptionService';
import lostPetService from '@/services/lostPetService';
import type { LostPet } from '@/services/lostPetService';
import type { MainStackParamList } from '@/navigation/MainStackNavigator';

// Hayvan kategorileri
const petCategories = [
  { icon: 'paw', id: 'all', name: 'Hepsi' },
  { icon: 'cat', id: 'cat', name: 'Kedi' },
  { icon: 'dog', id: 'dog', name: 'Köpek' },
  { icon: 'bird', id: 'bird', name: 'Kuş' },
];

// Type tanımlamaları
type DrawerParamList = {
  MainStack: undefined;
};

type HomeScreenNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<DrawerParamList>,
  StackNavigationProp<MainStackParamList>
>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  // Durum değişkenleri
  const [adoptionListings, setAdoptionListings] = useState<AdoptionListingDetail[]>([]);
  const [lostPets, setLostPets] = useState<LostPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAdoptionCategory, setSelectedAdoptionCategory] = useState('all');
  const [selectedLostCategory, setSelectedLostCategory] = useState('all');
  
  // Stiller
  const styles = useStyles((theme: Theme) => ({
    screen: {
      backgroundColor: theme.colors.background.default,
      flex: 1,
    },
    heroSection: {
      height: 400,
      position: 'relative',
    },
    heroImage: {
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    heroContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    heroTitle: {
      color: theme.colors.text.inverse,
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
    },
    heroSubtitle: {
      color: theme.colors.text.inverse,
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 24,
      opacity: 0.9,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary.main,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.text.inverse,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    buttonText: {
      color: theme.colors.text.inverse,
      fontSize: 16,
      fontWeight: '600',
    },
    featuresSection: {
      padding: 24,
      backgroundColor: theme.colors.background.paper,
    },
    sectionTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 32,
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    featureCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: theme.colors.background.default,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    featureIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary.light,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    featureTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    featureDescription: {
      fontSize: 14,
      color: theme.colors.text.secondary,
    },
    communitySection: {
      padding: 24,
      backgroundColor: theme.colors.background.default,
    },
    communityContent: {
      flexDirection: 'row',
      gap: 24,
    },
    communityText: {
      flex: 1,
    },
    communityImage: {
      flex: 1,
      height: 300,
      borderRadius: 12,
    },
    donationSection: {
      padding: 24,
      backgroundColor: theme.colors.primary.light,
    },
    donationCard: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
    },
    donationList: {
      marginTop: 16,
    },
    donationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    donationIcon: {
      marginRight: 8,
    },
    footer: {
      backgroundColor: theme.colors.background.dark,
      padding: 24,
    },
    footerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    footerLinks: {
      flex: 1,
    },
    footerTitle: {
      color: theme.colors.text.inverse,
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
    },
    footerLink: {
      color: theme.colors.text.inverse,
      marginBottom: 8,
    },
    footerBottom: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.divider,
      paddingTop: 16,
      alignItems: 'center',
    },
    copyright: {
      color: theme.colors.text.inverse,
      opacity: 0.7,
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
      fontFamily: theme.typography.fontFamily.semibold,
      fontSize: theme.typography.fontSize.l,
      marginLeft: theme.spacing.m,
    },
    menuButton: {
      padding: theme.spacing.s,
    },
    scrollContent: {
      padding: theme.spacing.m,
    },
    categoriesContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.m,
    },
    categoryButton: {
      alignItems: 'center',
      borderRadius: 20,
      flexDirection: 'row',
      marginRight: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      paddingVertical: theme.spacing.s,
    },
    categoryText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.s,
      marginLeft: 5,
    },
    itemContainer: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: 8, // Sabit değer kullanıyoruz
      elevation: 2,
      marginBottom: theme.spacing.m,
      overflow: 'hidden',
      shadowColor: '#000', // Sabit değer kullanıyoruz
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    itemImage: {
      height: 150,
      resizeMode: 'cover',
      width: '100%',
    },
    itemDetails: {
      padding: theme.spacing.m,
    },
    itemTitle: {
      color: theme.colors.text.primary,
      fontFamily: theme.typography.fontFamily.semibold,
      fontSize: theme.typography.fontSize.m,
      marginBottom: theme.spacing.xs,
    },
    itemSubtitle: {
      color: theme.colors.text.secondary,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.s,
      marginBottom: theme.spacing.xs,
    },
    itemInfo: {
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: theme.spacing.xs,
    },
    itemInfoText: {
      color: theme.colors.text.secondary,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.xs,
      marginLeft: theme.spacing.xs,
    },
    errorContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.m,
    },
    errorText: {
      color: theme.colors.error,
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.m,
      textAlign: 'center',
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.l,
    },
    emptyStateText: {
      color: theme.colors.text.secondary,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.m,
      padding: theme.spacing.m,
      textAlign: 'center',
    },
    listingsContainer: {
      marginBottom: theme.spacing.m,
    },
  }));
  
  // Verileri yükle
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [adoptionData, lostPetData] = await Promise.all([
        adoptionService.getAdoptionListings(),
        lostPetService.getLostPets()
      ]);
      
      setAdoptionListings(adoptionData);
      setLostPets(lostPetData);
    } catch (error) {
      console.error('Ana sayfa veri yükleme hatası:', error);
      setError('Veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };
  
  // Kategoriye göre filtreleme
  const filteredAdoptionListings = adoptionListings.filter(item => 
    selectedAdoptionCategory === 'all' || 
    (item.breed?.toLowerCase().includes(selectedAdoptionCategory === 'cat' ? 'kedi' : 
                                       selectedAdoptionCategory === 'dog' ? 'köpek' : 
                                       selectedAdoptionCategory === 'bird' ? 'kuş' : ''))
  );
  
  const filteredLostPets = lostPets.filter(item => 
    selectedLostCategory === 'all' || 
    (item.animalType?.toLowerCase() === (
      selectedLostCategory === 'cat' ? 'kedi' : 
      selectedLostCategory === 'dog' ? 'köpek' : 
      selectedLostCategory === 'bird' ? 'kuş' : '')
    )
  );
  
  // İlan öğesini render et
  const renderAdoptionItem = (item: AdoptionListingDetail) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.itemContainer}
      onPress={() => navigation.navigate('AdoptionDetail', { slug: item.slug })}
    >
      <Image 
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>{item.petName}, {item.breed}</Text>
        <View style={styles.itemInfo}>
          <Icon name="map-pin" color={theme.colors.text.secondary} size={14} />
          <Text style={styles.itemInfoText}>{item.city}, {item.district}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Icon name="calendar" color={theme.colors.text.secondary} size={14} />
          <Text style={styles.itemInfoText}>
            {new Date(item.createdAt).toLocaleDateString('tr-TR')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderLostPetItem = (item: LostPet) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.itemContainer}
      onPress={() => navigation.navigate('LostPetDetail', { id: item.id })}
    >
      <Image 
        source={{ uri: item.imageUrl || item.image || 'https://via.placeholder.com/150' }} 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>{item.animalType}</Text>
        <View style={styles.itemInfo}>
          <Icon name="map-pin" color={theme.colors.text.secondary} size={14} />
          <Text style={styles.itemInfoText}>{item.lastSeenLocation || item.location}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Icon name="calendar" color={theme.colors.text.secondary} size={14} />
          <Text style={styles.itemInfoText}>
            {item.lastSeenDate || new Date(item.timestamp).toLocaleDateString('tr-TR')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Kategori butonlarını render et
  const renderCategoryButtons = (selectedCategory: string, setSelectedCategory: (category: string) => void) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
      {petCategories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            {
              backgroundColor: selectedCategory === category.id
                ? theme.colors.primary.main
                : theme.colors.background.paper,
            },
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <MaterialIcon
            name={category.icon}
            size={18}
            color={
              selectedCategory === category.id
                ? theme.colors.primary.contrast
                : theme.colors.text.secondary
            }
          />
          <Text
            style={[
              styles.categoryText,
              {
                color:
                  selectedCategory === category.id
                    ? theme.colors.primary.contrast
                    : theme.colors.text.secondary,
              },
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
  
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
          style={styles.primaryButton}
          onPress={fetchData}
        >
          <Text style={styles.buttonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.screen}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Image 
          source={{ uri: 'https://example.com/intro.jpg' }} 
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Evcil Hayvanların İçin En İyi Platform
          </Text>
          <Text style={styles.heroSubtitle}>
            Kayıp ilanları oluştur, yeni bir dost sahiplen, sağlık takibini yap ve daha fazlası!
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Auth')}
            >
              <Text style={styles.buttonText}>Hemen Katıl</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Features')}
            >
              <Text style={styles.buttonText}>Daha Fazla Bilgi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>
          <Text style={{ color: theme.colors.primary.main }}>SocialPet</Text> ile Neler Yapabilirsin?
        </Text>
        <View style={styles.featuresGrid}>
          {/* Lost Pets Feature */}
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => navigation.navigate('Lost')}
          >
            <View style={styles.featureIcon}>
              <Icon name="search" size={24} color={theme.colors.primary.main} />
            </View>
            <Text style={styles.featureTitle}>Kayıp Evcil Hayvanlar</Text>
            <Text style={styles.featureDescription}>
              Kaybolan dostunu bulman için hızlı ve etkili bir platform. İlanını oluştur, topluluk yardımıyla dostunu bul.
            </Text>
          </TouchableOpacity>
          
          {/* Adoption Feature */}
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => navigation.navigate('Adoption')}
          >
            <View style={styles.featureIcon}>
              <Icon name="heart" size={24} color={theme.colors.primary.main} />
            </View>
            <Text style={styles.featureTitle}>Sahiplendirme</Text>
            <Text style={styles.featureDescription}>
              Yeni bir dost edinmek veya dostunu sahiplendirmek için güvenilir bir ortam. Binlerce hayvan yeni yuvasını bekliyor.
            </Text>
          </TouchableOpacity>
          
          {/* Breed Detector Feature */}
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => navigation.navigate('BreedDetector')}
          >
            <View style={styles.featureIcon}>
              <Icon name="camera" size={24} color={theme.colors.primary.main} />
            </View>
            <Text style={styles.featureTitle}>Cins Dedektifi (AI)</Text>
            <Text style={styles.featureDescription}>
              Evcil hayvanının cinsini öğrenmek mi istiyorsun? Yapay zeka destekli cins dedektifi ile hemen öğren.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Community Section */}
      <View style={styles.communitySection}>
        <View style={styles.communityContent}>
          <View style={styles.communityText}>
            <Text style={styles.sectionTitle}>
              <Text style={{ color: theme.colors.primary.main }}>Topluluk</Text> ile Sorularına Yanıt Bul
            </Text>
            <Text style={styles.featureDescription}>
              Evcil hayvanlarla ilgili her türlü sorunun yanıtını bulabileceğin, deneyimli hayvan sahiplerinden oluşan topluluğumuza katıl.
            </Text>
            <TouchableOpacity 
              style={[styles.primaryButton, { marginTop: 16 }]}
              onPress={() => navigation.navigate('QnA')}
            >
              <Text style={styles.buttonText}>Sen de Bir Soru Sor</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: 'https://example.com/community.jpg' }} 
            style={styles.communityImage}
          />
        </View>
      </View>
      
      {/* Donation Section */}
      <View style={styles.donationSection}>
        <Text style={styles.sectionTitle}>
          <Text style={{ color: theme.colors.primary.main }}>Bağış Yap</Text>, Hayat Kurtar
        </Text>
        <View style={styles.donationCard}>
          <View style={styles.donationList}>
            <View style={styles.donationItem}>
              <Icon name="gift" size={20} color={theme.colors.primary.main} style={styles.donationIcon} />
              <Text>Barınak hayvanları için mama</Text>
            </View>
            <View style={styles.donationItem}>
              <Icon name="activity" size={20} color={theme.colors.primary.main} style={styles.donationIcon} />
              <Text>Veteriner tedavi masrafları</Text>
            </View>
            <View style={styles.donationItem}>
              <Icon name="home" size={20} color={theme.colors.primary.main} style={styles.donationIcon} />
              <Text>Barınak iyileştirme çalışmaları</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.primaryButton, { marginTop: 16 }]}
            onPress={() => navigation.navigate('Donation')}
          >
            <Text style={styles.buttonText}>Bağış Yap</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerLinks}>
            <Text style={styles.footerTitle}>Hızlı Erişim</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Text style={styles.footerLink}>Ana Sayfa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Adoption')}>
              <Text style={styles.footerLink}>Sahiplendirme</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Lost')}>
              <Text style={styles.footerLink}>Kayıp İlanları</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Donation')}>
              <Text style={styles.footerLink}>Bağış Yap</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footerLinks}>
            <Text style={styles.footerTitle}>İletişim</Text>
            <Text style={styles.footerLink}>info@socialpet.com</Text>
            <Text style={styles.footerLink}>+90 212 345 67 89</Text>
          </View>
        </View>
        
        <View style={styles.footerBottom}>
          <Text style={styles.copyright}>© 2025 SocialPet. Tüm hakları saklıdır.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
