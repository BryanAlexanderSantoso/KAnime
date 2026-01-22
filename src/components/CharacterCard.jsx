import React from 'react';

function CharacterCard({ character, onClick }) {
    const image = character.images?.webp?.image_url || character.images?.jpg?.image_url;
    const name = character.name || 'Unknown Character';
    const favorites = character.favorites || 0;

    return (
        <div
            onClick={onClick}
            className="group cursor-pointer relative overflow-hidden rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
        >
            {/* Character Image */}
            <div className="aspect-[2/3] relative overflow-hidden bg-zinc-800">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80"></div>

                {/* Favorites Badge */}
                {favorites > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
                        <svg className="w-3.5 h-3.5 fill-red-500" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                        <span className="text-xs font-bold text-white">
                            {favorites >= 1000 ? `${(favorites / 1000).toFixed(1)}K` : favorites}
                        </span>
                    </div>
                )}

                {/* Name */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-sm line-clamp-2 text-white drop-shadow-lg leading-tight">
                        {name}
                    </h3>
                </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-500/50 transition-all duration-300 pointer-events-none"></div>
        </div>
    );
}

export default CharacterCard;
