import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Navbar() {
  return (
    <>
      {/* Tricolor Top Accent Bar */}
      <div className="w-full h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] fixed top-0 z-50" />
      <nav className="fixed top-1.5 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center gap-2">
          <a href="https://veaglespace.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 sm:gap-1.5 cursor-pointer group">
            <img src="/logo.webp" alt="Say No To Drugs Campaign Logo - Veagle Space" className="h-16 sm:h-20 w-auto object-contain animate-coin-flip group-hover:scale-105 transition-transform duration-300" />
            <span className="text-base sm:text-lg font-black tracking-tight text-tricolor drop-shadow-[1.5px_1.5px_0_#1a1a1a] group-hover:opacity-80 transition-opacity duration-300">Say No To Drugs</span>
          </a>
          <Link
            href="/pledge"
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-[#FF9933] hover:bg-[#E6852E] text-white font-bold rounded-xl transition-all text-xs sm:text-sm shadow-lg shadow-[#FF9933]/20 hover:-translate-y-0.5 whitespace-nowrap"
          >
            <span className="[text-shadow:1px_1px_0_#1a1a1a]">Take a Pledge</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>
    </>
  );
}
