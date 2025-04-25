"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { coachAPI } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EnhancedDataTable } from '@/components/ui/enhanced-data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Users, 
  GraduationCap,
  ChevronDown,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

const statusOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'ACTIVE', label: 'Actifs' },
  { value: 'REPLACED', label: 'Remplacés' },
  { value: 'REPLACEMENT', label: 'Remplaçants' }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return <CheckCircle className="h-4 w-4 mr-1" />;
    case 'REPLACED':
      return <XCircle className="h-4 w-4 mr-1" />;
    case 'REPLACEMENT':
      return <AlertTriangle className="h-4 w-4 mr-1" />;
    default:
      return null;
  }
};

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100';
    case 'REPLACED':
      return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
    case 'REPLACEMENT':
      return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'Actif';
    case 'REPLACED':
      return 'Remplacé';
    case 'REPLACEMENT':
      return 'Remplaçant';
    default:
      return status;
  }
};

interface Learner {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
  status: string;
  averageGrade?: number;
}

export default function CoachLearners() {
  const router = useRouter();
  const [learners, setLearners] = useState<Learner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const columns: ColumnDef<Learner>[] = [
    {
      accessorKey: 'matricule',
      header: ({ column }) => (
        <div className="flex items-center space-x-1">
          <span>Matricule</span>
          <ArrowUpDown 
            className="h-4 w-4 text-gray-400 cursor-pointer" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      ),
      cell: ({ row }) => (
        <span className="font-medium text-gray-700">{row.original.matricule}</span>
      )
    },
    {
      accessorKey: 'learner',
      header: 'Apprenant',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
            {row.original.photoUrl ? (
              <img
                src={row.original.photoUrl}
                alt={`${row.original.firstName} ${row.original.lastName}`}
                className="h-10 w-10 object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {row.original.firstName[0]}{row.original.lastName[0]}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800">{row.original.firstName} {row.original.lastName}</p>
            <p className="text-sm text-gray-500">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <div className="flex items-center space-x-1">
          <span>Statut</span>
          <ArrowUpDown 
            className="h-4 w-4 text-gray-400 cursor-pointer" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className={`flex items-center px-2.5 py-1 text-xs font-medium ${getStatusBadgeStyle(row.original.status)}`}>
          {getStatusIcon(row.original.status)}
          {getStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: 'averageGrade',
      header: ({ column }) => (
        <div className="flex items-center space-x-1">
          <span>Moyenne</span>
          <ArrowUpDown 
            className="h-4 w-4 text-gray-400 cursor-pointer" 
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        </div>
      ),
      cell: ({ row }) => {
        const grade = row.original.averageGrade;
        if (!grade) return <span className="text-gray-400">-</span>;
        
        let textColor = 'text-gray-800';
        if (grade >= 14) textColor = 'text-teal-600 font-semibold';
        else if (grade < 10) textColor = 'text-red-600';
        
        return (
          <span className={`font-medium ${textColor}`}>
            {grade.toFixed(2)}/20
          </span>
        );
      },
    }
  ];

  useEffect(() => {
    fetchLearners();
  }, [statusFilter]);

  const fetchLearners = async () => {
    try {
      const data = await coachAPI.getReferentialLearners(statusFilter !== 'all' ? statusFilter : undefined);
      setLearners(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des apprenants");
    } finally {
      setLoading(false);
    }
  };

  const filteredLearners = learners.filter(learner => {
    const searchMatch = searchTerm === '' || 
      learner.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${learner.firstName} ${learner.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || learner.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <GraduationCap className="h-8 w-8 text-teal-500" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-orange-500">
            Mes Apprenants
          </h1>
        </div>

        <Card className="p-6 border border-gray-200 shadow-lg rounded-xl bg-white">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par matricule, nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50 rounded-lg"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full md:w-[200px] border-gray-200 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Filtrer par statut" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-gray-200 shadow-lg">
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="focus:bg-teal-50 focus:text-teal-700">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white rounded-lg overflow-hidden">
            <EnhancedDataTable<Learner, any>
              columns={columns}
              data={filteredLearners}
              onRowClick={(row) => router.push(`/dashboard/learners/coach/${row.id}`)}
            />
          </div>

          <div className="mt-4 text-sm text-gray-500 flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{filteredLearners.length} apprenant{filteredLearners.length > 1 ? 's' : ''} affichés</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-60 bg-gray-200" />
        <Card className="p-6 border border-gray-200 shadow-lg rounded-xl">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1 bg-gray-200" />
            <Skeleton className="h-10 w-[200px] bg-gray-200" />
          </div>
          <div className="rounded-lg overflow-hidden">
            <Skeleton className="h-12 w-full bg-gray-200 mb-1" />
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full bg-gray-200 mb-1" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}