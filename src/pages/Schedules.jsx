import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimeCard from '../components/AnimeCard';
import DetailModal from '../components/DetailModal';
import { getSchedules, filterValidAnime } from '../api';

function Schedules() {
    const days = [
        { id: 'monday', label: 'Mon' },
        { id: 'tuesday', label: 'Tue' },
        { id: 'wednesday', label: 'Wed' },
        { id: 'thursday', label: 'Thu' },
        { id: 'friday', label: 'Fri' },
        { id: 'saturday', label: 'Sat' },
        { id: 'sunday', label: 'Sun' }
    ];

    const getCurrentDay = () => {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return dayNames[new Date().getDay()];
    };

    const [activeDay, setActiveDay] = useState(getCurrentDay());
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnimeId, setSelectedAnimeId] = useState(null);
    const [navScrolled, setNavScrolled] = useState(false);
    const [sfwOnly, setSfwOnly] = useState(true);

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
        fetchSchedule();
    }, [activeDay, sfwOnly]);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const data = await getSchedules({
                filter: activeDay,
                sfw: sfwOnly,
                limit: 25
            });
            setAnimeList(filterValidAnime(data.data || []));
        } catch (error) {
            console.error('Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    };

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
                    {/* Hero */}
                    <div className="mb-16">
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-1.5 rounded-full mb-4 border border-blue-500/10">
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Broadcast Schedule</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-6 italic uppercase">Weekly <span className="text-blue-500">Schedules</span></h1>
                        <p className="text-zinc-400 max-w-2xl leading-relaxed">
                            Stay updated with the latest broadcast times for your favorite currently airing anime.
                            Select a day to see what's trending and when it airs.
                        </p>
                    </div>

                    {/* Day Selection & Filters */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 border-b border-zinc-800/50 pb-6">
                        <div className="flex flex-wrap gap-2">
                            {days.map((day) => (
                                <button
                                    key={day.id}
                                    onClick={() => setActiveDay(day.id)}
                                    className={`px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${activeDay === day.id
                                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20 scale-105'
                                            : 'bg-zinc-900/50 text-zinc-500 hover:text-white border border-white/5 hover:border-white/10'
                                        }`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 bg-zinc-900/40 p-1.5 rounded-2xl border border-white/5">
                            <button
                                onClick={() => setSfwOnly(true)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${sfwOnly ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-400'}`}
                            >
                                SFW
                            </button>
                            <button
                                onClick={() => setSfwOnly(false)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${!sfwOnly ? 'bg-red-500/20 text-red-400' : 'text-zinc-500 hover:text-zinc-400'}`}
                            >
                                NSFW
                            </button>
                        </div>
                    </div>

                    {/* Content Grid */}
                    {loading ? (
                        <div className="anime-grid">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="skuy-card animate-pulse bg-zinc-900" />
                            ))}
                        </div>
                    ) : animeList.length > 0 ? (
                        <div className="anime-grid">
                            {animeList.map(anime => (
                                <AnimeCard
                                    key={anime.mal_id}
                                    anime={anime}
                                    onSelect={setSelectedAnimeId}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-white/5">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-900 rounded-full mb-6">
                                <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-2 uppercase italic">No broadcasts today</h3>
                            <p className="text-zinc-500">There are no anime scheduled for release on this day.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Schedules;
