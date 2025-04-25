"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { coachAPI } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users,
  Book,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3
} from 'lucide-react';
import type { CoachDashboardStats } from '@/lib/types/coach';

export default function CoachDashboard() {
  const [stats, setStats] = useState<CoachDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await coachAPI.getDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error("Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <BarChart3 className="h-8 w-8 text-teal-500" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-orange-500">
            Tableau de bord
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Apprenants actifs"
            value={stats.activeLearners}
            icon={<Users className="h-8 w-8" />}
            color="teal"
          />
          <StatCard
            title="Remplacements"
            value={stats.replacementLearners}
            icon={<Users className="h-8 w-8" />}
            color="orange"
          />
          <StatCard
            title="Modules"
            value={stats.totalModules}
            icon={<Book className="h-8 w-8" />}
            color="teal"
          />
          <StatCard
            title="Moyenne générale"
            value={stats.averageGrade.toFixed(2)}
            suffix="/20"
            icon={<Star className="h-8 w-8" />}
            color="orange"
          />
        </div>

        {/* Top Learners Cards */}
        <div className="mt-12 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Performance des apprenants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TopLearnerCard
              title="Plus assidu"
              learner={stats.topAttendance?.learner ?? null}
              icon={<CheckCircle className="h-6 w-6 text-teal-500" />}
              stat={`${stats.topAttendance?.attendanceRate.toFixed(1)}% de présence`}
              color="teal"
            />
            <TopLearnerCard
              title="Plus de retards"
              learner={stats.mostLate?.learner ?? null}
              icon={<Clock className="h-6 w-6 text-orange-500" />}
              stat={`${stats.mostLate?.lateCount} retards`}
              color="orange"
            />
            <TopLearnerCard
              title="Plus d'absences"
              learner={stats.mostAbsent?.learner ?? null}
              icon={<XCircle className="h-6 w-6 text-red-500" />}
              stat={`${stats.mostAbsent?.absenceCount} absences`}
              color="red"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  suffix?: string;
  color: 'teal' | 'orange';
}

function StatCard({ title, value, icon, suffix, color }: StatCardProps) {
  const gradients = {
    teal: 'from-teal-100 to-teal-50',
    orange: 'from-orange-100 to-orange-50',
  };

  const iconColors = {
    teal: 'text-teal-500',
    orange: 'text-orange-500',
  };

  const borderColors = {
    teal: 'border-teal-200',
    orange: 'border-orange-200',
  };

  return (
    <Card className={`p-6 border bg-gradient-to-br ${gradients[color]} backdrop-blur-lg border ${borderColors[color]} rounded-xl overflow-hidden relative shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/80 -mr-12 -mt-12" />
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-800">
            {value}{suffix}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${iconColors[color]} bg-white shadow-md`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

interface TopLearnerCardProps {
  title: string;
  learner: {
    firstName: string;
    lastName: string;
    matricule: string;
    photoUrl?: string;
  } | null;
  icon: React.ReactNode;
  stat: string;
  color: 'teal' | 'orange' | 'red';
}

function TopLearnerCard({ title, learner, icon, stat, color }: TopLearnerCardProps) {
  if (!learner) {
    return (
      <Card className="p-6 border border-gray-200 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg">
        <div className="text-sm text-gray-500">
          Aucune donnée disponible
        </div>
      </Card>
    );
  }

  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600 border-teal-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  const gradients = {
    teal: 'from-teal-50 to-white',
    orange: 'from-orange-50 to-white',
    red: 'from-red-50 to-white',
  };

  return (
    <Card className={`p-6 border border-gray-200 bg-gradient-to-br ${gradients[color]} backdrop-blur-lg rounded-xl overflow-hidden relative shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/80 -mr-16 -mt-16" />
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-medium text-gray-800">{title}</h3>
        {icon}
      </div>

      <div className="flex items-center space-x-4">
        <div className="h-14 w-14 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-200 shadow-md">
          {learner.photoUrl ? (
            <img
              src={learner.photoUrl}
              alt={`${learner.firstName} ${learner.lastName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-lg font-medium text-gray-600">
              {learner.firstName[0]}{learner.lastName[0]}
            </span>
          )}
        </div>

        <div>
          <h4 className="font-medium text-gray-800">
            {learner.firstName} {learner.lastName}
          </h4>
          <p className="text-sm text-gray-500">{learner.matricule}</p>
        </div>
      </div>

      <div className={`mt-4 px-4 py-2 rounded-full inline-block ${colorClasses[color]} border shadow-sm`}>
        <span className="text-sm font-medium">{stat}</span>
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-60 bg-gray-200" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>

        <div className="mt-12 mb-6">
          <Skeleton className="h-8 w-48 bg-gray-200 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-48 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}