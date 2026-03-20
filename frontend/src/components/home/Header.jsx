import { useState } from "react";
import { Search } from "lucide-react";

export default function Header({ search, setSearch, totalItems }) {
  // We use standard lucide icons if material isn't completely imported everywhere,
  // but we adapt to the "Velvet Crema" visual styling entirely.

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fef9f2]/80 dark:bg-[#1d1c18]/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(29,28,24,0.06)] px-6 py-4 flex items-center justify-between max-w-full border-b border-[#e6e2db]/50 dark:border-white/5">
      <div className="flex items-center gap-12">
        <h1 className="font-headline italic font-black text-[#361f1a] dark:text-[#fef9f2] text-2xl tracking-tight">Varun Jamwal</h1>
        
        {/* Search Bar - tactical native integration */}
        <div className="hidden lg:flex items-center bg-[#ece7e1] dark:bg-[#32302c] rounded-full px-5 py-2 w-96 group focus-within:ring-2 ring-[#d4c3bf]/50 dark:ring-[#827471]/50 transition-all shadow-inner">
          <span className="material-symbols-outlined text-[#504442] dark:text-[#ded9d3] mr-3 text-xl">search</span>
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[#827471] dark:placeholder:text-[#827471] placeholder:font-light font-body text-[#1d1c18] dark:text-[#fef9f2] outline-none" 
            placeholder="Search for your roast..." 
            type="text"
          />
        </div>
      </div>

      {/* Navigation Links (Desktop) */}
      <nav className="flex items-center gap-8">
        <div className="hidden xl:flex gap-8">

          <a className="font-label font-medium text-[#504442] dark:text-[#d4c3bf] hover:text-[#361f1a] dark:hover:text-[#fef9f2] transition-colors pb-1" href="">Orders</a>
         
        </div>
        
        {/* Mobile Search Icon */}
        <div className="flex lg:hidden items-center bg-[#ece7e1] dark:bg-[#32302c] rounded-full px-4 py-2 flex-1 max-w-[200px]">
          <Search size={16} className="text-[#504442] dark:text-[#ded9d3] mr-2" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-[13px] w-full placeholder:text-[#827471] outline-none" 
            placeholder="Search..." 
          />
        </div>
        
        {/* User / Settings Profile */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f8f3ec] dark:bg-[#1d1c18] border border-[#e6e2db] dark:border-white/10 flex items-center justify-center p-0.5 shadow-sm overflow-hidden">
             <div className="w-full h-full rounded-full bg-[#361f1a] flex items-center justify-center text-[#ffffff] font-headline font-bold text-sm">V</div>
          </div>
        </div>
      </nav>
    </header>
  );
}