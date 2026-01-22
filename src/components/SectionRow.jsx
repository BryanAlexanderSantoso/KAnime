import React, { useState, useEffect } from 'react';
import AnimeCard from './AnimeCard';
import { API_BASE } from '../api';

function SectionRow({ title, type, onSelect }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                let url = `${API_BASE}/top/anime?limit=15`;
                if (type === 'trending') url = `${API_BASE}/top/anime?filter=bypopularity&limit=15`;
                if (type === 'airing') url = `${API_BASE}/top/anime?filter=airing&limit=15`;
                if (type === 'recent-episodes') url = `${API_BASE}/watch/episodes`;
                if (type === 'popular-episodes') url = `${API_BASE}/watch/episodes/popular`;
                if (type === 'recent-promos') url = `${API_BASE}/watch/promos`;
                if (type === 'popular-promos') url = `${API_BASE}/watch/promos/popular`;

                const res = await fetch(url);
                const data = await res.json();

                let processedData = data.data || [];

                // Endpoints with nested .entry
                if (type.includes('episodes')) {
                    processedData = processedData.map(item => ({
                        ...item.entry,
                        badge_label: item.episodes?.[0]?.title?.split(' ')[1] ? `EP ${item.episodes[0].title.split(' ')[1]}` : 'NEW'
                    }));
                } else if (type.includes('promos')) {
                    processedData = processedData.map(item => ({
                        ...item.entry,
                        badge_label: 'PROMO'
                    }));
                } else if (type === 'recent') { // Fallback for previous 'recent' type
                    processedData = processedData.map(item => ({
                        ...item.entry,
                        badge_label: item.episodes?.[0]?.title?.split(' ')[1] ? `EP ${item.episodes[0].title.split(' ')[1]}` : null
                    }));
                }

                // Filter out broken entries (Region locked or Placeholder)
                processedData = processedData.filter(item =>
                    item.title &&
                    !item.title.toLowerCase().includes('not available') &&
                    !item.images?.webp?.large_image_url?.includes('questionmark')
                );

                setItems(processedData);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        }
        fetchData();
    }, [type]);

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6 px-1">
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                <button className="text-[#0084ff] text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="anime-grid">
                {loading ? [...Array(6)].map((_, i) => <div key={i} className="skuy-card animate-pulse bg-zinc-800" />) :
                    items.slice(0, 6).map((anime, idx) => (
                        <AnimeCard
                            key={`${anime.mal_id}-${idx}`}
                            anime={anime}
                            onSelect={onSelect}
                            badge={anime.badge_label}
                        />
                    ))}
            </div>
        </div>
    );
}

export default SectionRow;
