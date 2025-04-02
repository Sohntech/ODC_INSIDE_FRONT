"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { learnersAPI, modulesAPI } from '@/lib/api';
import { QrCode, Calendar, FileText, Clock, CheckCircle, XCircle, Book } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

export default function LearnerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [learnerId, setLearnerId] = useState<string | null>(null);
  const [learner, setLearner] = useState<any>(null);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);
  const [activeModules, setActiveModules] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    learner: true,
    stats: true,
    modules: true,
    events: true,
  });
  const [error, setError] = useState({
    learner: '',
    stats: '',
    modules: '',
    events: '',
  });

  useEffect(() => {
    // Get user info from localStorage
    const getUserInfo = () => {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        if (!userData) return;
        
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Simulate getting learnerId from user data
          // In a real app, this would come from the API or user info
          setLearnerId('sample-learner-id'); // This is a placeholder
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }
    };
    
    getUserInfo();
  }, []);

  useEffect(() => {
    if (!learnerId) return;
    
    const fetchData = async () => {
      try {
        // Fetch learner details
        const learnerData = await learnersAPI.getLearnerById(learnerId);
        setLearner(learnerData);
        setLoading(prev => ({ ...prev, learner: false }));
      } catch (err) {
        console.error('Error fetching learner details:', err);
        setError(prev => ({ ...prev, learner: 'Failed to load your profile' }));
        setLoading(prev => ({ ...prev, learner: false }));
      }

      try {
        // Fetch attendance stats
        const statsData = await learnersAPI.getLearnerAttendanceStats(learnerId);
        setAttendanceStats(statsData);
        setLoading(prev => ({ ...prev, stats: false }));
      } catch (err) {
        console.error('Error fetching attendance stats:', err);
        setError(prev => ({ ...prev, stats: 'Failed to load attendance statistics' }));
        setLoading(prev => ({ ...prev, stats: false }));
      }

      try {
        // Fetch active modules
        const modulesData = await modulesAPI.getActiveModulesByLearner(learnerId);
        setActiveModules(modulesData);
        setLoading(prev => ({ ...prev, modules: false }));
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError(prev => ({ ...prev, modules: 'Failed to load modules' }));
        setLoading(prev => ({ ...prev, modules: false }));
      }

      // Placeholder for events data
      // This would normally come from an API
      setUpcomingEvents([
        {
          id: '1',
          title: 'Visite entreprise Sonatel',
          date: new Date(Date.now() + 86400000 * 2), // 2 days from now
          location: 'Sonatel Siège, Dakar',
          type: 'VISIT'
        },
        {
          id: '2',
          title: 'Workshop Design Thinking',
          date: new Date(Date.now() + 86400000 * 5), // 5 days from now
          location: 'ODC Inside, Salle 3',
          type: 'WORKSHOP'
        }
      ]);
      setLoading(prev => ({ ...prev, events: false }));
    };

    fetchData();
  }, [learnerId]);

  // If we're still loading the initial user info
  if (!user || !learnerId) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bienvenue, {learner?.firstName || user.email}</h1>
        <p className="text-gray-600">Votre tableau de bord ODC Inside</p>
      </div>
      
      {/* QR Code Display */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row items-center">
        <div className="mb-4 md:mb-0 md:mr-6 md:w-1/3">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Votre QR Code Personnel</h2>
          <p className="text-gray-600 text-sm mb-4">
            Présentez ce code au vigil pour pointer votre présence ou au restaurateur pour vos repas.
          </p>
          <Link 
            href="/dashboard/qrcode" 
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <QrCode className="mr-2 h-5 w-5" />
            Afficher en plein écran
          </Link>
        </div>
        <div className="bg-white p-3 border-2 border-orange-500 rounded-lg">
          {loading.learner ? (
            <div className="w-40 h-40 bg-gray-200 animate-pulse"></div>
          ) : (
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${learner?.qrCode || 'placeholder'}`} 
              alt="QR Code personnel" 
              className="w-40 h-40"
            />
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Taux de présence" 
          value={attendanceStats?.present || 0} 
          suffix={`/${attendanceStats?.totalDays || 0} jours`}
          icon={<CheckCircle className="h-8 w-8 text-green-500" />} 
          loading={loading.stats}
        />
        <StatCard 
          title="Retards" 
          value={attendanceStats?.late || 0} 
          suffix="jours"
          icon={<Clock className="h-8 w-8 text-orange-500" />} 
          loading={loading.stats}
        />
        <StatCard 
          title="Absences" 
          value={attendanceStats?.absent || 0} 
          suffix="jours"
          icon={<XCircle className="h-8 w-8 text-red-500" />} 
          loading={loading.stats}
        />
        <StatCard 
          title="Modules actifs" 
          value={activeModules?.length || 0} 
          icon={<Book className="h-8 w-8 text-blue-500" />} 
          loading={loading.modules}
        />
      </div>
      
      {/* Active Modules */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Modules en cours</h2>
          <Link 
            href="/dashboard/modules" 
            className="text-orange-500 hover:text-orange-700 text-sm font-medium"
          >
            Voir tous les modules
          </Link>
        </div>
        
        {loading.modules ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : error.modules ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error.modules}
          </div>
        ) : activeModules.length === 0 ? (
          <div className="bg-gray-50 text-gray-500 p-4 rounded-lg text-center">
            Aucun module actif en ce moment
          </div>
        ) : (
          <div className="space-y-4">
            {activeModules.map(module => (
              <div key={module.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">{module.name}</h3>
                    <p className="text-sm text-gray-600">{module.description}</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(module.startDate).toLocaleDateString('fr-FR')} - {new Date(module.endDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="bg-orange-100 px-3 py-1 rounded-full text-orange-800 text-sm font-medium">
                    En cours
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Événements à venir</h2>
        
        {loading.events ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : error.events ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error.events}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="bg-gray-50 text-gray-500 p-4 rounded-lg text-center">
            Aucun événement prévu prochainement
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="flex items-center border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{event.title}</h3>
                  <div className="text-sm text-gray-600">{event.location}</div>
                  <div className="text-xs text-gray-500">
                    {event.date.toLocaleDateString('fr-FR')} à {event.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${event.type === 'VISIT' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}
                `}>
                  {event.type === 'VISIT' ? 'Visite' : 'Workshop'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 