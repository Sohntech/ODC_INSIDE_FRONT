'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { learnersAPI, promotionsAPI, Learner, Promotion } from '@/lib/api';
import KitStatusBadge from '@/components/dashboard/KitStatusBadge';
import UpdateKitModal from '@/components/modals/UpdateKitModal';
import Pagination from '@/components/common/Pagination';

export default function KitsPage() {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [activePromotion, setActivePromotion] = useState<Promotion | null>(null);
  const [filteredLearners, setFilteredLearners] = useState<Learner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [referentialFilter, setReferentialFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['ACTIVE', 'REMPLACEMENT']);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [learnersData, promotionsData] = await Promise.all([
          learnersAPI.getAllLearners(),
          promotionsAPI.getAllPromotions()
        ]);

        const activePromo = promotionsData.find(p => p.status === 'ACTIVE');
        setActivePromotion(activePromo || null);
        setPromotions(promotionsData);
        setLearners(learnersData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    filterLearners();
  }, [searchQuery, referentialFilter, statusFilter, learners, activePromotion]);

  const filterLearners = () => {
    let filtered = [...learners];

    // Filter by active promotion by default
    if (activePromotion) {
      filtered = filtered.filter(learner => learner.promotionId === activePromotion.id);
    }

    // Filter by status (ACTIVE and REMPLACEMENT by default)
    filtered = filtered.filter(learner => statusFilter.includes(learner.status));

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(learner => 
        `${learner.firstName} ${learner.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        learner.matricule?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by referential
    if (referentialFilter) {
      filtered = filtered.filter(learner => 
        learner.referential?.id === referentialFilter
      );
    }

    setFilteredLearners(filtered);
  };

  const handleUpdateKit = (learnerId: string) => {
    setSelectedLearnerId(learnerId);
    setIsUpdateModalOpen(true);
  };

  const paginatedLearners = filteredLearners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status options for filter
  const statusOptions = [
    { value: 'ACTIVE', label: 'Actif' },
    { value: 'REMPLACEMENT', label: 'Remplacement' },
    { value: 'ABANDONED', label: 'Abandon' },
    { value: 'REPLACED', label: 'Remplacé' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Distribution des Kits</h1>
        <p className="mt-2 text-gray-600">
          Gestion des kits pour la promotion {activePromotion?.name || 'active'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un apprenant..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none"
              value={statusFilter}
              onChange={(e) => {
                const options = e.target.selectedOptions;
                const values = Array.from(options).map(option => option.value);
                setStatusFilter(values);
              }}
              multiple={true}
              size={1}
              style={{ height: '42px' }}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-orange-500 hover:text-orange-600"
          >
            Réessayer
          </button>
        </div>
      ) : filteredLearners.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun apprenant trouvé</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-orange-500 text-white font-bold"> 
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Apprenant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Référentiel
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Laptop
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Chargeur
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Sac
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Polo
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedLearners.map((learner) => (
                  <tr key={learner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                          {learner.photoUrl ? (
                            <img
                              src={learner.photoUrl}
                              alt={`${learner.firstName} ${learner.lastName}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-500 font-medium">
                              {learner.firstName[0]}
                              {learner.lastName[0]}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {learner.firstName} {learner.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {learner.matricule}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {learner.referential?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <KitStatusBadge received={learner.kit?.laptop} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <KitStatusBadge received={learner.kit?.charger} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <KitStatusBadge received={learner.kit?.bag} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <KitStatusBadge received={learner.kit?.polo} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleUpdateKit(learner.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Mettre à jour
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='ml-4 '>

          <Pagination
            totalItems={filteredLearners.length}
            initialItemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
          </div>
        </div>
      )}

      <UpdateKitModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        learnerId={selectedLearnerId}
        onSuccess={() => {
          const fetchLearners = async () => {
            const data = await learnersAPI.getAllLearners();
            setLearners(data);
          };
          fetchLearners();
          setIsUpdateModalOpen(false);
        }}
      />
    </div>
  );
}