'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { modulesAPI, Module, Learner, Grade, gradesAPI } from '@/lib/api';
import { CalendarDays, Users, GraduationCap, Book, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { ModuleDetailsSkeleton, GradesTableSkeleton } from '@/components/skeletons/ModuleSkeleton';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/utils/imageUrl';

export default function ModuleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [module, setModule] = useState<Module | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        setLoading(true);
        const [moduleData, gradesData] = await Promise.all([
          modulesAPI.getModuleById(params.id as string),
          gradesAPI.getGradesByModule(params.id as string)
        ]);
        setModule(moduleData);
        setGrades(gradesData);
      } catch (err) {
        console.error('Error fetching module details:', err);
        setError('Erreur lors du chargement des détails du module');
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetails();
  }, [params.id]);

  const getGradeStatus = (value: number) => {
    if (value >= 10) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Validé
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
        Non validé
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ModuleDetailsSkeleton />
        <GradesTableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-orange-500 hover:text-orange-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-orange-500 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Retour aux modules
      </button>

      {/* Module Details Card */}
      <div className="bg-teal-500 rounded-lg shadow-lg p-1">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-start gap-6">
            {/* Module Image */}
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {module?.photoUrl ? (
                <img
                  src={getImageUrl(module.photoUrl)}
                  alt={module.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full flex items-center justify-center bg-orange-50';
                      const icon = document.createElement('div');
                      icon.innerHTML = '<svg class="w-12 h-12 text-orange-300">...</svg>';
                      fallback.appendChild(icon);
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-50">
                  <Book className="w-12 h-12 text-orange-300" />
                </div>
              )}
            </div>

            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{module?.name}</h1>
              <p className="text-gray-600 mb-6">{module?.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-orange-50">
                    <CalendarDays className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Période</p>
                    <p className="font-medium">
                      {format(new Date(module?.startDate || ''), 'dd MMM yyyy', { locale: fr })} - 
                      {format(new Date(module?.endDate || ''), 'dd MMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-teal-50">
                    <Users className="w-5 h-5 text-teal-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Référentiel</p>
                    <p className="font-medium">{module?.referential?.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-orange-50">
                    <GraduationCap className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Coach</p>
                    <p className="font-medium">
                      {module?.coach 
                        ? `${module.coach.firstName} ${module.coach.lastName}`
                        : 'Non assigné'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-orange-500">
          <h2 className="text-lg font-semibold text-white">Notes des apprenants</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Apprenant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  État
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commentaire
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* Photo de l'apprenant */}
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-orange-500">
                        {grade.learner.photoUrl ? (
                          <img
                            src={getImageUrl(grade.learner.photoUrl)}
                            alt={`${grade.learner.firstName} ${grade.learner.lastName}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/images/default-avatar.png'; // Add a default avatar image
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-orange-50 text-orange-500 text-lg font-semibold">
                            {grade.learner.firstName[0]}
                            {grade.learner.lastName[0]}
                          </div>
                        )}
                      </div>
                      {/* Informations de l'apprenant */}
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {grade.learner.firstName} {grade.learner.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {grade.learner.matricule}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-semibold">{grade.value}/20</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getGradeStatus(grade.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {grade.comment || '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}