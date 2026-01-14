import React from 'react';

    const Footer = () => {
      return (
        <footer className="bg-black border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex flex-wrap justify-center gap-4 text-white/60 text-sm">
                <a href="/terms" className="hover:underline">Terms of Use</a>
                <span className="mx-1">•</span>
                <a href="/privacy" className="hover:underline">Privacy Policy</a>
                <span className="mx-1">•</span>
                <a href="/cookies" className="hover:underline">Cookies</a>
                <span className="mx-1">•</span>
                <a href="/refund" className="hover:underline">Refund Policies</a>
              </div>
              <div className="text-white/40 text-xs mt-2">
                © 2026 Rosie Tejada. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      );
    };

    export default Footer;