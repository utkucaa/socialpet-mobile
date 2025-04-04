import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import axiosInstance from '@/services/axios';
import { storage } from '@/App';
import { SafeScreen } from '@/components/templates';
import useTheme from '@/theme/hooks/useTheme';
import { useStyles } from '@/theme/useStyles';
import type { Theme } from '@/theme/types';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  joinDate: string;
  avatar?: string;
  bio?: string;
  phoneNumber?: string;
}

interface UserStats {
  totalAds: number;
  activeAds: number;
  views: number;
  membershipDate: string;
}

interface Pet {
  id: string | number;
  name: string;
  type: string;
  animalType?: string;
  breed?: string;
  age: number;
  gender?: string;
  imageUrl?: string;
}

interface Ad {
  id: string | number;
  title: string;
  description: string;
  petType?: string;
  animalType?: string;
  location: string;
  date?: string;
  status: 'active' | 'inactive' | 'Kayıp';
  category: 'kayıp' | 'sahiplendirme';
  imageUrl?: string;
}

export const Profile = () => {
  const { theme, setTheme } = useTheme();
  const navigation = useNavigation();
  
  // State variables
  const [userData, setUserData] = useState<UserData | null>(null);
  const [avatar, setAvatar] = useState<any>(require('@/assets/images/avatar.png'));
  const [activeTab, setActiveTab] = useState<string>('pets');
  const [pets, setPets] = useState<Pet[]>([]);
  const [adoptionAds, setAdoptionAds] = useState<Ad[]>([]);
  const [lostPetAds, setLostPetAds] = useState<Ad[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalAds: 0,
    activeAds: 0,
    views: 0,
    membershipDate: ''
  });
  const [isLoading, setIsLoading] = useState({
    user: true,
    pets: true,
    ads: true
  });
  const [error, setError] = useState<string | null>(null);

  // Styles
  const styles = useStyles((theme: Theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.default,
      padding: theme.spacing.m,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
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
    avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
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
    tabContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    tab: {
      alignItems: 'center',
      borderRadius: 8,
      flexDirection: 'row',
      marginRight: 10,
      padding: 12,
    },
    activeTab: {
      backgroundColor: theme.colors.primary.main,
    },
    tabText: {
      fontSize: 14,
      marginLeft: 8,
    },
    activeTabText: {
      color: theme.colors.primary.contrast,
    },
    inactiveTabText: {
      color: theme.colors.text.primary,
    },
    loadingContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    statCard: {
      alignItems: 'center',
      backgroundColor: theme.colors.background.paper,
      borderRadius: 12,
      flex: 1,
      marginHorizontal: 4,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statIcon: {
      alignItems: 'center',
      backgroundColor: theme.colors.primary.main,
      borderRadius: 20,
      height: 40,
      justifyContent: 'center',
      marginBottom: 8,
      width: 40,
    },
    statValue: {
      color: theme.colors.text.primary,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    statLabel: {
      color: theme.colors.text.secondary,
      fontSize: 12,
    },
    petCard: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    petImage: {
      height: 150,
      width: '100%',
    },
    petContent: {
      padding: 12,
    },
    petName: {
      color: theme.colors.text.primary,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    petInfo: {
      color: theme.colors.text.secondary,
      fontSize: 14,
    },
    adCard: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    adImage: {
      height: 150,
      width: '100%',
    },
    adContent: {
      padding: 12,
    },
    adTitle: {
      color: theme.colors.text.primary,
      fontSize: 16,
      fontWeight: 'bold',
      flex: 1,
      marginRight: 8,
    },
    adDescription: {
      color: theme.colors.text.secondary,
      fontSize: 14,
      marginVertical: 8,
    },
    emptyStateContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      backgroundColor: theme.colors.background.paper,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    emptyStateText: {
      fontSize: 16,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginVertical: 16,
    },
    addButton: {
      backgroundColor: theme.colors.primary.main,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButtonText: {
      color: theme.colors.primary.contrast,
      fontSize: 14,
      fontWeight: '600',
    },
    addButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      gap: 12,
    },
    petListHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    adActionButtons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    adStatusBadge: {
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      alignSelf: 'flex-start',
    },
    adStatusText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: 'white',
    },
    adLocation: {
      color: theme.colors.text.secondary,
      fontSize: 14,
      marginVertical: 4,
    },
    adDate: {
      color: theme.colors.text.secondary,
      fontSize: 14,
      marginTop: 4,
    },
    adHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.divider,
      marginVertical: 8,
    },
  }));

  // Effect to load user data from storage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userStr = storage.getString('user');
        if (userStr) {
          const parsedUser = JSON.parse(userStr);
          setUserData(parsedUser);
          
          // Set membership date
          if (parsedUser.joinDate) {
            const formattedDate = new Date(parsedUser.joinDate).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            setUserStats(prev => ({
              ...prev,
              membershipDate: formattedDate
            }));
          }
          
          // Load user's avatar if available
          if (parsedUser.avatar) {
            setAvatar({ uri: parsedUser.avatar });
          }
          
          // Fetch user stats if we have user ID
          if (parsedUser.id) {
            fetchUserStats(parsedUser.id);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Kullanıcı bilgileri yüklenemedi.');
      } finally {
        setIsLoading(prev => ({ ...prev, user: false }));
      }
    };
    
    getUserData();
  }, []);
  
  // Fetch user statistics
  const fetchUserStats = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/api/v1/users/${userId}/stats`);
      
      setUserStats(prev => ({
        ...prev,
        totalAds: response.data.totalAds || 0,
        activeAds: response.data.activeAds || 0,
        views: response.data.views || 0
      }));
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Continue with default values
    }
  };
  
  // Fetch user's pets
  useEffect(() => {
    const fetchPets = async () => {
      if (!userData?.id) return;
      
      try {
        const response = await axiosInstance.get(`/api/pets/owner/${userData.id}`);
        setPets(response.data);
      } catch (error) {
        console.error('Error fetching pets:', error);
        // Use empty array for pets
      } finally {
        setIsLoading(prev => ({ ...prev, pets: false }));
      }
    };
    
    if (userData?.id) {
      fetchPets();
    }
  }, [userData]);
  
  // Fetch user's ads (adoptions and lost pets)
  useEffect(() => {
    const fetchAds = async () => {
      if (!userData?.id) return;
      
      try {
        // Fetch adoption ads
        const adoptionResponse = await axiosInstance.get(`/api/v1/adoption/user/${userData.id}`);
        setAdoptionAds(adoptionResponse.data || []);
        
        // Fetch lost pet ads
        const lostPetResponse = await axiosInstance.get(`/api/lostpets/user/${userData.id}`);
        setLostPetAds(lostPetResponse.data || []);
        
        // Combine both types of ads
        const combinedAds = [
          ...(adoptionResponse.data || []).map(ad => ({
            ...ad,
            category: 'sahiplendirme'
          })),
          ...(lostPetResponse.data || []).map(ad => ({
            ...ad,
            category: 'kayıp'
          }))
        ];
        
        setAds(combinedAds);
      } catch (error) {
        console.error('Error fetching ads:', error);
        // Use empty arrays
      } finally {
        setIsLoading(prev => ({ ...prev, ads: false }));
      }
    };
    
    if (userData?.id) {
      fetchAds();
    }
  }, [userData]);
  
  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme.id === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const toggleLanguage = () => {
    // Dummy fonksiyon, i18n kaldırıldı
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage and reset auth state
      storage.delete('token');
      storage.delete('user');
      // Navigate to auth screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' as never }],
      });
    }
  };
  
  // Navigate to create screens
  const navigateToAddPet = () => {
    navigation.navigate('CreatePet' as never);
  };
  
  const navigateToCreateAdoption = () => {
    navigation.navigate('CreateAdoption' as never);
  };
  
  const navigateToCreateLostPet = () => {
    navigation.navigate('CreateLostPet' as never);
  };
  
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!userData) return 'U';
    
    const firstInitial = userData.firstName ? userData.firstName.charAt(0) : '';
    const lastInitial = userData.lastName ? userData.lastName.charAt(0) : '';
    
    return (firstInitial + lastInitial).toUpperCase();
  };
  
  // Render user profile header section
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.avatar}>
        {avatar ? (
          <Image source={avatar} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>{getUserInitials()}</Text>
        )}
      </View>
      <Text style={styles.name}>
        Utku Çolak
      </Text>
      <Text style={styles.email}>
        utku.colak@example.com
      </Text>
    </View>
  );
  
  // Render statistics section
  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <View style={styles.statIcon}>
          <Icon name="file-text" size={20} color={theme.colors.primary.contrast} />
        </View>
        <Text style={styles.statValue}>{userStats.totalAds}</Text>
        <Text style={styles.statLabel}>Toplam İlan</Text>
      </View>
      
      <View style={styles.statCard}>
        <View style={styles.statIcon}>
          <Icon name="check-circle" size={20} color={theme.colors.primary.contrast} />
        </View>
        <Text style={styles.statValue}>{userStats.activeAds}</Text>
        <Text style={styles.statLabel}>Aktif İlanlar</Text>
      </View>
      
      <View style={styles.statCard}>
        <View style={styles.statIcon}>
          <Icon name="eye" size={20} color={theme.colors.primary.contrast} />
        </View>
        <Text style={styles.statValue}>{userStats.views}</Text>
        <Text style={styles.statLabel}>Görüntülenme</Text>
      </View>
    </View>
  );
  
  // Render tabs for switching between different content
  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'pets' && styles.activeTab]}
        onPress={() => setActiveTab('pets')}
      >
        <Icon 
          name="github" 
          size={18} 
          color={activeTab === 'pets' ? theme.colors.primary.contrast : theme.colors.text.primary} 
        />
        <Text style={[
          styles.tabText, 
          activeTab === 'pets' ? styles.activeTabText : styles.inactiveTabText
        ]}>
          Evcil Hayvanlarım
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'ads' && styles.activeTab]}
        onPress={() => setActiveTab('ads')}
      >
        <Icon 
          name="file-text" 
          size={18} 
          color={activeTab === 'ads' ? theme.colors.primary.contrast : theme.colors.text.primary} 
        />
        <Text style={[
          styles.tabText, 
          activeTab === 'ads' ? styles.activeTabText : styles.inactiveTabText
        ]}>
          İlanlarım
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render user's pets
  const renderPets = () => {
    if (isLoading.pets) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={{ marginTop: 16 }}>Yükleniyor...</Text>
        </View>
      );
    }

    if (pets.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Icon name="alert-circle" size={48} color={theme.colors.text.secondary} />
          <Text style={styles.emptyStateText}>Henüz evcil hayvanınız bulunmuyor</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={navigateToAddPet}
          >
            <Text style={styles.addButtonText}>Evcil Hayvan Ekle</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        <View style={styles.petListHeader}>
          <Text style={styles.sectionTitle}>Evcil Hayvanlarım</Text>
          <TouchableOpacity onPress={navigateToAddPet}>
            <Icon name="plus-circle" size={24} color={theme.colors.primary.main} />
          </TouchableOpacity>
        </View>
        {pets.map((pet) => (
          <View key={pet.id} style={styles.petCard}>
            {pet.imageUrl ? (
              <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />
            ) : (
              <View style={[styles.petImage, { backgroundColor: theme.colors.primary.light, justifyContent: 'center', alignItems: 'center' }]}>
                <Icon name="image" size={48} color={theme.colors.primary.main} />
              </View>
            )}
            <View style={styles.petContent}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petInfo}>
                {pet.breed || pet.animalType || pet.type}, {pet.age} yaşında, {pet.gender}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };
  
  // Render user's ads
  const renderAds = () => {
    if (isLoading.ads) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={{ marginTop: 16 }}>Yükleniyor...</Text>
        </View>
      );
    }

    if (ads.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Icon name="alert-circle" size={48} color={theme.colors.text.secondary} />
          <Text style={styles.emptyStateText}>Henüz ilanınız bulunmuyor</Text>
          <View style={styles.addButtonContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={navigateToCreateAdoption}
            >
              <Text style={styles.addButtonText}>Sahiplendirme İlanı</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.colors.error }]}
              onPress={navigateToCreateLostPet}
            >
              <Text style={styles.addButtonText}>Kayıp İlanı</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View>
        <View style={styles.petListHeader}>
          <Text style={styles.sectionTitle}>İlanlarım</Text>
          <View style={styles.adActionButtons}>
            <TouchableOpacity onPress={navigateToCreateAdoption} style={{ marginRight: 16 }}>
              <Icon name="heart" size={24} color={theme.colors.primary.main} />
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToCreateLostPet}>
              <Icon name="alert-triangle" size={24} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        </View>
        {ads.map((ad) => (
          <View key={ad.id} style={styles.adCard}>
            {ad.imageUrl ? (
              <Image source={{ uri: ad.imageUrl }} style={styles.adImage} />
            ) : (
              <View style={[styles.adImage, { backgroundColor: theme.colors.primary.light, justifyContent: 'center', alignItems: 'center' }]}>
                <Icon name="image" size={48} color={theme.colors.primary.main} />
              </View>
            )}
            <View style={styles.adContent}>
              <View style={styles.adHeader}>
                <Text style={styles.adTitle}>{ad.title}</Text>
                <View style={[
                  styles.adStatusBadge, 
                  { backgroundColor: ad.status === 'active' 
                    ? theme.colors.success 
                    : ad.status === 'Kayıp' 
                      ? theme.colors.error 
                      : theme.colors.text.disabled 
                  }
                ]}>
                  <Text style={styles.adStatusText}>{ad.status}</Text>
                </View>
              </View>
              <Text style={styles.adLocation}>
                <Icon name="map-pin" size={14} color={theme.colors.text.secondary} /> {ad.location}
              </Text>
              <Text numberOfLines={2} style={styles.adDescription}>
                {ad.description}
              </Text>
              {ad.date && (
                <Text style={styles.adDate}>
                  <Icon name="calendar" size={14} color={theme.colors.text.secondary} /> {ad.date}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };
  
  // Handle account settings
  const renderSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Ayarlar</Text>
      
      <TouchableOpacity 
        onPress={toggleTheme}
        style={styles.row}
      >
        <View style={styles.rowLeft}>
          <Icon 
            name={theme.id === 'dark' ? 'moon' : 'sun'} 
            size={24} 
            color={theme.colors.text.primary}
            style={styles.rowIcon}
          />
          <Text style={styles.rowLabel}>Tema</Text>
        </View>
        <Text style={styles.rowValue}>
          {theme.id === 'dark' ? 'Koyu' : 'Açık'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.divider} />
      
      <TouchableOpacity 
        onPress={handleLogout}
        style={styles.row}
      >
        <View style={styles.rowLeft}>
          <Icon 
            name="log-out" 
            size={24} 
            color={theme.colors.error}
            style={styles.rowIcon}
          />
          <Text style={[styles.rowLabel, { color: theme.colors.error }]}>
            Çıkış Yap
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeScreen style={styles.container}>
      <ScrollView>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {isLoading.user ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Text style={{ marginTop: 16 }}>Profil bilgileri yükleniyor...</Text>
          </View>
        ) : (
          <>
            {renderHeader()}
            {renderStats()}
            {renderTabs()}
            
            {activeTab === 'pets' ? renderPets() : renderAds()}
            
            {renderSettings()}
          </>
        )}
      </ScrollView>
    </SafeScreen>
  );
};
