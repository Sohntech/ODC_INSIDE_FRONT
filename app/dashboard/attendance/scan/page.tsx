"use client";

import { Zap, QrCode, CheckCircle } from 'lucide-react';
import QRScanner from '@/components/dashboard/QRScanner';

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 pt-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-gradient-to-r from-teal-500 to-orange-500 p-0.5 rounded-lg">
              <div className="bg-white p-2 rounded-md">
                <QrCode className="w-6 h-6 text-teal-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-orange-500 bg-clip-text text-transparent">
              Scanner QR Code
            </h1>
          </div>
          
          <p className="text-gray-600 max-w-2xl">
            <span className="text-teal-500">•</span> Scannez le QR code d'un apprenant ou d'un coach pour enregistrer la présence
          </p>
          
          {/* Status Info */}
          <div className="flex items-center mt-4 text-sm">
            <div className="flex items-center mr-6">
              <div className="w-3 h-3 rounded-full bg-teal-500 mr-2"></div>
              <span className="text-teal-600">À l'heure</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <span className="text-orange-600">En retard</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-5 w-64 h-64 bg-teal-100 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-orange-100 rounded-full blur-3xl -z-10"></div>
        
        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white shadow-md p-4 rounded-xl border border-teal-100">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center mr-3">
                <Zap className="w-5 h-5 text-teal-500" />
              </div>
              <h3 className="font-medium text-gray-800">Scan instantané</h3>
            </div>
            <p className="text-sm text-gray-600">Pointez votre caméra vers le QR code pour un scan automatique et rapide</p>
          </div>
          
          <div className="bg-white shadow-md p-4 rounded-xl border border-orange-100">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mr-3">
                <QrCode className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-medium text-gray-800">Validation immédiate</h3>
            </div>
            <p className="text-sm text-gray-600">Les informations de l'utilisateur apparaîtront instantanément après le scan</p>
          </div>
          
          <div className="bg-white shadow-md p-4 rounded-xl border border-teal-100">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center mr-3">
                <CheckCircle className="w-5 h-5 text-teal-500" />
              </div>
              <h3 className="font-medium text-gray-800">Enregistrement sécurisé</h3>
            </div>
            <p className="text-sm text-gray-600">Les données de présence sont enregistrées de manière sécurisée dans le système</p>
          </div>
        </div>

        {/* Scanner Component */}
        <QRScanner />
      </div>
    </div>
  );
}