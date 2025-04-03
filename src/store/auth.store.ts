import { create } from 'zustand';
import { storage } from '@/App';
import { authService, AuthResponse, LoginPayload, RegisterPayload } from '@/services/api/auth';

interface AuthState {
  token: string | null;
  user: AuthResponse['user'] | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: storage.getString('token') || null,
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: !!storage.getString('token'),

  login: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authService.login(payload);
      const { accessToken, user } = response.data;
      
      // Save token to storage
      storage.set('token', accessToken);
      
      // Save user data to storage
      const userData = {
        id: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        joinDate: user.joinDate,
        avatar: user.avatarUrl,
        role: user.role,
      };
      storage.set('user', JSON.stringify(userData));
      
      set({ 
        token: accessToken, 
        user, 
        isAuthenticated: true 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Login failed' 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      
      console.log('Register payload:', payload);
      const response = await authService.register(payload);
      console.log('Register response:', response.data);
      
      // We don't store token after registration since the user needs to log in
      // Just inform about successful registration
      set({ 
        error: null, 
        isLoading: false 
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error);
      set({ 
        error: error.response?.data?.message || 'Registration failed' 
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await authService.logout();
      storage.delete('token');
      storage.delete('user');
      set({ token: null, user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
