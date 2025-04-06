'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { promotionsAPI } from '@/lib/api';
import { Plus, Search, Calendar, Users, Clock, Check, Bookmark, ChevronLeft, ChevronRight, MoreVertical, Filter } from 'lucide-react';

// Composant de carte de promotion amélioré pour correspondre au design de l'image
const EnhancedPromotionCard = ({ promotion }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700';
      case 'INACTIVE':
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      case 'COMPLETED':
        return 'Terminée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  // Formattage des dates pour un affichage plus convivial
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Extraire l'année de la promotion du nom ou de la date de début
  const getPromotionYear = (promotion) => {
    if (promotion.name && promotion.name.match(/\d{4}/)) {
      return promotion.name.match(/\d{4}/)[0];
    } else if (promotion.startDate) {
      return new Date(promotion.startDate).getFullYear().toString();
    }
    return '';
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="relative p-6">
        {/* Badge de statut */}
        <span className={`absolute top-6 right-6 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(promotion.status)}`}>
          {getStatusLabel(promotion.status)}
        </span>
        
        {/* En-tête de la carte avec le nom et l'année */}
        <div className="flex items-center mb-5">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
            <span className="text-orange-600 font-bold">{getPromotionYear(promotion)}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{promotion.name}</h3>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}</span>
            </div>
          </div>
        </div>
        
        {/* Tags des référentiels */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(promotion.referentials) && promotion.referentials.map((ref: string, index: number) => {
            const refString = String(ref); // Convertir en string de façon sûre
            return (
              <span key={index} className={`px-2 py-1 rounded-md text-xs font-medium
                ${refString.includes('DEV') ? 'bg-green-100 text-green-700' :
                refString.includes('DIG') ? 'bg-blue-100 text-blue-700' :
                refString.includes('AWS') ? 'bg-yellow-100 text-yellow-700' :
                'bg-purple-100 text-purple-700'}`}>
                {refString}
              </span>
            );
          })}
        </div>
        
        {/* Statistiques des apprenants */}
        <div className="flex items-center text-gray-600 mb-6">
          <Users size={16} className="mr-2" />
          <span className="text-sm">{promotion.learnerCount || 0} apprenants</span>
        </div>
        
        {/* Lien vers les détails */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <Link 
            href={`/dashboard/promotions/${promotion.id}`}
            className="text-orange-500 font-medium text-sm hover:text-orange-600 transition-colors"
          >
            Voir détails
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [classFilter, setClassFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('grid'); // 'grid' ou 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Liste des référentiels possibles
  const referentials = [
    { id: 'DEV_WEB', label: 'DEV WEB/MOBILE', color: 'bg-green-100 text-green-700' },
    { id: 'REF_DIG', label: 'REF DIG', color: 'bg-blue-100 text-blue-700' },
    { id: 'DEV_DATA', label: 'DEV DATA', color: 'bg-purple-100 text-purple-700' },
    { id: 'AWS', label: 'AWS', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'HACKEUSE', label: 'HACKEUSE', color: 'bg-pink-100 text-pink-700' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const promotionsData = await promotionsAPI.getAllPromotions();
        // Enrichissement des données pour la démo
        const enhancedData = promotionsData.map(promo => ({
          ...promo,
          learnerCount: promo.learnerCount || Math.floor(Math.random() * 30) + 5,
          description: promo.description || "Formation complète pour les apprenants du digital academy Orange.",
          referentials: promo.referentials || [
            'DEV WEB/MOBILE', 
            'REF DIG', 
            'DEV DATA', 
            Math.random() > 0.5 ? 'AWS' : '', 
            Math.random() > 0.7 ? 'HACKEUSE' : ''
          ].filter(Boolean)
        }));
        setPromotions(enhancedData);
      } catch (err) {
        console.error('Error fetching promotions:', err);
        setError('Une erreur est survenue lors du chargement des promotions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtrage des promotions selon les critères de recherche
  const filteredPromotions = promotions
    .filter(promotion => {
      return searchQuery === '' || 
        promotion.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .filter(promotion => {
      return statusFilter === null || promotion.status === statusFilter;
    })
    .filter(promotion => {
      return classFilter === null || 
        (promotion.referentials && promotion.referentials.includes(classFilter));
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPromotions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

  // Options de statut pour le filtre
  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'COMPLETED', label: 'Terminée' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Promotion</h1>
          <p className="text-gray-600 mt-1">{filteredPromotions.length} apprenants</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            className="inline-flex items-center px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium"
          >
            <Plus size={18} className="mr-2" />
            Ajouter promotion
          </button>
        </div>
      </div>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-4 rounded-full mr-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">180</h3>
              <p className="text-white text-opacity-80">Apprenants</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-gray-100 p-4 rounded-full mr-4">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800">5</h3>
              <p className="text-gray-500">Référentiels</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-gray-100 p-4 rounded-full mr-4">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800">5</h3>
              <p className="text-gray-500">Stagiaires</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-gray-100 p-4 rounded-full mr-4">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800">13</h3>
              <p className="text-gray-500">Permanent</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recherche et filtres */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        {/* Recherche */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filtres */}
        <div className="flex gap-4">
          <div className="w-48">
            <select
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={classFilter || ''}
              onChange={(e) => setClassFilter(e.target.value || null)}
            >
              <option value="">Filtre par classe</option>
              {referentials.map(ref => (
                <option key={ref.id} value={ref.label}>
                  {ref.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-48">
            <select
              className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
            >
              <option value="">Filtre par status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Basculer entre vue grille et liste */}
          <button
            className={`px-3 py-2 border border-gray-300 rounded-l-lg ${view === 'grid' ? 'bg-orange-500 text-white' : 'bg-white'}`}
            onClick={() => setView('grid')}
          >
            Grille
          </button>
          <button
            className={`px-3 py-2 border border-gray-300 rounded-r-lg ${view === 'list' ? 'bg-orange-500 text-white' : 'bg-white'}`}
            onClick={() => setView('list')}
          >
            Liste
          </button>
        </div>
      </div>
      
      {/* Contenu */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-48 animate-pulse border border-gray-100">
              <div className="flex mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-6"></div>
              <div className="flex justify-end pt-2 border-t border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 shadow-sm">
          <h3 className="font-medium mb-2">Erreur de chargement</h3>
          <p>{error}</p>
        </div>
      ) : filteredPromotions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="mx-auto w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
            <Calendar size={40} className="text-orange-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-3">Aucune promotion trouvée</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchQuery || statusFilter || classFilter
              ? 'Aucune promotion ne correspond à vos critères de recherche. Veuillez modifier vos filtres.'
              : 'Il n\'y a actuellement aucune promotion dans la base de données. Commencez par en créer une.'}
          </p>
          <button 
            className="inline-flex items-center px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium"
          >
            <Plus size={18} className="mr-2" />
            Ajouter une promotion
          </button>
        </div>
      ) : view === 'grid' ? (
        // Vue en grille
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map(promotion => (
            <EnhancedPromotionCard key={promotion.id} promotion={promotion} />
          ))}
        </div>
      ) : (
        // Vue en liste (tableau)
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promotion
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de début
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de fin
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référentiel
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((promotion, index) => (
                <tr key={promotion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800">{promotion.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promotion.startDate ? new Date(promotion.startDate).toLocaleDateString('fr-FR') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promotion.endDate ? new Date(promotion.endDate).toLocaleDateString('fr-FR') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {promotion.referentials && promotion.referentials.map((ref, idx) => (
                        <span 
                          key={idx} 
                          className={`px-2 py-0.5 rounded-md text-xs font-medium 
                            ${ref.includes('Développement web/mobile') ? 'bg-green-100 text-green-700' : 
                            ref.includes('Référent digital') ? 'bg-blue-100 text-blue-700' : 
                            ref.includes('Développement data') ? 'bg-purple-100 text-purple-700' : 
                            ref.includes('AWS & DevOps') ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-pink-100 text-pink-700'}`}
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      promotion.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      promotion.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {promotion.status === 'ACTIVE' ? 'Active' : 
                       promotion.status === 'COMPLETED' ? 'Terminée' : 
                       promotion.status === 'INACTIVE' ? 'Inactive' : 'Annulée'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {filteredPromotions.length > itemsPerPage && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            1 à {Math.min(indexOfLastItem, filteredPromotions.length)} promotion(s) pour {filteredPromotions.length}
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    currentPage === pageNum ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 3 && (
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <ChevronRight size={16} />
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Promotions/page</span>
            <select
              className="block px-2 py-1 border border-gray-300 rounded-md text-sm"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Orange Digital Center - Sonatel © 2025 Tous droits réservés.
      </div>
    </div>
  );
}