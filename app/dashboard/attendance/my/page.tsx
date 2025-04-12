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

export default function MyAttendancePage() {
  const [attendances, setAttendances] = useState<{ 
    id: string; 
    date: string; 
    isPresent: boolean; 
    isLate: boolean; 
    scanTime: string | null; 
    justification?: string; 
    status: "PENDING" | "REJECTED" | "APPROVED"; 
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
    status: "PENDING" | "REJECTED" | "APPROVED";
  } | null>(null)
  const [justification, setJustification] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, total: 0 })
  const [searchDate, setSearchDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

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

  const handleJustify = (attendance) => {
    setSelectedAttendance(attendance)
    setShowJustifyModal(true)
  }

  const submitJustification = async () => {
    try {
      // Add your API call here to submit justification
      // await attendanceAPI.submitJustification(selectedAttendance.id, justification, file)
      setShowJustifyModal(false)
      setJustification("")
      setFile(null)
      // Refresh attendance data
    } catch (err) {
      console.error('Error submitting justification:', err)
    }
  }

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
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {attendance.isPresent && !attendance.isLate ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <JustificationStatus status={attendance.status} />
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                      {(attendance.isLate || !attendance.isPresent) &&
                       attendance.status !== 'APPROVED' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleJustify(attendance)}
                          className="text-xs sm:text-sm"
                        >
                          Justifier
                        </Button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
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
              Veuillez fournir une justification et joindre un document si nécessaire.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Saisissez votre justification ici..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
            />
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJustifyModal(false)}>
              Annuler
            </Button>
            <Button onClick={submitJustification}>
              Envoyer
            </Button>
          </DialogFooter>
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