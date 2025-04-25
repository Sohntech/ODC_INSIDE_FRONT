'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { attendanceAPI } from '@/lib/api';
import { CheckCircle, Clock, Camera, ArrowLeft, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ScanResponse } from '@/types/attendance';

interface ScanResult {
  type: 'LEARNER' | 'COACH';
  scanTime: string;
  isLate: boolean;
  isPresent: boolean;
  learner?: {
    firstName: string;
    lastName: string;
    matricule: string;
    photoUrl?: string | null;
    referential?: {
      name: string;
    } | null;
    promotion?: {
      name: string;
    };
  };
  coach?: {
    firstName: string;
    lastName: string;
    matricule: string;
    photoUrl?: string | null;
    referential?: {
      name: string;
    } | null;
  };
}

const mapApiResponseToScanResult = (data: ScanResponse): ScanResult => {
  return {
    type: data.type,
    scanTime: new Date(data.scanTime).toISOString(),
    isLate: data.attendanceStatus === 'LATE',
    isPresent: data.attendanceStatus === 'PRESENT',
    ...(data.type === 'LEARNER' ? {
      learner: {
        firstName: data.learner.firstName,
        lastName: data.learner.lastName,
        matricule: data.learner.matricule,
        photoUrl: data.learner.photoUrl,
        referential: data.learner.referential,
        promotion: data.learner.promotion
      }
    } : {
      coach: {
        firstName: data.coach.firstName,
        lastName: data.coach.lastName,
        matricule: data.coach.matricule,
        photoUrl: data.coach.photoUrl,
        referential: data.coach.referential
      }
    })
  };
};

