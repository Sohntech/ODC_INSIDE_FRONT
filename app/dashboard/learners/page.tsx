"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { learnersAPI, promotionsAPI, type Learner, type Promotion } from "@/lib/api"
import { Plus, Search, Download, Users, Grid, List, Filter, XCircle } from "lucide-react"
import LearnerCard from "@/components/dashboard/LearnerCard"
import Pagination from "@/components/common/Pagination"
import AddLearnerModal from "@/components/modals/AddLearnerModal"
import { toast } from "sonner"
import { Button } from "@headlessui/react"
import { LearnerFormSubmitData } from "@/lib/types"
import { motion } from "framer-motion"

export default function LearnersPage() {
  const [learners, setLearners] = useState<Learner[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [view, setView] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>(["ACTIVE", "REPLACEMENT"])
  const [promotionFilter, setPromotionFilter] = useState<string>("")
  const [referentialFilter, setReferentialFilter] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12) // Increased from 10 to 12 for better grid layout
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError("")

      // Fetch learners and promotions in parallel
      const [learnersData, promotionsData] = await Promise.all([
        learnersAPI.getAllLearners(),
        promotionsAPI.getAllPromotions(),
      ])

      setLearners(learnersData)
      setPromotions(promotionsData)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Une erreur est survenue lors du chargement des données")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const setActivePromotionAsDefault = async () => {
      try {
        const activePromotion = promotions.find((p) => p.status === "ACTIVE")
        if (activePromotion) {
          setPromotionFilter(activePromotion.id)
        }
      } catch (error) {
        console.error("Error setting active promotion:", error)
      }
    }

    if (promotions.length > 0) {
      setActivePromotionAsDefault()
    }
  }, [promotions])

  // Filter learners based on search query, status filter, and promotion filter
  const filteredLearners = learners
    .filter((learner) => {
      const fullName = `${learner.firstName} ${learner.lastName}`.toLowerCase()
      return searchQuery === "" || fullName.includes(searchQuery.toLowerCase())
    })
    .filter((learner) => {
      return statusFilter.length === 0 || statusFilter.includes(learner.status)
    })
    .filter((learner) => {
      return !promotionFilter || learner.promotionId === promotionFilter
    })
    .filter((learner) => {
      return !referentialFilter || learner.referential?.id === referentialFilter
    })

  // Status options for filter
  const statusOptions = [
    { value: "ACTIVE", label: "Actif" },
    { value: "WAITING", label: "En attente" },
    { value: "ABANDONED", label: "Abandon" },
    { value: "REPLACEMENT", label: "Remplacement" },
    { value: "REPLACED", label: "Remplacé" },
  ]

  // Add this function near your other utility functions
  const getReferentialBadgeClass = (referentialName: string) => {
    switch (referentialName) {
      case "AWS & DevOps":
        return "bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 px-3 py-1 w-fit rounded-lg font-medium"

      case "Développement web/mobile":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-lg font-medium"

      case "Assistanat Digital (Hackeuse)":
        return "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 px-3 py-1 rounded-lg font-medium"

      case "Développement data":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 px-3 py-1 rounded-lg font-medium"

      case "Référent digital":
        return "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 px-3 py-1 rounded-lg font-medium"

      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 px-3 py-1 rounded-lg font-medium"
    }
  }

  // Add this function near your other utility functions
  const getReferentialAlias = (referentialName: string) => {
    switch (referentialName) {
      case "AWS & DevOps":
        return "AWS"

      case "Développement web/mobile":
        return "DEV WEB/MOBILE"

      case "Assistanat Digital (Hackeuse)":
        return "HACKEUSE"

      case "Développement data":
        return "DEV DATA"

      case "Référent digital":
        return "REF DIG"

      default:
        return referentialName
    }
  }

  // Create a helper function for status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
      case "WAITING":
        return "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 border border-blue-200"
      case "ABANDONED":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200"
      case "REPLACEMENT":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200"
      case "REPLACED":
        return "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-200"
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200"
    }
  }

  // Update the status label formatter
  const formatStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Actif"
      case "WAITING":
        return "En attente"
      case "ABANDONED":
        return "Abandon"
      case "REPLACEMENT":
        return "Remplacement"
      case "REPLACED":
        return "Remplacé"
      default:
        return "Inconnu"
    }
  }

  // Ajoutez cette fonction helper avec les autres fonctions helpers
  const getPromotionYear = (promotionName: string | undefined) => {
    if (!promotionName) return "N/A"
    // Utilise une regex pour trouver un nombre à 4 chiffres (année)
    const match = promotionName.match(/\d{4}/)
    return match ? match[0] : "N/A"
  }

  // Add this near your other state declarations
  const uniqueReferentials = useMemo(() => {
    const referentials = learners
      .map((l) => l.referential)
      .filter(Boolean)
      .reduce((unique: any[], ref) => {
        if (!unique.find((r) => r.id === ref?.id)) {
          unique.push(ref)
        }
        return unique
      }, [])

    return referentials.sort((a, b) => a.name.localeCompare(b.name))
  }, [learners])

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredLearners.slice(indexOfFirstItem, indexOfLastItem)

  // Handle pagination changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter(["ACTIVE", "REPLACEMENT"])
    setReferentialFilter("")
    const activePromotion = promotions.find((p) => p.status === "ACTIVE")
    if (activePromotion) {
      setPromotionFilter(activePromotion.id)
    } else {
      setPromotionFilter("")
    }
  }

  async function handleAddLearner(data: LearnerFormSubmitData) {
    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      
      // Format de la date de naissance
      const birthDate = new Date(data.birthDate);
      const formattedBirthDate = birthDate.toISOString(); // Format: YYYY-MM-DDTHH:mm:ss.sssZ

      // Ajouter la photo
      if (data.photoFile && data.photoFile instanceof File) {
        formData.append('photoFile', data.photoFile);
      }

      // Ajouter les champs de base de l'apprenant
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('gender', data.gender);
      formData.append('birthDate', formattedBirthDate);
      formData.append('birthPlace', data.birthPlace);
      formData.append('promotionId', data.promotionId);
      formData.append('refId', data.refId);
      formData.append('status', data.status);

      // Ajouter les champs du tuteur
      formData.append('tutor[firstName]', data.tutor.firstName);
      formData.append('tutor[lastName]', data.tutor.lastName);
      formData.append('tutor[phone]', data.tutor.phone);
      formData.append('tutor[email]', data.tutor.email || '');
      formData.append('tutor[address]', data.tutor.address);

      // Log pour déboguer
      console.log('Données envoyées:', {
        formData: Object.fromEntries(formData.entries()),
        photoFile: data.photoFile ? data.photoFile.name : 'Pas de photo'
      });

      const response = await learnersAPI.createLearner(formData);
      
      if (response) {
        toast.success("Apprenant ajouté avec succès", {
          description: `${data.firstName} ${data.lastName} a été ajouté à la promotion`,
        });
        setShowAddModal(false);
        await fetchData();
      }
    } catch (error: any) {
      console.error('Error details:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'ajout de l\'apprenant';
      toast.error("Erreur lors de l'ajout de l'apprenant", {
        description: error.response?.data?.message || "Veuillez réessayer",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusUpdate(id: string, status: string, reason?: string) {
    try {
      // ...existing code...
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  }

  const activeFiltersCount = 
    (statusFilter.length < 5 ? 1 : 0) + 
    (promotionFilter ? 1 : 0) + 
    (referentialFilter ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="pb-12">
      {/* Page header with modern styling */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="inline-block mr-2">💫</span>
            Apprenants
          </h1>
          <p className="text-orange-100 mt-1">Gérer votre communauté d'apprenants</p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm py-1 px-3 rounded-full text-sm font-medium">
            {filteredLearners.length} apprenants
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-white text-orange-600 rounded-full hover:bg-orange-50 transition-colors shadow-md font-medium"
          >
            <Plus size={18} className="mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Search and filters - modern design with expandable filter section */}
      <div className="mb-6 bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search - with modern styling */}
          <div className="flex-grow md:flex-grow-0 md:w-1/3 lg:w-1/4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-orange-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un apprenant..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Toggle filters button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-all duration-200"
          >
            <Filter size={16} />
            <span>Filtres</span>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white text-xs font-medium rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* View options with modern toggle */}
          <div className="flex rounded-full overflow-hidden border border-gray-200 ml-auto">
            <button
              className={`p-2 flex items-center justify-center transition-all duration-200 ${view === "grid" ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setView("grid")}
            >
              <Grid size={16} />
            </button>
            <button
              className={`p-2 flex items-center justify-center transition-all duration-200 ${view === "list" ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setView("list")}
            >
              <List size={16} />
            </button>
          </div>

          {/* Export button */}
          <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-all duration-200 rounded-full text-gray-700">
            <Download size={16} className="mr-2" />
            Exporter
          </button>
        </div>

        {/* Expandable filters section */}
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            <div className="flex flex-wrap gap-4">
              {/* Referential filter */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Référentiel</label>
                <select
                  className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={referentialFilter}
                  onChange={(e) => setReferentialFilter(e.target.value)}
                >
                  <option value="">Tous les référentiels</option>
                  {uniqueReferentials.map((ref) => (
                    <option key={ref?.id} value={ref?.id}>
                      {getReferentialAlias(ref?.name || "")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={statusFilter}
                  onChange={(e) => {
                    const options = e.target.selectedOptions
                    const values = Array.from(options).map((option) => option.value)
                    setStatusFilter(values)
                  }}
                  multiple={true}
                  size={1}
                  style={{ height: "42px" }}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Promotion filter */}
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Promotion</label>
                <select
                  className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  value={promotionFilter}
                  onChange={(e) => setPromotionFilter(e.target.value)}
                >
                  <option value="">Toutes les promotions</option>
                  {promotions
                    .sort((a, b) => (b.status === "ACTIVE" ? 1 : -1))
                    .map((promotion) => (
                      <option key={promotion.id} value={promotion.id}>
                        {promotion.name} {promotion.status === "ACTIVE" ? "(Active)" : ""}
                      </option>
                    ))}
                </select>
              </div>

              {/* Reset filters button */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <XCircle size={16} className="mr-2" />
                  Réinitialiser
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Content with modern styling */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 h-32 animate-pulse border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 flex items-center">
          <div className="mr-4 bg-red-100 rounded-full p-2">
            <XCircle size={24} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-medium">Une erreur est survenue</h3>
            <p>{error}</p>
          </div>
        </div>
      ) : filteredLearners.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="mx-auto w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
            <Users size={40} className="text-orange-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">Aucun apprenant trouvé</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchQuery || statusFilter.length < 5 || promotionFilter || referentialFilter
              ? "Essayez d'ajuster vos filtres pour trouver des apprenants"
              : "Il n'y a actuellement aucun apprenant dans la base de données"}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full hover:from-orange-600 hover:to-amber-600 transition-all shadow-md"
          >
            <Plus size={18} className="mr-2" />
            Ajouter un apprenant
          </motion.button>
        </div>
      ) : view === "grid" ? (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {currentItems.map((learner, index) => (
              <motion.div
                key={learner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <LearnerCard learner={learner} />
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-6">
            <Pagination
              totalItems={filteredLearners.length}
              initialItemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Apprenant
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Genre
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Matricule
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Référentiel
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentItems.map((learner, index) => {
                  // Find the promotion this learner belongs to
                  const promotion = promotions.find((p) => p.id === learner.promotionId)

                  return (
                    <motion.tr 
                      key={learner.id} 
                      className="hover:bg-orange-50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/dashboard/learners/${learner.id}`} className="flex items-center">
                          {learner.photoUrl ? (
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden ring-2 ring-orange-100">
                              <img
                                src={learner.photoUrl || "/placeholder.svg"}
                                alt={`${learner.firstName} ${learner.lastName}`}
                                className="h-10 w-10 object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-medium">
                              {`${learner.firstName.charAt(0)}${learner.lastName.charAt(0)}`}
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {learner.firstName} {learner.lastName}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          <span
                            className={`px-2 py-1 inline-flex text-xs font-medium rounded-full ${
                              learner.gender === "MALE" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                            }`}
                          >
                            {learner.gender === "MALE" ? "Homme" : "Femme"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{learner.matricule || "Non assigné"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{learner.phone}</div>
                        <div className="text-sm text-gray-500">{learner.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm ${getReferentialBadgeClass(learner.referential?.name || "Non assigné")}`}
                        >
                          {getReferentialAlias(learner.referential?.name || "Non assigné")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-medium rounded-lg ${getStatusBadgeClass(learner.status)}`}
                        >
                          {formatStatusLabel(learner.status)}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Pagination
              totalItems={filteredLearners.length}
              initialItemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </>
      )}

      {/* Stylized and modern modal */}
      <AddLearnerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        promotions={promotions}
        referentials={uniqueReferentials}
        onSubmit={handleAddLearner}
      />

      {/* Floating action button for mobile */}
      <div className="md:hidden fixed bottom-6 right-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg"
        >
          <Plus size={24} />
        </motion.button>
      </div>
    </div>
  )
}