'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Referential } from '@/lib/api';
import { Users, BookOpen } from 'lucide-react';

interface ReferentialCardProps {
  referential: Referential;
}

export default function ReferentialCard({ referential }: ReferentialCardProps) {
  return (
    <Link 
      href={`/dashboard/referentials/${referential.id}`}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Image Container */}
      <div className="relative w-full h-40">
        <Image
          src={referential.photoUrl || '/placeholder-referential.png'}
          alt={referential.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content Container */}
      <div className="p-4">
        <h3 className="font-medium text-gray-800 truncate mb-2">
          {referential.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 truncate">
          {referential.description || 'Aucune description disponible'}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 text-gray-400 mr-1.5" />
            <span>{referential.learners?.length || 0} apprenants</span>
          </div>
          <div className="flex items-center text-gray-600">
            <BookOpen className="h-4 w-4 text-gray-400 mr-1.5" />
            <span>{referential.modules?.length || 0} modules</span>
          </div>
        </div>
      </div>
    </Link>
  );
}