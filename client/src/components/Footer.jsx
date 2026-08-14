export default function Footer() {
  return (
    <footer className="py-4 bg-[#1a1a1a] text-white relative">
      {/* Tricolor top accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
          <span className="block sm:inline">Designed & Developed by <a href="https://veaglespace.com" target="_blank" rel="noopener noreferrer" className="text-[#FF9933] hover:text-[#FFB366] transition-colors underline underline-offset-2 font-medium whitespace-nowrap">Veagle Space Technology Pvt. Ltd.</a></span>
          <span className="hidden sm:inline mx-1">|</span>
          <span className="block sm:inline mt-1 sm:mt-0">© {new Date().getFullYear()} All Rights Reserved.</span>
        </p>
      </div>
    </footer>
  );
}
