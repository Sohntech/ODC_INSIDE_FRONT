import { useState, useEffect } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { referentialsAPI } from '@/lib/api';

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (promotionData: any) => Promise<void>;
}

export default function CreatePromotionModal({ isOpen, onClose, onSubmit }: CreatePromotionModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });
  
  const [referentials, setReferentials] = useState([]);
  const [selectedReferentials, setSelectedReferentials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Charger les référentiels au montage du composant
  useEffect(() => {
    const fetchReferentials = async () => {
      try {
        setIsLoading(true);
        const data = await referentialsAPI.getAllReferentials();
        setReferentials(data);
      } catch (err) {
        setError('Erreur lors du chargement des référentiels');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchReferentials();
    }
  }, [isOpen]);

  // Filtrer les référentiels selon la recherche
  const filteredReferentials = referentials.filter(ref => 
    ref.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedReferentials.find(selected => selected.id === ref.id)
  );

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Le fichier doit être une image');
        return;
      }
      
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 2MB');
        return;
      }

      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      setError(''); // Clear any existing errors
    }
  };

  // Clean up the preview URL when the component unmounts or when the modal closes
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.startDate || !formData.endDate || selectedReferentials.length === 0) {
      setError('Veuillez remplir tous les champs et sélectionner au moins un référentiel');
      return;
    }

    try {
      setIsLoading(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('endDate', formData.endDate);
      
      // Convert referentialIds to string before appending
      const referentialIds = selectedReferentials.map(ref => ref.id);
      formDataToSend.append('referentialIds', referentialIds.join(','));
      
      // Add photo if exists
      if (photoFile) {
        formDataToSend.append('photo', photoFile);
      }

      // Debug log
      const debugData = {};
      formDataToSend.forEach((value, key) => {
        debugData[key] = value;
      });
      console.log('Sending form data:', debugData);

      await onSubmit(formDataToSend);
      onClose();
    } catch (err) {
      console.error('Error in form submission:', err);
      setError('Erreur lors de la création de la promotion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Créer une nouvelle promotion
          </DialogTitle>
          <DialogDescription id="dialog-description" className="text-gray-500">
            Remplissez les informations ci-dessous pour créer une nouvelle promotion.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom de la promotion
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Promotion 2025"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date de début
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date de fin
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Photo de la promotion
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {photoPreview ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPreview(null);
                          setPhotoFile(null);
                        }}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl-lg hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <label className="cursor-pointer text-center p-2">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                        <div className="text-gray-500">
                          <span className="block text-sm font-medium text-orange-600">
                            Ajouter
                          </span>
                          <span className="text-xs">ou glisser</span>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Format JPG, PNG. Taille max 2MB
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Référentiels
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Rechercher un référentiel..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Selected referentials */}
              {selectedReferentials.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedReferentials.map(ref => (
                    <span
                      key={ref.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                    >
                      {ref.name}
                      <button
                        type="button"
                        onClick={() => setSelectedReferentials(selected => 
                          selected.filter(r => r.id !== ref.id)
                        )}
                        className="ml-2 inline-flex items-center justify-center"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Referentials search results */}
              {searchQuery && filteredReferentials.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                  <ul className="py-1">
                    {filteredReferentials.map(ref => (
                      <li
                        key={ref.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedReferentials(prev => [...prev, ref]);
                          setSearchQuery('');
                        }}
                      >
                        {ref.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer la promotion'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}