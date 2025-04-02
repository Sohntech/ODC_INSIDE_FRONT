'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { learnersAPI, promotionsAPI, Learner, Promotion } from '@/lib/api';
import { Plus, Search, Filter, DownloadIcon, Users } from 'lucide-react';
import LearnerCard from '@/components/dashboard/LearnerCard';

export default function LearnersPage() {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [promotionFilter, setPromotionFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch learners and promotions in parallel
        const [learnersData, promotionsData] = await Promise.all([
          learnersAPI.getAllLearners(),
          promotionsAPI.getAllPromotions()
        ]);
        
        setLearners(learnersData);
        setPromotions(promotionsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter learners based on search query, status filter, and promotion filter
  const filteredLearners = learners
    .filter(learner => {
      const fullName = `${learner.firstName} ${learner.lastName}`.toLowerCase();
      return searchQuery === '' || fullName.includes(searchQuery.toLowerCase());
    })
    .filter(learner => {
      return statusFilter === null || learner.status === statusFilter;
    })
    .filter(learner => {
      return promotionFilter === null || learner.promotionId === promotionFilter;
    });

  // Status options for filter
  const statusOptions = [
    { value: 'ACTIVE', label: 'Actif' },
    { value: 'INACTIVE', label: 'Inactif' },
    { value: 'SUSPENDED', label: 'Suspendu' },
    { value: 'REPLACED', label: 'Remplacé' },
    { value: 'WAITING_LIST', label: 'Liste d\'attente' },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Apprenants</h1>
          <p className="text-gray-600">Gérer les apprenants de l'académie</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link 
            href="/dashboard/learners/new" 
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Ajouter un apprenant
          </Link>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
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
          
          {/* Status filter */}
          <div className="w-full md:w-48">
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
            >
              <option value="">Tous les statuts</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Promotion filter */}
          <div className="w-full md:w-48">
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={promotionFilter || ''}
              onChange={(e) => setPromotionFilter(e.target.value || null)}
            >
              <option value="">Toutes les promotions</option>
              {promotions.map(promotion => (
                <option key={promotion.id} value={promotion.id}>
                  {promotion.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* View options */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              className={`px-3 py-2 ${view === 'grid' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setView('grid')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </button>
            <button
              className={`px-3 py-2 ${view === 'list' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setView('list')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list">
                <line x1="8" x2="21" y1="6" y2="6" />
                <line x1="8" x2="21" y1="12" y2="12" />
                <line x1="8" x2="21" y1="18" y2="18" />
                <line x1="3" x2="3.01" y1="6" y2="6" />
                <line x1="3" x2="3.01" y1="12" y2="12" />
                <line x1="3" x2="3.01" y1="18" y2="18" />
              </svg>
            </button>
          </div>
          
          {/* Export button */}
          <button
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <DownloadIcon size={18} className="mr-2" />
            Exporter
          </button>
        </div>
      </div>
      
      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-32 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      ) : filteredLearners.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users size={40} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun apprenant trouvé</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || statusFilter || promotionFilter
              ? 'Essayez d\'ajuster vos filtres pour trouver des apprenants'
              : 'Il n\'y a actuellement aucun apprenant dans la base de données'}
          </p>
          <Link 
            href="/dashboard/learners/new" 
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Ajouter un apprenant
          </Link>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLearners.map(learner => (
            <LearnerCard key={learner.id} learner={learner} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Apprenant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référentiel
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promotion
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLearners.map((learner) => {
                // Find the promotion this learner belongs to
                const promotion = promotions.find(p => p.id === learner.promotionId);
                
                return (
                  <tr key={learner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/dashboard/learners/${learner.id}`} className="flex items-center">
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
                          <div className="text-sm text-gray-500">
                            {learner.gender === 'MALE' ? 'Homme' : 'Femme'}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{learner.phone}</div>
                      <div className="text-sm text-gray-500">{learner.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {learner.referential?.name || 'Non assigné'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {promotion?.name || 'Non assigné'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${learner.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                          learner.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' : 
                          learner.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' :
                          learner.status === 'REPLACED' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {learner.status === 'ACTIVE' ? 'Actif' : 
                         learner.status === 'INACTIVE' ? 'Inactif' : 
                         learner.status === 'SUSPENDED' ? 'Suspendu' :
                         learner.status === 'REPLACED' ? 'Remplacé' :
                         'Liste d\'attente'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 