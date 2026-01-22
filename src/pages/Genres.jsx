import React, { useState, useEffect } from 'react';
import { getAnimeGenres, searchAnime } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

function Genres() {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('genres');
    const [navScrolled, setNavScrolled] = useState(false);
    const navigate = useNavigate();

    const filters = [
        { id: 'genres', label: 'Main Genres' },
        { id: 'themes', label: 'Themes' },
        { id: 'demographics', label: 'Demographics' },
        { id: 'explicit_genres', label: 'Adult' }
    ];

    useEffect(() => {
        const handleScroll = () => setNavScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        loadGenres();
    }, [filter]);

    const loadGenres = async () => {
        setLoading(true);
        try {
            const data = await getAnimeGenres({ filter });
            // Sort by count descending
            const sorted = (data.data || []).sort((a, b) => b.count - a.count);
            setGenres(sorted);
        } catch (error) {
            console.error('Error loading genres:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenreClick = (genreId, genreName) => {
        // Redirect to home or search page with genre filter
        // Actually, we can just redirect to home and pass genre in state or query
        navigate('/home', { state: { genreId, genreName } });
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white">
            <Navbar navScrolled={navScrolled} />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Hero Section */}
                    <div className="mb-16 text-center">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-6 py-2 rounded-full mb-6 border border-white/10">
                            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                            <span className="text-sm font-bold text-blue-300">Anime Categories</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
                            Browse by<br />Genre
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Filter through thousands of titles by their categories, themes, and target demographics.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {filters.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={`px-8 py-3 rounded-xl font-bold transition-all border ${filter === f.id
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg shadow-blue-500/20'
                                        : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Genres Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="h-32 bg-zinc-900/50 rounded-2xl animate-pulse border border-white/5" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {genres.map((genre) => (
                                <div
                                    key={genre.mal_id}
                                    onClick={() => handleGenreClick(genre.mal_id, genre.name)}
                                    className="group cursor-pointer relative overflow-hidden bg-zinc-900/40 border border-white/5 p-6 rounded-2xl hover:border-blue-500/40 hover:bg-zinc-900/60 transition-all duration-300"
                                >
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-black mb-1 transition-colors group-hover:text-blue-400">
                                            {genre.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-zinc-500 text-sm font-bold">
                                            <span className="bg-white/5 px-2 py-0.5 rounded text-xs">
                                                {genre.count.toLocaleString()}
                                            </span>
                                            <span>Titles</span>
                                        </div>
                                    </div>

                                    {/* Abstract BG Decor */}
                                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>

                                    <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && genres.length === 0 && (
                        <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-white/10">
                            <p className="text-zinc-500 font-bold">No categories found in this filter.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Genres;
