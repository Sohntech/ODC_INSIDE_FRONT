import axios from 'axios';
import { ReactNode } from 'react';

// Move these interfaces to the top of the file and export them
export interface LearnerDetails {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  address?: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  birthPlace: string;
  phone: string;
  photoUrl: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'REPLACED' | 'WAITING_LIST';
  qrCode: string;
  userId: string;
  refId?: string;
  promotionId: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
  referential: {
    id: string;
    name: string;
    description: string;
    photoUrl: string;
  };
  promotion: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    photoUrl: string;
    status: string;
  };
  attendances: Array<{
    id: string;
    date: string;
    isPresent: boolean;
    isLate: boolean;
    scanTime: string | null;
    justification?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  }>;
}

export interface AttendanceStats {
  attendance: any[];
  present: number;
  absent: number;
  late: number;
  totalDays: number;
}

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

export type LearnerStatus = 'ACTIVE' | 'WAITING' | 'ABANDONED' | 'REMPLACEMENT' | 'REPLACED';

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
  status: LearnerStatus;
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
  matricule?: string;
}

export interface Promotion {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  photoUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  learnerCount: number;
  referentials: Referential[]; // Change from string[] to Referential[]
  learners?: Learner[];
}

export interface Referential {
  id: string;
  name: string;
  description?: string;
  photoUrl?: string;
  capacity: number;
  category: string;
  status: string;
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
  learnerId: string;
  date: string;
  scanTime?: string;
  isPresent: boolean;
  isLate: boolean;
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  justification?: string;
  documentUrl?: string;
  justificationComment?: string;
  learner: {
    id: string;
    firstName: string;
    lastName: string;
    matricule?: string;
    photoUrl?: string;
    address?: string;
    referential?: {
      id: string;
      name: string;
    };
  };
}

export interface Kit {
  id: string;
  laptop: boolean;
  charger: boolean;
  bag: boolean;
  polo: boolean;
  learnerId?: string;
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

interface LatestScansResponse {
  learnerScans: Array<{
    id: string;
    scanTime: string;
    isLate: boolean;
    isPresent: boolean;
    learner: {
      firstName: string;
      lastName: string;
      matricule: string;
      photoUrl?: string;
      referential?: {
        name: string;
      }
    }
  }>;
  coachScans: Array<{
    id: string;
    scanTime: string;
    isLate: boolean;
    isPresent: boolean;
    coach: {
      firstName: string;
      lastName: string;
      matricule: string;
      photoUrl?: string;
    }
  }>;
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

