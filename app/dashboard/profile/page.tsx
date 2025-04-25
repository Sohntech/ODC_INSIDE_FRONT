"use client"

import { useState, useEffect } from "react"
import { User, Phone, Mail, MapPin, Calendar, BookOpen, School, Package, FileText, ChevronRight, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { learnersAPI } from "@/lib/api"
import type { LearnerDetails} from "@/lib/api"
import { UserCircle, GraduationCap, PackageCheck, Files } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const [learnerDetails, setLearnerDetails] = useState<LearnerDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchLearnerData = async () => {
      try {
        // Get user email from localStorage
        const userStr = localStorage.getItem('user')
        if (!userStr) {
          throw new Error('User data not found')
        }

        const user = JSON.parse(userStr)
        if (!user?.email) {
          throw new Error('User email not found')
        }

        const details = await learnersAPI.getLearnerByEmail(user.email)
        setLearnerDetails(details)
      } catch (err: any) {
        console.error('Error fetching learner data:', err)
        setError(err.message || 'Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchLearnerData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-16 h-16 relative">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="w-10 h-10 absolute top-3 left-3 border-4 border-orange-400 border-t-transparent rounded-full animate-spin-slow"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-red-50 text-red-600 p-6 rounded-xl text-center shadow-sm border border-red-100"
        >
          <p className="font-medium">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </motion.div>
      </div>
    )
  }

  if (!learnerDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-orange-50 text-orange-600 p-6 rounded-xl text-center shadow-sm border border-orange-100"
        >
          <p className="font-medium">Aucune donnée disponible</p>
        </motion.div>
      </div>
    )
  }

  return <LearnerProfile learner={learnerDetails} />
}

