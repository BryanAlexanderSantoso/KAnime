import React from 'react';
import NavLink from './NavLink';

function Navbar({
    navScrolled,
    searchQuery,
    setSearchQuery,
    handleSearch,
    isSearching,
    setIsSearching,
    setActiveTab,
    setPage,
    showingFavorites,
    setShowingFavorites
}) {
    return (
        <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ease-out border-b ${navScrolled ? 'bg-black/90 backdrop-blur-md border-zinc-800/50 py-2' : 'bg-transparent border-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <img
                        src="https://ik.imagekit.io/psdoxljjy/logo-removebg-preview.png?updatedAt=1748393870807"
                        alt="KANIME"
                        className="h-10 md:h-12 object-contain cursor-pointer transition-transform hover:scale-105 active:scale-95"
                        onClick={() => { setIsSearching(false); setSearchQuery(''); setActiveTab('latest'); setPage(1); setShowingFavorites(false); }}
                    />
                    <div className="hidden lg:flex items-center gap-6">
                        <button onClick={() => setShowingFavorites(false)}><NavLink icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20l-7-7 7-7" /></svg>} label="Anime" active={!isSearching && !showingFavorites} /></button>
                        <NavLink icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>} label="Explore" />
                        <button onClick={() => setShowingFavorites(true)}><NavLink icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} label="Favorites" active={showingFavorites} /></button>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <form onSubmit={handleSearch} className="relative group">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`bg-zinc-900/50 border border-zinc-700/50 rounded-lg py-2 px-10 text-xs focus:ring-2 focus:ring-[#0084ff] transition-all duration-300 w-32 md:w-64`}
                        />
                        <svg className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </form>
                    <button className="bg-[#0084ff] hover:bg-[#0073e6] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20 transition-all">Login</button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
