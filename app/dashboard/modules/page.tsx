'use client';

import { useState, useEffect } from 'react';
import { Book, Filter, Calendar, UserCheck } from 'lucide-react';
import { referentialsAPI, promotionsAPI, modulesAPI, Module, Referential } from '@/lib/api';
import { useRouter } from 'next/navigation';
import ModuleCard from '@/components/modules/ModuleCard';
import { ModuleCardSkeleton } from '@/components/skeletons/ModuleSkeleton';
import { toast } from "sonner";

export default function ModulesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [referentials, setReferentials] = useState<Referential[]>([]);
  const [selectedReferential, setSelectedReferential] = useState<string>('');
  const [activePromotion, setActivePromotion] = useState<any>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [promos, refs] = await Promise.all([
          promotionsAPI.getAllPromotions(),
          referentialsAPI.getAllReferentials()
        ]);

        const activePromo = promos.find(p => p.status === 'ACTIVE');
        setActivePromotion(activePromo);
        
        if (activePromo) {
          const filteredRefs = refs.filter(ref => 
            activePromo.referentials.some(r => r.id === ref.id)
          );
          setReferentials(filteredRefs);
          
          // Trouve le référentiel "Développement web/mobile"
          const defaultRef = filteredRefs.find(ref => 
            ref.name.toLowerCase().includes('développement web/mobile')
          );
          
          if (defaultRef) {
            setSelectedReferential(defaultRef.id);
            const modulesData = await modulesAPI.getAllModules();
            setModules(modulesData.filter(m => m.refId === defaultRef.id));
          } else if (filteredRefs.length > 0) {
            // Fallback au premier référentiel si "Développement web/mobile" n'est pas trouvé
            setSelectedReferential(filteredRefs[0].id);
            const modulesData = await modulesAPI.getAllModules();
            setModules(modulesData.filter(m => m.refId === filteredRefs[0].id));
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleReferentialChange = async (refId: string) => {
    try {
      setLoading(true);
      setSelectedReferential(refId);
      const modulesData = await modulesAPI.getAllModules();
      setModules(modulesData.filter(m => m.refId === refId));
    } catch (err) {
      console.error('Error fetching modules:', err);
      setError('Erreur lors du chargement des modules');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-teal-600">Modules</h1>
          <p className="text-gray-600">
            Gestion des modules de {activePromotion?.name || 'la promotion active'}
          </p>
        </div>

        {/* Referential Filter */}
        {!loading && !error && (
          <div className="mt-4 md:mt-0 relative w-full md:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedReferential}
              onChange={(e) => handleReferentialChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none"
            >
              {referentials.map((ref) => (
                <option key={ref.id} value={ref.id}>
                  {ref.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, index) => (
            <ModuleCardSkeleton key={index} />
          ))
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="text-orange-500 hover:text-orange-600"
            >
              Réessayer
            </button>
          </div>
        ) : modules.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucun module trouvé pour ce référentiel
          </div>
        ) : (
          modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onClick={() => router.push(`/dashboard/modules/${module.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}