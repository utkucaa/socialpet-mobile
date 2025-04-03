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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import useTheme from '@/theme/hooks/useTheme';
import { useStyles } from '@/theme/useStyles';
import type { Theme } from '@/theme/types';
import adoptionService from '@/services/adoptionService';
import axiosInstance from '@/services/axios';

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

const CreateAdoptionScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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
    animalType: 'cat' // Default value
  });

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

  const uploadImage = async (uri: string) => {
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      const response = await axiosInstance.post('/api/v1/files/upload', formData, {
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

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const styles = useStyles((theme: Theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.default,
    },
    scrollView: {
      flex: 1,
      padding: theme.spacing.m,
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
      marginBottom: theme.spacing.m,
    },
    uploadButtonText: {
      color: theme.colors.primary.contrast,
      fontSize: theme.typography.fontSize.s,
      fontWeight: '600',
    },
    submitButton: {
      backgroundColor: theme.colors.primary.main,
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.s,
      alignItems: 'center',
      marginBottom: theme.spacing.s,
    },
    submitButtonText: {
      color: theme.colors.primary.contrast,
      fontSize: theme.typography.fontSize.m,
      fontWeight: '600',
    },
    noteText: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.xs,
    },
    required: {
      color: theme.colors.error,
      marginLeft: theme.spacing.xs,
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
        <Text style={styles.headerTitle}>Sahiplendirme İlanı Oluştur</Text>
      </View>

      <ScrollView style={styles.scrollView}>
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
            Evcil Hayvan Adı<Text style={styles.required}>*</Text>
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
            Tür / Cins<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Kedi mi köpek mi? Cinsini girin"
            value={formData.animalType}
            onChangeText={(text) => handleInputChange('animalType', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Irk<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Hayvanın ırkını girin"
            value={formData.breed}
            onChangeText={(text) => handleInputChange('breed', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Yaş<Text style={styles.required}>*</Text>
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
            Kaynak
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nereden sahiplendiniz? (Barınak, sokak vb.)"
            value={formData.source}
            onChangeText={(text) => handleInputChange('source', text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>
            İletişim Adı Soyadı<Text style={styles.required}>*</Text>
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

        <Text style={styles.label}>
          Fotoğraf<Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity 
          style={styles.imageContainer} 
          onPress={pickImage}
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
            <View style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={theme.colors.primary.main} />
              <Text style={{ color: 'white', marginTop: 10 }}>Yükleniyor...</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isUploading}
        >
          <Text style={styles.submitButtonText}>İlan Oluştur</Text>
        </TouchableOpacity>

        <Text style={styles.noteText}>
          * işaretli alanlar zorunludur. İlanınız onaylandıktan sonra yayına alınacaktır.
        </Text>
      </ScrollView>
    </View>
  );
};

export default CreateAdoptionScreen; 