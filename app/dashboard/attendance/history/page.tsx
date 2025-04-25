'use client';

import { useState, useEffect } from 'react';
import { attendanceAPI } from '@/lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Filter, Download, CheckCircle, Search, RefreshCw } from 'lucide-react';
import Image from 'next/image';

export default function AttendanceHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'onTime', 'late'
  const [displayCount, setDisplayCount] = useState(15);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getLatestScans(50); // Get more scans for history
      const allScans = [
        ...(response.learnerScans || []),
        ...(response.coachScans || [])
      ].sort((a, b) => 
        new Date(b.scanTime).getTime() - new Date(a.scanTime).getTime()
      );
      setHistory(allScans);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search functionality
  const filteredHistory = history
    .filter(scan => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'onTime') return !scan.isLate;
      if (filterStatus === 'late') return scan.isLate;
      return true;
    })
    .filter(scan => {
      if (!searchTerm) return true;
      const fullName = `${scan.learner?.firstName || scan.coach?.firstName} ${scan.learner?.lastName || scan.coach?.lastName}`.toLowerCase();
      const matricule = (scan.learner?.matricule || scan.coach?.matricule || '').toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      return fullName.includes(searchLower) || matricule.includes(searchLower);
    });

  // Group by date for better visualization
  const groupedHistory = filteredHistory.reduce((groups, scan) => {
    const date = format(new Date(scan.scanTime), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(scan);
    return groups;
  }, {});

  const dateGroups = Object.keys(groupedHistory).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Load more entries
  const loadMore = () => {
    setDisplayCount(prev => prev + 15);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with gradient */}
        <div className="relative mb-8 bg-gradient-to-r from-teal-600 to-teal-400 rounded-2xl shadow-lg p-8 text-white">
          {/* Grid pattern in background */}
          <div 
            className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 bg-repeat pointer-events-none"
            style={{ 
              backgroundSize: '20px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)' 
            }}
          />
          
          {/* Content on top */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center text-teal-100 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour au tableau de bord
              </Link>
              <h1 className="text-3xl font-bold">Historique des présences</h1>
              <p className="text-teal-100 mt-1">Consultez et analysez les scans de présence</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <button 
                onClick={fetchHistory}
                className="inline-flex items-center px-4 py-2 bg-teal-700 bg-opacity-30 hover:bg-opacity-40 text-white rounded-lg transition-all"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="Rechercher par nom ou matricule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filterStatus === 'all' 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterStatus('onTime')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filterStatus === 'onTime' 
                    ? 'bg-white text-teal-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                À l'heure
              </button>
              <button
                onClick={() => setFilterStatus('late')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filterStatus === 'late' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                En retard
              </button>
            </div>
            
            <button 
              className="inline-flex items-center p-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Exporter les données"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mb-4"></div>
            <p className="text-gray-600">Chargement de l'historique...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-500 mb-4">
              <span className="text-xl">!</span>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={fetchHistory}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 text-gray-500 mb-4">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-gray-600">Aucun résultat trouvé pour cette recherche</p>
            {searchTerm || filterStatus !== 'all' ? (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Effacer les filtres
              </button>
            ) : null}
          </div>
        ) : (
          <div className="space-y-6">
            {dateGroups.slice(0, displayCount).map(date => (
              <div key={date} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-teal-600 mr-2" />
                    <h3 className="text-md font-medium text-gray-700">
                      {format(new Date(date), 'EEEE d MMMM yyyy', { locale: fr })}
                    </h3>
                    <div className="ml-auto bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-xs">
                      {groupedHistory[date].length} scan{groupedHistory[date].length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Heure
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Apprenant/Coach
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Matricule
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {groupedHistory[date].map((scan) => (
                        <tr key={scan.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {format(new Date(scan.scanTime), 'HH:mm', { locale: fr })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden shadow-sm">
                                {(scan.learner?.photoUrl || scan.coach?.photoUrl) ? (
                                  <Image
                                    src={scan.learner?.photoUrl || scan.coach?.photoUrl}
                                    alt="Profile"
                                    width={40}
                                    height={40}
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
                                  {scan.learner?.firstName || scan.coach?.firstName}{' '}
                                  {scan.learner?.lastName || scan.coach?.lastName}
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
                            <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full 
                              ${scan.isLate 
                                ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                                : 'bg-teal-100 text-teal-800 border border-teal-200'
                              }`}>
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
              </div>
            ))}

            {displayCount < dateGroups.length && (
              <div className="text-center py-4">
                <button 
                  onClick={loadMore}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Afficher plus d'entrées
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}