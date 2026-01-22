import React, { useState, useEffect } from 'react';
import { API_BASE } from '../api';

function DetailModal({ animeId, onClose, inList, onToggleList }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!animeId) return;
        async function fetchFullDetails() {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/anime/${animeId}/full`);
                const data = await res.json();
                setDetails(data.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchFullDetails();
    }, [animeId]);

    if (!animeId) return null;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm transition-all duration-300"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-5xl max-h-[90vh] bg-[#181818] rounded-2xl overflow-y-auto shadow-2xl scrollbar-hide animate-modal-enter"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[1001] w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {loading ? (
                    <div className="h-[60vh] flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-[#0084ff] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : details && (
                    <div className="flex flex-col">
                        <div className="relative aspect-video w-full overflow-hidden">
                            {details.trailer?.embed_url ? (
                                <iframe
                                    src={`${details.trailer.embed_url}?autoplay=1&mute=1&controls=0`}
                                    className="w-full h-full scale-[1.35]"
                                    title="trailer"
                                    allow="autoplay"
                                />
                            ) : (
                                <img
                                    src={details.images.webp.large_image_url}
                                    className="w-full h-full object-cover"
                                    alt={details.title}
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8">
                                <h2 className="text-3xl md:text-5xl font-black mb-4 drop-shadow-lg">{details.title}</h2>
                                <div className="flex gap-4">
                                    <button className="btn-primary">
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                        Watch Now
                                    </button>
                                    <button
                                        onClick={onToggleList}
                                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${inList ? 'bg-[#0084ff] border-[#0084ff]' : 'bg-white/10 border-white/50 hover:border-white'}`}
                                    >
                                        {inList ? (
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="flex items-center gap-1 bg-[#0084ff] px-2.5 py-1 rounded-md font-bold text-sm">
                                        <svg className="w-4 h-4 fill-white" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        {details.score}
                                    </span>
                                    <span className="text-zinc-400 font-medium">{details.aired.prop.from.year}</span>
                                    <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[11px] font-bold uppercase">{details.rating?.split(' ')[0]}</span>
                                    <span className="text-zinc-400 font-medium">{details.episodes} Episodes</span>
                                    <span className="bg-white/10 px-1.5 text-[10px] rounded border border-white/20 text-zinc-300">HD</span>
                                </div>
                                <p className="text-lg text-zinc-300 leading-relaxed mb-6">
                                    {details.synopsis}
                                </p>
                            </div>
                            <div className="flex flex-col gap-5 text-sm">
                                <div>
                                    <p className="text-zinc-500 uppercase text-[11px] font-bold tracking-widest mb-1">Genres</p>
                                    <p className="text-zinc-200">{details.genres.map(g => g.name).join(', ')}</p>
                                </div>
                                <div>
                                    <p className="text-zinc-500 uppercase text-[11px] font-bold tracking-widest mb-1">Studios</p>
                                    <p className="text-zinc-200">{details.studios.map(s => s.name).join(', ')}</p>
                                </div>
                                <div>
                                    <p className="text-zinc-500 uppercase text-[11px] font-bold tracking-widest mb-1">Status</p>
                                    <p className="text-zinc-200">{details.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetailModal;
