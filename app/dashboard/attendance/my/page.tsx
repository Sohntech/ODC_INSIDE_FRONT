"use client"

import { useState, useEffect } from 'react'
import { learnersAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Clock, Calendar, CheckCircle2, XCircle, Search, FileText, CalendarDays, ArrowUp, ArrowDown } from "lucide-react"
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Pagination from '@/components/common/Pagination'
import { toast } from "sonner"
import { attendanceAPI } from "@/lib/api"
import { AbsenceStatus } from '@/types/attendance'

// Helper function for status badges with new styling
function getStatusBadge(status: AbsenceStatus | undefined) {
  switch (status) {
    case 'TO_JUSTIFY':
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-1 rounded-md text-xs font-medium">
          À justifier
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 px-2 py-1 rounded-md text-xs font-medium">
          En attente
        </Badge>
      );
    case 'APPROVED':
      return (
        <Badge className="bg-teal-50 text-teal-700 border-teal-200 px-2 py-1 rounded-md text-xs font-medium">
          Justifié
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge className="bg-red-50 text-red-700 border-red-200 px-2 py-1 rounded-md text-xs font-medium">
          Rejeté
        </Badge>
      );
    default:
      return null;
  }
}

export default function MyAttendancePage() {
  const [attendances, setAttendances] = useState<{ 
    id: string, 
    date: string; 
    isPresent: boolean, 
    isLate: boolean; 
    scanTime: string | null; 
    justification?: string; 
    status: "TO_JUSTIFY" |  "PENDING" | "REJECTED" | "APPROVED"; 
  }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showJustifyModal, setShowJustifyModal] = useState(false)
  const [selectedAttendance, setSelectedAttendance] = useState<{
    id: string;
    date: string;
    isPresent: boolean;
    isLate: boolean;
    scanTime: string | null;
    justification?: string;
    status: "TO_JUSTIFY" | "PENDING" | "REJECTED" | "APPROVED";
  } | null>(null)
  const [justification, setJustification] = useState("")
  const [file, setFile] = useState<File | undefined>(undefined)
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, total: 0 })
  const [searchDate, setSearchDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [submitting, setSubmitting] = useState(false) 
  const [sortField, setSortField] = useState<'date' | 'status' | null>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // New function to handle sorting
  const handleSort = (field: 'date' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Apply sorting and filtering
  const sortedAndFilteredAttendances = [...attendances]
    .filter(attendance => {
      if (!searchDate) return true
      return format(new Date(attendance.date), 'yyyy-MM-dd') === searchDate
    })
    .sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
      } else if (sortField === 'status') {
        // Status ordering: Absent < Late < Present
        const statusA = a.isPresent ? (a.isLate ? 1 : 2) : 0
        const statusB = b.isPresent ? (b.isLate ? 1 : 2) : 0
        return sortDirection === 'asc' ? statusA - statusB : statusB - statusA
      }
      return 0
    })

  const paginatedAttendances = sortedAndFilteredAttendances
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const userStr = localStorage.getItem('user')
        if (!userStr) throw new Error('User not found')
        
        const user = JSON.parse(userStr)
        const learnerDetails = await learnersAPI.getLearnerByEmail(user.email)
        const attendanceData = learnerDetails.attendances || []
        
        setAttendances(attendanceData)
        
        // Calculate stats
        const stats = learnersAPI.calculateAttendanceStats(attendanceData)
        const updatedStats = {
          ...stats,
          total: stats.present + stats.absent + stats.late,
        }
        setStats(updatedStats)
      } catch (err) {
        console.error('Error fetching attendance:', err)
        setError('Failed to load attendance data')
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [])

  // Check for absences to justify
  useEffect(() => {
    const unjustifiedCount = attendances.filter(
      att => att.status === 'TO_JUSTIFY'
    ).length;
  
    if (unjustifiedCount > 0) {
      toast.warning(`Vous avez ${unjustifiedCount} absence(s)/retard(s) à justifier`, {
        duration: 5000,
      });
    }
  }, [attendances]);

  const handleJustify = (attendance) => {
    setSelectedAttendance(attendance)
    setShowJustifyModal(true)
  }

  const submitJustification = async () => {
    try {
      if (!selectedAttendance || !justification.trim()) {
        toast.error("Veuillez saisir une justification");
        return;
      }

      setSubmitting(true);

      await attendanceAPI.submitJustification(
        selectedAttendance.id,
        justification,
        file || undefined
      );

      // Refresh attendance data after submission
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found');
      
      const user = JSON.parse(userStr);
      const learnerDetails = await learnersAPI.getLearnerByEmail(user.email);
      setAttendances(learnerDetails.attendances || []);

      setShowJustifyModal(false);
      setJustification("");
      setFile(undefined);
      
      toast.success("Justification soumise avec succès");
    } catch (err) {
      console.error('Error submitting justification:', err);
      toast.error("Erreur lors de la soumission de la justification");
    } finally {
      setSubmitting(false);
    }
  };

  const renderJustificationCell = (attendance) => {
    return (
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
        {attendance.isPresent && !attendance.isLate ? (
          <span className="text-gray-400">-</span>
        ) : (
          getStatusBadge(attendance.status)
        )}
      </td>
    );
  };

  const renderActionCell = (attendance) => {
    return (
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
        {(attendance.isLate || !attendance.isPresent) && (
          attendance.status === 'TO_JUSTIFY' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleJustify(attendance)}
              className="text-xs border-orange-300 text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-colors"
            >
              Justifier
            </Button>
          ) : attendance.status === 'REJECTED' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleJustify(attendance)}
              className="text-xs border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            >
              Rejustifier
            </Button>
          ) : attendance.status === 'PENDING' ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="text-xs border-amber-300 text-amber-600 opacity-60"
            >
              En cours
            </Button>
          ) : (
            <span className="text-gray-400">-</span>
          )
        )}
      </td>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 bg-gray-50">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Suivi des présences</h1>
          <p className="text-gray-500 mt-1">Consultez et gérez votre historique de présence</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center gap-2">
          <Badge className="bg-teal-100 text-teal-800 border-none px-3 py-1.5">
            {stats.total} jours au total
          </Badge>
        </div>
      </div>

      {/* Stats Cards with Grid - Modern styling */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-none shadow rounded-xl overflow-hidden hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Présences</p>
                </div>
                <p className="text-3xl font-bold text-teal-700">{stats.present}</p>
                <p className="text-xs text-gray-500">
                  {Math.round((stats.present / stats.total) * 100)}% du total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow rounded-xl overflow-hidden hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Retards</p>
                </div>
                <p className="text-3xl font-bold text-orange-500">{stats.late}</p>
                <p className="text-xs text-gray-500">
                  {Math.round((stats.late / stats.total) * 100)}% du total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow rounded-xl overflow-hidden hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Absences</p>
                </div>  
                <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
                <p className="text-xs text-gray-500">
                  {Math.round((stats.absent / stats.total) * 100)}% du total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow rounded-xl overflow-hidden hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">Total jours</p>
                </div>
                <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
                <p className="text-xs text-gray-500">Jours enregistrés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table Card - Modern styling */}
      <Card className="bg-white shadow rounded-xl overflow-hidden border-none">
        <CardHeader className="p-6 border-b border-gray-100 bg-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" />
              Historique des présences
            </CardTitle>
            <div className="w-full sm:w-auto flex items-center space-x-2">
              <div className="relative flex-1 sm:flex-none">
                <Input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-auto border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortField === 'date' && (
                        sortDirection === 'asc' ? 
                          <ArrowUp className="h-3 w-3" /> : 
                          <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arrivée
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Statut
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? 
                          <ArrowUp className="h-3 w-3" /> : 
                          <ArrowDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Justification
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedAttendances.length > 0 ? (
                  paginatedAttendances.map((attendance) => (
                    <tr key={attendance.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-800">
                            {format(new Date(attendance.date), 'EEEE d MMMM yyyy', { locale: fr })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {attendance.scanTime 
                              ? format(new Date(attendance.scanTime), 'HH:mm')
                              : '-'
                            }
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attendance.isPresent && !attendance.isLate ? (
                          <Badge className="bg-teal-50 text-teal-700 border-teal-200 px-2 py-1 rounded-md text-xs font-medium">
                            Présent
                          </Badge>
                        ) : attendance.isLate ? (
                          <Badge className="bg-orange-50 text-orange-700 border-orange-200 px-2 py-1 rounded-md text-xs font-medium">
                            En retard
                          </Badge>
                        ) : (
                          <Badge className="bg-red-50 text-red-700 border-red-200 px-2 py-1 rounded-md text-xs font-medium">
                            Absent
                          </Badge>
                        )}
                      </td>
                      {renderJustificationCell(attendance)}
                      {renderActionCell(attendance)}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Calendar className="h-12 w-12 text-gray-300 mb-2" />
                        <p>Aucune donnée de présence trouvée</p>
                        {searchDate && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchDate("")}
                            className="mt-4 text-teal-600 border-teal-300 hover:bg-teal-50"
                          >
                            Effacer le filtre
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Styled */}
          {paginatedAttendances.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <Pagination
                totalItems={sortedAndFilteredAttendances.length}
                initialItemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Justification Modal - Styled */}
      <Dialog open={showJustifyModal} onOpenChange={setShowJustifyModal}>
        <DialogContent className="max-w-md bg-white rounded-xl p-0 overflow-hidden">
          <DialogHeader className="p-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <DialogTitle className="text-xl font-bold">
              Justifier votre {selectedAttendance?.isLate ? 'retard' : 'absence'}
            </DialogTitle>
            <DialogDescription className="text-teal-100 mt-1">
              {selectedAttendance?.status === 'TO_JUSTIFY' 
                ? "Veuillez fournir une justification pour votre absence/retard."
                : "Veuillez soumettre une nouvelle justification."}
            </DialogDescription>
          </DialogHeader>
          
          {submitting ? (
            <div className="min-h-[200px] flex flex-col items-center justify-center gap-4 p-6">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600">Envoi de la justification...</p>
            </div>
          ) : (
            <>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Motif de la justification
                  </label>
                  <Textarea
                    placeholder="Saisissez votre justification ici..."
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    className="min-h-[120px] border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    Document justificatif (optionnel)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-teal-400 transition-colors">
                    <Input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || undefined)}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-2 bg-teal-50 rounded-full">
                          <FileText className="h-6 w-6 text-teal-500" />
                        </div>
                        <span className="text-sm font-medium text-teal-600">
                          Cliquez pour sélectionner un fichier
                        </span>
                        <span className="text-xs text-gray-500">
                          PDF, JPEG ou PNG
                        </span>
                      </div>
                    </label>
                    {file && (
                      <div className="mt-4 p-2 bg-teal-50 rounded-lg flex items-center justify-between">
                        <span className="text-sm text-teal-700 truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                          onClick={() => setFile(undefined)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter className="p-6 border-t border-gray-100 bg-gray-50">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowJustifyModal(false);
                    setJustification("");
                    setFile(undefined);
                  }}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={submitJustification}
                  disabled={!justification.trim()}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Envoyer la justification
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}