import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
    return (
        <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://c4.wallpaperflare.com/wallpaper/295/163/719/anime-anime-boys-picture-in-picture-kimetsu-no-yaiba-kamado-tanjirou-hd-wallpaper-preview.jpg')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-transparent to-transparent"></div>

            <div className="relative z-10 text-center flex flex-col items-center p-8">
                <div className="mb-8 animate-modal-enter">
                    <img
                        src="https://ik.imagekit.io/psdoxljjy/logo-removebg-preview.png?updatedAt=1748393870807"
                        alt="KANIME"
                        className="h-24 md:h-32 object-contain mx-auto"
                    />
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl animate-modal-enter" style={{ animationDelay: '0.1s' }}>
                    Welcome to <span className="text-[#0084ff]">KANIME</span>
                </h1>

                <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-modal-enter" style={{ animationDelay: '0.2s' }}>
                    The ultimate destination for premium anime discovery. Explore trending titles, watch latest episodes, and build your personal collection.
                </p>

                <div className="animate-modal-enter" style={{ animationDelay: '0.3s' }}>
                    <Link to="/home">
                        <button className="bg-[#0084ff] hover:bg-[#0073e6] text-white text-xl font-bold px-12 py-4 rounded-2xl shadow-xl shadow-blue-900/30 transition-all hover:scale-105 active:scale-95 group flex items-center gap-3">
                            Start Watching
                            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 mb-12 max-w-5xl animate-modal-enter" style={{ animationDelay: '0.4s' }}>
                    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-6 rounded-2xl hover:border-[#0084ff]/30 transition-colors">
                        <div className="w-12 h-12 bg-[#0084ff]/10 rounded-xl flex items-center justify-center mb-4 mx-auto text-[#0084ff]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">HD Streaming</h3>
                        <p className="text-zinc-400 text-sm">Experience your favorite anime in stunning 1080p quality with zero buffering.</p>
                    </div>
                    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-6 rounded-2xl hover:border-[#0084ff]/30 transition-colors">
                        <div className="w-12 h-12 bg-[#0084ff]/10 rounded-xl flex items-center justify-center mb-4 mx-auto text-[#0084ff]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Simulcast Updates</h3>
                        <p className="text-zinc-400 text-sm">Watch the latest episodes straight from Japan, available minutes after airing.</p>
                    </div>
                    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-6 rounded-2xl hover:border-[#0084ff]/30 transition-colors">
                        <div className="w-12 h-12 bg-[#0084ff]/10 rounded-xl flex items-center justify-center mb-4 mx-auto text-[#0084ff]">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Personal Collection</h3>
                        <p className="text-zinc-400 text-sm">Track your progress and build your ultimate watchlist with a single click.</p>
                    </div>
                </div>

                <div className="mt-12 mb-8 animate-modal-enter" style={{ animationDelay: '0.5s' }}>
                    <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-[0.2em] mb-3">Part of the Ecosystem</p>
                    <a href="https://kazeserenity.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all group">
                        <span className="text-zinc-300 font-bold group-hover:text-white transition-colors">KAZE SERENITY</span>
                        <svg className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#0084ff] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>

                <p className="text-zinc-700 text-xs animate-modal-enter" style={{ animationDelay: '0.6s' }}>
                    &copy; 2026 KAnime Platform.
                </p>
            </div>
        </div>
    );
}

export default Landing;
