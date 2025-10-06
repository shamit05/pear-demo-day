'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User } from '@/types/user';

export default function HeaderNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isCompanyPage = pathname?.startsWith('/company/');
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'founder') return '/dashboard/founder';
    return '/dashboard/investor';
  };
  
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-black/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src="https://pear.vc/wp-content/themes/pear-vc/assets/images/pearvc_logo.png" 
                alt="Pear VC"
                className="h-8 w-auto"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                className={`text-sm font-medium transition ${!isCompanyPage && pathname === '/' ? 'text-black' : 'text-black/60 hover:text-black'}`}
                href="/"
              >
                Demo Day
              </Link>
              {user && (
                <Link 
                  className={`text-sm font-medium transition ${pathname?.startsWith('/dashboard') ? 'text-black' : 'text-black/60 hover:text-black'}`}
                  href={getDashboardLink()}
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                          <p className="text-xs text-[var(--button-color)] font-medium mt-1 capitalize">
                            {user.role}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* Login Button */
              <Link
                href="/login"
                className="px-4 py-2 border-2 border-black bg-transparent text-black rounded-lg hover:bg-black hover:text-white transition font-medium text-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
