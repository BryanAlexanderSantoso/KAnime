import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimeCard from '../components/AnimeCard';
import DetailModal from '../components/DetailModal';
import { getSeasonalAnime, getSeasonsList, filterValidAnime } from '../api';

function SeasonArchive() {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [season, setSeason] = useState('winter');
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [selectedAnimeId, setSelectedAnimeId] = useState(null);
    const [navScrolled, setNavScrolled] = useState(false);

    // Dynamic Lists
    const [availableSeasons, setAvailableSeasons] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [seasonMap, setSeasonMap] = useState({});

    // Filters
    const [filter, setFilter] = useState(''); // tv, movie, etc
    const [sfw, setSfw] = useState(true);
    const [continuing, setContinuing] = useState(false);

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

        loadSeasonsList();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const loadSeasonsList = async () => {
        try {
            const data = await getSeasonsList();
            const list = data.data || [];

            const years = list.map(item => item.year);
            const map = {};
            list.forEach(item => {
                map[item.year] = item.seasons;
            });

            setAvailableYears(years);
            setSeasonMap(map);

            // Set initial seasons for current year
            if (map[year]) {
                setAvailableSeasons(map[year]);
                if (!map[year].includes(season)) {
                    setSeason(map[year][0]);
                }
            }
        } catch (error) {
            console.error('Error loading seasons list:', error);
            // Fallback
            setAvailableYears(Array.from({ length: 50 }, (_, i) => currentYear - i));
            setAvailableSeasons(['winter', 'spring', 'summer', 'fall']);
        }
    };

    useEffect(() => {
        if (seasonMap[year]) {
            setAvailableSeasons(seasonMap[year]);
            if (!seasonMap[year].includes(season)) {
                setSeason(seasonMap[year][0]);
            }
        }
    }, [year, seasonMap]);

    useEffect(() => {
        setPage(1);
        fetchSeason(1, true);
    }, [year, season, filter, sfw, continuing]);

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

            const data = await getSeasonalAnime(year, season, params);
            const filtered = filterValidAnime(data.data || []);

            if (reset) {
                setAnimeList(filtered);
            } else {
                setAnimeList(prev => [...prev, ...filtered]);
            }

            setHasNextPage(data.pagination?.has_next_page || false);
        } catch (error) {
            console.error('Error fetching seasonal anime history:', error);
            if (reset) setAnimeList([]);
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
        { id: 'tv', label: 'TV' },
        { id: 'movie', label: 'Movie' },
        { id: 'ova', label: 'OVA' },
        { id: 'ona', label: 'ONA' }
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
                    {/* Page Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest border border-amber-500/20">Archive Mode</span>
                            <div className="h-[1px] flex-1 bg-zinc-800"></div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase italic leading-tight">Seasonal <span className="text-amber-500">Archive</span></h1>
                        <p className="text-zinc-400 max-w-2xl text-lg leading-relaxed font-medium">
                            Step into the past and explore the vast history of anime. Browse titles from any season and any year,
                            filtering through decades of entertainment.
                        </p>
                    </div>

                    {/* Controls Panel */}
                    <div className="bg-zinc-900/40 p-6 md:p-8 rounded-[2.5rem] border border-white/5 mb-12 backdrop-blur-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Year Select */}
                            <div>
                                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Select Year</label>
                                {availableYears.length > 0 ? (
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(parseInt(e.target.value))}
                                        className="w-full bg-zinc-800 text-white px-5 py-4 rounded-2xl border border-white/5 focus:border-amber-500/50 outline-none transition-all appearance-none cursor-pointer font-bold"
                                    >
                                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                ) : (
                                    <div className="w-full h-14 bg-zinc-800 animate-pulse rounded-2xl border border-white/5"></div>
                                )}
                            </div>

                            {/* Season Select */}
                            <div>
                                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Select Season</label>
                                <div className="flex bg-zinc-800 p-1.5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
                                    {availableSeasons.length > 0 ? (
                                        availableSeasons.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setSeason(s)}
                                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${season === s
                                                        ? 'bg-amber-500 text-white shadow-lg'
                                                        : 'text-zinc-500 hover:text-zinc-300'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="w-full h-8 bg-zinc-700/30 animate-pulse rounded-xl"></div>
                                    )}
                                </div>
                            </div>

                            {/* Type Filter */}
                            <div>
                                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Filter Type</label>
                                <div className="flex flex-wrap gap-2">
                                    {typeFilters.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setFilter(t.id)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${filter === t.id
                                                ? 'bg-white text-black border-white'
                                                : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
                                                }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="flex flex-col justify-center gap-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div
                                        onClick={() => setContinuing(!continuing)}
                                        className={`w-10 h-5 rounded-full p-1 transition-all ${continuing ? 'bg-amber-500' : 'bg-zinc-700'}`}
                                    >
                                        <div className={`w-3 h-3 bg-white rounded-full transition-all transform ${continuing ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                    <span className={`text-xs font-black uppercase tracking-widest ${continuing ? 'text-white' : 'text-zinc-500'}`}>Continuing</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div
                                        onClick={() => setSfw(!sfw)}
                                        className={`w-10 h-5 rounded-full p-1 transition-all ${sfw ? 'bg-amber-500' : 'bg-zinc-700'}`}
                                    >
                                        <div className={`w-3 h-3 bg-white rounded-full transition-all transform ${sfw ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                    <span className={`text-xs font-black uppercase tracking-widest ${sfw ? 'text-white' : 'text-zinc-500'}`}>SFW Mode</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Results Grid */}
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
                                className="group relative px-12 py-5 bg-amber-500 text-black rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-3"
                            >
                                <span>Load Historical Data</span>
                                <svg className="w-4 h-4 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {!loading && animeList.length === 0 && (
                        <div className="text-center py-32 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/10">
                            <h2 className="text-3xl font-black mb-4 uppercase italic">No History Found</h2>
                            <p className="text-zinc-500 max-w-sm mx-auto font-medium">
                                We couldn't find any anime in {season} {year} matching your criteria.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default SeasonArchive;
