export interface LearnerFormSubmitData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    gender: 'MALE' | 'FEMALE';
    birthDate: string;
    birthPlace: string;
    promotionId: string;
    refId: string;
    status: 'ACTIVE' | 'WAITING';
    photoFile?: File;
    tutor: {
      firstName: string;
      lastName: string;
      phone: string;
      email?: string;
      address: string;
    };
}

export interface Learner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  matricule: string;
  status: 'ACTIVE' | 'REPLACEMENT' | 'WAITING';
  photoUrl?: string;
  averageGrade?: number;
  attendanceStats?: {
    presentCount: number;
    lateCount: number;
    absentCount: number;
  };
}

export interface Attendance {
  id: string;
  date: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT';
  learner: {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
    photoUrl?: string;
  };
  justification?: {
    id: string;
    reason: string;
    status: 'TO_JUSTIFY' | 'PENDING' | 'APPROVED' | 'REJECTED';
    attachmentUrl?: string;
    createdAt: string;
  };
}

export interface AttendanceFilters {
  status?: 'PRESENT' | 'LATE' | 'ABSENT';
  period: 'day' | 'week' | 'month';
  date: string;
}

export interface Module {
  id: string;
  name: string;
  description?: string;
  duration: number;
  startDate: string;
  endDate: string;
  referentialId: string;
}