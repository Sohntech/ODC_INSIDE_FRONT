"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { learnersAPI, modulesAPI, referentialsAPI } from '@/lib/api';
import { Book, Users, CheckCircle, XCircle, Clock, ChevronDown, Clipboard } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

export default function CoachDashboard() {
  const [activeModules, setActiveModules] = useState<any[]>([]);
  const [learners, setLearners] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
  });
  const [selectedReferential, setSelectedReferential] = useState<string | null>(null);
  const [referentials, setReferentials] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    modules: true,
    learners: true,
    stats: true,
    referentials: true,
  });
  const [error, setError] = useState({
    modules: '',
    learners: '',
    stats: '',
    referentials: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In real app, this would be filtered to coach's modules
        const modulesData = await modulesAPI.getAllModules();
        setActiveModules(modulesData.filter((m: any) => 
          new Date(m.endDate) >= new Date()
        ));
        setLoading(prev => ({ ...prev, modules: false }));
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError(prev => ({ ...prev, modules: 'Failed to load modules' }));
        setLoading(prev => ({ ...prev, modules: false }));
      }

      try {
        // In real app, this would be filtered to coach's referentials
        const referentialsData = await referentialsAPI.getAllReferentials();
        setReferentials(referentialsData);
        if (referentialsData.length > 0) {
          setSelectedReferential(referentialsData[0].id);
        }
        setLoading(prev => ({ ...prev, referentials: false }));
      } catch (err) {
        console.error('Error fetching referentials:', err);
        setError(prev => ({ ...prev, referentials: 'Failed to load referentials' }));
        setLoading(prev => ({ ...prev, referentials: false }));
      }
    };

    fetchData();
  }, []);

  // When a referential is selected, fetch its learners
  useEffect(() => {
    if (!selectedReferential) return;

    const fetchLearners = async () => {
      try {
        setLoading(prev => ({ ...prev, learners: true }));
        // In real app, this would fetch learners by referential
        const allLearners = await learnersAPI.getAllLearners();
        const learnersData = allLearners.filter((learner: any) => learner.referentialId === selectedReferential);
        setLearners(learnersData);
        setLoading(prev => ({ ...prev, learners: false }));
        
        // Calculate attendance stats
        const totalLearners = learnersData.length;
        const present = learnersData.filter((l: any) => 
          l.attendances?.some((a: any) => a.isPresent && !a.isLate)
        ).length;
        const late = learnersData.filter((l: any) => 
          l.attendances?.some((a: any) => a.isPresent && a.isLate)
        ).length;
        const absent = totalLearners - present - late;
        
        setAttendanceStats({
          present,
          late,
          absent,
          total: totalLearners,
        });
        setLoading(prev => ({ ...prev, stats: false }));
      } catch (err) {
        console.error('Error fetching learners:', err);
        setError(prev => ({ ...prev, learners: 'Failed to load learners' }));
        setLoading(prev => ({ ...prev, learners: false }));
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };

    fetchLearners();
  }, [selectedReferential]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Coach</h1>
        <p className="text-gray-600">Gestion des modules et des notes</p>
      </div>
      
      {/* Coach Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link 
          href="/dashboard/modules/new" 
          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Book className="mr-2 h-5 w-5" />
          Ajouter un module
        </Link>
        <Link 
          href="/dashboard/grades/new" 
          className="inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          <Clipboard className="mr-2 h-5 w-5" />
          Saisir des notes
        </Link>
      </div>
      
      {/* Referential Selection */}
      {!loading.referentials && referentials.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner un référentiel
          </label>
          <div className="relative">
            <select
              value={selectedReferential || ''}
              onChange={(e) => setSelectedReferential(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {referentials.map(ref => (
                <option key={ref.id} value={ref.id}>
                  {ref.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Apprenants" 
          value={attendanceStats.total} 
          icon={<Users className="h-8 w-8 text-blue-500" />} 
          loading={loading.stats}
        />
        <StatCard 
          title="Présents" 
          value={attendanceStats.present} 
          icon={<CheckCircle className="h-8 w-8 text-teal-500" />} 
          suffix={attendanceStats.total > 0 ? `${Math.round((attendanceStats.present / attendanceStats.total) * 100)}%` : '0%'}
          loading={loading.stats}
        />
        <StatCard 
          title="En retard" 
          value={attendanceStats.late} 
          icon={<Clock className="h-8 w-8 text-orange-500" />} 
          loading={loading.stats}
        />
        <StatCard 
          title="Absents" 
          value={attendanceStats.absent} 
          icon={<XCircle className="h-8 w-8 text-red-500" />} 
          loading={loading.stats}
        />
      </div>
      
      {/* Active Modules */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Modules actifs</h2>
          <Link 
            href="/dashboard/modules" 
            className="text-orange-500 hover:text-orange-700 text-sm font-medium"
          >
            Voir tous les modules
          </Link>
        </div>
        
        {loading.modules ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
              <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-medium text-gray-800">{module.name}</h3>
                  <div className="bg-teal-100 px-3 py-1 rounded-full text-teal-800 text-sm font-medium">
                    En cours
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-3">{module.description || 'Aucune description disponible'}</p>
                  <div className="flex flex-wrap items-center text-sm text-gray-500">
                    <div className="flex items-center mr-4 mb-2">
                      <Book className="h-4 w-4 mr-1 text-orange-500" />
                      <span>{module.referential?.name || 'Référentiel non assigné'}</span>
                    </div>
                    <div className="flex items-center mr-4 mb-2">
                      <Clock className="h-4 w-4 mr-1 text-blue-500" />
                      <span>
                        {new Date(module.startDate).toLocaleDateString('fr-FR')} - {new Date(module.endDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Link 
                      href={`/dashboard/modules/${module.id}`}
                      className="text-orange-500 hover:text-orange-700 text-sm font-medium"
                    >
                      Voir les détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Learners for Selected Referential */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Apprenants du référentiel</h2>
          <Link 
            href={selectedReferential ? `/dashboard/referentials/${selectedReferential}/learners` : '#'}
            className={`text-orange-500 hover:text-orange-700 text-sm font-medium ${!selectedReferential ? 'pointer-events-none opacity-50' : ''}`}
          >
            Voir tous les apprenants
          </Link>
        </div>
        
        {loading.learners ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : error.learners ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error.learners}
          </div>
        ) : !selectedReferential ? (
          <div className="bg-gray-50 text-gray-500 p-4 rounded-lg text-center">
            Veuillez sélectionner un référentiel
          </div>
        ) : learners.length === 0 ? (
          <div className="bg-gray-50 text-gray-500 p-4 rounded-lg text-center">
            Aucun apprenant dans ce référentiel
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apprenant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Présence</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {learners.slice(0, 5).map(learner => (
                  <tr key={learner.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                          {learner.photoUrl ? (
                            <img 
                              src={learner.photoUrl} 
                              alt={`${learner.firstName} ${learner.lastName}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-orange-500 text-white text-sm font-medium">
                              {learner.firstName?.[0]}{learner.lastName?.[0]}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {learner.firstName} {learner.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {learner.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-orange-500 h-2.5 rounded-full" 
                          style={{ width: `${Math.floor(Math.random() * 100)}%` }} 
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        learner.attendances?.some((a: any) => !a.isPresent) 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {learner.attendances?.some((a: any) => !a.isPresent) 
                          ? 'Absences' 
                          : 'Complet'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/dashboard/learners/${learner.id}/grades`}
                        className="text-orange-500 hover:text-orange-700 mr-3"
                      >
                        Notes
                      </Link>
                      <Link 
                        href={`/dashboard/learners/${learner.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 