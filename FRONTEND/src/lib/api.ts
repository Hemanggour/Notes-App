import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
  User,
} from '@/types';

// API Configuration
// const API_BASE_URL = `${import.meta.env.VITE_API_URL}` || 'http://localhost:8000/api';
const API_BASE_URL = 'http://localhost:8000/api';

// Token management
const getToken = () => localStorage.getItem('auth_token');
const setToken = (token: string) => localStorage.setItem('auth_token', token);
const removeToken = () => localStorage.removeItem('auth_token');

const getRefreshToken = () => localStorage.getItem('refresh_token');
const setRefreshToken = (token: string) => localStorage.setItem('refresh_token', token);
const removeRefreshToken = () => localStorage.removeItem('refresh_token');

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// HTTP client with auth and token refresh
const apiClient = async (
  endpoint: string,
  options: RequestInit = {},
  skipRetry = false
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  // Handle 401 - Unauthorized (token expired)
  if (response.status === 401 && !skipRetry && endpoint !== '/account/token/refresh/') {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      try {
        // If already refreshing, wait for that promise
        if (isRefreshing && refreshPromise) {
          await refreshPromise;
        } else {
          // Start refresh process
          isRefreshing = true;
          refreshPromise = authAPI.refresh(refreshToken);
          const newToken = await refreshPromise;
          isRefreshing = false;
          refreshPromise = null;

          // Retry original request with new token
          return apiClient(endpoint, options, true);
        }
      } catch (error) {
        // Refresh failed, logout user
        isRefreshing = false;
        refreshPromise = null;
        authAPI.logout();
        window.location.href = '/login';
        throw error;
      }
    } else {
      // No refresh token, logout
      authAPI.logout();
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient('/account/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setToken(response.data.tokens.access);
    setRefreshToken(response.data.tokens.refresh);
    return response;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient('/account/register/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setToken(response.data.tokens.access);
    setRefreshToken(response.data.tokens.refresh);
    return response;
  },

  refresh: async (refreshToken: string): Promise<string> => {
    const response = await apiClient('/account/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    }, true); // Skip retry to prevent infinite loop
    setToken(response.access);
    return response.access;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    return apiClient('/account/forgot-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    return apiClient('/account/reset-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    return apiClient('/account/change-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: () => {
    removeToken();
    removeRefreshToken();
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient('/account/profile/');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient('/account/profile/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data;
  },
};

// Notes API
export const notesAPI = {
  getAll: async (): Promise<Note[]> => {
    const response = await apiClient('/notes/');
    return response.data;
  },

  create: async (data: CreateNoteRequest): Promise<Note> => {
    const response = await apiClient('/notes/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  update: async (data: UpdateNoteRequest): Promise<Note> => {
    const response = await apiClient('/notes/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  delete: async (note_uuid: string): Promise<void> => {
    await apiClient('/notes/', {
      method: 'DELETE',
      body: JSON.stringify({ note_uuid: [note_uuid] }),
    });
  },
};

// Export token utilities
export { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, removeRefreshToken };
