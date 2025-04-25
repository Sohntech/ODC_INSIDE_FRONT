"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { learnersAPI, modulesAPI, referentialsAPI } from '@/lib/api';
import { 
  QrCode, Calendar, FileText, Clock, CheckCircle, XCircle, 
  Book, X, User, ChevronRight, GraduationCap, // Replace Graduation with GraduationCap
  BarChart, 
  AlertCircle, Bell, Calendar as CalendarIcon
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
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
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Nouveau module disponible", time: "Il y a 2 heures" },
    { id: 2, title: "Rappel: Devoir à rendre demain", time: "Il y a 5 heures" },
  ]);
  const [currentTab, setCurrentTab] = useState("overview");

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
            
            // Identifier les modules actifs (pour cet exemple, prenons les 2 premiers)
            if (referentialData.modules?.length) {
              setActiveModules(referentialData.modules.slice(0, 2).map(m => ({
                ...m,
                progress: Math.floor(Math.random() * 100) // Pour l'exemple
              })));
            }
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
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const calculateOverallProgress = () => {
    if (!modules.length) return 0;

    const now = new Date();

    const totalProgress = modules.reduce((acc, module) => {
      if (!module.startDate || !module.endDate) return acc;

      const startDate = new Date(module.startDate);
      const endDate = new Date(module.endDate);

      if (now < startDate) return acc; // Module hasn't started yet
      if (now > endDate) return acc + 100; // Module is completed

      // Calculate progress based on the current date
      const duration = endDate.getTime() - startDate.getTime();
      const elapsed = now.getTime() - startDate.getTime();
      const progress = Math.min((elapsed / duration) * 100, 100);

      return acc + progress;
    }, 0);

    return Math.floor(totalProgress / modules.length);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50">
      {/* Header avec profil et QR code */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Carte profil */}
        <Card className="w-full md:w-2/3 bg-white">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-teal-100">
                  {learnerDetails?.photoUrl ? (
                    <Image 
                      src={learnerDetails.photoUrl} 
                      alt="Profile" 
                      fill 
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-full w-full flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                  )}
                </Avatar>
                <Badge className="absolute -bottom-1 right-0 bg-teal-500">Actif</Badge>
              </div>
              
              <div className="flex-1 space-y-2 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-800">
                  {learnerDetails?.firstName} {learnerDetails?.lastName}
                </h1>
                <p className="text-gray-600">{learnerDetails?.address}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    {learnerDetails?.referential?.name}
                  </Badge>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                    Matricule: {learnerDetails?.matricule}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col md:flex-row gap-6 justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-teal-600" />
                    <span className="text-sm font-medium text-gray-700">Progression globale</span>
                  </div>
                  <Progress value={calculateOverallProgress()} className="h-2 bg-gray-100" />
                  <p className="text-sm text-gray-600">{calculateOverallProgress()}% complété</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {/* <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                    <GraduationCap className="h-4 w-4 mr-2" /> Mon parcours
                  </Button> */}
                  <Button 
                    onClick={() => setShowQRCode(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <QrCode className="h-4 w-4 mr-2" /> Mon QR Code
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Carte notifications */}
        {/* <Card className="w-full md:w-1/3 bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-orange-500" />
                Notifications
              </h2>
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                {notifications.length} nouvelles
              </Badge>
            </div>
            
            <div className="space-y-3">
              {notifications.map(notification => (
                <div key={notification.id} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm text-gray-800">{notification.title}</p>
                    <Badge variant="outline" className="text-xs font-normal">{notification.time}</Badge>
                  </div>
                </div>
              ))}
              
              <Button variant="ghost" className="w-full text-sm text-gray-600 hover:text-teal-600 flex items-center justify-center">
                Voir toutes les notifications
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Présences"
          value={attendanceStats?.present || 0}
          icon={<CheckCircle className="h-8 w-8 text-teal-600" />}
          bgColor="teal"
          trend={{
            value: "+5%",
            label: "ce mois",
            positive: true
          }}
        />
        <StatCard
          title="Retards"
          value={attendanceStats?.late || 0}
          icon={<Clock className="h-8 w-8 text-orange-500" />}
          bgColor="orange"
          trend={{
            value: "-2%",
            label: "ce mois",
            positive: true
          }}
        />
        <StatCard
          title="Absences"
          value={attendanceStats?.absent || 0}
          icon={<XCircle className="h-8 w-8 text-red-500" />}
          bgColor="red"
          trend={{
            value: "+1%",
            label: "ce mois",
            positive: false
          }}
        />
        <StatCard
          title="Modules"
          value={modules.length}
          icon={<Book className="h-8 w-8 text-blue-500" />}
          bgColor="blue"
          trend={{
            value: "Complet",
            label: "",
            positive: true
          }}
        />
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setCurrentTab}>
        <TabsList className="bg-white mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="modules">Tous les modules</TabsTrigger>
        </TabsList>
        
        {/* Tab Content - Overview */}
        <TabsContent value="overview" className="space-y-6">
          {/* Modules actifs */}
          <Card className="bg-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <Book className="h-5 w-5 text-teal-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Modules en cours
                  </h2>
                </div>
                <Button variant="outline" size="sm" className="text-sm">
                  Voir tout
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              {activeModules.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Aucun module actif en ce moment.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {activeModules.map((module) => (
                    <Card key={module.id} className="overflow-hidden border hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative h-32 md:h-auto md:w-1/3 bg-gray-100">
                          {module.photoUrl ? (
                            <Image 
                              src={module.photoUrl} 
                              alt={module.name} 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-r from-teal-100 to-orange-50">
                              <Book size={32} className="text-teal-600" />
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 md:w-2/3">
                          <h3 className="font-semibold text-base mb-1 group-hover:text-teal-600 transition-colors">
                            {module.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {module.description}
                          </p>
                          
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-700">Progression</span>
                              <span className="text-xs font-medium text-teal-700">{module.progress}%</span>
                            </div>
                            <Progress value={module.progress} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
          
          {/* Dernières présences */}
          {/* <Card className="bg-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Dernières présences
                  </h2>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="pb-3 text-xs font-medium text-gray-500">Date</th>
                      <th className="pb-3 text-xs font-medium text-gray-500">Module</th>
                      <th className="pb-3 text-xs font-medium text-gray-500">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {learnerDetails?.attendances?.slice(0, 5).map((attendance, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 text-sm text-gray-700">
                          {new Date(attendance.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-sm text-gray-700">
                          {attendance.module?.name || "Module inconnu"}
                        </td>
                        <td className="py-3">
                          {attendance.status === 'present' && (
                            <Badge className="bg-green-100 text-green-700">Présent</Badge>
                          )}
                          {attendance.status === 'late' && (
                            <Badge className="bg-orange-100 text-orange-700">Retard</Badge>
                          )}
                          {attendance.status === 'absent' && (
                            <Badge className="bg-red-100 text-red-700">Absent</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card> */}
        </TabsContent>
        
        {/* Tab Content - All Modules */}
        <TabsContent value="modules">
          <Card className="bg-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Book className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {modules.map((module) => (
                    <Card
                      key={module.id}
                      className="overflow-hidden border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all duration-300 cursor-pointer group"
                      onClick={() => console.log(`Module clicked: ${module.name}`)}
                    >
                      <div className="relative h-32 w-full bg-gray-100">
                        {module.photoUrl ? (
                          <Image 
                            src={module.photoUrl} 
                            alt={module.name} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gradient-to-r from-teal-100 to-orange-50">
                            <Book size={32} className="text-teal-600" />
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-base mb-1 text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1">
                          {module.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {module.description}
                        </p>
                        
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1 text-teal-600" />
                            <span>{module.duration} heure{module.duration > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        
                        {module.progress !== undefined && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">Progrès</span>
                              <span className="text-xs font-bold text-teal-600">{module.progress}%</span>
                            </div>
                            <div className="mt-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-teal-500 to-orange-400 rounded-full"
                                style={{ width: `${module.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        
        {/* Tab Content - Attendance */}
        {/* <TabsContent value="attendance">
          <Card className="bg-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-teal-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Historique des présences
                  </h2>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="pb-3 pl-4 text-xs font-medium text-gray-500">Date</th>
                      <th className="pb-3 text-xs font-medium text-gray-500">Module</th>
                      <th className="pb-3 text-xs font-medium text-gray-500">Horaire</th>
                      <th className="pb-3 text-xs font-medium text-gray-500">Statut</th>
                      <th className="pb-3 text-xs font-medium text-gray-500">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {learnerDetails?.attendances?.map((attendance, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 pl-4 text-sm text-gray-700">
                          {new Date(attendance.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-sm text-gray-700">
                          {attendance.module?.name || "Module inconnu"}
                        </td>
                        <td className="py-3 text-sm text-gray-700">
                          {attendance.checkInTime || "N/A"}
                        </td>
                        <td className="py-3">
                          {attendance.status === 'present' && (
                            <Badge className="bg-green-100 text-green-700">Présent</Badge>
                          )}
                          {attendance.status === 'late' && (
                            <Badge className="bg-orange-100 text-orange-700">Retard</Badge>
                          )}
                          {attendance.status === 'absent' && (
                            <Badge className="bg-red-100 text-red-700">Absent</Badge>
                          )}
                        </td>
                        <td className="py-3 text-sm text-gray-700">
                          {attendance.note || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent> */}
      </Tabs>

      {/* QR Code Modal with increased size */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Votre QR Code Personnel</DialogTitle>
          </DialogHeader>
          <div className="text-center p-6">
            <div className="bg-white p-4 rounded-lg inline-block shadow-sm border-2 border-teal-100">
              <img
                src={learnerDetails?.qrCode}
                alt="QR Code"
                className="w-full h-auto"
                style={{
                  minWidth: '200px',
                  maxWidth: '300px',
                  width: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-lg text-gray-800 font-medium">
                {learnerDetails?.firstName} {learnerDetails?.lastName}
              </p>
              <p className="text-sm text-gray-600">
                Matricule: {learnerDetails?.matricule}
              </p>
              <p className="text-sm text-gray-500">
                {learnerDetails?.referential?.name}
              </p>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-600">
                Scannez ce code pour valider votre présence aux cours et événements
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}