"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { learnersAPI, modulesAPI, referentialsAPI } from '@/lib/api';
import { QrCode, Calendar, FileText, Clock, CheckCircle, XCircle, Book, X } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { LearnerDetails, AttendanceStats, Module } from '@/lib/api';
import ModuleCard from '@/components/modules/ModuleCard';

export default function LearnerDashboard() {
  const [learnerDetails, setLearnerDetails] = useState<LearnerDetails | null>(null);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [activeModules, setActiveModules] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    learner: true,
    stats: true,
    modules: true,
  });
  const [error, setError] = useState({
    learner: '',
    stats: '',
    modules: '',
  });
  const [showQRCode, setShowQRCode] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user email from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error('User data not found');
        }

        const user = JSON.parse(userStr);
        if (!user?.email) {
          throw new Error('User email not found');
        }

        // Get learner details directly by email
        const details = await learnersAPI.getLearnerByEmail(user.email);
        if (details) {
          setLearnerDetails(details);
          
          // Calculate attendance stats
          const stats = learnersAPI.calculateAttendanceStats(details.attendances);
          setAttendanceStats(stats);
          
          // Récupérer les modules directement depuis le referential du learner
          if (details.referential?.id) {
            const referentialData = await referentialsAPI.getReferentialById(details.referential.id);
            setModules(referentialData.modules || []);
          }
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError({
          learner: err.response?.data?.message || 'Failed to load learner data',
          stats: 'Failed to load attendance statistics',
          modules: 'Failed to load modules'
        });
      } finally {
        setLoading({
          learner: false,
          stats: false,
          modules: false
        });
      }
    };

    fetchData();
  }, []);

  if (loading.learner) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-teal-600">
            Bienvenue, {learnerDetails?.firstName || 'Apprenant'}
          </h1>
          <p className="text-gray-600">Votre tableau de bord ODC Inside</p>
        </div>
      </div>

      {/* QR Code Card */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Votre QR Code Personnel
            </h2>
            <p className="text-gray-600">
              Utilisez ce code pour pointer votre présence et accéder aux services
            </p>
            <button
              onClick={() => setShowQRCode(true)}
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <QrCode className="mr-2 h-5 w-5" />
              Afficher en plein écran
            </button>
          </div>
          <div className="relative">
            <div className="h-32 w-32 md:h-40 md:w-40 bg-white p-2 rounded-lg border-2 border-teal-200">
              <img
                src={learnerDetails?.qrCode}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Présences"
          value={attendanceStats?.present || 0}
          icon={<CheckCircle className="h-8 w-8 text-teal-600" />}
          bgColor="teal"
        />
        <StatCard
          title="Retards"
          value={attendanceStats?.late || 0}
          icon={<Clock className="h-8 w-8 text-orange-500" />}
          bgColor="orange"
        />
        <StatCard
          title="Absences"
          value={attendanceStats?.absent || 0}
          icon={<XCircle className="h-8 w-8 text-red-500" />}
          bgColor="red"
        />
        <StatCard
          title="Modules"
          value={modules.length}
          icon={<Book className="h-8 w-8 text-blue-500" />}
          bgColor="blue"
        />
      </div>

      {/* Modules Section */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Book className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Modules du référentiel
                </h2>
                <p className="text-sm text-gray-500">
                  {learnerDetails?.referential?.name}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
              {modules.length} modules
            </span>
          </div>
          
          {modules.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun module trouvé pour ce référentiel
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  onClick={() => console.log(`Module clicked: ${module.name}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal avec taille augmentée */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
          <div className="text-center p-8">
            <h2 className="text-2xl font-semibold mb-6">Votre QR Code</h2>
            <div className="bg-white p-8 rounded-lg inline-block shadow-lg">
              <img
                src={learnerDetails?.qrCode}
                alt="QR Code"
                className="w-full h-auto"
                style={{
                  minWidth: '200px',
                  maxWidth: '400px',
                  width: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div className="mt-8 space-y-3">
              <p className="text-xl text-gray-700 font-medium">
                {learnerDetails?.firstName} {learnerDetails?.lastName}
              </p>
              <p className="text-lg text-gray-600">
                Matricule: {learnerDetails?.matricule}
              </p>
              <p className="text-base text-gray-500">
                {learnerDetails?.referential?.name}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}