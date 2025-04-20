import React from 'react';
import { useAuth } from '../Auth/AuthProvider';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {user && <Navbar />}
      <main className="container mx-auto px-4 py-4">
        {children}
      </main>
    </div>
  );
} 