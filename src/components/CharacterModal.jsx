import React, { useState, useEffect } from 'react';
import {
    getCharacterById,
    getCharacterAnime,
    getCharacterVoiceActors
} from '../api';

function CharacterModal({ characterId, onClose }) {
    const [character, setCharacter] = useState(null);
    const [animeList, setAnimeList] = useState([]);
    const [voiceActors, setVoiceActors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('anime'); // anime, voices, about

    useEffect(() => {
        if (characterId) {
            loadCharacterData();
        } else {
            setCharacter(null);
            setAnimeList([]);
            setVoiceActors([]);
        }
    }, [characterId]);

    const loadCharacterData = async () => {
        setLoading(true);
        try {
            const [charData, animeData, voicesData] = await Promise.all([
                getCharacterById(characterId),
                getCharacterAnime(characterId),
                getCharacterVoiceActors(characterId)
            ]);

            setCharacter(charData.data);
            setAnimeList(animeData.data || []);
            setVoiceActors(voicesData.data || []);
        } catch (error) {
            console.error('Error loading character:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!characterId) return null;

    const mainRoles = animeList.filter(a => a.role === 'Main');
    const supportingRoles = animeList.filter(a => a.role === 'Supporting');
    const japaneseVA = voiceActors.find(v => v.language === 'Japanese');
    const englishVA = voiceActors.find(v => v.language === 'English');

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative max-w-5xl w-full max-h-[90vh] bg-[#0d0d0d] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-all border border-white/10"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : character ? (
                    <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
                        {/* Header with Background Image */}
                        <div className="relative h-80">
                            <div className="absolute inset-0">
                                <img
                                    src={character.images?.webp?.image_url || character.images?.jpg?.image_url}
                                    alt={character.name}
                                    className="w-full h-full object-cover blur-2xl opacity-30 scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/60 to-transparent"></div>
                            </div>

                            <div className="relative h-full flex items-end p-8 gap-6">
                                {/* Character Image */}
                                <div className="flex-shrink-0">
                                    <div className="w-48 h-64 rounded-xl overflow-hidden border-4 border-white/10 shadow-2xl">
                                        <img
                                            src={character.images?.webp?.image_url || character.images?.jpg?.image_url}
                                            alt={character.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Character Info */}
                                <div className="flex-1 pb-4">
                                    <h1 className="text-4xl font-black mb-2 drop-shadow-lg">
                                        {character.name}
                                    </h1>
                                    {character.name_kanji && (
                                        <p className="text-xl text-zinc-400 mb-3 font-medium">
                                            {character.name_kanji}
                                        </p>
                                    )}
                                    {character.nicknames && character.nicknames.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {character.nicknames.map((nickname, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                                                >
                                                    {nickname}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 fill-red-500" viewBox="0 0 20 20">
                                                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                            </svg>
                                            <span className="font-bold">{character.favorites?.toLocaleString() || 0}</span>
                                            <span className="text-zinc-400 text-sm">favorites</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                            </svg>
                                            <span className="font-bold">{animeList.length}</span>
                                            <span className="text-zinc-400 text-sm">anime</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-8 pt-6 border-b border-white/10">
                            <div className="flex gap-6">
                                <button
                                    onClick={() => setActiveTab('anime')}
                                    className={`pb-4 px-2 font-bold transition-all ${activeTab === 'anime'
                                            ? 'text-blue-400 border-b-2 border-blue-400'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    Anime ({animeList.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('voices')}
                                    className={`pb-4 px-2 font-bold transition-all ${activeTab === 'voices'
                                            ? 'text-blue-400 border-b-2 border-blue-400'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    Voice Actors ({voiceActors.length})
                                </button>
                                {character.about && (
                                    <button
                                        onClick={() => setActiveTab('about')}
                                        className={`pb-4 px-2 font-bold transition-all ${activeTab === 'about'
                                                ? 'text-blue-400 border-b-2 border-blue-400'
                                                : 'text-zinc-500 hover:text-zinc-300'
                                            }`}
                                    >
                                        About
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-8">
                            {activeTab === 'anime' && (
                                <div>
                                    {mainRoles.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                Main Roles ({mainRoles.length})
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {mainRoles.map((item, i) => (
                                                    <div
                                                        key={i}
                                                        className="group cursor-pointer bg-zinc-900/50 rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all"
                                                    >
                                                        <div className="aspect-[3/4] relative">
                                                            <img
                                                                src={item.anime.images?.webp?.large_image_url || item.anime.images?.jpg?.large_image_url}
                                                                alt={item.anime.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                                        </div>
                                                        <div className="p-3">
                                                            <p className="font-bold text-sm line-clamp-2">{item.anime.title}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {supportingRoles.length > 0 && (
                                        <div>
                                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                Supporting Roles ({supportingRoles.length})
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {supportingRoles.map((item, i) => (
                                                    <div
                                                        key={i}
                                                        className="group cursor-pointer bg-zinc-900/50 rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all"
                                                    >
                                                        <div className="aspect-[3/4] relative">
                                                            <img
                                                                src={item.anime.images?.webp?.large_image_url || item.anime.images?.jpg?.large_image_url}
                                                                alt={item.anime.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                                        </div>
                                                        <div className="p-3">
                                                            <p className="font-bold text-sm line-clamp-2">{item.anime.title}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {animeList.length === 0 && (
                                        <p className="text-center text-zinc-500 py-12">No anime data available</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'voices' && (
                                <div className="space-y-4">
                                    {japaneseVA && (
                                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-white/5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs font-bold rounded">🇯🇵 Japanese</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {japaneseVA.person.images?.jpg?.image_url && (
                                                    <img
                                                        src={japaneseVA.person.images.jpg.image_url}
                                                        alt={japaneseVA.person.name}
                                                        className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
                                                    />
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-lg">{japaneseVA.person.name}</h4>
                                                    <a
                                                        href={japaneseVA.person.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-400 hover:underline"
                                                    >
                                                        View Profile →
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {englishVA && (
                                        <div className="bg-zinc-900/50 rounded-xl p-6 border border-white/5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded">🇺🇸 English</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {englishVA.person.images?.jpg?.image_url && (
                                                    <img
                                                        src={englishVA.person.images.jpg.image_url}
                                                        alt={englishVA.person.name}
                                                        className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
                                                    />
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-lg">{englishVA.person.name}</h4>
                                                    <a
                                                        href={englishVA.person.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-400 hover:underline"
                                                    >
                                                        View Profile →
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {voiceActors.filter(v => v.language !== 'Japanese' && v.language !== 'English').map((va, i) => (
                                        <div key={i} className="bg-zinc-900/50 rounded-xl p-6 border border-white/5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded">
                                                    {va.language}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {va.person.images?.jpg?.image_url && (
                                                    <img
                                                        src={va.person.images.jpg.image_url}
                                                        alt={va.person.name}
                                                        className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
                                                    />
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-lg">{va.person.name}</h4>
                                                    <a
                                                        href={va.person.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-400 hover:underline"
                                                    >
                                                        View Profile →
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {voiceActors.length === 0 && (
                                        <p className="text-center text-zinc-500 py-12">No voice actor data available</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'about' && character.about && (
                                <div className="prose prose-invert max-w-none">
                                    <div className="bg-zinc-900/50 rounded-xl p-6 border border-white/5">
                                        <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                            {character.about}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-96">
                        <p className="text-zinc-500">Character not found</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CharacterModal;
