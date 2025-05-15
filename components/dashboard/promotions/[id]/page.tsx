'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Users, ArrowLeft, BookOpen } from 'lucide-react';
import { Promotion, Referential } from '@/lib/api';

interface PromotionDetailProps {
  params: {
    id: string;
  };
}

export default function PromotionDetail({ params }: PromotionDetailProps) {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [referentials, setReferentials] = useState<Referential[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch promotion data
    const fetchPromotion = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        const res = await fetch(`/api/promotions/${params.id}`);
        const data = await res.json();
        setPromotion(data);
        
        // Fetch referentials associated with this promotion
        if (data.referentialIds && data.referentialIds.length > 0) {
          const refsRes = await fetch(`/api/referentials?ids=${data.referentialIds.join(',')}`);
          const refsData = await refsRes.json();
          setReferentials(refsData);
        }
      } catch (error) {
        console.error('Failed to load promotion:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [params.id]);

  // Format date to DD/MM/YYYY
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status label
  const formatStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'COMPLETED':
        return 'Terminée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Promotion non trouvée</h1>
        <Link href="/dashboard/promotions" className="text-teal-600 hover:text-teal-800 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux promotions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb & Back button */}
      <div className="mb-6">
        <Link href="/dashboard/promotions" className="text-teal-600 hover:text-teal-800 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux promotions
        </Link>
      </div>

      {/* Promotion Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          {/* Promotion image */}
          <div className="md:w-1/3 relative h-64 md:h-auto">
            {promotion.photoUrl ? (
              <Image
                src={promotion.photoUrl}
                alt={promotion.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                <Users className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Promotion details */}
          <div className="p-6 md:w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{promotion.name}</h1>
              <span
                className={`px-3 py-1 text-sm rounded-full ${getStatusBadgeClass(promotion.status)}`}
              >
                {formatStatusLabel(promotion.status)}
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 text-teal-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Période</p>
                  <p className="text-sm">{formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Users className="h-5 w-5 text-teal-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Apprenants</p>
                  <p className="text-sm">{promotion.learners?.length || 0} inscrits</p>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Description</h2>
              <p className="text-gray-600">{promotion.description || "Aucune description disponible."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referentials Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Référentiels associés</h2>
        
        {referentials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {referentials.map((referential) => (
              <ReferentialCard key={referential.id} referential={referential} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Aucun référentiel associé à cette promotion.</p>
          </div>
        )}
      </div>
      
      {/* Learners Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Apprenants</h2>
        
        {promotion.learners && promotion.learners.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promotion.learners.map((learner) => (
                  <tr key={learner.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          {learner.photoUrl ? (
                            <Image
                              src={learner.photoUrl}
                              alt={`${learner.firstName} ${learner.lastName}`}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                              <span className="text-teal-600 text-sm font-medium">
                                {learner.firstName?.[0] || ''}
                                {learner.lastName?.[0] || ''}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {learner.firstName} {learner.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {learner.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {learner.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/dashboard/learners/${learner.id}`}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        Voir détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <Users className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Aucun apprenant inscrit à cette promotion.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ReferentialCard Component (réutilisé à partir de votre code)
function ReferentialCard({ referential }: { referential: Referential }) {
  return (
    <Link 
      href={`/dashboard/referentials/${referential.id}`}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow max-w-full"
    >
      {/* Image Container with programming bubbles */}
      <div className="relative w-full border-8 border-white h-40 bg-white">
        <Image
          src={referential.photoUrl || '/placeholder-referential.png'}
          alt={referential.name}
          fill
          className="object-cover rounded-xl"
        />
      </div>

      {/* Content Container */}
      <div className="p-3">
        {/* Title with teal color */}
        <h3 className="font-medium text-teal-600 text-sm mb-1">
          {referential.name}
        </h3>
        
        {/* Modules count */}
        <p className="text-gray-800 mb-1 font-medium text-xs">
          {referential.modules?.length || 0} modules
        </p>
        
        {/* Description */}
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
          {referential.description || 'Le développeur web mobile crée, écrit, teste et documente des applications mobiles, des sites web...'}
        </p>
        
        {/* Green divider */}
        <div className="h-0.5 w-12 bg-teal-500 mb-2"></div>
        
        {/* Profile images and learners count */}
        <div className="flex items-center">
          {/* Circle avatars */}
          <div className="flex -space-x-1.5 mr-2">
            {/* First learner */}
            {referential.learners && referential.learners[0]?.photoUrl ? (
              <div className="w-5 h-5 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src={referential.learners[0].photoUrl}
                  alt="First learner avatar"
                  width={20}
                  height={20}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-300 border-2 border-white" />
            )}
            
            {/* Second learner */}
            {referential.learners && referential.learners[1]?.photoUrl ? (
              <div className="w-5 h-5 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src={referential.learners[1].photoUrl}
                  alt="Second learner avatar"
                  width={20}
                  height={20}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-400 border-2 border-white" />
            )}
            
            {/* Third learner */}
            {referential.learners && referential.learners[2]?.photoUrl ? (
              <div className="w-5 h-5 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src={referential.learners[2].photoUrl}
                  alt="Third learner avatar"
                  width={20}
                  height={20}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-500 border-2 border-white" />
            )}
          </div>
          
          {/* Learners count */}
          <span className="text-xs text-teal-600 font-medium">
            {referential.learners?.length || 0} apprenants
          </span>
        </div>
      </div>
    </Link>
  );
}