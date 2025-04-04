import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import useTheme from '@/theme/hooks/useTheme';
import { useStyles } from '@/theme/useStyles';
import type { Theme } from '@/theme/types';
import adoptionService from '@/services/adoptionService';
import axiosInstance from '@/services/axios';

// Form data interface
interface FormData {
  title: string;
  petName: string;
  breed: string;
  age: string;
  gender: string;
  description: string;
  city: string;
  district: string;
  fullName: string;
  phone: string;
  size: string;
  imageUrl: string;
  source: string;
  animalType: string;
}

// Initial form state
const initialFormData: FormData = {
  title: '',
  petName: '',
  breed: '',
  age: '',
  gender: '',
  description: '',
  city: '',
  district: '',
  fullName: '',
  phone: '',
  size: '',
  imageUrl: '',
  source: '',
  animalType: 'kedi',
};

const StepByStepCreateAdoptionScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  // State for step management
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAnimalType, setSelectedAnimalType] = useState<string>('kedi');

  // Animal type options
  const animalTypes = [
    { id: 'kedi', name: 'Kedi', icon: 'github' }, // Using this as a cat icon placeholder
    { id: 'köpek', name: 'Köpek', icon: 'gitlab' }, // Using this as a dog icon placeholder
    { id: 'muhabbetkuşu', name: 'Muhabbet Kuşu', icon: 'twitter' }, // Using bird icon placeholder
    { id: 'papağan', name: 'Papağan', icon: 'twitter' }, // Using bird icon placeholder
  ];

  // Handle input changes
  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Navigation between steps
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Check if current step is valid to proceed
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedAnimalType !== '';
      case 2:
        return (
          formData.title !== '' &&
          formData.petName !== '' &&
          formData.breed !== '' &&
          formData.age !== '' &&
          formData.gender !== '' &&
          formData.city !== '' &&
          formData.district !== '' &&
          formData.fullName !== '' &&
          formData.phone !== ''
        );
      case 3:
        return formData.imageUrl !== '';
      default:
        return true;
    }
  };

  // Request camera permission
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Galeri İzni",
            message: "Resim seçmek için galeri izni gerekiyor",
            buttonNeutral: "Daha Sonra Sor",
            buttonNegative: "İptal",
            buttonPositive: "Tamam"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Pick an image from library
  const pickImage = async () => {
    const hasPermission = await requestCameraPermission();
    
    if (!hasPermission) {
      Alert.alert('İzin Gerekli', 'Galeriye erişim izni gereklidir.');
      return;
    }

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
      });

      if (result.assets && result.assets[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Hata', 'Resim seçilirken bir hata oluştu');
    }
  };

  // Upload image to server
  const uploadImage = async (uri: string) => {
    try {
      setIsUploading(true);
      
      const formDataObj = new FormData();
      formDataObj.append('file', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      const response = await axiosInstance.post('/api/v1/files/upload', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.fileUrl) {
        setFormData(prev => ({
          ...prev,
          imageUrl: response.data.fileUrl
        }));
      } else if (response.data?.fileName) {
        const fileUrl = `/api/v1/files/${response.data.fileName}`;
        setFormData(prev => ({
          ...prev,
          imageUrl: fileUrl
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Hata', 'Resim yüklenirken bir hata oluştu');
    } finally {
      setIsUploading(false);
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
    content: {
      flex: 1,
      padding: theme.spacing.m,
    },
    stepIndicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.l,
      paddingHorizontal: theme.spacing.s,
    },
    stepCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.colors.background.paper,
      borderWidth: 1,
      borderColor: theme.colors.primary.main,
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeStepCircle: {
      backgroundColor: theme.colors.primary.main,
    },
    stepText: {
      color: theme.colors.text.primary,
      fontSize: theme.typography.fontSize.s,
    },
    activeStepText: {
      color: theme.colors.primary.contrast,
      fontWeight: 'bold',
    },
    stepConnector: {
      flex: 1,
      height: 2,
      backgroundColor: theme.colors.divider,
      alignSelf: 'center',
      marginHorizontal: theme.spacing.xs,
    },
    activeStepConnector: {
      backgroundColor: theme.colors.primary.main,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.l,
    },
    button: {
      backgroundColor: theme.colors.primary.main,
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.s,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 100,
    },
    buttonText: {
      color: theme.colors.primary.contrast,
      fontSize: theme.typography.fontSize.m,
      fontWeight: '600',
    },
    disabledButton: {
      backgroundColor: theme.colors.background.paper,
      borderWidth: 1,
      borderColor: theme.colors.divider,
    },
    disabledButtonText: {
      color: theme.colors.text.disabled,
    },
    stepTitle: {
      fontSize: theme.typography.fontSize.l,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.m,
    },
    stepDescription: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.l,
    },
    animalTypeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.l,
    },
    animalTypeItem: {
      width: '48%',
      backgroundColor: theme.colors.background.paper,
      borderRadius: theme.borderRadius.m,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.m,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.divider,
    },
    selectedAnimalTypeItem: {
      borderColor: theme.colors.primary.main,
      borderWidth: 2,
      backgroundColor: theme.colors.primary.light,
    },
    animalTypeIcon: {
      marginBottom: theme.spacing.s,
    },
    animalTypeName: {
      fontSize: theme.typography.fontSize.m,
      color: theme.colors.text.primary,
      fontWeight: '500',
    },
    formGroup: {
      marginBottom: theme.spacing.m,
    },
    label: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.s,
    },
    input: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: theme.borderRadius.s,
      padding: theme.spacing.s,
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text.primary,
      borderWidth: 1,
      borderColor: theme.colors.divider,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    required: {
      color: theme.colors.error,
      marginLeft: theme.spacing.xs,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginTop: theme.spacing.m,
      marginBottom: theme.spacing.s,
    },
    imageContainer: {
      width: '100%',
      height: 200,
      backgroundColor: theme.colors.background.paper,
      borderRadius: theme.borderRadius.s,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: theme.borderRadius.s,
    },
    uploadButton: {
      backgroundColor: theme.colors.primary.main,
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.s,
      alignItems: 'center',
      marginTop: theme.spacing.m,
    },
    uploadButtonText: {
      color: theme.colors.primary.contrast,
      fontSize: theme.typography.fontSize.s,
      fontWeight: '600',
    },
    reviewContainer: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: theme.borderRadius.s,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.m,
    },
    reviewTitle: {
      fontSize: theme.typography.fontSize.m,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.s,
    },
    reviewRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.s,
    },
    reviewLabel: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text.secondary,
      fontWeight: '500',
      width: '40%',
    },
    reviewValue: {
      fontSize: theme.typography.fontSize.s,
      color: theme.colors.text.primary,
      flex: 1,
    },
    editSection: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: theme.spacing.xs,
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    editButtonText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.primary.main,
      marginLeft: theme.spacing.xs,
    },
    reviewImageContainer: {
      width: '100%',
      height: 200,
      marginBottom: theme.spacing.m,
      marginTop: theme.spacing.s,
    },
    reviewImage: {
      width: '100%',
      height: '100%',
      borderRadius: theme.borderRadius.s,
    },
    noteText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.s,
      marginBottom: theme.spacing.m,
    },
  }));

  // Step indicator component
  const StepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {/* Step 1 */}
      <View style={[styles.stepCircle, currentStep >= 1 && styles.activeStepCircle]}>
        <Text style={[styles.stepText, currentStep >= 1 && styles.activeStepText]}>1</Text>
      </View>
      
      {/* Connector 1-2 */}
      <View style={[styles.stepConnector, currentStep >= 2 && styles.activeStepConnector]} />
      
      {/* Step 2 */}
      <View style={[styles.stepCircle, currentStep >= 2 && styles.activeStepCircle]}>
        <Text style={[styles.stepText, currentStep >= 2 && styles.activeStepText]}>2</Text>
      </View>
      
      {/* Connector 2-3 */}
      <View style={[styles.stepConnector, currentStep >= 3 && styles.activeStepConnector]} />
      
      {/* Step 3 */}
      <View style={[styles.stepCircle, currentStep >= 3 && styles.activeStepCircle]}>
        <Text style={[styles.stepText, currentStep >= 3 && styles.activeStepText]}>3</Text>
      </View>
      
      {/* Connector 3-4 */}
      <View style={[styles.stepConnector, currentStep >= 4 && styles.activeStepConnector]} />
      
      {/* Step 4 */}
      <View style={[styles.stepCircle, currentStep >= 4 && styles.activeStepCircle]}>
        <Text style={[styles.stepText, currentStep >= 4 && styles.activeStepText]}>4</Text>
      </View>
    </View>
  );

  // Navigation buttons component
  const NavigationButtons = () => (
    <View style={styles.buttonContainer}>
      {/* Back button (hidden on first step) */}
      {currentStep > 1 ? (
        <TouchableOpacity style={styles.button} onPress={prevStep}>
          <Text style={styles.buttonText}>Geri</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ minWidth: 100 }} />
      )}
      
      {/* Next/Finish button */}
      <TouchableOpacity 
        style={[
          styles.button, 
          !isStepValid() && styles.disabledButton
        ]} 
        onPress={currentStep < 4 ? nextStep : handleSubmit}
        disabled={!isStepValid()}
      >
        <Text style={[
          styles.buttonText, 
          !isStepValid() && styles.disabledButtonText
        ]}>
          {currentStep < 4 ? 'Devam Et' : 'İlanı Yayınla'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Handle final submission
  const handleSubmit = async () => {
    try {
      if (isUploading) {
        Alert.alert('Bekleyin', 'Resim yükleniyor, lütfen bekleyin...');
        return;
      }

      // Validate required fields
      if (!formData.title || !formData.petName || !formData.breed || 
          !formData.age || !formData.gender || !formData.city || 
          !formData.district || !formData.imageUrl || !formData.fullName ||
          !formData.phone) {
        Alert.alert('Eksik Bilgi', 'Lütfen tüm zorunlu alanları doldurun.');
        return;
      }

      await adoptionService.createAdoptionListing({
        ...formData,
        status: 'active',
        approvalStatus: 'PENDING'
      });
      
      Alert.alert('Başarılı', 'İlan başarıyla oluşturuldu ve onaya gönderildi');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating listing:', error);
      Alert.alert('Hata', 'İlan oluşturulurken bir hata oluştu');
    }
  };

  // Step 1: Animal Type Selection Content
  const renderStep1 = () => (
    <View>
      <Text style={styles.stepDescription}>
        Sahiplendirmek istediğiniz hayvan türünü seçin.
      </Text>
      
      <View style={styles.animalTypeContainer}>
        {animalTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.animalTypeItem,
              selectedAnimalType === type.id && styles.selectedAnimalTypeItem,
            ]}
            onPress={() => {
              setSelectedAnimalType(type.id);
              setFormData(prev => ({ ...prev, animalType: type.id }));
            }}
          >
            <Icon
              name={type.icon}
              size={40}
              color={selectedAnimalType === type.id ? theme.colors.primary.main : theme.colors.text.secondary}
              style={styles.animalTypeIcon}
            />
            <Text style={styles.animalTypeName}>{type.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Step 2: Pet Details Form
  const renderStep2 = () => (
    <View>
      <Text style={styles.stepDescription}>
        Evcil hayvanınız ve ilanınız hakkında detaylı bilgileri girin.
      </Text>

      {/* Pet Information Section */}
      <Text style={styles.sectionTitle}>Evcil Hayvan Bilgileri</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Pet Adı<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Evcil hayvanınızın adını girin"
          value={formData.petName}
          onChangeText={(text) => handleInputChange('petName', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Cinsi<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Hayvanın cinsini girin"
          value={formData.breed}
          onChangeText={(text) => handleInputChange('breed', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Yaşı<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Yaşını girin (örn: 2 yaşında, 6 aylık)"
          value={formData.age}
          onChangeText={(text) => handleInputChange('age', text)}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Cinsiyet<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Cinsiyetini girin (Erkek/Dişi)"
          value={formData.gender}
          onChangeText={(text) => handleInputChange('gender', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Boyut
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Boyutunu girin (Küçük/Orta/Büyük)"
          value={formData.size}
          onChangeText={(text) => handleInputChange('size', text)}
        />
      </View>

      {/* Listing Information Section */}
      <Text style={styles.sectionTitle}>İlan Bilgileri</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          İlan Başlığı<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="İlan başlığını girin"
          value={formData.title}
          onChangeText={(text) => handleInputChange('title', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Açıklama
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Sahiplendirme ilanı hakkında detaylı bilgi verin"
          multiline
          value={formData.description}
          onChangeText={(text) => handleInputChange('description', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Kimden
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nereden sahiplendiniz? (Sahip / Barınak / Sokak vb.)"
          value={formData.source}
          onChangeText={(text) => handleInputChange('source', text)}
        />
      </View>

      {/* Location Information Section */}
      <Text style={styles.sectionTitle}>Konum Bilgileri</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Şehir<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Şehir girin"
          value={formData.city}
          onChangeText={(text) => handleInputChange('city', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          İlçe<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="İlçe girin"
          value={formData.district}
          onChangeText={(text) => handleInputChange('district', text)}
        />
      </View>

      {/* Contact Information Section */}
      <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Ad Soyad<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Adınız ve soyadınızı girin"
          value={formData.fullName}
          onChangeText={(text) => handleInputChange('fullName', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Telefon<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Telefon numaranızı girin"
          value={formData.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );

  // Step 3: Photo Upload
  const renderStep3 = () => (
    <View>
      <Text style={styles.stepDescription}>
        Sahiplendirmek istediğiniz evcil hayvanın fotoğrafını yükleyin.
        İyi bir fotoğraf, ilanınızın daha hızlı sonuç almasını sağlar.
      </Text>
      
      <TouchableOpacity 
        style={styles.imageContainer} 
        onPress={pickImage}
        disabled={isUploading}
      >
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Icon name="image" size={50} color={theme.colors.text.disabled} />
            <Text style={{ color: theme.colors.text.secondary, marginTop: 10 }}>
              Fotoğraf eklemek için dokunun
            </Text>
          </View>
        )}
        {isUploading && (
          <View style={{ 
            position: 'absolute', 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            width: '100%', 
            height: '100%', 
            justifyContent: 'center', 
            alignItems: 'center',
            borderRadius: theme.borderRadius.s
          }}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Text style={{ color: 'white', marginTop: 10 }}>Yükleniyor...</Text>
          </View>
        )}
      </TouchableOpacity>

      {!selectedImage && (
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={pickImage}
          disabled={isUploading}
        >
          <Text style={styles.uploadButtonText}>Fotoğraf Seç</Text>
        </TouchableOpacity>
      )}

      {selectedImage && (
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={pickImage}
          disabled={isUploading}
        >
          <Text style={styles.uploadButtonText}>Fotoğrafı Değiştir</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Get animal type name from ID
  const getAnimalTypeName = (animalTypeId: string): string => {
    const animalType = animalTypes.find(type => type.id === animalTypeId);
    return animalType ? animalType.name : animalTypeId;
  };

  // Step 4: Review Submission
  const renderStep4 = () => (
    <View>
      <Text style={styles.stepDescription}>
        İlanınızı gözden geçirin. Bilgilerinizde bir hata varsa önceki adımlara dönerek düzeltebilirsiniz.
      </Text>
      
      {/* Pet Information Review */}
      <View style={styles.reviewContainer}>
        <Text style={styles.reviewTitle}>Evcil Hayvan Bilgileri</Text>
        
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Tür:</Text>
          <Text style={styles.reviewValue}>{getAnimalTypeName(formData.animalType)}</Text>
        </View>
        
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Adı:</Text>
          <Text style={styles.reviewValue}>{formData.petName}</Text>
        </View>
        
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Cinsi:</Text>
          <Text style={styles.reviewValue}>{formData.breed}</Text>
        </View>
        
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Yaşı:</Text>
          <Text style={styles.reviewValue}>{formData.age}</Text>
        </View>
        
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Cinsiyet:</Text>
          <Text style={styles.reviewValue}>{formData.gender}</Text>
        </View>
        
        {formData.size && (
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Boyut:</Text>
            <Text style={styles.reviewValue}>{formData.size}</Text>
          </View>
        )}
        
        <View style={styles.editSection}>
          <TouchableOpacity style={styles.editButton} onPress={() => setCurrentStep(2)}>
            <Icon name="edit-2" size={12} color={theme.colors.primary.main} />
            <Text style={styles.editButtonText}>Düzenle</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Listing Information Review */}
      <View style={styles.reviewContainer}>
        <Text style={styles.reviewTitle}>İlan Bilgileri</Text>
        
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Başlık:</Text>
          <Text style={styles.reviewValue}>{formData.title}</Text>
        </View>
        
        {formData.description && (
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Açıklama:</Text>
            <Text style={styles.reviewValue}>{formData.description}</Text>
          </View>
        )}
        
        {formData.source && (
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Kimden:</Text>
            <Text style={styles.reviewValue}>{formData.source}</Text>
          </View>
        )}
        
        <View style={styles.editSection}>
          <TouchableOpacity style={styles.editButton} onPress={() => setCurrentStep(2)}>
            <Icon name="edit-2" size={12} color={theme.colors.primary.main} />
            <Text style={styles.editButtonText}>Düzenle</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Location Information Review */}
      <View style={styles.reviewContainer}>
        <Text style={styles.reviewTitle}>Konum Bilgileri</Text>
        
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Şehir:</Text>
          <Text style={styles.reviewValue}>{formData.city}</Text>
        </View>
        
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>İlçe:</Text>
          <Text style={styles.reviewValue}>{formData.district}</Text>
        </View>
        
        <View style={styles.editSection}>
          <TouchableOpacity style={styles.editButton} onPress={() => setCurrentStep(2)}>
            <Icon name="edit-2" size={12} color={theme.colors.primary.main} />
            <Text style={styles.editButtonText}>Düzenle</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Contact Information Review */}
      <View style={styles.reviewContainer}>
        <Text style={styles.reviewTitle}>İletişim Bilgileri</Text>
        
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Ad Soyad:</Text>
          <Text style={styles.reviewValue}>{formData.fullName}</Text>
        </View>
        
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Telefon:</Text>
          <Text style={styles.reviewValue}>{formData.phone}</Text>
        </View>
        
        <View style={styles.editSection}>
          <TouchableOpacity style={styles.editButton} onPress={() => setCurrentStep(2)}>
            <Icon name="edit-2" size={12} color={theme.colors.primary.main} />
            <Text style={styles.editButtonText}>Düzenle</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Photo Review */}
      <View style={styles.reviewContainer}>
        <Text style={styles.reviewTitle}>Fotoğraf</Text>
        
        {selectedImage && (
          <View style={styles.reviewImageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.reviewImage} />
          </View>
        )}
        
        <View style={styles.editSection}>
          <TouchableOpacity style={styles.editButton} onPress={() => setCurrentStep(3)}>
            <Icon name="edit-2" size={12} color={theme.colors.primary.main} />
            <Text style={styles.editButtonText}>Düzenle</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.noteText}>
        "İlanı Yayınla" butonuna tıkladığınızda, ilanınız onay sürecine gönderilecektir.
        Onay sürecinden sonra ilanınız yayınlanacaktır.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sahiplendirme İlanı Oluştur</Text>
      </View>
      
      <View style={styles.content}>
        <StepIndicator />
        
        <ScrollView>
          <Text style={styles.stepTitle}>
            {currentStep === 1 ? 'Hayvan Türünü Seçin' :
             currentStep === 2 ? 'Evcil Hayvan Bilgileri' :
             currentStep === 3 ? 'Fotoğraf Yükleme' :
             'İlanı Gözden Geçirin'}
          </Text>
          
          {/* Step content based on current step */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </ScrollView>
        
        <NavigationButtons />
      </View>
    </View>
  );
};

export default StepByStepCreateAdoptionScreen; 