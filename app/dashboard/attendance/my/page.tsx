"use client"

import { useState, useEffect } from 'react'
import { learnersAPI } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Clock, Calendar, CheckCircle2, XCircle, Search } from "lucide-react"
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Pagination from '@/components/common/Pagination'
import { toast } from "sonner"
import { attendanceAPI } from "@/lib/api"
import { AbsenceStatus } from '@/types/attendance'

// Helper function for status badges
function getStatusBadge(status: AbsenceStatus | undefined) {
  switch (status) {
    case 'TO_JUSTIFY':
      return (
        <Badge className="bg-blue-50 text-blue-700 text-xs sm:text-sm">
          À justifier
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge className="bg-yellow-50 text-yellow-700 text-xs sm:text-sm">
          En attente
        </Badge>
      );
    case 'APPROVED':
      return (
        <Badge className="bg-green-50 text-green-700 text-xs sm:text-sm">
          Justifié
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge className="bg-red-50 text-red-700 text-xs sm:text-sm">
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
    status:     "TO_JUSTIFY" | "PENDING" | "REJECTED" | "APPROVED";
  } | null>(null)
  const [justification, setJustification] = useState("")
  const [file, setFile] = useState<File | undefined>(undefined)
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, total: 0 })
  const [searchDate, setSearchDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [submitting, setSubmitting] = useState(false) // Add this state

  const filteredAttendances = attendances
    .filter(attendance => {
      if (!searchDate) return true
      return format(new Date(attendance.date), 'yyyy-MM-dd') === searchDate
    })

  const paginatedAttendances = filteredAttendances
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
          total: stats.present + stats.absent + stats.late, // Ensure 'total' is included
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

  // Nouveau hook pour vérifier les absences à justifier
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

      setSubmitting(true); // Use submitting instead of loading

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
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700"
            >
              Justifier
            </Button>
          ) : attendance.status === 'REJECTED' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleJustify(attendance)}
              className="text-xs sm:text-sm text-red-600 hover:text-red-700"
            >
              Rejustifier
            </Button>
          ) : attendance.status === 'PENDING' ? (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="text-xs sm:text-sm text-yellow-600"
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
    <div className="space-y-6 p-4 sm:p-6">
      {/* Stats Cards with Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Présences</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.present}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Retards</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.late}</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Absences</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.absent}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total jours</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table Card */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <CardTitle className="text-xl font-semibold">Historique des présences</CardTitle>
          <div className="w-full sm:w-auto flex items-center space-x-2">
            <div className="relative flex-1 sm:flex-none">
              <Input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="pl-8 pr-4 py-2 w-full sm:w-auto"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrivée</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Justification</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAttendances.map((attendance) => (
                  <tr key={attendance.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(attendance.date), 'PP', { locale: fr })}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attendance.scanTime 
                        ? format(new Date(attendance.scanTime), 'HH:mm')
                        : '-'
                      }
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {attendance.isPresent && !attendance.isLate ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200 text-xs sm:text-sm">
                          Présent
                        </Badge>
                      ) : attendance.isLate ? (
                        <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs sm:text-sm">
                          En retard
                        </Badge>
                      ) : (
                        <Badge className="bg-red-50 text-red-700 border-red-200 text-xs sm:text-sm">
                          Absent
                        </Badge>
                      )}
                    </td>
                    {renderJustificationCell(attendance)}
                    {renderActionCell(attendance)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 sm:px-6">
            <Pagination
              totalItems={filteredAttendances.length}
              initialItemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Justification Modal */}
      <Dialog open={showJustifyModal} onOpenChange={setShowJustifyModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Justifier votre {selectedAttendance?.isLate ? 'retard' : 'absence'}</DialogTitle>
            <DialogDescription>
              {selectedAttendance?.status === 'TO_JUSTIFY' 
                ? "Veuillez fournir une justification pour votre absence/retard."
                : "Veuillez soumettre une nouvelle justification."}
            </DialogDescription>
          </DialogHeader>
          
          {submitting ? (
            <div className="min-h-[200px] flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Envoi de la justification...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <Textarea
                  placeholder="Saisissez votre justification ici..."
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    Document justificatif (optionnel)
                  </p>
                  <Input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || undefined)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="cursor-pointer"
                  />
                  {file && (
                    <p className="text-sm text-gray-500">
                      Fichier sélectionné : {file.name}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowJustifyModal(false);
                    setJustification("");
                    setFile(undefined);
                  }}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={submitJustification}
                  disabled={!justification.trim()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Envoyer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper Components
function AttendanceStatus({ attendance }) {
  // Pour les présences, afficher simplement un tiret
  if (attendance.isPresent && !attendance.isLate) {
    return (
      <Badge className="bg-green-50 text-green-700 border-green-200 text-xs sm:text-sm">
        Présent
      </Badge>
    )
  }

  // Pour les retards, afficher le statut de justification
  if (attendance.isLate) {
    if (attendance.status === 'APPROVED') {
      return (
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs sm:text-sm">
            En retard
          </Badge>
          <Badge className="bg-green-50 text-green-700 text-xs sm:text-sm">
            Justifié
          </Badge>
        </div>
      )
    }
    if (attendance.status === 'PENDING') {
      return (
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs sm:text-sm">
            En retard
          </Badge>
          <Badge className="bg-yellow-50 text-yellow-700 text-xs sm:text-sm">
            En attente
          </Badge>
        </div>
      )
    }
    return (
      <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs sm:text-sm">
        En retard
      </Badge>
    )
  }

  // Pour les absences, afficher le statut de justification
  if (!attendance.isPresent) {
    if (attendance.status === 'APPROVED') {
      return (
        <div className="flex items-center gap-2">
          <Badge className="bg-red-50 text-red-700 border-red-200 text-xs sm:text-sm">
            Absent
          </Badge>
          <Badge className="bg-green-50 text-green-700 text-xs sm:text-sm">
            Justifié
          </Badge>
        </div>
      )
    }
    if (attendance.status === 'PENDING') {
      return (
        <div className="flex items-center gap-2">
          <Badge className="bg-red-50 text-red-700 border-red-200 text-xs sm:text-sm">
            Absent
          </Badge>
          <Badge className="bg-yellow-50 text-yellow-700 text-xs sm:text-sm">
            En attente
          </Badge>
        </div>
      )
    }
    return (
      <Badge className="bg-red-50 text-red-700 border-red-200 text-xs sm:text-sm">
        Absent
      </Badge>
    )
  }

  return <span className="text-gray-400">-</span>
}

function JustificationStatus({ status }) {
  if (!status) return null

  switch (status) {
    case 'APPROVED':
      return (
        <Badge className="bg-green-50 text-green-700">
          Justifié
        </Badge>
      )
    case 'PENDING':
      return (
        <Badge className="bg-yellow-50 text-yellow-700">
          En attente
        </Badge>
      )
    case 'REJECTED':
      return (
        <Badge className="bg-red-50 text-red-700">
          Rejeté
        </Badge>
      )
    default:
      return null
  }
}

// Removed duplicate implementation of getStatusBadge

// Mise à jour de la colonne Justification
<>
    // Removed duplicate implementation of getStatusBadge
    // Mise à jour de la colonne Justification
    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
        {attendanceAPI.isPresent && !attendanceAPI.isLate ? (
            <span className="text-gray-400">-</span>
        ) : (
            getStatusBadge(attendanceAPI.status)
        )}
    </td>
    // Mise à jour de la colonne Actions
    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
        {(attendanceAPI.isLate || !attendanceAPI.isPresent) && (
            attendanceAPI.status === 'TO_JUSTIFY' ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleJustify(attendanceAPI)}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700"
                >
                    Justifier
                </Button>
            ) : attendanceAPI.status === 'REJECTED' ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleJustify(attendance)}
                    className="text-xs sm:text-sm text-red-600 hover:text-red-700"
                >
                    Rejustifier
                </Button>
            ) : attendanceAPI.status === 'PENDING' ? (
                <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="text-xs sm:text-sm text-yellow-600"
                >
                    En cours
                </Button>
            ) : (
                <span className="text-gray-400">-</span>
            )
        )}
    </td></>