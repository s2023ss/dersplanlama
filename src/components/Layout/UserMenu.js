import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  // Kullanıcı e-postasından baş harfleri al
  const getInitials = () => {
    if (!user?.email) return '??';
    return user.email
      .split('@')[0]
      .split('.')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        {getInitials()}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border bg-card p-1 shadow-md">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground">
                Öğretmen
              </p>
            </div>
            <div className="h-px bg-border my-1" />
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/profile');
              }}
              className="w-full rounded px-2 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground"
            >
              Profil
            </button>
            <button
              onClick={handleSignOut}
              className="w-full rounded px-2 py-1.5 text-sm text-left text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              Çıkış Yap
            </button>
          </div>
        </>
      )}
    </div>
  );
} 