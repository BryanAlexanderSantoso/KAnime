import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DetailModal from '../components/DetailModal';
import AnimeCard from '../components/AnimeCard';
import SectionRow from '../components/SectionRow';
import DiscordPopup from '../components/DiscordPopup';
import { getTopAnime, searchAnime, getAnimeById, filterValidAnime } from '../api';

function Home() {
    const location = useLocation();
    const [heroAnime, setHeroAnime] = useState(null);
    const [navScrolled, setNavScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedAnimeId, setSelectedAnimeId] = useState(null);

    const [activeTab, setActiveTab] = useState('latest');
    const [mainList, setMainList] = useState([]);
    const [page, setPage] = useState(1);
    const [loadingMain, setLoadingMain] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [myList, setMyList] = useState(() => JSON.parse(localStorage.getItem('kanime-list') || '[]'));
    const [showingFavorites, setShowingFavorites] = useState(false);

    useEffect(() => {
        localStorage.setItem('kanime-list', JSON.stringify(myList));
    }, [myList]);

    const toggleMyList = (id) => {
        setMyList(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    useEffect(() => {
        async function fetchInitial() {
            try {
                // Fetch dynamic hero from top titles
                const heroData = await getTopAnime({ limit: 5 });
                const randomHero = heroData.data[Math.floor(Math.random() * heroData.data.length)];
                setHeroAnime(randomHero);

                // Check for genre from navigation
                if (location.state?.genreId) {
                    handleGenreSearch(location.state.genreId, location.state.genreName);
                } else {
                    // Fetch initial list
                    fetchListData(1, 'latest', true);
                }
            } catch (e) { console.error(e); }
        }
        fetchInitial();

        const handleScroll = () => setNavScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.state]);

    const handleGenreSearch = async (genreId, genreName) => {
        setSearchQuery(genreName);
        setIsSearching(true);
        setShowingFavorites(false);
        try {
            const data = await searchAnime('', { genres: genreId.toString(), limit: 24 });
            const results = filterValidAnime(data.data || []);
            setSearchResults(results);
        } catch (e) { console.error(e); }
    };

    const fetchListData = async (pageNum, tab, reset = false) => {
        if (showingFavorites) return;
        if (reset) setLoadingMain(true);
        else setLoadingMore(true);

        try {
            let params = { page: pageNum, limit: 12 };

            if (tab === 'latest') params.filter = 'airing';
            if (tab === 'popular') params.filter = 'bypopularity';

            const data = await getTopAnime(params);
            const fetchedData = filterValidAnime(data.data || []);

            if (reset) setMainList(fetchedData);
            else setMainList(prev => [...prev, ...fetchedData]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingMain(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (!showingFavorites && page > 1) fetchListData(page, activeTab);
    }, [page]);

    useEffect(() => {
        if (!showingFavorites) {
            setPage(1);
            fetchListData(1, activeTab, true);
        }
    }, [activeTab, showingFavorites]);

    const fetchFavorites = async () => {
        if (myList.length === 0) {
            setMainList([]);
            setLoadingMain(false);
            return;
        }
        setLoadingMain(true);
        try {
            const results = await Promise.all(myList.map(id => getAnimeById(id)));
            setMainList(results.map(r => r.data));
        } catch (e) { console.error(e); } finally { setLoadingMain(false); }
    };

    useEffect(() => {
        if (showingFavorites) fetchFavorites();
    }, [showingFavorites, myList]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setShowingFavorites(false);
        if (searchQuery.trim()) {
            setIsSearching(true);
            try {
                const data = await searchAnime(searchQuery, { limit: 24 });
                const results = filterValidAnime(data.data || []);
                setSearchResults(results);
            } catch (e) { console.error(e); }
        } else { setIsSearching(false); }
    };

    return (
        <div className={`min-h-screen bg-[#0d0d0d] text-white select-none ${selectedAnimeId ? 'overflow-hidden' : ''}`}>
            <DetailModal
                animeId={selectedAnimeId}
                onClose={() => setSelectedAnimeId(null)}
                inList={myList.includes(selectedAnimeId)}
                onToggleList={() => toggleMyList(selectedAnimeId)}
            />

            <DiscordPopup />

            <Navbar
                navScrolled={navScrolled}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                isSearching={isSearching}
                setIsSearching={setIsSearching}
                setActiveTab={setActiveTab}
                setPage={setPage}
                showingFavorites={showingFavorites}
                setShowingFavorites={setShowingFavorites}
            />

            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {isSearching ? (
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <button onClick={() => setIsSearching(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                </button>
                                <h2 className="text-2xl font-bold text-zinc-400">Search Results: <span className="text-white italic">"{searchQuery}"</span></h2>
                            </div>
                            <div className="anime-grid">
                                {searchResults.map(anime => <AnimeCard key={anime.mal_id} anime={anime} onSelect={setSelectedAnimeId} />)}
                            </div>
                        </div>
                    ) : (
                        <>
                            {heroAnime ? (
                                <section className="hero-billboard group mb-16">
                                    <div className="absolute inset-0">
                                        <img src={heroAnime.images.webp.large_image_url} alt="Hero" className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" />
                                        <div className="absolute inset-0 hero-gradient"></div>
                                    </div>
                                    <div className="relative h-full flex flex-col justify-end px-6 md:px-16 pb-12">
                                        <div className="max-w-3xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="flex items-center gap-1.5 bg-[#0084ff] px-3 py-1.5 rounded-lg text-sm font-bold shadow-xl shadow-blue-950/20"><svg className="w-4 h-4 fill-white" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> {heroAnime.score}</span>
                                                <span className="bg-zinc-800/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-300">{heroAnime.type}</span>
                                                <span className="bg-zinc-800/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-300">Epic Journey</span>
                                            </div>
                                            <h2 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-2xl leading-tight uppercase italic">{heroAnime.title}</h2>
                                            <p className="text-zinc-300 text-sm md:text-base font-medium mb-8 line-clamp-3 leading-relaxed max-w-2xl">{heroAnime.synopsis}</p>
                                            <div className="flex gap-4">
                                                <button className="btn-primary" onClick={() => setSelectedAnimeId(heroAnime.mal_id)}>
                                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M5 5v14l11-7z" /></svg>
                                                    Watch Now
                                                </button>
                                                <button className="btn-zinc" onClick={() => setSelectedAnimeId(heroAnime.mal_id)}>
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            ) : (
                                <div className="hero-billboard bg-zinc-900 animate-pulse mb-16" />
                            )}

                            {/* Main Content Tabs */}
                            <div className="flex items-center gap-3 mb-10 border-b border-zinc-800 pb-1">
                                <button
                                    onClick={() => setActiveTab('latest')}
                                    className={activeTab === 'latest' ? 'tab-active' : 'tab-inactive'}
                                >
                                    Latest Update
                                </button>
                                <button
                                    onClick={() => setActiveTab('popular')}
                                    className={activeTab === 'popular' ? 'tab-active' : 'tab-inactive'}
                                >
                                    Popular
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="anime-grid">
                                    {loadingMain ? [...Array(12)].map((_, i) => <div key={i} className="skuy-card animate-pulse bg-zinc-800" />) :
                                        mainList.map(anime => <AnimeCard key={anime.mal_id} anime={anime} onSelect={setSelectedAnimeId} />)}
                                </div>

                                {loadingMore && (
                                    <div className="anime-grid mt-6">
                                        {[...Array(6)].map((_, i) => <div key={i} className="skuy-card animate-pulse bg-zinc-800" />)}
                                    </div>
                                )}

                                {!showingFavorites && (
                                    <div className="flex justify-center mt-10">
                                        <button
                                            onClick={() => setPage(p => p + 1)}
                                            disabled={loadingMore}
                                            className="bg-white/5 hover:bg-white/10 text-zinc-300 px-10 py-3 rounded-xl border border-white/5 transition-all font-bold disabled:opacity-50"
                                        >
                                            {loadingMore ? 'Loading...' : 'Load More Content'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Section Rows */}
                            <div className="mt-24 space-y-16">
                                <SectionRow title="Recently Released Episodes" type="recent-episodes" onSelect={setSelectedAnimeId} />
                                <SectionRow title="Popular Episodes" type="popular-episodes" onSelect={setSelectedAnimeId} />
                                <SectionRow title="Trending Now" type="trending" onSelect={setSelectedAnimeId} />
                                <SectionRow title="Top Airing" type="airing" onSelect={setSelectedAnimeId} />
                                <SectionRow title="Latest Trailers" type="recent-promos" onSelect={setSelectedAnimeId} />
                                <SectionRow title="Popular Trailers" type="popular-promos" onSelect={setSelectedAnimeId} />
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Home;
