import React, { useState } from 'react';
    import { Menu, X } from 'lucide-react';
    import Link from 'next/link';
    import { useRouter } from 'next/router';

    const Header = () => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const router = useRouter();

      const navigation = [
        { name: 'Home', href: '/' },
        { name: 'Messages', href: '/secure-messages' },
        { name: 'Payments', href: '/payments' },
        { name: 'Contact', href: '/contact' },
      ];

      return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-white font-semibold text-lg">
                Rosie Tejada
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      router.pathname === item.href
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden py-4 border-t border-white/10">
                <div className="flex flex-col space-y-3">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200 ${
                        router.pathname === item.href
                          ? 'text-white bg-white/5'
                          : 'text-white/80 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </header>
      );
    };

    export default Header;