import React from 'react';
import TiltedCard from './TiltedCard';

function AnimeCard({ anime, onSelect, badge }) {
    // Overlay content for the TiltedCard
    const Overlay = (
        <div className="relative w-full h-full">
            {badge && (
                <div className="absolute top-2 left-2 z-10 bg-[#0084ff] text-white text-[10px] font-black px-2 py-1 rounded shadow-lg">
                    {badge}
                </div>
            )}

            <div className="card-overlay rounded-b-[15px]">
                <p className="font-bold truncate text-white text-sm mb-1 text-left">{anime.title}</p>
                <div className="flex justify-between items-center text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1 text-yellow-500 font-bold">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        {anime.score || 'N/A'}
                    </span>
                    <span className="text-zinc-400">{anime.episodes || '?'} eps</span>
                </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-[15px]">
                <div className="bg-white rounded-full p-3 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <svg className="w-6 h-6 text-zinc-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
            </div>
        </div>
    );

    return (
        <div className="skuy-card border-none bg-transparent shadow-none hover:shadow-none hover:translate-y-0 hover:scale-100" onClick={() => onSelect(anime.mal_id)}>
            <TiltedCard
                imageSrc={anime.images.webp.large_image_url}
                altText={anime.title}
                captionText={anime.title}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={10}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={Overlay}
            />
        </div>
    );
}

export default AnimeCard;
