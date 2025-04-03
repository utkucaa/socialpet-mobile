import { AdoptionData } from '../components/Adoption/types';
import axiosInstance from './axios';

const API_BASE_URL = 'http://localhost:8080';

export interface AdoptionListingDetail {
  id: string | number;
  title: string;
  petName: string;
  breed: string;
  age: string | number;
  gender: string;
  size: string;
  description: string;
  city: string;
  district: string;
  fullName: string;
  phone: string;
  imageUrl: string;
  createdAt: string;
  status: string;
  animalType?: string;
  viewCount?: number;
  approvalStatus?: string;
  source?: string;
  slug?: string;
  user?: any;
}

const adoptionService = {
  
  getAdoptionListings: async () => {
    try {
      console.log('API isteği başlatılıyor:', `${API_BASE_URL}/api/v1/adoption/recent`);
      const response = await axiosInstance.get('/api/v1/adoption/recent');
      console.log('API yanıtı alındı');
      
      if (!response.data) {
        throw new Error('Sunucudan veri alınamadı');
      }

      const processedData = response.data.map((listing: AdoptionListingDetail) => ({
        ...listing,
        imageUrl: listing.imageUrl ? 
          (listing.imageUrl.startsWith('http') ? listing.imageUrl : `${API_BASE_URL}${listing.imageUrl}`) 
          : null
      }));

      console.log('Veri işlendi, toplam ilan sayısı:', processedData.length);
      return processedData;
    } catch (error: any) {
      console.error('API Hatası:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 404) {
        throw new Error('İlan bulunamadı');
      } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('İnternet bağlantınızı kontrol ediniz');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Sunucu yanıt vermedi, lütfen daha sonra tekrar deneyiniz');
      }
      
      throw new Error(error.response?.data?.message || 'İlanlar yüklenirken bir hata oluştu');
    }
  },

  // Get a specific adoption listing by slug
  getAdoptionListingById: async (slug: string) => {
    try {
      console.log('Fetching adoption listing with slug:', slug);
      const response = await axiosInstance.get(`/api/v1/adoption/${slug}`);
      console.log('Listing detail response received');

      if (!response.data) {
        throw new Error('İlan bulunamadı');
      }

      const listing = response.data;
      return {
        ...listing,
        imageUrl: listing.imageUrl ? 
          (listing.imageUrl.startsWith('http') ? listing.imageUrl : `${API_BASE_URL}${listing.imageUrl}`)
          : null
      };
    } catch (error: any) {
      console.error('Error fetching listing detail:', error);
      throw new Error(error.response?.data?.message || 'İlan detayları yüklenirken bir hata oluştu');
    }
  },

  // Create a new adoption listing
  createAdoptionListing: async (data: AdoptionData) => {
    try {
      const response = await axiosInstance.post('/api/v1/adoption/create', data);
      console.log('Create listing response received');

      if (!response.data) {
        throw new Error('İlan oluşturulamadı');
      }

      const listing = response.data;
      return {
        ...listing,
        imageUrl: listing.imageUrl ? 
          (listing.imageUrl.startsWith('http') ? listing.imageUrl : `${API_BASE_URL}${listing.imageUrl}`)
          : null
      };
    } catch (error: any) {
      console.error('Error creating listing:', error);
      throw new Error(error.response?.data?.message || 'İlan oluşturulurken bir hata oluştu');
    }
  },


  updateAdoptionListing: async (id: string, data: AdoptionData) => {
    try {
      const response = await axiosInstance.put(`/api/v1/adoption/${id}`, data);
      console.log('Update listing response received');

      if (!response.data) {
        throw new Error('İlan güncellenemedi');
      }

      const listing = response.data;
      return {
        ...listing,
        imageUrl: listing.imageUrl ? 
          (listing.imageUrl.startsWith('http') ? listing.imageUrl : `${API_BASE_URL}${listing.imageUrl}`)
          : null
      };
    } catch (error: any) {
      console.error('Error updating listing:', error);
      throw new Error(error.response?.data?.message || 'İlan güncellenirken bir hata oluştu');
    }
  },

  // Delete an adoption listing
  deleteAdoptionListing: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/api/v1/adoption/${id}`);
      console.log('Delete listing response received');
      return response.data;
    } catch (error: any) {
      console.error('Error deleting listing:', error);
      throw new Error(error.response?.data?.message || 'İlan silinirken bir hata oluştu');
    }
  },

  // Upload photo for an adoption listing
  uploadPhoto: async (id: string, photo: File) => {
    try {
      const formData = new FormData();
      formData.append('file', photo);
      
      const response = await axiosInstance.post(`/api/v1/adoption/${id}/upload-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Photo upload response received');
      return response.data;
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      throw new Error(error.response?.data?.message || 'Fotoğraf yüklenirken bir hata oluştu');
    }
  }
};

export default adoptionService; 