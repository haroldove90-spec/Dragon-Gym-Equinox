import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, CheckCircle2, QrCode } from 'lucide-react';
import { UserProfile } from '../types';

interface CheckInCardProps {
  user: UserProfile;
  onClose: () => void;
  onConfirmCheckIn: () => void;
}

export default function CheckInCard({ user, onClose, onConfirmCheckIn }: CheckInCardProps) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const triggerScan = () => {
    setScanning(true);
    // Simulate a laser scan bar moving across the barcode
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      setTimeout(() => {
        onConfirmCheckIn();
      }, 1500);
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-end md:justify-center p-0 md:p-4"
    >
      {/* Tap out background */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Responsive Container */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 240 }}
        className="w-full md:max-w-md bg-neutral-950 border-t md:border border-neutral-800 rounded-t-[38px] md:rounded-[28px] px-6 pt-5 pb-10 flex flex-col items-center md:shadow-[0_20px_50px_rgba(0,0,0,0.85)] md:m-auto"
      >
        {/* Header drag-bar accent (mobile only) */}
        <div className="w-12 h-1 bg-neutral-800 rounded-full mb-6 md:hidden" />

        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase">DRAGON GYM CLUB PASS</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Card */}
        <div className="w-full relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 rounded-2xl border border-neutral-800/80 shadow-[0_12px_40px_-5px_rgba(0,0,0,0.8)] p-6 space-y-8">
          
          {/* Card Glassmorphic Background Blur Accent */}
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-brand-gold/10 blur-3xl" />
          
          {/* Brand/Logo Row */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xl font-display font-black tracking-widest text-white">D R A G O N   G Y M</p>
              <p className="text-[9px] text-neutral-500 tracking-wider uppercase font-mono">{user.membershipLevel}</p>
            </div>
            
            <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-display font-semibold text-lg text-brand-gold">
              {user.avatarLetter}
            </div>
          </div>

          {/* User Details */}
          <div>
            <h3 className="text-2xl font-display font-semibold tracking-tight text-white mb-0.5">{user.name}</h3>
            <p className="text-xs text-neutral-400 font-light flex items-center gap-1">
              Preferred: <span className="text-neutral-200 font-medium">{user.favoriteClub}</span>
            </p>
          </div>

          {/* Barcode/Scan Area */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 flex flex-col items-center justify-center relative group min-h-[160px]">
            <AnimatePresence mode="wait">
              {!scanned ? (
                <motion.div
                  key="barcode-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex flex-col items-center gap-4"
                >
                  {/* Generated Simulated Barcode lines */}
                  <div className="relative w-full h-[60px] flex justify-between px-2 items-stretch bg-white/95 rounded p-3 filter invert opacity-90">
                    <div className="w-1 bg-black" />
                    <div className="w-1.5 bg-black" />
                    <div className="w-0.5 bg-black" />
                    <div className="w-1 bg-black" />
                    <div className="w-2 bg-black" />
                    <div className="w-1.5 bg-black" />
                    <div className="w-0.5 bg-black" />
                    <div className="w-1.5 bg-black" />
                    <div className="w-1 bg-black" />
                    <div className="w-2.5 bg-black" />
                    <div className="w-0.5 bg-black" />
                    <div className="w-1.5 bg-black" />
                    <div className="w-1 bg-black" />
                    <div className="w-1 bg-black" />
                    <div className="w-1.5 bg-black" />
                    <div className="w-0.5 bg-black" />
                    <div className="w-2.5 bg-black" />
                    <div className="w-1 bg-black" />
                    <div className="w-0.5 bg-black" />
                    <div className="w-1.5 bg-black" />
                    
                    {/* Laser Scanner animation line */}
                    {scanning && (
                      <motion.div
                        initial={{ top: '0%' }}
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                        className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] z-20"
                      />
                    )}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-[10px] font-mono tracking-wider text-neutral-400">MEMBERSHIP ID: EQX-049281</p>
                    {scanning && <span className="text-[10px] font-mono text-emerald-400 animate-pulse mt-0.5 block">Scanning, hold steady...</span>}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="scanned-view"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-semibold text-white">Scan Successful</h4>
                    <p className="text-xs text-neutral-400 font-light">Enjoy your workout at {user.favoriteClub.split(' ').slice(1).join(' ')}!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Actions Button */}
        {!scanned && (
          <button
            onClick={triggerScan}
            disabled={scanning}
            className={`w-full py-3.5 rounded-full mt-6 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              scanning
                ? 'bg-neutral-800 text-neutral-500 border border-neutral-700/50 cursor-not-allowed'
                : 'bg-white text-black hover:bg-neutral-200 shadow-lg'
            }`}
          >
            <QrCode className="w-4 h-4" /> {scanning ? 'Registering Access...' : 'Simulate Scanning'}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
