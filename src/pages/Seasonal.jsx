import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimeCard from '../components/AnimeCard';
import DetailModal from '../components/DetailModal';
import { getCurrentSeason, filterValidAnime } from '../api';

function Seasonal() {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [selectedAnimeId, setSelectedAnimeId] = useState(null);
    const [navScrolled, setNavScrolled] = useState(false);

    // Filters
    const [filter, setFilter] = useState(''); // tv, movie, etc
    const [sfw, setSfw] = useState(true);
    const [continuing, setContinuing] = useState(true);

    const [myList, setMyList] = useState(() => JSON.parse(localStorage.getItem('kanime-list') || '[]'));

    useEffect(() => {
        localStorage.setItem('kanime-list', JSON.stringify(myList));
    }, [myList]);

    const toggleMyList = (id) => {
        setMyList(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    useEffect(() => {
        const handleScroll = () => setNavScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setPage(1);
        fetchSeason(1, true);
    }, [filter, sfw, continuing]);

    const fetchSeason = async (pageNum, reset = false) => {
        setLoading(true);
        try {
            const params = {
                page: pageNum,
                limit: 24,
                filter: filter || undefined,
                sfw: sfw ? true : undefined,
                continuing: continuing ? true : undefined
            };

            const data = await getCurrentSeason(params);
            const filtered = filterValidAnime(data.data || []);

            if (reset) {
                setAnimeList(filtered);
            } else {
                setAnimeList(prev => [...prev, ...filtered]);
            }

            setHasNextPage(data.pagination?.has_next_page || false);
        } catch (error) {
            console.error('Error fetching seasonal anime:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchSeason(nextPage);
    };

    const typeFilters = [
        { id: '', label: 'All Type' },
        { id: 'tv', label: 'TV Series' },
        { id: 'movie', label: 'Movies' },
        { id: 'ova', label: 'OVA' },
        { id: 'ona', label: 'ONA' },
        { id: 'special', label: 'Specials' }
    ];

    return (
        <div className={`min-h-screen bg-[#0d0d0d] text-white ${selectedAnimeId ? 'overflow-hidden' : ''}`}>
            <DetailModal
                animeId={selectedAnimeId}
                onClose={() => setSelectedAnimeId(null)}
                inList={myList.includes(selectedAnimeId)}
                onToggleList={() => toggleMyList(selectedAnimeId)}
            />

            <Navbar navScrolled={navScrolled} />

            <main className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border border-red-500/20">Hot Season</span>
                            <div className="h-[1px] flex-1 bg-zinc-800"></div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase italic leading-tight">Current <span className="text-red-500">Season</span></h1>
                        <p className="text-zinc-400 max-w-2xl text-lg leading-relaxed font-medium">
                            Exploring the current anime season. Discover the latest broadcasting titles,
                            upcoming movies, and ongoing series that define this season.
                        </p>
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 bg-zinc-900/30 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <div className="flex flex-wrap gap-2">
                            {typeFilters.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setFilter(t.id)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === t.id
                                            ? 'bg-red-500 text-white shadow-xl shadow-red-500/20 scale-105'
                                            : 'bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div
                                    onClick={() => setContinuing(!continuing)}
                                    className={`w-12 h-6 rounded-full p-1 transition-all ${continuing ? 'bg-red-500' : 'bg-zinc-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-all transform ${continuing ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                                <span className={`text-sm font-bold transition-colors ${continuing ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'}`}>Continuing</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div
                                    onClick={() => setSfw(!sfw)}
                                    className={`w-12 h-6 rounded-full p-1 transition-all ${sfw ? 'bg-red-500' : 'bg-zinc-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-all transform ${sfw ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                                <span className={`text-sm font-bold transition-colors ${sfw ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'}`}>SFW Only</span>
                            </label>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="anime-grid">
                        {animeList.map(anime => (
                            <AnimeCard
                                key={anime.mal_id}
                                anime={anime}
                                onSelect={setSelectedAnimeId}
                            />
                        ))}
                        {loading && [...Array(12)].map((_, i) => (
                            <div key={`loading-${i}`} className="skuy-card bg-zinc-900 animate-pulse" />
                        ))}
                    </div>

                    {/* Load More */}
                    {hasNextPage && !loading && (
                        <div className="flex justify-center mt-16">
                            <button
                                onClick={loadMore}
                                className="group relative px-10 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all font-black text-sm uppercase tracking-widest flex items-center gap-3"
                            >
                                <span>Discover More</span>
                                <svg className="w-4 h-4 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {!loading && animeList.length === 0 && (
                        <div className="text-center py-32 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/10">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-zinc-900 rounded-full mb-8">
                                <svg className="w-12 h-12 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-black mb-4 uppercase italic">No Titles Found</h2>
                            <p className="text-zinc-500 max-w-sm mx-auto font-medium">
                                We couldn't find any anime matching your current filters. Try adjusting your selection.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Seasonal;
