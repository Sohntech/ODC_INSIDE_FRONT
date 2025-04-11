'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from "next/navigation"
import { referentialsAPI } from '@/lib/api'
import { Book, Users, ArrowLeft, Calendar, Phone, MapPin, Clock, Loader2, AlertCircle, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ReferentialDetailsSkeleton } from '@/components/skeletons/ReferentialDetailsSkeleton';
import AddModuleModal from '@/components/modals/AddModuleModal';

export default function ReferentialDetailsPage() {
  const { id } = useParams()
  const [referential, setReferential] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(['ACTIVE', 'REMPLACEMENT']);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);

  const STATUS_OPTIONS = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'WAITING', label: 'En attente' },
    { value: 'ABANDONED', label: 'Abandon' },
    { value: 'REMPLACEMENT', label: 'Remplacement' },
    { value: 'REPLACED', label: 'Remplacé' }
  ];

  const fetchReferential = async () => {
    try {
      setLoading(true)
      if (typeof id === 'string') {
        const data = await referentialsAPI.getReferentialById(id)
        setReferential(data)
      } else {
        throw new Error('Invalid id format')
      }
    } catch (err) {
      console.error('Error fetching referential:', err)
      setError('Une erreur est survenue lors du chargement du référentiel')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReferential()
  }, [id])

  const filteredLearners = referential?.learners?.filter(learner => {
    const matchesSearch = 
      searchQuery === '' || 
      `${learner.firstName} ${learner.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      learner.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const validStatus = learner.status === 'ACTIVE' || learner.status === 'REMPLACEMENT';
    
    // Check if learner belongs to active promotion
    const belongsToActivePromotion = learner.promotionId === referential.promotions?.[0]?.id;
    
    return matchesSearch && validStatus && belongsToActivePromotion;
  }) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredLearners.length / itemsPerPage);
  const currentLearners = filteredLearners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <ReferentialDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Une erreur est survenue</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link
            href="/dashboard/referentials"
            className="inline-flex items-center text-orange-500 hover:text-orange-600"
          >
            
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux référentiels
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-teal-600">Référentiels</h1>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-orange-500">Détails</span>
          </div>
        </div>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            {referential.photoUrl ? ( 
              <Image
                src={referential.photoUrl}
                alt={referential.name}
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-orange-100 rounded-lg flex items-center justify-center">
                <Book className="h-12 w-12 text-orange-500" />
              </div>
            )}
            <div>
            
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{referential.name}</h1>
              <p className="text-gray-600 max-w-2xl">{referential.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Section - Updated design */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Modules</h2>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
              {referential.modules?.length || 0} modules
            </span>
            <button
              onClick={() => setIsAddModuleModalOpen(true)}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un module
            </button>
          </div>
        </div>
        
        {!referential.modules?.length ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun module</h3>
            <p className="text-gray-500">Aucun module n'a été ajouté à ce référentiel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {referential.modules.map((module) => (
              <div 
                key={module.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-32 relative">
                  {module.photoUrl ? (
                    <Image
                      src={module.photoUrl}
                      alt={module.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full bg-orange-50 flex items-center justify-center">
                      <Book className="h-8 w-8 text-orange-300" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-base mb-2">{module.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{module.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex bg-green-50 text-green-600 rounded-md px-2 py-1 items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(module.startDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                    <div className="flex bg-red-50 text-red-600 rounded-md px-2 py-1 items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(module.endDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Module Modal */}
      <AddModuleModal
        isOpen={isAddModuleModalOpen}
        onClose={() => setIsAddModuleModalOpen(false)}
        refId={typeof id === 'string' ? id : ''}
        onSuccess={() => {
          // Refresh the referential data
          fetchReferential();
        }}
      />

      {/* Learners Section - Updated filtering */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Apprenants</h2>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            {filteredLearners.length} apprenants actifs
          </span>
        </div>

        {!referential.learners?.length ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun apprenant</h3>
            <p className="text-gray-500">Aucun apprenant n'est inscrit dans ce référentiel.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Apprenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Adresse
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentLearners.map((learner) => (
                    <tr key={learner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {learner.photoUrl ? (
                            <Image
                              src={learner.photoUrl}
                              alt={`${learner.firstName} ${learner.lastName}`}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <span className="text-orange-600 font-medium">
                                {learner.firstName[0]}
                                {learner.lastName[0]}
                              </span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {learner.firstName} {learner.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{learner.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-1" />
                          {learner.phone || 'Non renseigné'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {learner.address || 'Non renseignée'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${learner.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                          learner.status === 'WAITING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                          {learner.status === 'ACTIVE' ? 'Actif' :
                           learner.status === 'WAITING' ? 'En attente' : 'Abandonné'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}