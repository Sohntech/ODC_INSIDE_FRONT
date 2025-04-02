"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coffee, Clock, Users, CheckCircle, ChevronDown, QrCode } from 'lucide-react';
import { attendanceAPI, learnersAPI } from '@/lib/api';
import StatCard from '@/components/dashboard/StatCard';

export default function RestaurateurDashboard() {
  const [mealStats, setMealStats] = useState({
    totalLearners: 0,
    breakfast: 0,
    lunch: 0,
  });
  const [recentMeals, setRecentMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    stats: true,
    meals: true,
  });
  const [error, setError] = useState({
    stats: '',
    meals: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // In a real app, this would be an API call to get meal stats
        // Here we simulate it with placeholder data
        setMealStats({
          totalLearners: 250,
          breakfast: 180,
          lunch: 210,
        });
        setLoading(prev => ({ ...prev, stats: false }));
      } catch (err) {
        console.error('Error fetching meal stats:', err);
        setError(prev => ({ ...prev, stats: 'Failed to load meal statistics' }));
        setLoading(prev => ({ ...prev, stats: false }));
      }

      try {
        // In a real app, this would be an API call to get recent meals
        // Here we simulate it with placeholder data
        setRecentMeals(generateFakeMeals(10));
        setLoading(prev => ({ ...prev, meals: false }));
      } catch (err) {
        console.error('Error fetching recent meals:', err);
        setError(prev => ({ ...prev, meals: 'Failed to load recent meals' }));
        setLoading(prev => ({ ...prev, meals: false }));
      }
    };

    fetchData();
  }, []);

  // Helper to generate fake meal data
  const generateFakeMeals = (count: number) => {
    const names = [
      { firstName: 'Amadou', lastName: 'Diallo' },
      { firstName: 'Fatou', lastName: 'Sow' },
      { firstName: 'Ibrahima', lastName: 'Ndiaye' },
      { firstName: 'Aissatou', lastName: 'Diop' },
      { firstName: 'Moussa', lastName: 'Gueye' },
    ];
    
    const types = ['BREAKFAST', 'LUNCH'];
    const refs = ['Développement Web', 'AWS Cloud', 'Data Science'];
    
    return Array(count).fill(0).map((_, i) => {
      const name = names[Math.floor(Math.random() * names.length)];
      return {
        id: `meal-${i}`,
        learner: {
          id: `learner-${i}`,
          firstName: name.firstName,
          lastName: name.lastName,
          referential: { name: refs[Math.floor(Math.random() * refs.length)] }
        },
        type: types[Math.floor(Math.random() * types.length)],
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
      };
    });
  };

  // Calculate percentage of served breakfast
  const breakfastPercentage = mealStats.totalLearners > 0
    ? Math.round((mealStats.breakfast / mealStats.totalLearners) * 100)
    : 0;
    
  // Calculate percentage of served lunch
  const lunchPercentage = mealStats.totalLearners > 0
    ? Math.round((mealStats.lunch / mealStats.totalLearners) * 100)
    : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Restaurateur</h1>
        <p className="text-gray-600">Gestion des repas</p>
      </div>
      
      {/* Quick Action Button */}
      <div className="mb-6">
        <Link 
          href="/dashboard/meals/scan" 
          className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-lg font-medium"
        >
          <QrCode className="mr-2 h-6 w-6" />
          Scanner pour un repas
        </Link>
      </div>
      
      {/* Date selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date
        </label>
        <div className="relative w-full md:w-64">
          <input 
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            className="block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title="Total Apprenants" 
          value={mealStats.totalLearners} 
          icon={<Users className="h-8 w-8 text-blue-500" />} 
          loading={loading.stats}
        />
        <StatCard 
          title="Petit déjeuner servis" 
          value={mealStats.breakfast} 
          icon={<Coffee className="h-8 w-8 text-orange-500" />} 
          suffix={`${breakfastPercentage}%`}
          loading={loading.stats}
        />
        <StatCard 
          title="Déjeuners servis" 
          value={mealStats.lunch} 
          icon={<Clock className="h-8 w-8 text-green-500" />} 
          suffix={`${lunchPercentage}%`}
          loading={loading.stats}
        />
      </div>
      
      {/* Meal Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de repas
        </label>
        <div className="relative w-full md:w-64">
          <select
            defaultValue="ALL"
            className="block w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="ALL">Tous les repas</option>
            <option value="BREAKFAST">Petit déjeuner</option>
            <option value="LUNCH">Déjeuner</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>
      
      {/* Recent Meals */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Repas Récents</h2>
          <Link 
            href="/dashboard/meals/history" 
            className="text-orange-500 hover:text-orange-700 text-sm font-medium"
          >
            Voir tout l'historique
          </Link>
        </div>
        
        {loading.meals ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : error.meals ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error.meals}
          </div>
        ) : recentMeals.length === 0 ? (
          <div className="bg-gray-50 text-gray-500 p-4 rounded-lg text-center">
            Aucun repas récent
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apprenant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentMeals.map((meal) => (
                  <tr key={meal.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                          {meal.learner.firstName?.[0]}{meal.learner.lastName?.[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {meal.learner.firstName} {meal.learner.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {meal.learner.referential?.name || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(meal.timestamp).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(meal.timestamp).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          meal.type === 'BREAKFAST' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {meal.type === 'BREAKFAST' ? 'Petit déjeuner' : 'Déjeuner'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Meal Distribution Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Statistiques des repas</h2>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-700 mb-2">Taux de petit déjeuner</h3>
            <div className="relative pt-1">
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200">
                <div 
                  style={{ width: `${breakfastPercentage}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"
                ></div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold inline-block text-orange-500">
                  {breakfastPercentage}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-gray-50 p-4 rounded-lg mt-4 md:mt-0">
            <h3 className="text-md font-medium text-gray-700 mb-2">Taux de déjeuner</h3>
            <div className="relative pt-1">
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200">
                <div 
                  style={{ width: `${lunchPercentage}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                ></div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold inline-block text-green-500">
                  {lunchPercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 