function LearnerProfile({ learner }: { learner: LearnerDetails }) {
  const [activeTab, setActiveTab] = useState("personal")

  const getKitProgress = () => {
    if (!learner.kit) return 0
    const items = Object.values(learner.kit)
    const total = items.length
    const received = items.filter(Boolean).length
    return (received / total) * 100
  }

  // Background gradient pattern
  const headerStyle = {
    backgroundImage: 'linear-gradient(135deg, rgba(0, 178, 169, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div 
      className="space-y-6 max-w-7xl mx-auto px-4 pt-4 pb-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Profile Header with gradient background */}
      <motion.div 
        variants={cardVariants}
        className="rounded-2xl overflow-hidden shadow-lg"
        style={headerStyle}
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Photo with decorative elements */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-orange-500 rounded-full opacity-25 blur-lg transform scale-110"></div>
              <div className="h-32 w-32 sm:h-36 sm:w-36 rounded-full overflow-hidden border-4 border-white shadow-xl relative">
                {learner.photoUrl ? (
                  <img
                    src={learner.photoUrl}
                    alt={`${learner.firstName} ${learner.lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {learner.firstName?.[0]}
                      {learner.lastName?.[0]}
                    </span>
                  </div>
                )}
              </div>
              <Badge
                className="absolute bottom-1 right-1 px-3 py-1 shadow-md"
                variant={learner.status === "ACTIVE" ? "success" : "secondary"}
              >
                {learner.status}
              </Badge>
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {learner.firstName} {learner.lastName}
                </h1>
                <button className="bg-white/70 hover:bg-white text-gray-600 px-2 py-1 rounded-full flex items-center justify-center gap-1 text-sm transition-colors mx-auto md:mx-0 w-24">
                  <Edit className="h-3 w-3" />
                  Modifier
                </button>
              </div>
              <p className="text-gray-600 mt-1 flex items-center justify-center md:justify-start gap-1">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-sm">Matricule: {learner.matricule}</span>
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 px-3 py-1 shadow-sm">
                  <School className="h-3 w-3 mr-1 inline" /> {learner.referential?.name}
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1 shadow-sm">
                  <Calendar className="h-3 w-3 mr-1 inline" /> {learner.promotion?.name}
                </Badge>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden lg:grid grid-cols-2 gap-4 bg-white/80 p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date de naissance</p>
                  <p className="font-medium">{new Date(learner.birthDate).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{learner.user?.email}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-6 bg-white/80 rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Progression du programme</span>
              <span className="text-sm font-medium text-teal-600">60%</span>
            </div>
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-500 to-orange-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
              {/* Milestones */}
              <div className="flex justify-between mt-1 px-1">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-teal-600 mt-[-8px]"></div>
                  <span className="text-[10px] text-gray-500">Début</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-teal-600 mt-[-8px]"></div>
                  <span className="text-[10px] text-gray-500">Semestre 1</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-orange-400 mt-[-8px]"></div>
                  <span className="text-[10px] text-gray-500">Semestre 2</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-gray-400 mt-[-8px]"></div>
                  <span className="text-[10px] text-gray-500">Fin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Tabs with animation and styling */}
      <Tabs defaultValue="personal" className="space-y-4">
        <motion.div variants={cardVariants}>
          <TabsList className="grid grid-cols-4 gap-1 bg-white shadow-md rounded-xl p-1 border border-gray-100">
            <TabsTrigger 
              value="personal" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-50 data-[state=active]:to-teal-100 data-[state=active]:text-teal-700 rounded-lg flex flex-col items-center justify-center py-3 transition-all duration-300"
            >
              <span className="sm:hidden flex flex-col items-center">
                <UserCircle className="h-6 w-6" />
                <span className="text-[10px] mt-1">Infos</span>
              </span>
              <span className="hidden sm:block text-sm font-medium">
                Infos Personnelles
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="academic" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-50 data-[state=active]:to-teal-100 data-[state=active]:text-teal-700 rounded-lg flex flex-col items-center justify-center py-3 transition-all duration-300"
            >
              <span className="sm:hidden flex flex-col items-center">
                <GraduationCap className="h-6 w-6" />
                <span className="text-[10px] mt-1">Études</span>
              </span>
              <span className="hidden sm:block text-sm font-medium">
                Infos Académiques
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="kit" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-50 data-[state=active]:to-orange-100 data-[state=active]:text-orange-700 rounded-lg flex flex-col items-center justify-center py-3 transition-all duration-300"
            >
              <span className="sm:hidden flex flex-col items-center">
                <PackageCheck className="h-6 w-6" />
                <span className="text-[10px] mt-1">Kit</span>
              </span>
              <span className="hidden sm:block text-sm font-medium">
                Kit ODC
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="documents" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-50 data-[state=active]:to-orange-100 data-[state=active]:text-orange-700 rounded-lg flex flex-col items-center justify-center py-3 transition-all duration-300"
            >
              <span className="sm:hidden flex flex-col items-center">
                <Files className="h-6 w-6" />
                <span className="text-[10px] mt-1">Docs</span>
              </span>
              <span className="hidden sm:block text-sm font-medium">
                Documents
              </span>
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Tab Content */}
        <div className="mt-4 sm:mt-6">
          <TabsContent value="personal" className="space-y-6">
            <motion.div variants={cardVariants}>
              <Card className="overflow-hidden border border-gray-100 shadow-md rounded-xl">
                <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-teal-50 to-white border-b border-gray-100">
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <User className="h-5 w-5 text-teal-600" />
                    <span>Informations Personnelles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 p-6 grid-cols-1 sm:grid-cols-2">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Genre</p>
                      <p className="font-medium text-gray-900">{learner.gender}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-900">{learner.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{learner.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Adresse</p>
                      <p className="font-medium text-gray-900">{learner.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date de naissance</p>
                      <p className="font-medium text-gray-900">{new Date(learner.birthDate).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Lieu de naissance</p>
                      <p className="font-medium text-gray-900">{learner.birthPlace}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Card className="overflow-hidden border border-gray-100 shadow-md rounded-xl">
                <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-white border-b border-gray-100">
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <User className="h-5 w-5 text-orange-600" />
                    <span>Information du Tuteur</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 p-6 grid-cols-1 sm:grid-cols-2">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nom complet</p>
                      <p className="font-medium text-gray-900">{learner.tutor?.firstName} {learner.tutor?.lastName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-900">{learner.tutor?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{learner.tutor?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Adresse</p>
                      <p className="font-medium text-gray-900">{learner.tutor?.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <motion.div variants={cardVariants}>
              <Card className="border border-gray-100 shadow-md rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
                  <h3 className="text-lg font-medium">Programme Académique</h3>
                  <p className="text-teal-100 text-sm mt-1">Suivez votre parcours éducatif et vos accomplissements</p>
                </div>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 hover:border-teal-200 transition-colors relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-20 w-20 bg-teal-100 rounded-bl-full opacity-30"></div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-100 rounded-xl">
                          <School className="h-8 w-8 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-xl text-gray-900">Promotion</h3>
                          <p className="text-lg text-orange-600 font-medium mt-1">{learner.promotion?.name}</p>
                          <p className="text-sm text-gray-500 mt-2 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {learner.promotion?.startDate && 
                              `Début: ${new Date(learner.promotion?.startDate).toLocaleDateString("fr-FR")}`
                            }
                          </p>
                          <div className="mt-4 flex">
                            <button className="text-teal-600 text-sm flex items-center hover:underline">
                              Voir les détails
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 hover:border-orange-200 transition-colors relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-20 w-20 bg-orange-100 rounded-bl-full opacity-30"></div>
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-teal-100 rounded-xl">
                          <BookOpen className="h-8 w-8 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-xl text-gray-900">Référentiel</h3>
                          <p className="text-lg text-teal-600 font-medium mt-1">{learner.referential?.name}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {learner.referential?.description}
                          </p>
                          <div className="mt-4 flex">
                            <button className="text-orange-600 text-sm flex items-center hover:underline">
                              Explorer le programme
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Academic timeline */}
                  <div className="mt-8">
                    <h3 className="font-medium text-gray-900 mb-4">Parcours académique</h3>
                    <div className="relative">
                      {/* Timeline */}
                      <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 to-orange-500"></div>
                      
                      {/* Timeline items */}
                      <div className="space-y-6">
                        <div className="flex relative">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white shadow-md relative z-10">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <div className="ml-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-1">
                            <h4 className="font-medium text-gray-900">Début de la formation</h4>
                            <p className="text-sm text-gray-500">12 septembre 2024</p>
                          </div>
                        </div>
                        
                        <div className="flex relative">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-teal-400 flex items-center justify-center text-white shadow-md relative z-10">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div className="ml-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-1">
                            <h4 className="font-medium text-gray-900">Fin du premier module</h4>
                            <p className="text-sm text-gray-500">15 octobre 2024</p>
                          </div>
                        </div>
                        
                        <div className="flex relative">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-md relative z-10">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="ml-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-1">
                            <h4 className="font-medium text-gray-900">Stage d'observation</h4>
                            <p className="text-sm text-gray-500">5 décembre 2024</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="kit" className="space-y-6">
            <motion.div variants={cardVariants}>
              <Card className="border border-gray-100 shadow-md rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        Kit ODC
                      </h3>
                      <p className="text-orange-100 text-sm mt-1">Matériel fourni pour votre formation</p>
                    </div>
                    <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {Math.round(getKitProgress())}%
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Progression du kit</span>
                        <span className="text-sm font-medium text-orange-600">{Math.round(getKitProgress())}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full p-0.5 overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-700 ease-in-out"
                          style={{ width: `${getKitProgress()}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className={`flex flex-col rounded-xl overflow-hidden shadow-sm border ${learner.kit?.laptop ? 'border-green-200' : 'border-gray-200'}`}>
                        <div className={`p-4 ${learner.kit?.laptop ? 'bg-green-50' : 'bg-gray-50'} border-b border-gray-100 flex justify-between items-center`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${learner.kit?.laptop ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                              <Package className="h-5 w-5" />
                            </div>
                            <span className="font-medium">Ordinateur portable</span>
                          </div>
                          <Badge variant={learner.kit?.laptop ? "success" : "secondary"} className="px-3">
                            {learner.kit?.laptop ? "Reçu" : "Non reçu"}
                          </Badge>
                        </div>
                        <div className="p-4 bg-white">
                          <div className="flex items-center text-sm text-gray-500">
                            <div className={`h-3 w-3 rounded-full mr-2 ${learner.kit?.laptop ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span>{learner.kit?.laptop ? 'Remis le 15/09/2024' : 'En attente'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`flex flex-col rounded-xl overflow-hidden shadow-sm border ${learner.kit?.charger ? 'border-green-200' : 'border-gray-200'}`}>
                        <div className={`p-4 ${learner.kit?.charger ? 'bg-green-50' : 'bg-gray-50'} border-b border-gray-100 flex justify-between items-center`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${learner.kit?.charger ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                              <Package className="h-5 w-5" />
                            </div>
                            <span className="font-medium">Chargeur</span>
                          </div>
                          <Badge variant={learner.kit?.charger ? "success" : "secondary"} className="px-3">
                            {learner.kit?.charger ? "Reçu" : "Non reçu"}
                          </Badge>
                        </div>
                        <div className="p-4 bg-white">
                          <div className="flex items-center text-sm text-gray-500">
                            <div className={`h-3 w-3 rounded-full mr-2 ${learner.kit?.charger ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span>{learner.kit?.charger ? 'Remis le 15/09/2024' : 'En attente'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`flex flex-col rounded-xl overflow-hidden shadow-sm border ${learner.kit?.bag ? 'border-green-200' : 'border-gray-200'}`}>
                        <div className={`p-4 ${learner.kit?.bag ? 'bg-green-50' : 'bg-gray-50'} border-b border-gray-100 flex justify-between items-center`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${learner.kit?.bag ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                              <Package className="h-5 w-5" />
                            </div>
                            <span className="font-medium">Sac</span>
                          </div>
                          <Badge variant={learner.kit?.bag ? "success" : "secondary"} className="px-3">
                            {learner.kit?.bag ? "Reçu" : "Non reçu"}
                          </Badge>
                        </div>
                        <div className="p-4 bg-white">
                          <div className="flex items-center text-sm text-gray-500">
                            <div className={`h-3 w-3 rounded-full mr-2 ${learner.kit?.bag ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span>{learner.kit?.bag ? 'Remis le 20/09/2024' : 'En attente'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`flex flex-col rounded-xl overflow-hidden shadow-sm border ${learner.kit?.polo ? 'border-green-200' : 'border-gray-200'}`}>
                        <div className={`p-4 ${learner.kit?.polo ? 'bg-green-50' : 'bg-gray-50'} border-b border-gray-100 flex justify-between items-center`}>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${learner.kit?.polo ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                              <Package className="h-5 w-5" />
                            </div>
                            <span className="font-medium">Polo</span>
                          </div>
                          <Badge variant={learner.kit?.polo ? "success" : "secondary"} className="px-3">
                            {learner.kit?.polo ? "Reçu" : "Non reçu"}
                          </Badge>
                        </div>
                        <div className="p-4 bg-white">
                          <div className="flex items-center text-sm text-gray-500">
                            <div className={`h-3 w-3 rounded-full mr-2 ${learner.kit?.polo ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span>{learner.kit?.polo ? 'Remis le 22/09/2024' : 'En attente'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Conditions d'utilisation du kit */}
                    <div className="mt-8 bg-orange-50 border border-orange-100 rounded-xl p-4">
                      <h4 className="font-medium text-orange-800 flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Rappel important
                      </h4>
                      <p className="text-sm text-orange-700">
                        Tout le matériel fourni reste la propriété d'Orange Digital Center pendant toute la durée de votre formation. Veuillez en prendre soin et signaler tout problème au responsable de votre promotion.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <motion.div variants={cardVariants}>
                <Card className="border border-gray-100 shadow-md rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
                    <h3 className="text-lg font-medium flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Documents
                    </h3>
                    <p className="text-teal-100 text-sm mt-1">Vos documents administratifs et pédagogiques</p>
                  </div>
                  <CardContent className="p-6">
                    {Array.isArray(learner.documents) && learner.documents.length > 0 ? (
                      <div className="grid gap-4">
                        {learner.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-teal-200 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
                                <FileText className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{doc.name}</p>
                                <p className="text-sm text-gray-500 flex items-center">
                                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${doc.type === 'PDF' ? 'bg-red-500' : doc.type === 'DOCX' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                                  {doc.type}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg flex items-center transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Voir
                              </a>
                              <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg flex items-center transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Télécharger
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="h-16 w-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-500 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">Aucun document disponible</h4>
                        <p className="text-gray-500 max-w-sm">
                          Vos documents seront ajoutés ici par l'administration au cours de votre formation.
                        </p>
                        <button className="mt-6 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center transition-colors mx-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Soumettre un document
                        </button>
                      </div>
                    )}
                    
                    {/* Carte de documents récents */}
                    <div className="mt-8">
                      <h4 className="font-medium text-gray-900 mb-4">Documents récents</h4>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="divide-y divide-gray-100">
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-red-50 rounded-md text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="text-sm">
                                <p className="font-medium text-gray-900">Règlement intérieur</p>
                                <p className="text-xs text-gray-500">Téléchargé il y a 2 jours</p>
                              </div>
                            </div>
                            <a href="#" className="text-teal-600 hover:text-teal-700">Voir</a>
                          </div>
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 rounded-md text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="text-sm">
                                <p className="font-medium text-gray-900">Calendrier de formation</p>
                                <p className="text-xs text-gray-500">Téléchargé il y a 1 semaine</p>
                              </div>
                            </div>
                            <a href="#" className="text-teal-600 hover:text-teal-700">Voir</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Formulaires supplémentaires */}
              <motion.div variants={cardVariants}>
                <Card className="border border-gray-100 shadow-md rounded-xl overflow-hidden">
                  <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-white border-b border-gray-100">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <FileText className="h-5 w-5 text-orange-600" />
                      <span>Formulaires à remplir</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-orange-200 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <h5 className="font-medium">Demande d'attestation</h5>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          Formulaire de demande d'attestation de suivi de formation
                        </p>
                        <button className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-sm transition-colors">
                          Remplir le formulaire
                        </button>
                      </div>
                      
                      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-teal-200 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <h5 className="font-medium">Mise à jour des informations</h5>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          Mettre à jour vos coordonnées personnelles ou celles de votre tuteur
                        </p>
                        <button className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-sm transition-colors">
                          Mettre à jour
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
        
        {/* Footer Card with Contact Info */}
        <motion.div variants={cardVariants}>
          <Card className="border border-gray-100 shadow-md rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Besoin d'aide ?</p>
                    <p className="font-medium">Contactez votre responsable pédagogique</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 border border-teal-200 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors">
                    Envoyer un message
                  </button>
                  <button className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors">
                    Prendre rendez-vous
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    )
  }



