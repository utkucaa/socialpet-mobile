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
import lostPetService from '@/services/lostPetService';
import axiosInstance from '@/services/axios';

interface FormData {
  title: string;
  details: string;
  location: string;
  category: string;
  status: string;
  additionalInfo: string;
  contactInfo: string;
  lastSeenDate: string;
  lastSeenLocation: string;
  imageUrl: string;
  animalType: string;
  image: string;
}

const CreateLostPetScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    details: '',
    location: '',
    category: '',
    status: 'Kayıp',
    additionalInfo: '',
    contactInfo: '',
    lastSeenDate: '',
    lastSeenLocation: '',
    imageUrl: '',
    animalType: '',
    image: ''
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
          imageUrl: response.data.fileUrl,
          image: response.data.fileUrl
        }));
      } else if (response.data?.fileName) {
        const fileUrl = `http://localhost:8080/api/v1/files/${response.data.fileName}`;
        setFormData(prev => ({
          ...prev,
          imageUrl: fileUrl,
          image: fileUrl
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

      const lostPetData = {
        ...formData,
        timestamp: Date.now(),
        viewCount: 0,
        image: formData.image || formData.imageUrl || "",
        imageUrl: formData.imageUrl || formData.image || "",
        animalType: formData.animalType || formData.category || "Unknown"
      };

      await lostPetService.createLostPet(lostPetData);
      Alert.alert('Başarılı', 'İlan başarıyla oluşturuldu');
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
  }));

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>İlan Başlığı</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => handleInputChange('title', text)}
            placeholder="İlan başlığı"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>İlan Detayları</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.details}
            onChangeText={(text) => handleInputChange('details', text)}
            placeholder="İlan detaylarını giriniz"
            multiline
          />
          <Text style={styles.noteText}>
            Not: Buraya girdiğiniz açıklama oluşturulacak afişte yer alacaktır.
            O nedenle kısa bir açıklama girmeyiniz.
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Konum</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(text) => handleInputChange('location', text)}
            placeholder="Konum giriniz"
          />
          <Text style={styles.noteText}>Lütfen kaybolduğu konumu belirtin.</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Son Görüldüğü Konum</Text>
          <TextInput
            style={styles.input}
            value={formData.lastSeenLocation}
            onChangeText={(text) => handleInputChange('lastSeenLocation', text)}
            placeholder="Son görüldüğü konum"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Son Görüldüğü Tarih</Text>
          <TextInput
            style={styles.input}
            value={formData.lastSeenDate}
            onChangeText={(text) => handleInputChange('lastSeenDate', text)}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>İletişim Bilgileri</Text>
          <TextInput
            style={styles.input}
            value={formData.contactInfo}
            onChangeText={(text) => handleInputChange('contactInfo', text)}
            placeholder="İletişim bilgileri"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Hayvan Türü</Text>
          <TextInput
            style={styles.input}
            value={formData.category}
            onChangeText={(text) => handleInputChange('category', text)}
            placeholder="Kedi, Köpek, Papağan, Muhabbet Kuşu"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>İlan Durumu</Text>
          <TextInput
            style={styles.input}
            value={formData.status}
            onChangeText={(text) => handleInputChange('status', text)}
            placeholder="Kayıp veya Bulundu"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Ek Bilgi</Text>
          <TextInput
            style={styles.input}
            value={formData.additionalInfo}
            onChangeText={(text) => handleInputChange('additionalInfo', text)}
            placeholder="Ödüllü, Acil veya boş bırakın"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>İlan Görseli</Text>
          <TouchableOpacity 
            style={styles.imageContainer}
            onPress={pickImage}
            disabled={isUploading}
          >
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.image} />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Icon name="upload" size={40} color={theme.colors.text.secondary} />
                <Text style={styles.noteText}>
                  {isUploading ? 'YÜKLENIYOR...' : 'İLAN GÖRSELİ YÜKLE'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {isUploading && (
            <Text style={styles.noteText}>
              Resim yükleniyor, lütfen bekleyin...
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Yayımla</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreateLostPetScreen; 