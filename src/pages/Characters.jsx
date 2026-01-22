import React, { useState, useEffect } from 'react';
import {
    getTopCharacters,
    searchCharacters
} from '../api';
import CharacterCard from '../components/CharacterCard';
import CharacterModal from '../components/CharacterModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Characters() {
    const [characters, setCharacters] = useState([]);
    const [selectedCharId, setSelectedCharId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [navScrolled, setNavScrolled] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState('');

    // Sorting & Pagination
    const [orderBy, setOrderBy] = useState('favorites'); // mal_id, name, favorites
    const [sortDirection, setSortDirection] = useState('desc'); // asc, desc
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Alphabet for letter filter
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    useEffect(() => {
        loadTopCharacters();

        const handleScroll = () => setNavScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Reload when sorting changes
    useEffect(() => {
        if (isSearching) {
            handleSearch(new Event('submit'), true);
        } else {
            loadTopCharacters();
        }
    }, [orderBy, sortDirection]);

    const loadTopCharacters = async () => {
        setLoading(true);
        setCurrentPage(1);
        try {
            const data = await getTopCharacters({ limit: 24 });
            setCharacters(data.data || []);
            setHasNextPage(data.pagination?.has_next_page || false);
        } catch (error) {
            console.error('Error loading characters:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e, reset = false) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim() && !selectedLetter && !reset) return;

        if (reset) {
            setCurrentPage(1);
        }

        setIsSearching(true);
        setLoading(true);

        try {
            const params = {
                limit: 24,
                page: reset ? 1 : currentPage,
                order_by: orderBy,
                sort: sortDirection
            };
            if (selectedLetter) params.letter = selectedLetter;

            const data = await searchCharacters(searchQuery, params);

            if (reset) {
                setSearchResults(data.data || []);
                setCurrentPage(1);
            } else {
                setSearchResults(data.data || []);
            }

            setHasNextPage(data.pagination?.has_next_page || false);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreCharacters = async () => {
        setLoadingMore(true);
        const nextPage = currentPage + 1;

        try {
            const params = {
                limit: 24,
                page: nextPage,
                order_by: orderBy,
                sort: sortDirection
            };

            if (selectedLetter) params.letter = selectedLetter;

            const data = await searchCharacters(searchQuery, params);

            if (isSearching) {
                setSearchResults(prev => [...prev, ...(data.data || [])]);
            } else {
                setCharacters(prev => [...prev, ...(data.data || [])]);
            }

            setCurrentPage(nextPage);
            setHasNextPage(data.pagination?.has_next_page || false);
        } catch (error) {
            console.error('Error loading more:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleLetterClick = async (letter) => {
        setSelectedLetter(letter);
        setSearchQuery('');
        setIsSearching(true);
        setLoading(true);
        setCurrentPage(1);

        try {
            const data = await searchCharacters('', {
                letter,
                limit: 24,
                order_by: orderBy,
                sort: sortDirection
            });
            setSearchResults(data.data || []);
            setHasNextPage(data.pagination?.has_next_page || false);
        } catch (error) {
            console.error('Error filtering by letter:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setIsSearching(false);
        setSearchQuery('');
        setSelectedLetter('');
        setCurrentPage(1);
        loadTopCharacters();
    };

    const displayCharacters = isSearching ? searchResults : characters;

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white">
            <CharacterModal
                characterId={selectedCharId}
                onClose={() => setSelectedCharId(null)}
            />

            <Navbar
                navScrolled={navScrolled}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                isSearching={isSearching}
                setIsSearching={setIsSearching}
                showingFavorites={false}
                setShowingFavorites={() => { }}
            />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Hero Section */}
                    <div className="mb-16 text-center">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-6 py-2 rounded-full mb-6 border border-white/10">
                            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                            <span className="text-sm font-bold text-blue-300">Character Database</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
                            Discover Amazing<br />Characters
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Explore thousands of anime characters, from legendary heroes to beloved side characters
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-12">
                        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search characters... (e.g., Naruto, Luffy, Eren)"
                                    className="w-full px-6 py-5 bg-zinc-900/50 border border-white/10 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900/80 transition-all text-lg"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        {/* Letter Filter */}
                        <div className="max-w-5xl mx-auto mt-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm font-bold text-zinc-500">Filter by letter:</span>
                                {selectedLetter && (
                                    <button
                                        onClick={() => {
                                            setSelectedLetter('');
                                            clearSearch();
                                        }}
                                        className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full hover:bg-blue-500/30 transition-colors"
                                    >
                                        Clear: {selectedLetter} ✕
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {alphabet.map(letter => (
                                    <button
                                        key={letter}
                                        onClick={() => handleLetterClick(letter)}
                                        className={`w-10 h-10 rounded-lg font-bold transition-all ${selectedLetter === letter
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                                : 'bg-zinc-900/50 border border-white/10 text-zinc-400 hover:bg-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        {letter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sorting Controls */}
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                        {isSearching && (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={clearSearch}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {selectedLetter ? `Characters starting with "${selectedLetter}"` : `Search Results`}
                                    </h2>
                                    <p className="text-zinc-400 text-sm">
                                        {searchQuery && `for "${searchQuery}" - `}
                                        {displayCharacters.length} results found
                                    </p>
                                </div>
                            </div>
                        )}

                        {!isSearching && (
                            <div>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                                    <h2 className="text-3xl font-black">Most Popular Characters</h2>
                                </div>
                                <p className="text-zinc-400">
                                    Top characters ranked by community favorites
                                </p>
                            </div>
                        )}

                        {/* Sort Controls */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-zinc-500 font-bold">Sort by:</span>
                            <select
                                value={orderBy}
                                onChange={(e) => setOrderBy(e.target.value)}
                                className="bg-zinc-900/80 border border-white/10 rounded-lg px-4 py-2 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                            >
                                <option value="favorites">Favorites</option>
                                <option value="name">Name</option>
                                <option value="mal_id">ID</option>
                            </select>

                            <button
                                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                                className="p-2 bg-zinc-900/80 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                                title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                            >
                                {sortDirection === 'asc' ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Characters Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {[...Array(24)].map((_, i) => (
                                <div key={i} className="aspect-[2/3] bg-zinc-900/50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : displayCharacters.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                {displayCharacters.map(character => (
                                    <CharacterCard
                                        key={character.mal_id}
                                        character={character}
                                        onClick={() => setSelectedCharId(character.mal_id)}
                                    />
                                ))}
                            </div>

                            {/* Load More Button */}
                            {hasNextPage && (
                                <div className="flex justify-center mt-12">
                                    <button
                                        onClick={loadMoreCharacters}
                                        disabled={loadingMore}
                                        className="group relative bg-gradient-to-r from-blue-500 to-purple-500 px-12 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loadingMore ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Loading...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <span>Load More Characters</span>
                                                <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-900/50 rounded-full mb-6">
                                <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No characters found</h3>
                            <p className="text-zinc-400 mb-6">Try a different search term or filter</p>
                            <button
                                onClick={clearSearch}
                                className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl border border-white/10 transition-colors font-bold"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Characters;
