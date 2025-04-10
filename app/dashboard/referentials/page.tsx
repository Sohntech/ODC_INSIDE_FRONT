'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { referentialsAPI, promotionsAPI, Referential } from '@/lib/api';
import { Plus, Search, Book, Users, GraduationCap, Briefcase, Filter } from 'lucide-react';
import ReferentialCard from '@/components/dashboard/ReferentialCard';
import AddReferentialToPromotionModal from '@/components/modals/AddReferentialToPromotionModal';

export default function ReferentialsPage() {
  const [referentials, setReferentials] = useState<Referential[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activePromotionId, setActivePromotionId] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // First get the active promotion
      const promotions = await promotionsAPI.getAllPromotions();
      const activePromotion = promotions.find(p => p.status === 'ACTIVE');
      
      if (!activePromotion) {
        setError('Aucune promotion active trouvée');
        return;
      }

      setActivePromotionId(activePromotion.id);

      // Get detailed data for each referential in the active promotion
      const referentialPromises = activePromotion.referentials.map(async (ref) => {
        try {
          // Fetch complete referential data including learners and modules
          const detailedRef = await referentialsAPI.getReferentialById(ref.id);
          return {
            ...detailedRef,
            learners: detailedRef.learners?.filter(learner => 
              learner.promotionId === activePromotion.id
            ),
            modules: detailedRef.modules || []
          };
        } catch (error) {
          console.error(`Error fetching details for referential ${ref.id}:`, error);
          return ref; // Fallback to basic referential data if fetch fails
        }
      });

      // Wait for all referential data to be fetched
      const detailedReferentials = await Promise.all(referentialPromises);
      
      if (detailedReferentials.length > 0) {
        setReferentials(detailedReferentials);
      } else {
        setError('Aucun référentiel trouvé pour la promotion active');
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Une erreur est survenue lors du chargement des référentiels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update the filtering logic to work with the full referential objects
  const filteredReferentials = referentials.filter(referential => {
    const matchesSearch = searchQuery === '' || 
      referential.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referential.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || referential.category === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-teal-600">Référentiels</h1>
          <p className="text-gray-600">Gérer les référentiels de la promotion</p>
        </div>
      </div>

      {/* Search and Buttons */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un référentiel..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Link 
              href="/dashboard/referentials/all" 
              className="inline-flex items-center px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition-colors shadow-sm whitespace-nowrap"
            >
              <Book size={18} className="mr-2" />
              Tous les référentiels
            </Link>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus size={18} className="mr-2" />
              Ajouter à la promotion
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-40 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      ) : filteredReferentials.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Book size={40} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun référentiel trouvé</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? 'Aucun référentiel ne correspond à votre recherche'
              : 'Aucun référentiel n\'est associé à la promotion active'}
          </p>
          <Link 
            href="/dashboard/referentials/new" 
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Ajouter un référentiel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredReferentials.map(referential => (
            <ReferentialCard key={referential.id} referential={referential} />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddReferentialToPromotionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        promotionId={activePromotionId}
        onSuccess={() => {
          // Refresh data after adding referentials
          fetchData();
        }}
      />
    </div>
  );
}