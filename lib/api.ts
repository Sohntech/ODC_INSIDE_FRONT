import axios from 'axios';
import { ReactNode } from 'react';

// Create an Axios instance with base URL and default headers
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage if we're in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // If we're in the browser, clear the token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      console.log('API call: Attempting login with:', { email });
      console.log('API URL being used:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
      
      const response = await axios.post('/api/auth/login', { email, password });
      console.log('API response received:', response.status);
      
      if (response.data && response.status === 200) {
        return response.data;
      } else {
        console.error('Unexpected API response format:', response);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
};

// Types based on database schema
export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'COACH' | 'APPRENANT' | 'RESTAURATEUR' | 'VIGIL';
}

export interface Learner {
  [x: string]: any;
  email: ReactNode;
  id: string;
  firstName: string;
  lastName: string;
  address?: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  birthPlace: string;
  phone: string;
  photoUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'REPLACED' | 'WAITING_LIST';
  qrCode: string;
  userId: string;
  refId?: string;
  promotionId: string;
  createdAt: string;
  updatedAt: string;
  referential?: Referential;
  promotion?: Promotion;
  attendances?: LearnerAttendance[];
  kit?: Kit;
}

export interface Promotion {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  photoUrl?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  learners?: Learner[];
  referentials?: Referential[];
}

export interface Referential {
  id: string;
  name: string;
  description?: string;
  photoUrl?: string;
  capacity: number;
  learners?: Learner[];
  modules?: Module[];
}

export interface Module {
  id: string;
  name: string;
  description?: string;
  photoUrl?: string;
  startDate: string;
  endDate: string;
  coachId: string;
  refId: string;
  referential?: Referential;
}

export interface LearnerAttendance {
  id: string;
  date: string;
  isPresent: boolean;
  isLate: boolean;
  scanTime?: string;
  justification?: string;
  justificationComment?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  documentUrl?: string;
  learnerId: string;
}

export interface Kit {
  id: string;
  laptop: boolean;
  charger: boolean;
  bag: boolean;
  polo: boolean;
  learnerId?: string;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  totalDays: number;
}

export interface Grade {
  id: string;
  score: number;
  comment?: string;
  date: string;
  moduleId: string;
  learnerId: string;
  module?: Module;
  learner?: Learner;
}

