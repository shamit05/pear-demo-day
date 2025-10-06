// HeaderNav Component - Pear Design
// Matches exact design from HTML

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HeaderNav() {
  const pathname = usePathname();
  const isCompanyPage = pathname?.startsWith('/company/');
  
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-black/10">
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
                className={`text-sm font-medium transition ${isCompanyPage ? 'text-black/60 hover:text-black' : 'text-black'}`}
                href="/"
              >
                Demo Day
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User Avatar */}
            <div className="relative group cursor-pointer">
              <img 
                src="https://bundui-images.netlify.app/avatars/01.png" 
                alt="User avatar"
                className="w-10 h-10 rounded-full shadow-md hover:shadow-lg transition-all"
              />
              {/* Tooltip on hover */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-black/10 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <p className="text-sm font-medium text-black">Investor Portal</p>
                <p className="text-xs text-black/60 mt-1">View your saved companies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
