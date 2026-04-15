import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from './ui/alert-dialog';

const AGE_VERIFY_KEY = 'nrw_age_verified';

const AgeVerificationModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem(AGE_VERIFY_KEY);
    if (!verified) {
      setTimeout(() => setOpen(true), 300);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem(AGE_VERIFY_KEY, 'true');
    setOpen(false);
  };

  const handleLeave = () => {
    window.location.href = 'https://www.google.de';
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        data-testid="age-verification-modal"
        className="border-white/12 max-w-sm"
        style={{ background: '#111', color: '#f0f0f0' }}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: '#cc0000', fontFamily: 'Oswald, sans-serif', fontSize: '14px' }}>18+</div>
            <AlertDialogTitle style={{ fontFamily: 'Oswald, sans-serif', color: '#f0f0f0', fontSize: '22px', fontWeight: 700 }}>
              Altersverifikation
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-white/60 text-sm leading-relaxed">
            Diese Seite enthält Inhalte für Erwachsene und ist <strong className="text-white/80">ausschließlich für Personen ab 18 Jahren</strong> bestimmt.
            <br /><br />
            Mit dem Betreten bestätigst du, dass du mindesens 18 Jahre alt bist und solche Inhalte in deinem Land legal abrufen darfst.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 mt-4">
          <AlertDialogCancel
            onClick={handleLeave}
            data-testid="age-verification-leave-button"
            className="flex-1 border-white/20 text-white/60 hover:text-white hover:bg-white/5"
            style={{ background: 'transparent' }}
          >
            Verlassen
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            data-testid="age-verification-confirm-button"
            className="flex-1 font-semibold"
            style={{ background: '#cc0000', color: '#fff', boxShadow: '0 0 0 1px rgba(255,34,68,0.35), 0 0 24px rgba(255,34,68,0.18)' }}
          >
            Ich bin 18+
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AgeVerificationModal;
