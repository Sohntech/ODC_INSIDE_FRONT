"use client"

import { useState, useEffect } from "react"
import { User, Phone, Mail, MapPin, Calendar, BookOpen, School, Package, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { learnersAPI } from "@/lib/api"
import type { LearnerDetails} from "@/lib/api"
import { UserCircle, GraduationCap, PackageCheck, Files } from 'lucide-react'

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
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!learnerDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <div className="bg-orange-50 text-orange-600 p-4 rounded-lg text-center">
          <p>Aucune donnée disponible</p>
        </div>
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* Profile Header - Amélioré pour mobile */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 sm:gap-6">
            {/* Photo - Centré sur mobile */}
            <div className="relative flex-shrink-0">
              <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                {learner.photoUrl ? (
                  <img
                    src={learner.photoUrl}
                    alt={`${learner.firstName} ${learner.lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-teal-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {learner.firstName?.[0]}
                      {learner.lastName?.[0]}
                    </span>
                  </div>
                )}
              </div>
              <Badge
                className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2"
                variant={learner.status === "ACTIVE" ? "success" : "secondary"}
              >
                {learner.status}
              </Badge>
            </div>

            {/* Basic Info - Amélioré pour mobile */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {learner.firstName} {learner.lastName}
              </h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                Matricule: {learner.matricule}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge variant="outline" className="bg-teal-50 text-teal-700 text-xs sm:text-sm">
                  {learner.referential?.name}
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs sm:text-sm">
                  {learner.promotion?.name}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs - Optimisé pour mobile avec icônes */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-1 bg-transparent p-1 rounded-lg border border-gray-100">
          <TabsTrigger 
            value="personal" 
            className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 rounded-md flex flex-col items-center justify-center py-3"
          >
            <span className="sm:hidden flex flex-col items-center">
              <UserCircle className="h-6 w-6" />
              <span className="text-[10px] mt-1">Infos</span>
            </span>
            <span className="hidden sm:block text-sm">
              Infos Personnelles
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="academic" 
            className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 rounded-md flex flex-col items-center justify-center py-3"
          >
            <span className="sm:hidden flex flex-col items-center">
              <GraduationCap className="h-6 w-6" />
              <span className="text-[10px] mt-1">Études</span>
            </span>
            <span className="hidden sm:block text-sm">
              Infos Académiques
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="kit" 
            className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 rounded-md flex flex-col items-center justify-center py-3"
          >
            <span className="sm:hidden flex flex-col items-center">
              <PackageCheck className="h-6 w-6" />
              <span className="text-[10px] mt-1">Kit</span>
            </span>
            <span className="hidden sm:block text-sm">
              Kit ODC
            </span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="documents" 
            className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 rounded-md flex flex-col items-center justify-center py-3"
          >
            <span className="sm:hidden flex flex-col items-center">
              <Files className="h-6 w-6" />
              <span className="text-[10px] mt-1">Docs</span>
            </span>
            <span className="hidden sm:block text-sm">
              Documents
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Ajoutez ces styles pour le contenu des tabs */}
        <div className="mt-2 sm:mt-6">
          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Informations Personnelles</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-4 sm:p-6 grid-cols-1 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Genre</p>
                    <p>{learner.gender}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Téléphone</p>
                    <p>{learner.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{learner.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Adresse</p>
                    <p>{learner.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date de naissance</p>
                    <p>{new Date(learner.birthDate).toLocaleDateString("fr-FR")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Lieu de naissance</p>
                    <p>{learner.birthPlace}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Information du Tuteur</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-4 sm:p-6 grid-cols-1 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom complet</p>
                    <p>{learner.tutor?.firstName} {learner.tutor?.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Téléphone</p>
                    <p>{learner.tutor?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{learner.tutor?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Adresse</p>
                    <p>{learner.tutor?.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <School className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Promotion</h3>
                      <p className="text-gray-500">{learner.promotion?.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {learner.promotion?.startDate && 
                          `Début: ${new Date(learner.promotion?.startDate).toLocaleDateString("fr-FR")}`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-teal-50 rounded-lg">
                      <BookOpen className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Référentiel</h3>
                      <p className="text-gray-500">{learner.referential?.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {learner.referential?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Kit ODC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progression du kit</span>
                    <span className="text-sm font-medium">{Math.round(getKitProgress())}%</span>
                  </div>
                  <Progress value={getKitProgress()} className="h-2" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Ordinateur portable</span>
                    <Badge variant={learner.kit?.laptop ? "success" : "secondary"}>
                      {learner.kit?.laptop ? "Reçu" : "Non reçu"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Chargeur</span>
                    <Badge variant={learner.kit?.charger ? "success" : "secondary"}>
                      {learner.kit?.charger ? "Reçu" : "Non reçu"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Sac</span>
                    <Badge variant={learner.kit?.bag ? "success" : "secondary"}>
                      {learner.kit?.bag ? "Reçu" : "Non reçu"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Polo</span>
                    <Badge variant={learner.kit?.polo ? "success" : "secondary"}>
                      {learner.kit?.polo ? "Reçu" : "Non reçu"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {Array.isArray(learner.documents) && learner.documents.length > 0 ? (
                  <div className="grid gap-4">
                    {learner.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-500">{doc.type}</p>
                          </div>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700"
                        >
                          Voir
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Aucun document disponible
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}