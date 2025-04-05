"use client";

import QRScanner from '@/components/dashboard/QRScanner';

export default function ScanPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Scanner un QR Code</h1>
        <p className="text-gray-600">Scannez le QR code d'un apprenant ou d'un coach</p>
      </div>

      <QRScanner />
    </div>
  );
}