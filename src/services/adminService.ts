import axiosInstance from './axios';

export interface PendingCounts {
  pendingAdoptionsCount: number;
  pendingLostPetsCount: number;
  totalPendingCount: number;
}

export interface PendingAdoption {
  id: number;
  animalType: string;
  petName: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  title: string;
  description: string;
  source: string;
  city: string;
  district: string;
  fullName: string;
  phone: string;
  imageUrl: string;
  slug: string;
  createdAt: string;
  approvalStatus: string;
  viewCount: number;
  user: {
    id: number;
    userName: string;
  };
}

export interface PendingLostPet {
  id: number;
  title: string;
  details: string;
  location: string;
  category: string;
  status: string;
  additionalInfo: string;
  imageUrl: string;
  contactInfo: string;
  lastSeenDate: string;
  lastSeenLocation: string;
  viewCount: number;
  approvalStatus: string;
  user: {
    id: number;
    userName: string;
  };
}

export interface PendingListings {
  pendingAdoptions: PendingAdoption[];
  pendingLostPets: PendingLostPet[];
}

export interface User {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface PendingUser {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  requestDate: string;
}

export interface CreateUserRequest {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
}

export interface UpdateUserRequest {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  role: string;
}

export interface DonationOrganization {
  id: string;
  name: string;
  imageUrl: string | null;
  phoneNumber: string;
  iban: string;
  address?: string;
  description?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  website?: string;
  status: 'active' | 'inactive';
}

// Geçici test verileri - API bağlantısı düzeltilene kadar kullanılacak
const mockDonationOrganizations: DonationOrganization[] = [
  {
    id: '1',
    name: 'Haytap - Hayvan Hakları Federasyonu',
    imageUrl: 'https://pbs.twimg.com/profile_images/932605980215353345/IIqgLZDo_400x400.jpg',
    phoneNumber: '0212 123 45 67',
    iban: 'TR12 0000 0000 0000 0000 0000 00',
    address: 'İstanbul, Beşiktaş',
    description: 'Türkiye çapında hayvanlara yardım eden federasyon.',
    instagramUrl: 'https://instagram.com/haytap',
    facebookUrl: 'https://facebook.com/haytap',
    twitterUrl: 'https://twitter.com/haytap',
    website: 'https://haytap.org',
    status: 'active'
  },
  {
    id: '2',
    name: 'Patilere Umut Vakfı',
    imageUrl: 'https://i0.wp.com/patilereumut.org/wp-content/uploads/2016/06/PUVLogo.png',
    phoneNumber: '0212 987 65 43',
    iban: 'TR98 7654 3210 9876 5432 1098 76',
    address: 'Ankara, Çankaya',
    description: 'Sokaktan kurtarılan hayvanların tedavi ve rehabilitasyonu için çalışmalar yürütür.',
    instagramUrl: 'https://instagram.com/patilereumut',
    website: 'https://patilereumut.org',
    status: 'active'
  },
  {
    id: '3',
    name: 'Sahipsiz Dostlar Derneği',
    imageUrl: null,
    phoneNumber: '0232 456 78 90',
    iban: 'TR45 6789 0123 4567 8901 2345 67',
    address: 'İzmir, Bornova',
    description: 'Sokak hayvanlarına yardım etmek için kurulmuş gönüllü derneği.',
    facebookUrl: 'https://facebook.com/sahipsizdostlar',
    status: 'active'
  }
];

export interface CreateDonationOrganizationRequest {
  name: string;
  description: string;
  phoneNumber: string;
  iban: string;
  address: string;
  website?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  active?: boolean;
}

const adminService = {
  // Get counts of pending ads
  getPendingCounts: async (): Promise<PendingCounts> => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/pending-counts');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pending counts:', error);
      throw new Error(error.response?.data?.message || 'Onay bekleyen ilan sayıları alınamadı');
    }
  },

  // Get all pending listings
  getPendingListings: async (): Promise<PendingListings> => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/pending-listings');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pending listings:', error);
      throw new Error(error.response?.data?.message || 'Onay bekleyen ilanlar alınamadı');
    }
  },

  // Get pending adoption listings
  getPendingAdoptions: async (): Promise<PendingAdoption[]> => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/adoptions/pending');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pending adoptions:', error);
      throw new Error(error.response?.data?.message || 'Onay bekleyen sahiplendirme ilanları alınamadı');
    }
  },

  // Get pending lost pet listings
  getPendingLostPets: async (): Promise<PendingLostPet[]> => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/lostpets/pending');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pending lost pets:', error);
      throw new Error(error.response?.data?.message || 'Onay bekleyen kayıp ilanları alınamadı');
    }
  },

  // Approve an adoption listing
  approveAdoption: async (id: string): Promise<PendingAdoption> => {
    try {
      const response = await axiosInstance.put(`/api/v1/admin/adoptions/${id}/approve`);
      return response.data;
    } catch (error: any) {
      console.error('Error approving adoption:', error);
      throw new Error(error.response?.data?.message || 'Sahiplendirme ilanı onaylanamadı');
    }
  },

  // Reject an adoption listing
  rejectAdoption: async (id: string): Promise<PendingAdoption> => {
    try {
      const response = await axiosInstance.put(`/api/v1/admin/adoptions/${id}/reject`);
      return response.data;
    } catch (error: any) {
      console.error('Error rejecting adoption:', error);
      throw new Error(error.response?.data?.message || 'Sahiplendirme ilanı reddedilemedi');
    }
  },

  // Approve a lost pet listing
  approveLostPet: async (id: string): Promise<PendingLostPet> => {
    try {
      const response = await axiosInstance.put(`/api/v1/admin/lostpets/${id}/approve`);
      return response.data;
    } catch (error: any) {
      console.error('Error approving lost pet:', error);
      throw new Error(error.response?.data?.message || 'Kayıp ilanı onaylanamadı');
    }
  },

  // Reject a lost pet listing
  rejectLostPet: async (id: string): Promise<PendingLostPet> => {
    try {
      const response = await axiosInstance.put(`/api/v1/admin/lostpets/${id}/reject`);
      return response.data;
    } catch (error: any) {
      console.error('Error rejecting lost pet:', error);
      throw new Error(error.response?.data?.message || 'Kayıp ilanı reddedilemedi');
    }
  },

  // User Management API Endpoints

  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/users');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw new Error(error.response?.data?.message || 'Kullanıcılar alınamadı');
    }
  },

  // Get pending users
  getPendingUsers: async (): Promise<PendingUser[]> => {
    try {
      const response = await axiosInstance.get('/api/v1/admin/users/pending');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching pending users:', error);
      throw new Error(error.response?.data?.message || 'Onay bekleyen kullanıcılar alınamadı');
    }
  },

  // Get user details
  getUserDetails: async (userId: number): Promise<User> => {
    try {
      const response = await axiosInstance.get(`/api/v1/admin/users/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      throw new Error(error.response?.data?.message || 'Kullanıcı detayları alınamadı');
    }
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    try {
      const response = await axiosInstance.post('/api/v1/admin/users', userData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw new Error(error.response?.data?.message || 'Kullanıcı oluşturulamadı');
    }
  },

  // Update user
  updateUser: async (userId: number, userData: UpdateUserRequest): Promise<User> => {
    try {
      const response = await axiosInstance.put(`/api/v1/admin/users/${userId}`, userData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw new Error(error.response?.data?.message || 'Kullanıcı güncellenemedi');
    }
  },

  // Delete user
  deleteUser: async (userId: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/admin/users/${userId}`);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw new Error(error.response?.data?.message || 'Kullanıcı silinemedi');
    }
  },

  // Change user role
  changeUserRole: async (userId: number, role: string): Promise<User> => {
    try {
      const response = await axiosInstance.put(`/api/v1/admin/users/${userId}/role?role=${role}`);
      return response.data;
    } catch (error: any) {
      console.error('Error changing user role:', error);
      throw new Error(error.response?.data?.message || 'Kullanıcı rolü değiştirilemedi');
    }
  },

  // Approve user
  approveUser: async (userId: number): Promise<User> => {
    try {
      const response = await axiosInstance.put(`/api/v1/admin/users/${userId}/approve`);
      return response.data;
    } catch (error: any) {
      console.error('Error approving user:', error);
      throw new Error(error.response?.data?.message || 'Kullanıcı onaylanamadı');
    }
  },

  // Reject user
  rejectUser: async (userId: number): Promise<User> => {
    try {
      const response = await axiosInstance.put(`/api/v1/admin/users/${userId}/reject`);
      return response.data;
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      throw new Error(error.response?.data?.message || 'Kullanıcı reddedilemedi');
    }
  },

  // Donation Organizations API Endpoints

  // Get all donation organizations
  getAllDonationOrganizations: async (): Promise<DonationOrganization[]> => {
    try {
      const response = await axiosInstance.get('/api/v1/donation-organizations/admin');
      return response.data;
    } catch (error) {
      console.error('Error fetching donation organizations:', error);
      console.warn('API bağlantısı sağlanamadı, geçici test verileri gösteriliyor');
      return mockDonationOrganizations;
    }
  },

  // Get only active donation organizations (for public display)
  getActiveDonationOrganizations: async (): Promise<DonationOrganization[]> => {
    try {
      // Önce API'den veri çekmeyi deneyin
      const response = await axiosInstance.get('/api/v1/donation-organizations');
      return response.data;
    } catch (error) {
      console.error('Error fetching active donation organizations:', error);
      
      // API hatası durumunda mock veriyi kullanın
      console.warn('API bağlantısı sağlanamadı, geçici test verileri gösteriliyor');
      return mockDonationOrganizations;
    }
  },

  // Create a new donation organization
  createDonationOrganization: async (data: Omit<DonationOrganization, 'id'>): Promise<DonationOrganization> => {
    try {
      const response = await axiosInstance.post('/api/v1/donation-organizations', data);
      return response.data;
    } catch (error) {
      console.error('Error creating donation organization:', error);
      throw new Error('Bağış kurumu oluşturulamadı');
    }
  },

  // Update an existing donation organization
  updateDonationOrganization: async (id: string, data: Partial<DonationOrganization>): Promise<DonationOrganization> => {
    try {
      const response = await axiosInstance.put(`/api/v1/donation-organizations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating donation organization:', error);
      throw new Error('Bağış kurumu güncellenemedi');
    }
  },

  // Delete a donation organization
  deleteDonationOrganization: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/donation-organizations/${id}`);
    } catch (error) {
      console.error('Error deleting donation organization:', error);
      throw new Error('Bağış kurumu silinemedi');
    }
  },

  // Toggle the status of a donation organization
  toggleDonationOrganizationStatus: async (id: string): Promise<DonationOrganization> => {
    try {
      const response = await axiosInstance.put(`/api/v1/donation-organizations/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling donation organization status:', error);
      throw new Error('Bağış kurumu durumu değiştirilemedi');
    }
  },

  // Upload donation organization image
  uploadDonationOrganizationImage: async (id: number, imageFile: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await axiosInstance.post(
        `/api/v1/donation-organizations/${id}/image`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.imageUrl;
    } catch (error: any) {
      console.error('Error uploading donation organization image:', error);
      throw new Error(error.response?.data?.message || 'Bağış kurumu resmi yüklenemedi');
    }
  },
};

export default adminService; 