  getLearnerByEmail: async (email: string): Promise<LearnerDetails> => {
    try {
      // Updated to match your new backend endpoint
      const response = await api.get(`/learners/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching learner by email:', error);
      throw error;
    }
  },

  // Remove or comment out getLearnerDetails since we're getting full details from email endpoint
  // getLearnerDetails: async (id: string): Promise<LearnerDetails> => {...}

  calculateAttendanceStats: (attendances: LearnerDetails['attendances']): AttendanceStats => {
    const stats = {
      attendance: attendances,
      present: 0,
      absent: 0,
      late: 0,
      totalDays: attendances.length
    };

    attendances.forEach(attendance => {
      if (attendance.isPresent) {
        if (attendance.isLate) {
          stats.late++;
        } else {
          stats.present++;
        }
      } else {
        stats.absent++;
      }
    });
    return stats; // Ensure the 'attendance' property is included
    return stats;
  }
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
  
  getReferentialById: async (id: string): Promise<Referential> => {
    const response = await api.get(`/referentials/${id}?include=modules,learners`);
    return response.data;
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
interface AttendanceScanResponse {
  success: boolean;
  message: string;
  data?: {
    learner?: {
      firstName: string;
      lastName: string;
      matricule: string;
      photoUrl?: string;
      referential?: {
        name: string;
      };
    };
    coach?: {
      firstName: string;
      lastName: string;
      matricule: string;
      photoUrl?: string;
    };
    scanTime: string;
    isLate: boolean;
    isPresent: boolean;
  };
}

// First, add these interfaces to match your backend
interface BaseScanResponse {
  type: 'LEARNER' | 'COACH';
  scanTime: Date;
  attendanceStatus: 'PRESENT' | 'LATE' | 'ABSENT';
  isAlreadyScanned: boolean;
}

interface LearnerScanResponse extends BaseScanResponse {
  type: 'LEARNER';
  learner: {
    id: string;
    matricule: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
    referential: {
      name: string;
    } | null;
    promotion: {
      name: string;
    };
  };
}

interface CoachScanResponse extends BaseScanResponse {
  type: 'COACH';
  coach: {
    id: string;
    matricule: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
    referential: {
      name: string;
    } | null;
  };
}

type ApiScanResponse = {
  success: boolean;
  message: string;
  data?: LearnerScanResponse | CoachScanResponse;
};

// Update the attendance API methods
export const attendanceAPI = {
  getAttendanceByLearner: async (learnerId: string) => {
    try {
      const response = await api.get(`/attendance/learner/${learnerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getDailyStats: async (date: string): Promise<AttendanceStats> => {
    const response = await api.get('/attendance/stats/daily', {
      params: { date }
    });
    return response.data;
  },

  getMonthlyStats: async (year: number, month: number) => {
    const response = await api.get('/attendance/stats/monthly', {
      params: { year, month }
    });
    return response.data;
  },

  getYearlyStats: async (year: number) => {
    const response = await api.get('/attendance/stats/yearly', {
      params: { year }
    });
    return response.data;
  },

  getLatestScans: async (limit: number = 10) => {
    try {
      const response = await api.get(`/attendance/scans/latest?limit=${limit}`);
      return {
        learnerScans: response.data.learnerScans?.map((scan: LearnerScanResponse) => ({
          id: scan.learner.id,
          scanTime: scan.scanTime,
          isLate: scan.attendanceStatus === 'LATE',
          isPresent: scan.attendanceStatus === 'PRESENT',
          learner: {
            firstName: scan.learner.firstName,
            lastName: scan.learner.lastName,
            matricule: scan.learner.matricule,
            photoUrl: scan.learner.photoUrl,
            referential: scan.learner.referential
          }
        })) || [],
        coachScans: response.data.coachScans?.map((scan: CoachScanResponse) => ({
          id: scan.coach.id,
          scanTime: scan.scanTime,
          isLate: scan.attendanceStatus === 'LATE',
          isPresent: scan.attendanceStatus === 'PRESENT',
          coach: {
            firstName: scan.coach.firstName,
            lastName: scan.coach.lastName,
            matricule: scan.coach.matricule,
            photoUrl: scan.coach.photoUrl
          }
        })) || []
      };
    } catch (error) {
      console.error('Error fetching latest scans:', error);
      return {
        learnerScans: [],
        coachScans: []
      };
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

  scanLearnerQR: async (matricule: string): Promise<ApiScanResponse> => {
    try {
      const response = await api.post('/attendance/scan/learner', { matricule });
      const data = response.data;

      if (data.isAlreadyScanned) {
        return {
          success: false,
          message: 'Cette personne a déjà été scannée aujourd\'hui'
        };
      }

      return {
        success: true,
        data: data,
        message: data.attendanceStatus === 'LATE' 
          ? 'Présence enregistrée (En retard)' 
          : 'Présence enregistrée'
      };
    } catch (error: any) {
      console.error('Error scanning learner QR:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du scan'
      };
    }
  },

  scanCoachQR: async (matricule: string): Promise<ApiScanResponse> => {
    try {
      const response = await api.post('/attendance/scan/coach', { matricule });
      const data = response.data;

      if (data.isAlreadyScanned) {
        return {
          success: false,
          message: 'Cette personne a déjà été scannée aujourd\'hui'
        };
      }

      return {
        success: true,
        data: data,
        message: data.attendanceStatus === 'LATE' 
          ? 'Présence enregistrée (En retard)' 
          : 'Présence enregistrée'
      };
    } catch (error: any) {
      console.error('Error scanning coach QR:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du scan'
      };
    }
  },


  // Update this method to match your backend route
  getScanHistory: async (startDate: string): Promise<LearnerAttendance[]> => {
    const response = await api.get('/attendance/history', {
      params: { date: startDate }
    });
    return response.data;
  },

  // Update this method to match your backend controller
 
};

// Promotions API calls
export const promotionsAPI = {
  getAllPromotions: async () => {
    try {
      const response = await api.get('/promotions');
      
      // Map the response to include learner count
      const promotions = response.data.map(promotion => ({
        ...promotion,
        learnerCount: promotion.learners?.length || 0
      }));
      
      return promotions;
    } catch (error) {
      console.error('Error fetching promotions:', error);
      throw error;
    }
  },
  
  getPromotionById: async (id: string) => {
    try {
      const response = await api.get(`/promotions/${id}`);
      
      // Add learner count to the promotion data
      return {
        ...response.data,
        learnerCount: response.data.learners?.length || 0
      };
    } catch (error) {
      console.error('Error fetching promotion:', error);
      throw error;
    }
  },
  
  createPromotion: async (formData: FormData) => {
    try {
      // Update the endpoint to match your backend controller
      const response = await api.post('/promotions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  },

  updatePromotionStatus: async (promotionId: string, status: 'ACTIVE' | 'INACTIVE') => {
    try {
      const response = await api.patch(`/promotions/${promotionId}/status`, { status });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating promotion status:', error);
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