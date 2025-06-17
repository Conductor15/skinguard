const API_BASE_URL = 'http://localhost:8000';

// Types cho API responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterDoctorRequest {
  doctor_id: string;
  email: string;
  password: string;
  fullName: string;
  discipline: string;
  permission: string;
  phoneNumber: string;
  rating?: number;
  avatar?: string;
}

export interface RegisterPatientRequest {
  patient_id: string;
  email: string;
  password: string;
  fullName: string;
  birthDay: string; // ISO date string
  avatar?: string;
  orderID?: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  expires_in: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    userType: 'doctor' | 'patient';
  };
}

export interface RegisterResponse {
  message: string;
  doctor?: any;
  patient?: any;
  originalPassword: string;
  hashedPassword: string;
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

class AuthService {
  private baseUrl = API_BASE_URL;

  // Helper method để handle API calls
  private async apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
      const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('access_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      console.log(`🚀 API Call: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error('❌ API Error:', data);
        throw {
          message: data.message || 'API call failed',
          error: data.error,
          statusCode: response.status,
        } as ApiError;
      }

      console.log('✅ API Success:', data);
      return data;    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('🔌 Network Error: Backend server might be down');
        throw {
          message: 'Cannot connect to server. Please check if backend is running.',
          error: 'Network Error',
          statusCode: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  // ============ AUTHENTICATION METHODS ============

  /**
   * Login user (doctor or patient)
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.apiCall<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token in localStorage
    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('token_type', response.token_type);
      localStorage.setItem('user', JSON.stringify(response.user));
      console.log('💾 Token stored successfully');
    }

    return response;
  }

  /**
   * Register new doctor
   */
  async registerDoctor(doctorData: RegisterDoctorRequest): Promise<RegisterResponse> {
    return this.apiCall<RegisterResponse>('/auth/register/doctor', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  }

  /**
   * Register new patient
   */
  async registerPatient(patientData: RegisterPatientRequest): Promise<RegisterResponse> {
    return this.apiCall<RegisterResponse>('/auth/register/patient', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.apiCall('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.warn('⚠️ Logout API call failed, but continuing with local cleanup');
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('user');
      console.log('🧹 Local storage cleared');
    }
  }

  /**
   * Get user profile (protected route test)
   */
  async getProfile(): Promise<any> {
    return this.apiCall('/auth/profile', {
      method: 'GET',
    });
  }

  // ============ UTILITY METHODS ============

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): any | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Check if current user is doctor
   */
  isDoctor(): boolean {
    const user = this.getCurrentUser();
    return user?.userType === 'doctor';
  }

  /**
   * Check if current user is patient
   */
  isPatient(): boolean {
    const user = this.getCurrentUser();
    return user?.userType === 'patient';
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
