import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Ana Sayfa' },
    { path: '/ozel-plans', label: 'Özel Ders Planları' },
    { path: '/create-plan', label: 'Yeni Plan' },
  ];

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-semibold">
              DersPlan
            </Link>
            <div className="flex items-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path)
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
} 