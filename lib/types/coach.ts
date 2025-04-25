export interface CoachDashboardStats {
  activeLearners: number;
  replacementLearners: number;
  totalModules: number;
  averageGrade: number;
  topAttendance: {
    learner: {
      id: string;
      firstName: string;
      lastName: string;
      matricule: string;
      photoUrl?: string;
    };
    attendanceRate: number;
  } | null;
  mostLate: {
    learner: {
      id: string;
      firstName: string;
      lastName: string;
      matricule: string;
      photoUrl?: string;
    };
    lateCount: number;
  } | null;
  mostAbsent: {
    learner: {
      id: string;
      firstName: string;
      lastName: string;
      matricule: string;
      photoUrl?: string;
    };
    absenceCount: number;
  } | null;
}