export default function QRScanner() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isMounted = useRef(true);
  const shouldRestartScanner = useRef(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout>();

  // Cleanup function
  const cleanupScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
        scannerRef.current = null;

        // Clean up the reader element
        const readerElement = document.getElementById('reader');
        if (readerElement) {
          readerElement.innerHTML = '';
        }
      } catch (err) {
        console.error('Cleanup error:', err);
      }
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      cleanupScanner();
    };
  }, []);

  const startScanning = async () => {
    try {
      await cleanupScanner();

      const container = document.getElementById('scanner-container');
      if (!container) {
        throw new Error('Scanner container not found');
      }

      let readerElement = document.getElementById('reader');
      if (!readerElement) {
        readerElement = document.createElement('div');
        readerElement.id = 'reader';
        container.appendChild(readerElement);
      }
      readerElement.innerHTML = '';

      scannerRef.current = new Html5Qrcode("reader");
      
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { 
            width: Math.min(250, window.innerWidth - 40),
            height: Math.min(250, window.innerWidth - 40)
          },
          aspectRatio: 1.0,
        },
        handleScanSuccess,
        undefined
      );
      
      setIsScanning(true);
      setError('');
    } catch (err) {
      console.error('Failed to start scanner:', err);
      setError('Erreur d\'accès à la caméra. Veuillez vérifier vos permissions.');
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    await cleanupScanner();
    if (isMounted.current) {
      setIsScanning(false);
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    try {
      if (!scannerRef.current) return;
      
      await scannerRef.current.stop();
      
      // Try learner scan
      const learnerResponse = await attendanceAPI.scanLearnerQR(decodedText);
      
      if (learnerResponse.success && learnerResponse.data) {
        setScanResult(mapApiResponseToScanResult(learnerResponse.data));
        return;
      }

      // Try coach scan if not an already scanned learner
      if (!learnerResponse.message.includes('déjà été scanné')) {
        const coachResponse = await attendanceAPI.scanCoachQR(decodedText);
        
        if (coachResponse.success && coachResponse.data) {
          setScanResult(mapApiResponseToScanResult(coachResponse.data));
          return;
        }
      }

      // Show error message with delay before restarting
      setError(learnerResponse.message);
      
      // Clear any existing timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      
      // Set new timeout for error message
      errorTimeoutRef.current = setTimeout(async () => {
        setError('');
        await startScanning();
      }, 2000); // Show error for 2 seconds

    } catch (err) {
      console.error('Scan processing error:', err);
      setError('Erreur lors du traitement du scan');
      
      // Set timeout for error message
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      errorTimeoutRef.current = setTimeout(async () => {
        setError('');
        await startScanning();
      }, 2000);
    }
  };

  const handleValidate = async () => {
    // Just reset states and restart scanner
    setScanResult(null);
    setError('');
    await startScanning();
  };

  const handleReturn = async () => {
    await stopScanning();
    router.push('/dashboard');
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-teal-500/20">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <button
            onClick={handleReturn}
            className="flex items-center text-gray-600 hover:text-teal-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Tableau de bord</span>
          </button>
          
          <div className="flex items-center text-teal-500">
            <Zap className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Scanner QR</span>
          </div>
        </div>

        <div className="relative bg-gray-50">
          <div 
            id="scanner-container" 
            className="aspect-square relative"
            style={{ maxHeight: '400px' }}
          >
            {!isScanning && !scanResult && (
              <div className="absolute inset-0 flex items-center  justify-center bg-gray-50 ">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 flex items-center justify-center">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <button
                    onClick={startScanning}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-orange-500 text-white rounded-lg hover:from-teal-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Activer le scanner
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Scanner Frame */}
          {isScanning && (
            <div className="absolute inset-0  pointer-events-none">
              <div className="absolute inset-0 border-4 border-teal-500/20 rounded-lg"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-teal-500 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-teal-500 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-teal-500 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-teal-500 rounded-br-lg"></div>
              
              {/* Scanning animation */}
              <div className="absolute left-0 right-0 h-0.5 bg-teal-400 top-1/2 animate-pulse"></div>
              <div className="absolute inset-0 bg-teal-500/5 animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-center font-medium backdrop-blur-sm border-t border-b border-red-200">
            {error}
          </div>
        )}

        {/* Status info when scanning */}
        {isScanning && !error && (
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping mr-3"></div>
              <p className="text-gray-600 text-sm">Recherche de QR code...</p>
            </div>
          </div>
        )}
      </div>

      {/* Scan result modal */}
      {scanResult && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-teal-500/30 shadow-2xl shadow-teal-500/10">
            <div className="text-center">
              {/* Status Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-orange-500 animate-pulse opacity-50"></div>
                <div className="absolute inset-0.5 rounded-full bg-white"></div>
                <div className="relative">
                  {scanResult.isLate ? (
                    <Clock className="h-8 w-8 text-orange-500" />
                  ) : (
                    <CheckCircle className="h-8 w-8 text-teal-500" />
                  )}
                </div>
              </div>

              {/* Profile Image */}
              <div className="mb-6">
                <div className="h-28 w-28 mx-auto rounded-full overflow-hidden border-2 border-gray-100 shadow-lg shadow-teal-500/10 relative">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-teal-500 to-orange-500 animate-pulse opacity-50"></div>
                  {(scanResult.learner?.photoUrl || scanResult.coach?.photoUrl) ? (
                    <img 
                      src={scanResult.learner?.photoUrl || scanResult.coach?.photoUrl || ''}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-50 flex items-center justify-center text-teal-500 text-2xl font-bold">
                      {(scanResult.learner?.firstName[0] || scanResult.coach?.firstName[0]) +
                       (scanResult.learner?.lastName[0] || scanResult.coach?.lastName[0])}
                    </div>
                  )}
                </div>
              </div>

              {/* User Details */}
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {scanResult.learner?.firstName || scanResult.coach?.firstName}{' '}
                {scanResult.learner?.lastName || scanResult.coach?.lastName}
              </h3>
              
              <p className="text-sm text-gray-500 mb-6 font-mono">
                {scanResult.learner?.matricule || scanResult.coach?.matricule}
              </p>

              {/* Additional Details */}
              <div className="bg-gray-50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-100">
                <div className="text-sm text-gray-600">
                  {scanResult.type === 'LEARNER' ? (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Référentiel:</span>
                        <span className="font-medium text-teal-600">{scanResult.learner?.referential?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Promotion:</span>
                        <span className="font-medium text-teal-600">{scanResult.learner?.promotion?.name || 'N/A'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Statut:</span>
                      <span className="font-medium text-orange-500">Coach{scanResult.coach?.referential ? ` - ${scanResult.coach.referential.name}` : ''}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                    <span className="text-gray-500">Heure de scan:</span>
                    <span className="font-mono text-gray-800">{new Date(scanResult.scanTime).toLocaleTimeString('fr-FR')}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`inline-flex rounded-full px-6 py-2 text-sm font-medium ${
                scanResult.isLate 
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'bg-teal-50 text-teal-600 border border-teal-200'
              }`}>
                {scanResult.isLate ? (
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    En retard
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    À l'heure
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleValidate}
                  className="inline-flex justify-center rounded-xl border border-transparent bg-gradient-to-r from-teal-500 to-teal-400 px-8 py-3 text-base font-medium text-white hover:from-teal-600 hover:to-teal-500 shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}