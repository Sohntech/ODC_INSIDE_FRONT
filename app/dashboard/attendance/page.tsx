"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { attendanceAPI, learnersAPI, type Learner, type LearnerAttendance } from "@/lib/api"
import { Search, Download, MoreVertical, Users, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Pagination from '@/components/common/Pagination'
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { 
  DateFilterType, 
  AttendanceStats, 
  DATE_FILTER_OPTIONS,
  AttendanceRecord,
  AttendanceFilters
} from "./types"

// First, define the status options constant at the top of the file
const STATUS_OPTIONS = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'present', label: 'Présent' },
  { value: 'late', label: 'En retard' },
  { value: 'absent', label: 'Absent' }
] as const;

export default function AttendancePage() {
  // États pour les filtres
  const [dateFilter, setDateFilter] = useState<DateFilterType>('day')
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // États pour les données
  const [stats, setStats] = useState<AttendanceStats>({
    present: 0,
    late: 0,
    absent: 0,
    total: 0
  })
  const [attendanceRecords, setAttendanceRecords] = useState<LearnerAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Add this near your other state declarations
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);

  // Fonction pour charger les statistiques selon le filtre de date
  const fetchStats = async () => {
    try {
      setIsLoadingStats(true);
      let data;
      switch (dateFilter) {
        case 'day':
          data = await attendanceAPI.getDailyStats(selectedDate);
          break;
        case 'week':
          // Implémente la logique pour les stats hebdomadaires
          break;
        case 'month':
          const [year, month] = selectedDate.split('-');
          data = await attendanceAPI.getMonthlyStats(parseInt(year), parseInt(month));
          break;
        case 'year':
          const yearOnly = selectedDate.split('-')[0];
          data = await attendanceAPI.getYearlyStats(parseInt(yearOnly));
          break;
      }
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Effet pour charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // First fetch stats
        await fetchStats();

        try {
          const records = await attendanceAPI.getDailyStats(selectedDate);
          // Convert the stats response to the expected format
          const formattedRecords = records.attendance || [];
          if (Array.isArray(formattedRecords)) {
            setAttendanceRecords(formattedRecords);
          } else {
            console.error('Unexpected response format:', records);
            setError('Format de réponse invalide');
          }
        } catch (err: any) {
          console.error('Error fetching attendance records:', err);
          setError('Erreur lors du chargement des présences');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateFilter, selectedDate]);

  // Filtrage des enregistrements
  const filteredRecords = attendanceRecords.filter(record => {
    const nameMatch = `${record.learner.firstName} ${record.learner.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const statusMatch = 
      statusFilter === 'all' || 
      !statusFilter || 
      (statusFilter === 'present' && record.isPresent && !record.isLate) ||
      (statusFilter === 'late' && record.isLate) ||
      (statusFilter === 'absent' && !record.isPresent);

    return nameMatch && statusMatch;
  });

  // Pagination
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle exporting attendance data
  const handleExport = () => {
    alert("Fonctionnalité d'export à implémenter")
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Page header */}
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0D9488]">Présences</h1>
        <span className="ml-4 px-2 py-1 bg-[#F59E0B] text-white text-sm rounded-full">{stats.total} apprenants</span>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-orange-500 text-white"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/drxouwbms/image/upload/v1743765994/patternCard_no3lhf.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}>
          <div className="p-6 flex items-center">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mr-4">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <p className="text-4xl font-bold">{stats.total}</p>
              <p className="text-sm">Apprenants</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white text-emerald-500"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/drxouwbms/image/upload/v1743765994/patternCard_no3lhf.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}>
          <div className="p-6 flex items-center">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div>
              <p className="text-4xl font-bold">{stats.present}</p>
              <p className="text-sm">Présence(s)</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white text-amber-500"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/drxouwbms/image/upload/v1743765994/patternCard_no3lhf.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}>
          <div className="p-6 flex items-center">
            <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center mr-4">
              <Clock className="h-8 w-8" />
            </div>
            <div>
              <p className="text-4xl font-bold">{stats.late}</p>
              <p className="text-sm">Retard(s)</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white text-red-500"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/drxouwbms/image/upload/v1743765994/patternCard_no3lhf.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}>
          <div className="p-6 flex items-center">
            <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div>
              <p className="text-4xl font-bold">{stats.absent}</p>
              <p className="text-sm">Absence(s)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Date Filter */}
        <div className="flex gap-4">
          <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as DateFilterType)}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Journalier</SelectItem>
              <SelectItem value="week">Hebdomadaire</SelectItem>
              <SelectItem value="month">Mensuel</SelectItem>
              <SelectItem value="year">Annuel</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-[200px] bg-white"
          />
        </div>

        {/* Search */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Rechercher un apprenant..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter || 'all'} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px] bg-white">
            <SelectValue placeholder="Filtre par status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Export Button */}
        <Button
          variant="default"
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleExport}
        >
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Attendance table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded w-full mb-2"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun apprenant trouvé</h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter
              ? "Aucun apprenant ne correspond à vos critères de recherche"
              : "Il n'y a actuellement aucun apprenant dans la base de données"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#F97316]">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Photo
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Matricule
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Nom Complet
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Adresse
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Date & Heure
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Référentiel
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Statut
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Justification
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                        {record.learner.photoUrl ? (
                          <Image
                            src={record.learner.photoUrl}
                            alt={`${record.learner.firstName} ${record.learner.lastName}`}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-500 font-medium">
                            {record.learner.firstName?.charAt(0)}
                            {record.learner.lastName?.charAt(0)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {record.learner.matricule || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {record.learner.firstName} {record.learner.lastName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {record.learner.address || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {record.scanTime
                        ? new Date(record.scanTime).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        record.learner.referential?.name === "DEV WEB/MOBILE"
                          ? "bg-green-100 text-green-800"
                          : record.learner.referential?.name === "REF DIG"
                            ? "bg-blue-100 text-blue-800"
                            : record.learner.referential?.name === "DEV DATA"
                              ? "bg-purple-100 text-purple-800"
                              : record.learner.referential?.name === "AWS"
                                ? "bg-yellow-100 text-yellow-800"
                                : record.learner.referential?.name === "HACKEUSE"
                                  ? "bg-pink-100 text-pink-800"
                                  : "bg-gray-100 text-gray-800"
                      }`}>
                        {record.learner.referential?.name || "Non assigné"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {record.isPresent ? (
                        record.isLate ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-amber-500 text-white">
                            Retard
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-emerald-500 text-white">
                            Présent
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-500 text-white">
                          Absent
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {record.status === "PENDING" ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-amber-500 text-white">
                          En attente
                        </span>
                      ) : record.status === "ACCEPTED" ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-emerald-500 text-white">
                          Justifié
                        </span>
                      ) : record.status === "REJECTED" ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-500 text-white">
                          Non justifié
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-500 text-white">
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Voir détails</DropdownMenuItem>
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          {!record.isPresent && <DropdownMenuItem>Justifier absence</DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-700">
              <span>Apprenants/page</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[70px] h-8 ml-2">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map(value => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Replace with our custom Pagination component */}
            <Pagination
              totalItems={filteredRecords.length}
              initialItemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              onItemsPerPageChange={(newItemsPerPage) => {
                setItemsPerPage(newItemsPerPage)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">© 2025 Orange Digital Center. Tous droits réservés.</div>
    </div>
  )
}

