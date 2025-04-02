"use client";

import { useState, useEffect, useRef } from 'react';
import { learnersAPI, attendanceAPI } from '@/lib/api';
import { QrCode, Search, CheckCircle, XCircle, Clock, ChevronDown, User } from 'lucide-react';
import Link from 'next/link';

export default function ScanPage() {
  const [scanMode, setScanMode] = useState<'qr' | 'search'>('qr');
  const [searchQuery, setSearchQuery] = useState('');
  const [learners, setLearners] = useState<any[]>([]);
  const [filteredLearners, setFilteredLearners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scannedLearner, setScannedLearner] = useState<any>(null);
  const [error, setError] = useState('');
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [manualCode, setManualCode] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Fetch all learners
    const fetchLearners = async () => {
      try {
        const learnersData = await learnersAPI.getAllLearners();
        setLearners(learnersData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching learners:', err);
        setError('Failed to load learners data');
        setLoading(false);
      }
    };

    // Fetch recent scans
    const fetchRecentScans = async () => {
      try {
        const scansData = await attendanceAPI.getLatestScans(10);
        setRecentScans(scansData);
      } catch (err) {
        console.error('Error fetching recent scans:', err);
      }
    };

    fetchLearners();
    fetchRecentScans();

    // Cleanup function to stop camera
    return () => {
      stopCamera();
    };
  }, []);

  // Filter learners based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLearners([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = learners.filter(learner => 
      learner.firstName?.toLowerCase().includes(query) || 
      learner.lastName?.toLowerCase().includes(query) ||
      learner.qrCode?.toLowerCase().includes(query)
    );
    
    setFilteredLearners(filtered);
  }, [searchQuery, learners]);

  // Camera functions
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScanning(true);
        
        // Start QR code scanning
        scanQRCode();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please check camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const toggleQRScanner = () => {
    if (scanning) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // This is a simulated QR code scanner
  // In a real app, you would use a library like jsQR or a similar package
  const scanQRCode = () => {
    if (!scanning) return;

    // Simulate scanning every 1 second
    // In a real app, this would analyze video frames using a QR library
    const scanInterval = setInterval(() => {
      if (!scanning) {
        clearInterval(scanInterval);
        return;
      }

      // Simulate detecting a QR code (random learner)
      if (Math.random() > 0.9 && learners.length > 0) {
        clearInterval(scanInterval);
        const randomLearner = learners[Math.floor(Math.random() * learners.length)];
        processScannedCode(randomLearner.qrCode);
      }
    }, 1000);

    // Clear the interval after 10 seconds if no QR code is detected
    setTimeout(() => {
      clearInterval(scanInterval);
    }, 10000);
  };

  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    
    processScannedCode(manualCode);
    setManualCode('');
  };

  const processScannedCode = async (code: string) => {
    try {
      setLoading(true);
      setError('');
      
      // First, validate the QR code
      const learner = learners.find(l => l.qrCode === code);
      
      if (!learner) {
        setError('Code QR non reconnu. Veuillez réessayer.');
        setLoading(false);
        return;
      }
      
      // Register attendance
      const attendanceResponse = await attendanceAPI.scanLearner(code);
      
      // Update UI with scanned learner info
      setScannedLearner({
        ...learner,
        scanTime: new Date().toISOString(),
        isLate: attendanceResponse.isLate,
      });
      
      // Update recent scans
      await fetchRecentScans();
      
      // Reset state for next scan
      setTimeout(() => {
        setScannedLearner(null);
        setScanMode('qr');
        if (scanMode === 'qr') {
          startCamera();
        }
      }, 3000);
      
    } catch (err: any) {
      console.error('Error processing QR code:', err);
      setError(err.response?.data?.message || 'Failed to process attendance');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRecentScans = async () => {
    try {
      const scansData = await attendanceAPI.getLatestScans(10);
      setRecentScans(scansData);
    } catch (err) {
      console.error('Error fetching recent scans:', err);
    }
  };

  const handleLearnerSelect = (learner: any) => {
    processScannedCode(learner.qrCode);
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Scanner de présence</h1>
        <p className="text-gray-600">Scannez le QR code des apprenants pour enregistrer leur présence</p>
      </div>
      
      {/* Scan Mode Toggle */}
      <div className="mb-6 flex">
        <button
          className={`px-4 py-2 rounded-l-lg flex items-center ${
            scanMode === 'qr' 
              ? 'bg-orange-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-orange-100'
          }`}
          onClick={() => {
            setScanMode('qr');
            setSearchQuery('');
            setFilteredLearners([]);
          }}
        >
          <QrCode className="mr-2 h-5 w-5" />
          Scanner QR
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg flex items-center ${
            scanMode === 'search' 
              ? 'bg-orange-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-orange-100'
          }`}
          onClick={() => {
            setScanMode('search');
            stopCamera();
          }}
        >
          <Search className="mr-2 h-5 w-5" />
          Recherche
        </button>
      </div>
      
      {/* Scan Area */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {scannedLearner && (
          <div className="bg-green-50 p-4 rounded-lg mb-4 flex items-start">
            <div className="mr-4">
              {scannedLearner.photoUrl ? (
                <img 
                  src={scannedLearner.photoUrl} 
                  alt={`${scannedLearner.firstName} ${scannedLearner.lastName}`}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-lg font-medium">
                  {scannedLearner.firstName?.[0]}{scannedLearner.lastName?.[0]}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-800">
                  {scannedLearner.firstName} {scannedLearner.lastName}
                </h3>
                {scannedLearner.isLate ? (
                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    En retard
                  </span>
                ) : (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    À l'heure
                  </span>
                )}
              </div>
              <p className="text-gray-600">{scannedLearner.referential?.name || 'Référentiel non assigné'}</p>
              <p className="text-sm text-gray-500 mt-1">
                Scan à {new Date(scannedLearner.scanTime).toLocaleTimeString('fr-FR')}
              </p>
            </div>
          </div>
        )}
        
        {scanMode === 'qr' ? (
          <div>
            {scanning ? (
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                <video 
                  ref={videoRef} 
                  className="absolute inset-0 w-full h-full object-cover"
                ></video>
                <div className="absolute inset-0 border-2 border-orange-500 opacity-50 m-auto w-1/2 h-1/2"></div>
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <button
                  onClick={toggleQRScanner}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                >
                  <QrCode className="mr-2 h-5 w-5" />
                  Activer la caméra
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <button
                onClick={toggleQRScanner}
                className={`px-4 py-2 ${
                  scanning 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white rounded-lg transition-colors`}
              >
                {scanning ? 'Arrêter' : 'Démarrer'}
              </button>
              
              <form onSubmit={handleManualCodeSubmit} className="flex-1 ml-4">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Entrer code manuellement"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    className="bg-orange-500 text-white rounded-r-lg px-4 py-2 hover:bg-orange-600 transition-colors"
                  >
                    Valider
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div>
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un apprenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            {searchQuery.trim() !== '' && (
              <div className="mt-2 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
                {filteredLearners.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center">
                    Aucun apprenant trouvé
                  </div>
                ) : (
                  filteredLearners.map(learner => (
                    <div 
                      key={learner.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleLearnerSelect(learner)}
                    >
                      <div className="flex items-center">
                        {learner.photoUrl ? (
                          <img 
                            src={learner.photoUrl} 
                            alt={`${learner.firstName} ${learner.lastName}`}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-medium mr-3">
                            {learner.firstName?.[0]}{learner.lastName?.[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-800">
                            {learner.firstName} {learner.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {learner.referential?.name || 'Référentiel non assigné'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Recent Scans */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Scans Récents</h2>
          <Link 
            href="/dashboard/attendance/history" 
            className="text-orange-500 hover:text-orange-700 text-sm font-medium"
          >
            Voir tout l'historique
          </Link>
        </div>
        
        {recentScans.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            Aucun scan récent
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apprenant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentScans.map((scan) => (
                  <tr key={scan.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                          {scan.learner?.photoUrl ? (
                            <img 
                              src={scan.learner.photoUrl} 
                              alt={`${scan.learner.firstName} ${scan.learner.lastName}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-orange-500 text-white text-sm font-medium">
                              {scan.learner?.firstName?.[0]}{scan.learner?.lastName?.[0]}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {scan.learner?.firstName} {scan.learner?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {scan.learner?.referential?.name || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(scan.scanTime).toLocaleTimeString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        scan.isLate ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {scan.isLate ? 'En retard' : 'À l\'heure'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 