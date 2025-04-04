'use client';

import { useState, useEffect } from 'react';
import { Bell, MenuIcon, Search, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserPhoto } from '@/hooks/useUserPhoto';

interface HeaderProps {
  toggleSidebar: () => void;
  user?: { email: string; role: string } | null;
}

export default function Header({ toggleSidebar, user: propUser }: HeaderProps) {
  const [user, setUser] = useState<{ email: string; role: string } | null>(propUser || null);
  const { photoUrl, loading } = useUserPhoto(user?.email);

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      return;
    }
    
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
        }
      }
    }
  }, [propUser]);

  const getUserRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      'ADMIN': 'Administrateur',
      'COACH': 'Coach',
      'APPRENANT': 'Apprenant',
      'VIGIL': 'Vigil',
      'RESTAURATEUR': 'Restaurateur'
    };
    
    return roleMap[role] || role.toLowerCase();
  };

  return (
    <header className="bg-white border-b">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left: Menu button and search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 lg:hidden"
          >
            <MenuIcon size={24} />
          </button>
          
          <div className="hidden md:flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
            <Search size={20} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="bg-transparent border-none focus:outline-none text-sm w-48 xl:w-64" 
            />
          </div>
        </div>
        
        {/* Right: Notifications and profile */}
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 h-2 w-2 bg-orange-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-100">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                {loading ? (
                  <div className="w-full h-full bg-gray-200 animate-pulse" />
                ) : photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                    sizes="32px"
                    priority
                  />
                ) : (
                  <div className="w-full h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                    {user?.email ? user.email.charAt(0).toUpperCase() : <User size={20} />}
                  </div>
                )}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-700">
                  {user?.email || 'Utilisateur'}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.role ? getUserRoleDisplay(user.role) : 'Aucun rôle'}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}