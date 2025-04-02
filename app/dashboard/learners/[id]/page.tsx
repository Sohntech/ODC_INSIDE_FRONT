'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  learnersAPI, 
  Learner, 
  LearnerAttendance, 
  AttendanceStats, 
  Kit 
} from '@/lib/api';
import { 
  ChevronLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Award, 
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Edit
} from 'lucide-react';

export default function LearnerDetailsPage() {
  const { id } = useParams();
  const learnerId = Array.isArray(id) ? id[0] : id;
  
  const [learner, setLearner] = useState<Learner | null>(null);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchLearnerData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch learner and attendance stats in parallel
        const [learnerData, attendanceStatsData] = await Promise.all([
          learnersAPI.getLearnerById(learnerId),
          learnersAPI.getLearnerAttendanceStats(learnerId)
        ]);
        
        setLearner(learnerData);
        setAttendanceStats(attendanceStatsData);
      } catch (err) {
        console.error('Error fetching learner data:', err);
        setError('Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    if (learnerId) {
      fetchLearnerData();
    }
  }, [learnerId]);

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Format status
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'INACTIVE': return 'Inactif';
      case 'SUSPENDED': return 'Suspendu';
      case 'REPLACED': return 'Remplacé';
      case 'WAITING_LIST': return 'Liste d\'attente';
      default: return status;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED': return 'bg-yellow-100 text-yellow-800';
      case 'REPLACED': return 'bg-orange-100 text-orange-800';
      case 'WAITING_LIST': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Back button */}
      <Link 
        href="/dashboard/learners" 
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft size={16} className="mr-1" />
        Retour à la liste
      </Link>
      
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="flex mb-6">
            <div className="rounded-full bg-gray-200 h-20 w-20"></div>
            <div className="ml-4 space-y-3 flex-1">
              <div className="h-7 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/5"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      ) : learner ? (
        <>
          {/* Learner header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl font-bold mr-4">
                  {learner.photoUrl ? (
                    <img 
                      src={learner.photoUrl} 
                      alt={`${learner.firstName} ${learner.lastName}`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    `${learner.firstName.charAt(0)}${learner.lastName.charAt(0)}`
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {learner.firstName} {learner.lastName}
                  </h1>
                  <div className="flex items-center mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(learner.status)}`}>
                      {getStatusLabel(learner.status)}
                    </span>
                    {learner.qrCode && (
                      <span className="ml-2 text-sm text-gray-500">
                        Code: {learner.qrCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <Link 
                  href={`/dashboard/learners/${learnerId}/edit`}
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Edit size={18} className="mr-2" />
                  Modifier
                </Link>
              </div>
            </div>
            
            {/* Learner details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations personnelles</h2>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <User size={18} className="mr-3 text-gray-400" />
                    <span className="w-32">Genre:</span>
                    <span className="font-medium text-gray-800">
                      {learner.gender === 'MALE' ? 'Homme' : 'Femme'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar size={18} className="mr-3 text-gray-400" />
                    <span className="w-32">Date de naissance:</span>
                    <span className="font-medium text-gray-800">
                      {formatDate(learner.birthDate)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-3 text-gray-400" />
                    <span className="w-32">Lieu de naissance:</span>
                    <span className="font-medium text-gray-800">
                      {learner.birthPlace || 'Non renseigné'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-3 text-gray-400" />
                    <span className="w-32">Adresse:</span>
                    <span className="font-medium text-gray-800">
                      {learner.address || 'Non renseignée'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Phone size={18} className="mr-3 text-gray-400" />
                    <span className="w-32">Téléphone:</span>
                    <span className="font-medium text-gray-800">{learner.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Mail size={18} className="mr-3 text-gray-400" />
                    <span className="w-32">Email:</span>
                    <span className="font-medium text-gray-800">{learner.mail}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations académiques</h2>
                <div className="space-y-3">
                  {learner.promotion && (
                    <div className="flex items-center text-gray-600">
                      <Award size={18} className="mr-3 text-gray-400" />
                      <span className="w-32">Promotion:</span>
                      <span className="font-medium text-gray-800">
                        {learner.promotion.name}
                      </span>
                    </div>
                  )}
                  
                  {learner.referential && (
                    <div className="flex items-center text-gray-600">
                      <Briefcase size={18} className="mr-3 text-gray-400" />
                      <span className="w-32">Référentiel:</span>
                      <span className="font-medium text-gray-800">
                        {learner.referential.name}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar size={18} className="mr-3 text-gray-400" />
                    <span className="w-32">Date d'inscription:</span>
                    <span className="font-medium text-gray-800">
                      {formatDate(learner.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Attendance stats */}
          {attendanceStats && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Présence</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                      <span className="text-sm font-medium text-green-800">Présent</span>
                    </div>
                    <span className="text-lg font-bold text-green-800">{attendanceStats.present}</span>
                  </div>
                  <div className="h-2 bg-white rounded-full">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ 
                        width: `${attendanceStats.totalDays ? 
                          (attendanceStats.present / attendanceStats.totalDays) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Clock size={20} className="text-yellow-500 mr-2" />
                      <span className="text-sm font-medium text-yellow-800">En retard</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-800">{attendanceStats.late}</span>
                  </div>
                  <div className="h-2 bg-white rounded-full">
                    <div 
                      className="h-full bg-yellow-500 rounded-full" 
                      style={{ 
                        width: `${attendanceStats.totalDays ? 
                          (attendanceStats.late / attendanceStats.totalDays) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <XCircle size={20} className="text-red-500 mr-2" />
                      <span className="text-sm font-medium text-red-800">Absent</span>
                    </div>
                    <span className="text-lg font-bold text-red-800">{attendanceStats.absent}</span>
                  </div>
                  <div className="h-2 bg-white rounded-full">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{ 
                        width: `${attendanceStats.totalDays ? 
                          (attendanceStats.absent / attendanceStats.totalDays) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Calendar size={20} className="text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-blue-800">Total des jours</span>
                    </div>
                    <span className="text-lg font-bold text-blue-800">{attendanceStats.totalDays}</span>
                  </div>
                  <div className="h-2 bg-white rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Kit information */}
          {learner.kit && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Kit apprenant</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${learner.kit.laptop ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    {learner.kit.laptop ? (
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                    ) : (
                      <XCircle size={20} className="text-gray-400 mr-2" />
                    )}
                    <span className={`text-sm font-medium ${learner.kit.laptop ? 'text-green-800' : 'text-gray-600'}`}>
                      Ordinateur portable
                    </span>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${learner.kit.charger ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    {learner.kit.charger ? (
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                    ) : (
                      <XCircle size={20} className="text-gray-400 mr-2" />
                    )}
                    <span className={`text-sm font-medium ${learner.kit.charger ? 'text-green-800' : 'text-gray-600'}`}>
                      Chargeur
                    </span>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${learner.kit.bag ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    {learner.kit.bag ? (
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                    ) : (
                      <XCircle size={20} className="text-gray-400 mr-2" />
                    )}
                    <span className={`text-sm font-medium ${learner.kit.bag ? 'text-green-800' : 'text-gray-600'}`}>
                      Sac
                    </span>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${learner.kit.polo ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    {learner.kit.polo ? (
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                    ) : (
                      <XCircle size={20} className="text-gray-400 mr-2" />
                    )}
                    <span className={`text-sm font-medium ${learner.kit.polo ? 'text-green-800' : 'text-gray-600'}`}>
                      Polo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Attendance records */}
          {learner.attendances && learner.attendances.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Historique de présence</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {learner.attendances.map((attendance) => (
                      <tr key={attendance.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(attendance.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {attendance.isPresent ? (
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
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {attendance.scanTime ? new Date(attendance.scanTime).toLocaleTimeString('fr-FR') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {attendance.justification ? (
                            <div className="flex items-center">
                              <span className="truncate max-w-xs">
                                {attendance.justification}
                              </span>
                              {attendance.documentUrl && (
                                <a 
                                  href={attendance.documentUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="ml-2 text-orange-500 hover:text-orange-700"
                                >
                                  <FileText size={16} />
                                </a>
                              )}
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {attendance.justification ? (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${attendance.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                               attendance.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                               'bg-yellow-100 text-yellow-800'}`}>
                              {attendance.status === 'APPROVED' ? 'Approuvée' :
                               attendance.status === 'REJECTED' ? 'Rejetée' :
                               'En attente'}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-gray-50 text-gray-600 p-4 rounded-lg text-center">
          Aucun apprenant trouvé avec cet identifiant
        </div>
      )}
    </div>
  );
} 