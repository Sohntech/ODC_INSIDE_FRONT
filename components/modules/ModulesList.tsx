"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { coachAPI } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Book, Clock, Calendar, Users, ChevronRight, BarChart, Plus, Upload } from 'lucide-react';
import Image from 'next/image';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Module {
  id: string;
  name: string;
  description: string;
  duration: number;
  startDate: string;
  endDate: string;
  learnerCount: number;
  progress: number;
  photoUrl?: string;
}

interface NewModule {
  name: string;
  description: string;
  photoUrl?: string;
  duration: number;
  startDate: string;
  endDate: string;
}

export default function ModulesList() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newModule, setNewModule] = useState<NewModule>({
    name: '',
    description: '',
    photoUrl: '',
    duration: 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const data = await coachAPI.getReferentialModules();
      setModules(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des modules");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (hours: number) => {
    return `${hours} heure${hours > 1 ? 's' : ''}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewModule(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would typically upload the photo first to get a URL
      // and then send the complete module data to your API
      
      // Mock implementation:
      const photoUrl = photoPreview || '';
      const moduleData = { ...newModule, photoUrl };
      
      // Assuming coachAPI has a method to create modules
      // await coachAPI.createModule(moduleData);
      
      // For demo, we'll just add it to the local state
      const newId = `temp-${Date.now()}`;
      const createdModule = { 
        ...moduleData, 
        id: newId, 
        learnerCount: 0, 
        progress: 0 
      } as Module;
      
      setModules(prev => [...prev, createdModule]);
      toast.success("Module ajouté avec succès");
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Erreur lors de l'ajout du module");
    }
  };

  const resetForm = () => {
    setNewModule({
      name: '',
      description: '',
      photoUrl: '',
      duration: 1,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Modules
        </h2>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un module
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau module</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="photo">Photo du module</Label>
                <div className="flex flex-col items-center space-y-2">
                  <div className="relative h-36 w-full bg-gray-100 rounded-md overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {photoPreview ? (
                      <Image src={photoPreview} alt="Aperçu" fill className="object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-sm">Uploadez une image</span>
                      </div>
                    )}
                  </div>
                  <Input 
                    id="photo" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handlePhotoChange} 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('photo')?.click()}
                    className="w-full"
                  >
                    {photoPreview ? "Changer l'image" : "Sélectionner une image"}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nom du module *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={newModule.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={newModule.description} 
                  onChange={handleInputChange} 
                  rows={3} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée (heures) *</Label>
                  <Input 
                    id="duration" 
                    name="duration" 
                    type="number" 
                    min="1" 
                    value={newModule.duration} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début *</Label>
                  <Input 
                    id="startDate" 
                    name="startDate" 
                    type="date" 
                    value={newModule.startDate} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">Date de fin *</Label>
                  <Input 
                    id="endDate" 
                    name="endDate" 
                    type="date" 
                    value={newModule.endDate} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(false);
                  }}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Créer le module
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {modules.map((module) => (
          <Card 
            key={module.id}
            className="overflow-hidden border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all duration-300 cursor-pointer group"
            onClick={() => router.push(`/dashboard/modules/${module.id}`)}
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
                  <Book size={36} className="text-teal-600" />
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
                  <span>{formatDuration(module.duration)}</span>
                </div>
                
                <div className="flex items-center text-xs text-gray-500">
                  <Users className="h-3 w-3 mr-1 text-teal-600" />
                  <span>{module.learnerCount} apprenants</span>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart className="h-3 w-3 mr-1 text-orange-500" />
                    <span className="text-xs font-medium">Progrès</span>
                  </div>
                  <span className="text-xs font-bold text-orange-500">{module.progress}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-orange-400 rounded-full"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden border border-gray-200">
            <Skeleton className="h-32 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <div className="pt-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-1.5 w-full mt-1" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}