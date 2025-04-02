'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { referentialsAPI, Referential } from '@/lib/api';
import { Plus, Search, Book } from 'lucide-react';
import ReferentialCard from '@/components/dashboard/ReferentialCard';

export default function ReferentialsPage() {
  const [referentials, setReferentials] = useState<Referential[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const referentialsData = await referentialsAPI.getAllReferentials();
        setReferentials(referentialsData);
      } catch (err) {
        console.error('Error fetching referentials:', err);
        setError('Une erreur est survenue lors du chargement des référentiels');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter referentials based on search query
  const filteredReferentials = referentials.filter(referential => {
    return searchQuery === '' || 
      referential.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (referential.description && 
        referential.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Référentiels</h1>
          <p className="text-gray-600">Gérer les référentiels de formation</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link 
            href="/dashboard/referentials/new" 
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Ajouter un référentiel
          </Link>
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
            placeholder="Rechercher un référentiel..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
              : 'Il n\'y a actuellement aucun référentiel dans la base de données'}
          </p>
          <Link 
            href="/dashboard/referentials/new" 
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Ajouter un référentiel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReferentials.map(referential => (
            <ReferentialCard key={referential.id} referential={referential} />
          ))}
        </div>
      )}
    </div>
  );
} 