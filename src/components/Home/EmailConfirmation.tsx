'use client';

import { useAuth } from '@/context/AuthContext';
import EnterCodeFormModal from '../EmailValidation';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/sdkConfig';
import { toast } from 'react-toastify';

export default function EmailConfirmation() {
  const { token, user } = useAuth();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const toastDisplayed = useRef(false);
  const toastId = useRef<number | string | null>(null);
  useEffect(() => {
    const checkUserValidation = async () => {
      if (!token || !user?.sub) return;
      try {
        const profile = await api.user.getProfile(user.sub, token);
        if (!profile.isValidated && !toastDisplayed.current) {
          toastId.current = toast.info(
            <div>
              Verifica tu correo electrónico.{' '}
              <button
                onClick={() => {
                  toast.dismiss(toastId.current!);
                  setShowEmailModal(true);
                }}
                className="text-blue-300 underline hover:text-blue-500"
              >
                Verificar código
              </button>
            </div>,
            {
              autoClose: false,
              closeOnClick: false,
              draggable: true,
              position: 'top-right',
            },
          );
          toastDisplayed.current = true;
        }
      } catch (err) {
        console.error('Error verificando validación del usuario:', err);
      }
    };
    checkUserValidation();
  }, [token, user]);
  return (
    <>
      {token && user?.sub && (
        <EnterCodeFormModal
          show={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          userId={user.sub}
          jwt={token}
        />
      )}
    </>
  );
}
