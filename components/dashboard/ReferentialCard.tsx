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
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow max-w-xs"
    >
      {/* Image Container with programming bubbles */}
      <div className="relative w-full border-8  border-white h-48 bg-white">
        {/* Colored tech bubbles will be part of the background image */}
        <Image
          src={referential.photoUrl || '/placeholder-referential.png'}
          alt={referential.name}
          fill
          className="object-cover rounded-t-2xl"
        />
      </div>

      {/* Content Container */}
      <div className="p-5">
        {/* Title with teal color */}
        <h3 className="font-medium text-teal-600 text-lg mb-1">
          {referential.name}
        </h3>
        
        {/* Modules count */}
        <p className="text-gray-800 mb-3 font-medium">
          {referential.modules?.length || 12} modules
        </p>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {referential.description || 'Le développeur web mobile crée, écrit, teste et documente des applications mobiles, des sites web...'}
        </p>
        
        {/* Green divider */}
        <div className="h-0.5 w-16 bg-teal-500 mb-4"></div>
        
        {/* Profile images and learners count */}
        <div className="flex items-center">
          {/* Circle avatars */}
          <div className="flex -space-x-2 mr-3">
            {/* First learner */}
            {referential.learners && referential.learners[0]?.photoUrl ? (
              <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src={referential.learners[0].photoUrl}
                  alt="First learner avatar"
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white" />
            )}
            
            {/* Second learner */}
            {referential.learners && referential.learners[1]?.photoUrl ? (
              <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src={referential.learners[1].photoUrl}
                  alt="Second learner avatar"
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white" />
            )}
            
            {/* Third learner */}
            {referential.learners && referential.learners[2]?.photoUrl ? (
              <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                <Image
                  src={referential.learners[2].photoUrl}
                  alt="Third learner avatar"
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-500 border-2 border-white" />
            )}
          </div>
          
          {/* Learners count */}
          <span className="text-sm text-teal-600 font-medium">
            {referential.learners?.length || 0} apprenants
          </span>
        </div>
      </div>
    </Link>
  );
}