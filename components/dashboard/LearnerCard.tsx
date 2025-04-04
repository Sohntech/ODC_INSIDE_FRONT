'use client';

import Link from 'next/link';
import { Learner } from '@/lib/api';
import { Book, Calendar, Phone } from 'lucide-react';

interface LearnerCardProps {
  learner: Learner;
}

export default function LearnerCard({ learner }: LearnerCardProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-teal-100 text-teal-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED':
        return 'bg-orange-100 text-orange-800';
      case 'REPLACED':
        return 'bg-red-100 text-red-800';
      case 'WAITING':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Actif';
      case 'INACTIVE':
        return 'Inactif';
      case 'SUSPENDED':
        return 'Suspendu';
      case 'REPLACED':
        return 'Remplacé';
      case 'WAITING':
        return 'Liste d\'attente';
      default:
        return status;
    }
  };

  // Format birth date to DD/MM/YYYY
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Link 
      href={`/dashboard/learners/${learner.id}`}
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
      
    >
      <div className="flex mb-3"
      >
        <div className="mr-3">
          {learner.photoUrl ? (
            <img 
              src={learner.photoUrl} 
              alt={`${learner.firstName} ${learner.lastName}`}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
              {learner.firstName?.[0]}{learner.lastName?.[0]}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-800">
            {learner.firstName} {learner.lastName}
          </h3>
          <div className="flex items-center mt-1">
            <span 
              className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadgeClass(learner.status)}`}
            >
              {formatStatusLabel(learner.status)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600">
          <Book className="h-4 w-4 text-gray-400 mr-1.5" />
          <span className="truncate">{learner.referential?.name || 'Pas de référentiel'}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
          <span>Né(e) le {formatDate(learner.birthDate)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Phone className="h-4 w-4 text-gray-400 mr-1.5" />
          <span>{learner.phone || 'No phone'}</span>
        </div>
      </div>
    </Link>
  );
} 