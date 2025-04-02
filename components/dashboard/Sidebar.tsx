'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Book, 
  Calendar, 
  BarChart2,
  FileText,
  Settings,
  LogOut,
  X,
  QrCode,
  Coffee,
  Clipboard,
  School
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userRole?: 'ADMIN' | 'COACH' | 'APPRENANT' | 'RESTAURATEUR' | 'VIGIL';
}

export default function DashboardSidebar({ isOpen, setIsOpen, userRole = 'ADMIN' }: SidebarProps) {
  const pathname = usePathname();
  
  const getNavigationLinks = () => {
    // Common links for all roles
    const commonLinks = [
      { href: '/dashboard', label: 'Tableau de bord', icon: <Home size={20} /> },
    ];
    
    // Role-specific links
    const roleLinks = {
      ADMIN: [
        { href: '/dashboard/learners', label: 'Apprenants', icon: <Users size={20} /> },
        { href: '/dashboard/referentials', label: 'Référentiels', icon: <Book size={20} /> },
        { href: '/dashboard/promotions', label: 'Promotions', icon: <Calendar size={20} /> },
        { href: '/dashboard/attendance', label: 'Présence', icon: <FileText size={20} /> },
        { href: '/dashboard/statistics', label: 'Statistiques', icon: <BarChart2 size={20} /> },
        { href: '/dashboard/events', label: 'Événements', icon: <Calendar size={20} /> },
        { href: '/dashboard/settings', label: 'Paramètres', icon: <Settings size={20} /> },
      ],
      COACH: [
        { href: '/dashboard/learners', label: 'Apprenants', icon: <Users size={20} /> },
        { href: '/dashboard/modules', label: 'Modules', icon: <Book size={20} /> },
        { href: '/dashboard/attendance', label: 'Présence', icon: <FileText size={20} /> },
        { href: '/dashboard/grades', label: 'Notes', icon: <Clipboard size={20} /> },
      ],
      APPRENANT: [
        { href: '/dashboard/profile', label: 'Mon Profil', icon: <Users size={20} /> },
        { href: '/dashboard/attendance/my', label: 'Ma Présence', icon: <FileText size={20} /> },
        { href: '/dashboard/modules', label: 'Modules', icon: <Book size={20} /> },
        { href: '/dashboard/qrcode', label: 'Mon QR Code', icon: <QrCode size={20} /> },
      ],
      VIGIL: [
        { href: '/dashboard/attendance/scan', label: 'Scanner', icon: <QrCode size={20} /> },
        { href: '/dashboard/attendance/history', label: 'Historique', icon: <FileText size={20} /> },
      ],
      RESTAURATEUR: [
        { href: '/dashboard/meals/scan', label: 'Scanner', icon: <QrCode size={20} /> },
        { href: '/dashboard/meals/history', label: 'Historique', icon: <Coffee size={20} /> },
      ],
    };
    
    // Combine common links with role-specific links
    return [...commonLinks, ...(roleLinks[userRole] || [])];
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const links = getNavigationLinks();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-5 border-b">
            <Link href="/dashboard" className="flex items-center">
              <img 
                src="https://res.cloudinary.com/drxouwbms/image/upload/v1743507686/image_27_qtiin4.png" 
                alt="Sonatel Academy" 
                className="h-8"
              />
              <span className="ml-2 text-lg font-medium text-gray-800">ODC Inside</span>
            </Link>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* User role badge */}
          <div className="px-4 py-3 border-b">
            <div className="flex items-center">
              <School size={18} className="text-orange-500" />
              <span className="ml-2 text-sm font-medium text-gray-600">
                {userRole === 'ADMIN' && 'Administrateur'}
                {userRole === 'COACH' && 'Coach'}
                {userRole === 'APPRENANT' && 'Apprenant'}
                {userRole === 'VIGIL' && 'Vigil'}
                {userRole === 'RESTAURATEUR' && 'Restaurateur'}
              </span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'bg-orange-100 text-orange-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={`${isActive(link.href) ? 'text-orange-500' : 'text-gray-500'}`}>
                      {link.icon}
                    </span>
                    <span className="ml-3">{link.label}</span>
                    {isActive(link.href) && (
                      <span className="ml-auto w-1.5 h-6 bg-orange-500 rounded-full"></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <button 
              className="flex items-center justify-center w-full px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }
              }}
            >
              <LogOut size={18} />
              <span className="ml-2">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 