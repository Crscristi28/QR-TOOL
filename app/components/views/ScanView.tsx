"use client";

import React, { useState, useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import Quagga from '@ericblade/quagga2';
import { addQRCode } from '@/app/lib/db';
import { useLanguage } from '@/app/lib/i18n';

type ScanMode = 'idle' | 'scanning-qr' | 'scanning-barcode' | 'result';
type CodeType = 'QR' | 'Barcode';

const ScanView: React.FC = () => {
  const { t } = useLanguage();

  // State
  const [mode, setMode] = useState<ScanMode>('idle');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [codeType, setCodeType] = useState<CodeType>('QR');
  const [saved, setSaved] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [detectedFormat, setDetectedFormat] = useState<'text' | 'url' | 'wifi' | 'vcard'>('text');

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const quaggaTargetRef = useRef<HTMLDivElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const quaggaRunning = useRef(false);

  // Upload Refs
  const qrInputRef = useRef<HTMLInputElement>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllScanners();
    };
  }, []);

  const stopAllScanners = async (resetToIdle = true) => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }

    if (quaggaRunning.current) {
      Quagga.offDetected();
      await Quagga.stop();
      quaggaRunning.current = false;
      if (quaggaTargetRef.current) {
        quaggaTargetRef.current.innerHTML = '';
      }
    }

    if (resetToIdle) {
      setMode('idle');
    }
  };

  // --- QR SCANNER LOGIC ---
  const startQrScan = async () => {
    setPermissionError(false);
    setMode('scanning-qr');
    setScanResult(null);

    await new Promise(resolve => setTimeout(resolve, 100));

    if (videoRef.current) {
       qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleScanSuccess(result.data, 'QR'),
        {
          returnDetailedScanResult: true,
          preferredCamera: 'environment',
          calculateScanRegion: (video) => ({
            x: 0,
            y: 0,
            width: video.videoWidth,
            height: video.videoHeight,
          }),
        }
      );

      try {
        await qrScannerRef.current.start();
      } catch (e) {
        console.error('QR Scanner start error:', e);
        setPermissionError(true);
        setMode('idle');
      }
    }
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await QrScanner.scanImage(file);
      handleScanSuccess(result, 'QR');
    } catch (e) {
      console.error(e);
      alert(t.scan.notFound);
    } finally {
      if (qrInputRef.current) qrInputRef.current.value = '';
    }
  };

  // --- BARCODE SCANNER LOGIC (Quagga2) ---
  const startBarcodeScan = async () => {
    setPermissionError(false);
    setMode('scanning-barcode');
    setScanResult(null);

    await new Promise(resolve => setTimeout(resolve, 100));

    if (!quaggaTargetRef.current) return;

    try {
      await Quagga.init({
        inputStream: {
          type: "LiveStream",
          target: quaggaTargetRef.current,
          constraints: {
            facingMode: "environment",
            aspectRatio: 1.777778,
            width: { min: 640 },
            height: { min: 480 },
          },
        },
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader",
            "code_128_reader",
            "code_39_reader",
            "upc_reader",
            "upc_e_reader"
          ],
        },
        locate: true,
      });

      await Quagga.start();
      quaggaRunning.current = true;

      Quagga.onDetected((data) => {
        if (data && data.codeResult && data.codeResult.code) {
           Quagga.offDetected();
           handleScanSuccess(data.codeResult.code, 'Barcode');
        }
      });

    } catch (err) {
      console.error("Quagga start error:", err);
      setPermissionError(true);
      setMode('idle');
    }
  };

  const handleBarcodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    Quagga.decodeSingle({
      decoder: {
        readers: ["ean_reader", "ean_8_reader", "code_128_reader", "code_39_reader", "upc_reader", "upc_e_reader"]
      },
      locate: true,
      src: url
    }, (result) => {
      if (result?.codeResult?.code) {
        handleScanSuccess(result.codeResult.code, 'Barcode');
      } else {
        alert(t.scan.notFound);
      }
      URL.revokeObjectURL(url);
      if (barcodeInputRef.current) barcodeInputRef.current.value = '';
    });
  };

  // --- COMMON LOGIC ---
  const handleScanSuccess = (text: string, type: CodeType) => {
    stopAllScanners(false);
    setScanResult(text);
    setCodeType(type);
    setSaved(false);
    setMode('result');

    if (text.startsWith('http')) setDetectedFormat('url');
    else if (text.startsWith('WIFI:')) setDetectedFormat('wifi');
    else if (text.includes('BEGIN:VCARD')) setDetectedFormat('vcard');
    else setDetectedFormat('text');
  };

  const handleSaveResult = async () => {
    if (!scanResult || saved) return;

    let dbType: 'text' | 'url' | 'wifi' | 'vcard' = 'text';
    let name = scanResult.slice(0, 30);

    if (detectedFormat === 'url') {
      dbType = 'url';
      name = 'URL';
    } else if (detectedFormat === 'wifi') {
      dbType = 'wifi';
      const ssidMatch = scanResult.match(/S:([^;]+)/);
      name = ssidMatch ? ssidMatch[1] : 'WiFi';
    } else if (detectedFormat === 'vcard') {
      dbType = 'vcard';
      const fnMatch = scanResult.match(/FN:(.*)/);
      name = fnMatch ? fnMatch[1].trim() : 'Contact';
    }

    if (codeType === 'Barcode') {
      name = `Barcode: ${scanResult}`;
    }

    await addQRCode({
      type: dbType,
      name,
      content: scanResult,
      createdAt: Date.now()
    });
    setSaved(true);
  };

  const reset = () => {
    setScanResult(null);
    setSaved(false);
    setMode('idle');
  };

  // --- RENDER ---
  return (
    <div className="flex flex-col w-full h-full p-6">
      {/* IDLE STATE - BUTTONS */}
      {mode === 'idle' && (
        <div className="flex flex-col gap-4 mt-4 animate-in fade-in duration-300">
           {permissionError && (
             <div className="bg-red-50 border border-red-200 p-4 mb-4 text-center">
                <p className="font-body text-xs text-red-600">{t.scan.cameraPermission}</p>
             </div>
          )}

          <button
            onClick={startQrScan}
            className="w-full bg-[#141413] text-white py-5 font-heading font-medium tracking-wide uppercase text-sm hover:opacity-90 transition-opacity"
          >
            {t.scan.btnQrScan}
          </button>

          <button
            onClick={startBarcodeScan}
            className="w-full bg-[#141413] text-white py-5 font-heading font-medium tracking-wide uppercase text-sm hover:opacity-90 transition-opacity"
          >
            {t.scan.btnBarcodeScan}
          </button>

          <div className="w-full h-px bg-light-gray my-2"></div>

          <input
            type="file"
            ref={qrInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleQrUpload}
          />
          <button
            onClick={() => qrInputRef.current?.click()}
            className="w-full bg-transparent border border-light-gray text-text py-5 font-heading font-medium tracking-wide uppercase text-sm hover:border-gray transition-colors"
          >
            {t.scan.btnQrUpload}
          </button>

          <input
            type="file"
            ref={barcodeInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleBarcodeUpload}
          />
          <button
            onClick={() => barcodeInputRef.current?.click()}
            className="w-full bg-transparent border border-light-gray text-text py-5 font-heading font-medium tracking-wide uppercase text-sm hover:border-gray transition-colors"
          >
            {t.scan.btnBarcodeUpload}
          </button>
        </div>
      )}

      {/* SCANNING STATE */}
      {(mode === 'scanning-qr' || mode === 'scanning-barcode') && (
        <div className="flex flex-col items-center w-full animate-in fade-in duration-300">
           <div className="w-full aspect-video bg-black relative overflow-hidden mb-6">
             <video
               ref={videoRef}
               className={`w-full h-full object-cover ${mode === 'scanning-barcode' ? 'hidden' : 'block'}`}
               playsInline
               muted
             />

             <div
               ref={quaggaTargetRef}
               className={`absolute inset-0 w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover ${mode === 'scanning-barcode' ? 'block' : 'hidden'}`}
             />

             <div className="absolute inset-0 border-2 border-white/20 m-8 pointer-events-none flex items-center justify-center z-10">
                <div className="w-full h-[1px] bg-red-500/50" />
             </div>
           </div>

           <button
             onClick={() => stopAllScanners(true)}
             className="w-full text-center text-sm font-heading font-medium text-text border-b border-text pb-0.5 hover:opacity-70 self-center"
           >
             {t.scan.stopScanning}
           </button>
        </div>
      )}

      {/* RESULT STATE */}
      {mode === 'result' && scanResult && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
          <div className="w-full bg-card border border-light-gray p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="font-heading text-xs uppercase text-gray font-semibold">{t.scan.resultLabel}</p>
              <span className="font-mono text-[10px] uppercase bg-light-gray px-1.5 py-0.5 text-text">
                {codeType}
              </span>
            </div>
            <p className="font-mono text-sm text-text break-all max-h-40 overflow-y-auto">
               {scanResult}
            </p>
          </div>

          <div className="w-full space-y-3">
             {detectedFormat === 'url' && (
               <a
                 href={scanResult}
                 target="_blank"
                 rel="noreferrer"
                 className="block w-full bg-accent text-white py-4 text-center font-heading font-medium tracking-wide uppercase text-sm hover:bg-accent-hover transition-colors"
               >
                 {t.scan.openUrl}
               </a>
            )}

            <button
              onClick={handleSaveResult}
              disabled={saved}
              className={`
                w-full py-4 font-heading font-medium tracking-wide uppercase text-sm transition-colors
                ${saved ? 'bg-green-600 text-white' : 'bg-text text-bg hover:opacity-90'}
              `}
            >
              {saved ? t.scan.savedToLibrary : t.scan.saveToLibrary}
            </button>

            <button
              onClick={reset}
              className="w-full bg-transparent border border-light-gray text-text py-4 font-heading font-medium tracking-wide uppercase text-sm hover:border-gray transition-colors"
            >
              {t.scan.scanNext}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanView;
