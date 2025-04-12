"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Learner, learnersAPI, ReplaceLearnerDto } from "@/lib/api"
import { Search, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ReplaceLearnerPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { toast } = useToast()
  
  const [activeLearner, setActiveLearner] = useState<Learner | null>(null)
  const [waitingLearners, setWaitingLearners] = useState<Learner[]>([])
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [reason, setReason] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // First get the active learner
        const learnerData = await learnersAPI.getLearnerById(id);
        
        if (learnerData.status !== 'ACTIVE') {
          throw new Error("Seuls les apprenants actifs peuvent être remplacés");
        }
        
        setActiveLearner(learnerData);
        
        if (!learnerData.promotion?.id) {
          throw new Error("L'apprenant n'est pas assigné à une promotion");
        }
        
        // Then get waiting list for the same promotion
        const waitingListData = await learnersAPI.getWaitingList(learnerData.promotion.id);
        
        // Filter waiting learners from the same referential
        const filteredWaitingLearners = waitingListData.filter(learner => 
          learner.referential?.id === learnerData.referential?.id &&
          learner.status === 'WAITING'
        );
        
        if (filteredWaitingLearners.length === 0) {
          toast({
            title: "Information",
            description: "Aucun apprenant en liste d'attente pour ce référentiel",
            variant: "default"
          });
        }
        
        setWaitingLearners(filteredWaitingLearners);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        const errorMessage = err.response?.data?.message || 
          err.message || 
          "Une erreur est survenue lors du chargement des données";
        
        setError(errorMessage);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, toast]);

  const filteredWaitingLearners = waitingLearners.filter(learner => {
    const searchString = searchQuery.toLowerCase()
    return (
      learner.firstName.toLowerCase().includes(searchString) ||
      learner.lastName.toLowerCase().includes(searchString) ||
      learner.matricule?.toLowerCase().includes(searchString)
    )
  })

  const handleReplace = async () => {
    if (!selectedLearner || !reason || !activeLearner) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un remplaçant et fournir une raison",
        variant: "destructive"
      });
      return;
    }
  
    try {
      const replacementData: ReplaceLearnerDto = {
        activeLearnerForReplacement: activeLearner.id,
        replacementLearnerId: selectedLearner.id,  // Match the backend DTO
        reason
      };
  
      await learnersAPI.replaceLearner(replacementData);
  
      toast({
        title: "Succès",
        description: "Le remplacement a été effectué avec succès",
      });
  
      router.push(`/dashboard/learners/${id}`);
    } catch (err: any) {
      console.error("Error replacing learner:", err);
      toast({
        title: "Erreur",
        description: err.response?.data?.message || "Impossible d'effectuer le remplacement",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Remplacement d'apprenant
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Active Learner Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Apprenant à remplacer
              </h2>
              <div className="border-2 border-orange-200 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                    {activeLearner?.photoUrl ? (
                      <img
                        src={activeLearner.photoUrl}
                        alt={`${activeLearner.firstName} ${activeLearner.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold">
                        {`${activeLearner?.firstName[0]}${activeLearner?.lastName[0]}`}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {activeLearner?.firstName} {activeLearner?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{activeLearner?.matricule}</p>
                    <p className="text-sm text-gray-500">{activeLearner?.referential?.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Replacement Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Sélectionner le remplaçant
              </h2>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher un apprenant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {filteredWaitingLearners.map((learner) => (
                  <div
                    key={learner.id}
                    onClick={() => setSelectedLearner(learner)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedLearner?.id === learner.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                        {learner.photoUrl ? (
                          <img
                            src={learner.photoUrl}
                            alt={`${learner.firstName} ${learner.lastName}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
                            {`${learner.firstName[0]}${learner.lastName[0]}`}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {learner.firstName} {learner.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{learner.matricule}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reason and Action Buttons */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison du remplacement
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows={4}
                placeholder="Expliquez la raison du remplacement..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
              >
                Annuler
              </Button>
              <Button
                onClick={handleReplace}
                disabled={!selectedLearner || !reason}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Confirmer le remplacement
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}