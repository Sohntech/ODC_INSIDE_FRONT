'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { QrCode, Clock, Users, CheckCircle, XCircle, BarChart3, Calendar, ChevronRight } from 'lucide-react';
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

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with gradient */}
        <div className="relative mb-8 bg-gradient-to-r from-teal-600 to-teal-400 rounded-2xl shadow-lg p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Vigil</h1>
              <p className="text-teal-100 mt-1">Système intelligent de gestion de présence</p>
              <p className="text-teal-100 mt-2 text-sm">{currentDate}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-3xl font-bold">{presentPercentage}%</div>
              <div className="text-teal-100 text-sm">Taux de présence</div>
            </div>
          </div>
        </div>
      
        {/* Quick Action Button */}
        <div className="mb-8">
          <Link 
            href="/dashboard/attendance/scan" 
            className="group inline-flex items-center px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl hover:from-orange-600 hover:to-orange-500 transition-all duration-300 transform hover:translate-y-1 hover:shadow-lg shadow-md text-lg font-medium"
          >
            <QrCode className="mr-3 h-6 w-6" />
            <span>Scanner une présence</span>
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard 
            title="Total Apprenants" 
            value={attendanceStats.totalLearners} 
            icon={<Users className="h-8 w-8 text-teal-500" />} 
            loading={loading.stats}
            className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-teal-500 hover:shadow-md transition-all"
          />
          <StatCard 
            title="Présents aujourd'hui" 
            value={attendanceStats.presentToday} 
            icon={<CheckCircle className="h-8 w-8 text-teal-500" />} 
            suffix={`${presentPercentage}%`}
            loading={loading.stats}
            className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-teal-500 hover:shadow-md transition-all"
            highlightValue={true}
          />
          <StatCard 
            title="En retard aujourd'hui" 
            value={attendanceStats.lateToday} 
            icon={<Clock className="h-8 w-8 text-orange-500" />} 
            loading={loading.stats}
            className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500 hover:shadow-md transition-all"
          />
          <StatCard 
            title="Absents aujourd'hui" 
            value={attendanceStats.absentToday} 
            icon={<XCircle className="h-8 w-8 text-orange-500" />} 
            loading={loading.stats}
            className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500 hover:shadow-md transition-all"
          />
        </div>
      
        {/* Recent Scans */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 backdrop-blur-sm bg-opacity-80">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                <Calendar className="h-5 w-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Scans Récents</h2>
            </div>
            <Link 
              href="/dashboard/attendance/history" 
              className="flex items-center text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors"
            >
              Voir tout l'historique
              <ChevronRight className="ml-1 h-4 w-4" />
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
            <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 mr-2" />
                {error.scans}
              </div>
            </div>
          ) : recentScans.length === 0 ? (
            <div className="bg-gray-50 text-gray-500 p-6 rounded-xl text-center border border-gray-100">
              Aucun scan récent
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apprenant/Coach</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure de scan</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {recentScans.map((scan) => (
                    <tr key={`scan-${scan.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden shadow-sm">
                            {scan.learner?.photoUrl || scan.coach?.photoUrl ? (
                              <img 
                                src={scan.learner?.photoUrl || scan.coach?.photoUrl} 
                                alt={`${scan.learner?.firstName || scan.coach?.firstName} ${scan.learner?.lastName || scan.coach?.lastName}`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-600 text-white text-sm font-medium">
                                {(scan.learner?.firstName?.[0] || scan.coach?.firstName?.[0] || '') + 
                                (scan.learner?.lastName?.[0] || scan.coach?.lastName?.[0] || '')}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {scan.learner?.firstName || scan.coach?.firstName} {scan.learner?.lastName || scan.coach?.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {scan.learner?.referential?.name || 'Coach'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700 inline-block">
                          {scan.learner?.matricule || scan.coach?.matricule}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
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
                          className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full 
                            ${scan.isLate 
                              ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                              : 'bg-teal-100 text-teal-800 border border-teal-200'
                            }`}
                        >
                          {scan.isLate ? (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              En retard
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              À l'heure
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      
        {/* Analytics Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 backdrop-blur-sm bg-opacity-80">
          <div className="flex items-center mb-6">
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Analyses de Présence</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Peak Hours Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-teal-600" />
                Horaires de pointe
              </h3>
              <div className="relative h-40 w-full bg-white rounded-lg p-4 overflow-hidden">
                <div className="flex items-end h-24 space-x-2">
                  <div className="h-40% w-6 bg-teal-200 rounded-t relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-teal-700 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">7h: 40%</div>
                  </div>
                  <div className="h-90% w-6 bg-teal-400 rounded-t relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-teal-700 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">8h: 90%</div>
                  </div>
                  <div className="h-70% w-6 bg-teal-300 rounded-t relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-teal-700 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">9h: 70%</div>
                  </div>
                  <div className="h-20% w-6 bg-teal-200 rounded-t relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-teal-700 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">10h: 20%</div>
                  </div>
                  <div className="h-10% w-6 bg-teal-100 rounded-t relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-teal-700 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">11h: 10%</div>
                  </div>
                  <div className="h-5% w-6 bg-teal-100 rounded-t relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-teal-700 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">12h: 5%</div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500 px-1">
                  <span>7h</span>
                  <span>8h</span>
                  <span>9h</span>
                  <span>10h</span>
                  <span>11h</span>
                  <span>12h</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                Les scans sont plus fréquents entre <span className="font-semibold text-teal-700">8h00 et 9h00</span> du matin, avec un pic à 8h15.
              </p>
            </div>
            
            {/* Late Trends Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                Tendance des retards
              </h3>
              <div className="relative h-40 w-full bg-white rounded-lg p-4 overflow-hidden">
                <div className="flex items-end h-24 space-x-2">
                  <div className="h-25% w-8 bg-orange-300 rounded-t relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-orange-700 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">Lun: 25%</div>
                  </div>
                  <div className="h-15% w-8 bg-orange-200 rounded-t relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-orange-700 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">Mar: 15%</div>
                  </div>
                  <div className="h-10% w-8 bg-orange-100 rounded-t relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-orange-700 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">Mer: 10%</div>
                  </div>
                  <div className="h-12% w-8 bg-orange-200 rounded-t relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-orange-700 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">Jeu: 12%</div>
                  </div>
                  <div className="h-18% w-8 bg-orange-200 rounded-t relative group">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-orange-700 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">Ven: 18%</div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Lun</span>
                  <span>Mar</span>
                  <span>Mer</span>
                  <span>Jeu</span>
                  <span>Ven</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                En moyenne, <span className="font-semibold text-orange-700">15%</span> des apprenants arrivent en retard, avec un pic de <span className="font-semibold text-orange-700">25%</span> le lundi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}