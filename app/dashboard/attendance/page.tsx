'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { attendanceAPI, learnersAPI, Learner, LearnerAttendance } from '@/lib/api';
import { QrCode, Calendar, ArrowLeft, ArrowRight, Search, Download } from 'lucide-react';

export default function AttendancePage() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [learners, setLearners] = useState<Learner[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<{ [key: string]: LearnerAttendance }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch all learners
        const learnersData = await learnersAPI.getAllLearners();
        setLearners(learnersData);
        
        // Get daily stats for selected date
        const statsData = await attendanceAPI.getDailyStats(date);
        setStats({
          total: learnersData.length,
          present: statsData.present || 0,
          late: statsData.late || 0,
          absent: statsData.absent || 0,
        });
        
        // Simulate getting attendance records for each learner
        // In a real app, you would fetch this from the backend
        const records: { [key: string]: LearnerAttendance } = {};
        
        // Simulate some attendance data
        learnersData.forEach(learner => {
          const rand = Math.random();
          if (rand < 0.7) { // Present
            records[learner.id] = {
              id: `attendance-${learner.id}`,
              date,
              learnerId: learner.id,
              isPresent: true,
              isLate: rand > 0.5,
              scanTime: rand > 0.5 
                ? new Date(`${date}T09:${Math.floor(Math.random() * 30) + 30}:00`).toISOString()
                : new Date(`${date}T08:${Math.floor(Math.random() * 30) + 30}:00`).toISOString(),
              status: 'PENDING',
              justification: '',
            };
          } else { // Absent
            records[learner.id] = {
              id: `attendance-${learner.id}`,
              date,
              learnerId: learner.id,
              isPresent: false,
              isLate: false,
              status: 'PENDING',
              justification: '',
            };
          }
        });
        
        setAttendanceRecords(records);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError('Une erreur est survenue lors du chargement des données de présence');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [date]);

  // Navigate to previous/next day
  const changeDate = (amount: number) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + amount);
    setDate(currentDate.toISOString().split('T')[0]);
  };

  // Format date for display (ex: "Lundi 15 avril 2023")
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Filter learners based on search query
  const filteredLearners = learners.filter(learner => {
    const fullName = `${learner.firstName} ${learner.lastName}`.toLowerCase();
    return searchQuery === '' || fullName.includes(searchQuery.toLowerCase());
  });

  // Handle exporting attendance data
  const handleExport = () => {
    alert('Fonctionnalité d\'export à implémenter');
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des présences</h1>
          <p className="text-gray-600">Suivez la présence des apprenants</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link 
            href="/dashboard/attendance/scan" 
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <QrCode size={18} className="mr-2" />
            Scanner une présence
          </Link>
        </div>
      </div>
      
      {/* Date navigation */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => changeDate(-1)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            
            <div className="flex items-center space-x-3">
              <Calendar className="text-gray-500" size={20} />
              <span className="font-medium text-gray-800 capitalize">
                {formatDate(date)}
              </span>
            </div>
            
            <button 
              onClick={() => changeDate(1)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowRight size={20} className="text-gray-700" />
            </button>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 mr-2"
            />
            
            <button
              onClick={handleExport}
              className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download size={18} className="mr-2" />
              Exporter
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-lg font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Apprenants total</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-lg font-bold text-green-800">{stats.present}</div>
            <div className="text-sm text-green-600">Présents ({Math.round((stats.present / stats.total) * 100) || 0}%)</div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-lg font-bold text-yellow-800">{stats.late}</div>
            <div className="text-sm text-yellow-600">En retard ({Math.round((stats.late / stats.total) * 100) || 0}%)</div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-lg font-bold text-red-800">{stats.absent}</div>
            <div className="text-sm text-red-600">Absents ({Math.round((stats.absent / stats.total) * 100) || 0}%)</div>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un apprenant..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Attendance table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded w-full mb-2"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      ) : filteredLearners.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun apprenant trouvé</h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Aucun apprenant ne correspond à votre recherche'
              : 'Il n\'y a actuellement aucun apprenant dans la base de données'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apprenant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Référentiel
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Heure d'arrivée
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Justification
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLearners.map((learner) => {
                  const attendance = attendanceRecords[learner.id];
                  return (
                    <tr key={learner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-medium">
                            {learner.photoUrl ? (
                              <img 
                                src={learner.photoUrl} 
                                alt={`${learner.firstName} ${learner.lastName}`}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              `${learner.firstName.charAt(0)}${learner.lastName.charAt(0)}`
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {learner.firstName} {learner.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {learner.referential?.name || 'Non assigné'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attendance ? (
                          attendance.isPresent ? (
                            attendance.isLate ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                En retard
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Présent
                              </span>
                            )
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Absent
                            </span>
                          )
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Non enregistré
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attendance && attendance.scanTime 
                          ? new Date(attendance.scanTime).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attendance && attendance.justification ? (
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900 truncate max-w-xs">
                              {attendance.justification}
                            </span>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              attendance.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                              attendance.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {attendance.status === 'APPROVED' ? 'Approuvée' :
                               attendance.status === 'REJECTED' ? 'Rejetée' :
                               'En attente'}
                            </span>
                          </div>
                        ) : attendance && !attendance.isPresent ? (
                          <Link 
                            href={`/dashboard/attendance/justify/${learner.id}?date=${date}`}
                            className="text-yellow-500 hover:text-yellow-700 text-sm"
                          >
                            Ajouter une justification
                          </Link>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 