// Learners API calls
export const learnersAPI = {
  getAllLearners: async () => {
    try {
      const response = await api.get('/learners');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getLearnerById: async (id: string) => {
    try {
      const response = await api.get(`/learners/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getLearnerAttendanceStats: async (id: string) => {
    try {
      const response = await api.get(`/learners/${id}/attendance-stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getGenderDistribution: async () => {
    try {
      const response = await api.get('/learners/stats/gender');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateLearnerStatus: async (id: string, status: string, reason?: string) => {
    try {
      const response = await api.patch(`/learners/${id}/status`, { status, reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateLearnerKit: async (id: string, kitData: Partial<Kit>) => {
    try {
      const response = await api.put(`/learners/${id}/kit`, kitData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getWaitingList: async (promotionId?: string) => {
    try {
      const url = promotionId 
        ? `/learners/waiting-list?promotionId=${promotionId}`
        : '/learners/waiting-list';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  replaceLearner: async (replacedId: string, replacementId: string) => {
    try {
      const response = await api.post('/learners/replace', {
        replacedId,
        replacementId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLearnerByEmail: async (email: string) => {
    try {
      const response = await api.get(`/learners/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching learner by email:', error);
      return null;
    }
  },
};

// Modules API calls
export const modulesAPI = {
  getAllModules: async () => {
    try {
      const response = await api.get('/modules');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getModuleById: async (id: string) => {
    try {
      const response = await api.get(`/modules/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getActiveModulesByLearner: async (learnerId: string) => {
    try {
      const response = await api.get(`/modules/active/learner/${learnerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createModule: async (moduleData: Partial<Module>) => {
    try {
      const response = await api.post('/modules', moduleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateModule: async (id: string, moduleData: Partial<Module>) => {
    try {
      const response = await api.put(`/modules/${id}`, moduleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteModule: async (id: string) => {
    try {
      const response = await api.delete(`/modules/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Referentials API calls
export const referentialsAPI = {
  getAllReferentials: async () => {
    try {
      const response = await api.get('/referentials');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getReferentialById: async (id: string) => {
    try {
      const response = await api.get(`/referentials/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createReferential: async (referentialData: Partial<Referential>) => {
    try {
      const response = await api.post('/referentials', referentialData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateReferential: async (id: string, referentialData: Partial<Referential>) => {
    try {
      const response = await api.put(`/referentials/${id}`, referentialData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteReferential: async (id: string) => {
    try {
      const response = await api.delete(`/referentials/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Grades API calls
export const gradesAPI = {
  getGradesByLearner: async (learnerId: string) => {
    try {
      const response = await api.get(`/grades/learner/${learnerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getGradesByModule: async (moduleId: string) => {
    try {
      const response = await api.get(`/grades/module/${moduleId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createGrade: async (gradeData: Partial<Grade>) => {
    try {
      const response = await api.post('/grades', gradeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateGrade: async (id: string, gradeData: Partial<Grade>) => {
    try {
      const response = await api.put(`/grades/${id}`, gradeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  deleteGrade: async (id: string) => {
    try {
      const response = await api.delete(`/grades/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Attendance API calls
export const attendanceAPI = {
  getAttendanceByLearner: async (learnerId: string) => {
    try {
      const response = await api.get(`/attendance/learner/${learnerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getDailyStats: async (date: string) => {
    try {
      const response = await api.get(`/attendance/stats/daily?date=${date}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getMonthlyStats: async (year: number, month: number) => {
    try {
      const response = await api.get(`/attendance/stats/monthly?year=${year}&month=${month}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getYearlyStats: async (year: number) => {
    try {
      const response = await api.get(`/attendance/stats/yearly?year=${year}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getLatestScans: async (limit: number = 10) => {
    try {
      const response = await api.get(`/attendance/scans/latest?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  scanLearner: async (qrCode: string) => {
    try {
      const response = await api.post('/attendance/scan', { qrCode });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  approveJustification: async (attendanceId: string, approved: boolean, comment?: string) => {
    try {
      const response = await api.patch(`/attendance/${attendanceId}/justify`, { 
        status: approved ? 'APPROVED' : 'REJECTED',
        comment
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Promotions API calls
export const promotionsAPI = {
  getAllPromotions: async () => {
    try {
      const response = await api.get('/promotions');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getPromotionById: async (id: string) => {
    try {
      const response = await api.get(`/promotions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createPromotion: async (promotionData: Partial<Promotion>) => {
    try {
      const response = await api.post('/promotions', promotionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Coaches API calls
export const coachesAPI = {
  getCoachByEmail: async (email: string) => {
    try {
      const response = await api.get(`/coaches/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching coach by email:', error);
      return null;
    }
  },
};

// Users API calls
export const usersAPI = {
  getUserByEmail: async (email: string) => {
    try {
      const response = await api.get(`/users/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  },

  getUserById: async (id: string) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by id:', error);
      return null;
    }
  },

  getUserDetailsWithPhoto: async (email: string) => {
    try {
      const response = await api.get(`/users/email/${email}`);
      const user = response.data;
      
      if (!user || !user.details) {
        console.log('No user details found for:', email);
        return null;
      }

      // Get photo URL based on role
      let photoUrl = null;
      if (user.details) {
        photoUrl = user.details.photoUrl;
      }

      return {
        ...user,
        photoUrl
      };
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  },

  getUserPhoto: async (email: string) => {
    try {
      const token = localStorage.getItem('token'); // Make sure to include the JWT token
      const response = await api.get(`/users/photo/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.photoUrl;
    } catch (error) {
      console.error('Error fetching user photo:', error);
      return null;
    }
  }
};

export default api;