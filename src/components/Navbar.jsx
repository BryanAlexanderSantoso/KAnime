import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CardNav from './CardNav';

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
    const location = useLocation();
    const isHomePage = location.pathname === '/home';

    const navItems = [
        {
            label: 'Browse',
            bgColor: 'rgba(0, 132, 255, 0.05)',
            textColor: '#fff',
            links: [
                { label: 'All Anime', href: '/home' },
                { label: 'Seasonal', href: '/seasonal' },
                { label: 'Upcoming', href: '/upcoming' },
                { label: 'Archive', href: '/archive' }
            ]
        },
        {
            label: 'Features',
            bgColor: 'rgba(168, 85, 247, 0.05)',
            textColor: '#fff',
            links: [
                { label: 'Schedules', href: '/schedules' },
                { label: 'Genres', href: '/genres' },
                { label: 'Characters', href: '/characters' }
            ]
        },
        {
            label: 'Personal',
            bgColor: 'rgba(236, 72, 153, 0.05)',
            textColor: '#fff',
            links: [
                {
                    label: 'Favorites',
                    onClick: () => {
                        if (isHomePage) {
                            setShowingFavorites(true);
                        } else {
                            window.location.href = '/home?showFavorites=true';
                        }
                    }
                },
                { label: 'My Watchlist', href: '#' },
                { label: 'Settings', href: '#' }
            ]
        }
    ];

    return (
        <div className="flex flex-col items-center">
            {/* Main Navigation */}
            <CardNav
                logo="https://ik.imagekit.io/psdoxljjy/logo-removebg-preview.png?updatedAt=1748393870807"
                items={navItems}
                onCtaClick={() => console.log('Profile clicked')}
            />

            {/* Search Floating Bar - Repositioned to be below the main nav when scrolled or always visible elsewhere */}
            <div className={`fixed z-[99] transition-all duration-500 flex justify-center w-full ${navScrolled ? 'top-20 opacity-100' : 'top-28 opacity-0 pointer-events-none'}`}>
                <form onSubmit={handleSearch} className="relative group max-w-md w-full px-4">
                    <input
                        type="text"
                        placeholder="Search your favorite anime..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl py-3 px-12 text-sm focus:ring-2 focus:ring-[#0084ff] transition-all duration-300 w-full shadow-2xl"
                    />
                    <svg className="absolute left-8 top-3.5 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </form>
            </div>

            {/* Non-scrolled Search Bar (Initial State) */}
            {!navScrolled && (
                <div className="absolute top-32 z-[99] w-full flex justify-center">
                    <form onSubmit={handleSearch} className="relative group max-w-xl w-full px-4">
                        <input
                            type="text"
                            placeholder="Quick find..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl py-4 px-14 text-base focus:ring-2 focus:ring-[#0084ff] transition-all duration-300 w-full"
                        />
                        <svg className="absolute left-9 top-4.5 w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Navbar;
