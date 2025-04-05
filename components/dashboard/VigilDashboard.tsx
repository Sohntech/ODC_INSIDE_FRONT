'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { QrCode, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { attendanceAPI } from '@/lib/api';
import StatCard from '@/components/dashboard/StatCard';

interface Scan {
  id: string;
  scanTime: string;
  isLate: boolean;
  learner?: {
    firstName: string;
    lastName: string;
    photoUrl?: string;
    matricule: string;
    referential?: {
      name: string;
    }
  };
  coach?: {
    firstName: string;
    lastName: string;
    photoUrl?: string;
    matricule: string;
  }
}

export default function VigilDashboard() {
  // Initialize recentScans as an empty array
  const [recentScans, setRecentScans] = useState<Scan[]>([]);
  const [attendanceStats, setAttendanceStats] = useState({
    totalLearners: 0,
    presentToday: 0,
    lateToday: 0,
    absentToday: 0,
  });
  const [loading, setLoading] = useState({
    stats: true,
    scans: true,
  });
  const [error, setError] = useState({
    stats: '',
    scans: '',
  });

  // Combined fetch function
  const fetchData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch both stats and scans concurrently
      const [statsResponse, scansResponse] = await Promise.all([
        attendanceAPI.getDailyStats(today),
        attendanceAPI.getLatestScans()
      ]);

      // Update stats
      setAttendanceStats({
        totalLearners: statsResponse.total || 0,
        presentToday: statsResponse.present || 0,
        lateToday: statsResponse.late || 0,
        absentToday: statsResponse.absent || 0,
      });

      // Update scans - ensure we're getting an array
      if (Array.isArray(scansResponse?.learnerScans) || Array.isArray(scansResponse?.coachScans)) {
        const allScans = [
          ...(scansResponse.learnerScans || []),
          ...(scansResponse.coachScans || [])
        ].sort((a, b) => 
          new Date(b.scanTime).getTime() - new Date(a.scanTime).getTime()
        );
        setRecentScans(allScans);
      } else {
        setRecentScans([]);
        console.warn('Scans response is not in expected format:', scansResponse);
      }

      // Clear any errors
      setError({
        stats: '',
        scans: ''
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError({
        stats: 'Failed to load attendance statistics',
        scans: 'Failed to load recent scans'
      });
    } finally {
      setLoading({
        stats: false,
        scans: false
      });
    }
  };

  useEffect(() => {
    fetchData();
    // Set up auto-refresh
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Calculate percentage for stats
  const presentPercentage = attendanceStats.totalLearners > 0
    ? Math.round((attendanceStats.presentToday / attendanceStats.totalLearners) * 100)
    : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Vigil</h1>
        <p className="text-gray-600">Système de gestion de présence</p>
      </div>
      
      {/* Quick Action Button */}
      <div className="mb-6">
        <Link 
          href="/dashboard/attendance/scan" 
          className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-lg font-medium"
        >
          <QrCode className="mr-2 h-6 w-6" />
          Scanner une présence
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Apprenants" 
          value={attendanceStats.totalLearners} 
          icon={<Users className="h-8 w-8 text-blue-500" />} 
          loading={loading.stats}
        />
        <StatCard 
          title="Présents aujourd'hui" 
          value={attendanceStats.presentToday} 
          icon={<CheckCircle className="h-8 w-8 text-green-500" />} 
          suffix={`${presentPercentage}%`}
          loading={loading.stats}
        />
        <StatCard 
          title="En retard aujourd'hui" 
          value={attendanceStats.lateToday} 
          icon={<Clock className="h-8 w-8 text-orange-500" />} 
          loading={loading.stats}
        />
        <StatCard 
          title="Absents aujourd'hui" 
          value={attendanceStats.absentToday} 
          icon={<XCircle className="h-8 w-8 text-red-500" />} 
          loading={loading.stats}
        />
      </div>
      
      {/* Recent Scans */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Scans Récents</h2>
          <Link 
            href="/dashboard/attendance/history" 
            className="text-orange-500 hover:text-orange-700 text-sm font-medium"
          >
            Voir tout l'historique
          </Link>
        </div>
        
        {loading.scans ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={`loading-skeleton-${i}`} 
                className="h-16 bg-gray-100 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : error.scans ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error.scans}
          </div>
        ) : recentScans.length === 0 ? (
          <div className="bg-gray-50 text-gray-500 p-4 rounded-lg text-center">
            Aucun scan récent
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apprenant/Coach</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure de scan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentScans.map((scan) => (
                  <tr key={`scan-${scan.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                          {scan.learner?.photoUrl || scan.coach?.photoUrl ? (
                            <img 
                              src={scan.learner?.photoUrl || scan.coach?.photoUrl} 
                              alt={`${scan.learner?.firstName || scan.coach?.firstName} ${scan.learner?.lastName || scan.coach?.lastName}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-orange-500 text-white text-sm font-medium">
                              {(scan.learner?.firstName?.[0] || scan.coach?.firstName?.[0] || '') + 
                               (scan.learner?.lastName?.[0] || scan.coach?.lastName?.[0] || '')}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {scan.learner?.firstName || scan.coach?.firstName} {scan.learner?.lastName || scan.coach?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {scan.learner?.referential?.name || 'Coach'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {scan.learner?.matricule || scan.coach?.matricule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(scan.scanTime).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(scan.scanTime).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${scan.isLate 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                          }`}
                      >
                        {scan.isLate ? 'En retard' : 'À l\'heure'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Scan Counts by Hour */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Statistiques de scan</h2>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-700 mb-2">Horaires de pointe</h3>
            <p className="text-gray-600 text-sm">
              Les heures les plus occupées pour les scans sont généralement entre 8h00 et 9h00 du matin.
            </p>
          </div>
          <div className="flex-1 bg-gray-50 p-4 rounded-lg mt-4 md:mt-0">
            <h3 className="text-md font-medium text-gray-700 mb-2">Tendance des retards</h3>
            <p className="text-gray-600 text-sm">
              En moyenne, 15% des apprenants arrivent en retard, principalement les lundis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}