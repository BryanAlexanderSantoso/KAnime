/**
 * Character API Examples for KAnime
 * 
 * This file demonstrates practical use cases for character-related API functions.
 */

import {
    getCharacterAnime,
    getCharacterById,
    getCharacterFull,
    getCharacterVoiceActors,
    searchCharacters,
    getTopCharacters,
    getCharacterPictures
} from './api';

// ============================================================================
// 1. GET CHARACTER INFORMATION
// ============================================================================

/**
 * Get basic character info
 */
export const getCharacterInfo = async (characterId) => {
    try {
        const character = await getCharacterById(characterId);
        return {
            id: character.data.mal_id,
            name: character.data.name,
            nameKanji: character.data.name_kanji,
            nicknames: character.data.nicknames,
            about: character.data.about,
            images: character.data.images,
            favorites: character.data.favorites
        };
    } catch (error) {
        console.error('Error fetching character:', error);
        return null;
    }
};

/**
 * Get full character details with everything
 */
export const getCompleteCharacterInfo = async (characterId) => {
    try {
        const fullData = await getCharacterFull(characterId);
        return {
            info: fullData.data,
            anime: fullData.data.anime,
            manga: fullData.data.manga,
            voices: fullData.data.voices
        };
    } catch (error) {
        console.error('Error fetching full character data:', error);
        return null;
    }
};

// ============================================================================
// 2. GET CHARACTER'S ANIME APPEARANCES
// ============================================================================

/**
 * Get all anime where character appears
 */
export const getCharacterAppearances = async (characterId) => {
    try {
        const data = await getCharacterAnime(characterId);
        return data.data.map(item => ({
            role: item.role,
            anime: {
                id: item.anime.mal_id,
                title: item.anime.title,
                image: item.anime.images.webp.large_image_url,
                url: item.anime.url
            }
        }));
    } catch (error) {
        console.error('Error fetching character anime:', error);
        return [];
    }
};

/**
 * Get only main roles for a character
 */
export const getCharacterMainRoles = async (characterId) => {
    try {
        const data = await getCharacterAnime(characterId);
        return data.data
            .filter(item => item.role === 'Main')
            .map(item => item.anime);
    } catch (error) {
        console.error('Error fetching main roles:', error);
        return [];
    }
};

/**
 * Get only supporting roles for a character
 */
export const getCharacterSupportingRoles = async (characterId) => {
    try {
        const data = await getCharacterAnime(characterId);
        return data.data
            .filter(item => item.role === 'Supporting')
            .map(item => item.anime);
    } catch (error) {
        console.error('Error fetching supporting roles:', error);
        return [];
    }
};

// ============================================================================
// 3. SEARCH CHARACTERS
// ============================================================================

/**
 * Search for characters by name
 */
export const findCharacterByName = async (name) => {
    try {
        const results = await searchCharacters(name, { limit: 25 });
        return results.data;
    } catch (error) {
        console.error('Error searching characters:', error);
        return [];
    }
};

/**
 * Get most popular characters
 */
export const getMostPopularCharacters = async (limit = 25) => {
    try {
        const results = await searchCharacters('', {
            order_by: 'favorites',
            sort: 'desc',
            limit
        });
        return results.data;
    } catch (error) {
        console.error('Error fetching popular characters:', error);
        return [];
    }
};

/**
 * Search characters by first letter
 */
export const getCharactersByLetter = async (letter) => {
    try {
        const results = await searchCharacters('', {
            letter: letter.toUpperCase(),
            limit: 25
        });
        return results.data;
    } catch (error) {
        console.error('Error fetching characters by letter:', error);
        return [];
    }
};

/**
 * Get top characters (most favorited)
 */
export const getTop25Characters = async () => {
    try {
        const results = await getTopCharacters({ limit: 25 });
        return results.data;
    } catch (error) {
        console.error('Error fetching top characters:', error);
        return [];
    }
};

// ============================================================================
// 4. VOICE ACTORS
// ============================================================================

/**
 * Get all voice actors for a character
 */
export const getCharacterVoices = async (characterId) => {
    try {
        const data = await getCharacterVoiceActors(characterId);
        return data.data.map(voice => ({
            person: voice.person,
            language: voice.language
        }));
    } catch (error) {
        console.error('Error fetching voice actors:', error);
        return [];
    }
};

/**
 * Get Japanese voice actor for a character
 */
export const getJapaneseVoiceActor = async (characterId) => {
    try {
        const data = await getCharacterVoiceActors(characterId);
        const japaneseVA = data.data.find(voice => voice.language === 'Japanese');
        return japaneseVA ? japaneseVA.person : null;
    } catch (error) {
        console.error('Error fetching Japanese VA:', error);
        return null;
    }
};

/**
 * Get English voice actor for a character
 */
export const getEnglishVoiceActor = async (characterId) => {
    try {
        const data = await getCharacterVoiceActors(characterId);
        const englishVA = data.data.find(voice => voice.language === 'English');
        return englishVA ? englishVA.person : null;
    } catch (error) {
        console.error('Error fetching English VA:', error);
        return null;
    }
};

// ============================================================================
// 5. CHARACTER MEDIA
// ============================================================================

/**
 * Get all pictures for a character
 */
export const getAllCharacterPictures = async (characterId) => {
    try {
        const data = await getCharacterPictures(characterId);
        return data.data.map(pic => ({
            jpg: pic.jpg.image_url,
            webp: pic.webp?.image_url
        }));
    } catch (error) {
        console.error('Error fetching character pictures:', error);
        return [];
    }
};

// ============================================================================
// 6. CHARACTER PROFILE BUILDER
// ============================================================================

/**
 * Build complete character profile for display
 */
export const buildCharacterProfile = async (characterId) => {
    try {
        const [character, anime, voices, pictures] = await Promise.all([
            getCharacterById(characterId),
            getCharacterAnime(characterId),
            getCharacterVoiceActors(characterId),
            getCharacterPictures(characterId)
        ]);

        return {
            // Basic info
            id: character.data.mal_id,
            name: character.data.name,
            nameKanji: character.data.name_kanji,
            nicknames: character.data.nicknames,
            about: character.data.about,
            favorites: character.data.favorites,
            image: character.data.images.webp.image_url,

            // Appearances
            animeAppearances: anime.data.map(item => ({
                role: item.role,
                anime: item.anime
            })),

            // Voice actors
            voiceActors: voices.data,

            // Pictures
            pictures: pictures.data,

            // Stats
            stats: {
                totalAppearances: anime.data.length,
                mainRoles: anime.data.filter(a => a.role === 'Main').length,
                supportingRoles: anime.data.filter(a => a.role === 'Supporting').length,
                voiceActorCount: voices.data.length
            }
        };
    } catch (error) {
        console.error('Error building character profile:', error);
        return null;
    }
};

// ============================================================================
// 7. CHARACTER DISCOVERY
// ============================================================================

/**
 * Find characters from a specific anime
 */
export const findCharactersInAnime = async (animeTitle) => {
    try {
        // Search for the anime title
        const charResults = await searchCharacters(animeTitle, { limit: 50 });
        return charResults.data;
    } catch (error) {
        console.error('Error finding characters in anime:', error);
        return [];
    }
};

/**
 * Get random popular character
 */
export const getRandomPopularCharacter = async () => {
    try {
        const topChars = await getTopCharacters({ limit: 25 });
        const randomIndex = Math.floor(Math.random() * topChars.data.length);
        return topChars.data[randomIndex];
    } catch (error) {
        console.error('Error getting random character:', error);
        return null;
    }
};

// ============================================================================
// 8. UTILITY FUNCTIONS
// ============================================================================

/**
 * Compare two characters' popularity
 */
export const compareCharacterPopularity = async (charId1, charId2) => {
    try {
        const [char1, char2] = await Promise.all([
            getCharacterById(charId1),
            getCharacterById(charId2)
        ]);

        return {
            character1: {
                name: char1.data.name,
                favorites: char1.data.favorites
            },
            character2: {
                name: char2.data.name,
                favorites: char2.data.favorites
            },
            morePopular: char1.data.favorites > char2.data.favorites ? char1.data.name : char2.data.name,
            difference: Math.abs(char1.data.favorites - char2.data.favorites)
        };
    } catch (error) {
        console.error('Error comparing characters:', error);
        return null;
    }
};

/**
 * Get character statistics summary
 */
export const getCharacterStats = async (characterId) => {
    try {
        const [character, anime, voices] = await Promise.all([
            getCharacterById(characterId),
            getCharacterAnime(characterId),
            getCharacterVoiceActors(characterId)
        ]);

        return {
            name: character.data.name,
            favorites: character.data.favorites,
            totalAnime: anime.data.length,
            mainRoles: anime.data.filter(a => a.role === 'Main').length,
            supportingRoles: anime.data.filter(a => a.role === 'Supporting').length,
            voiceActors: voices.data.length,
            hasJapaneseVA: voices.data.some(v => v.language === 'Japanese'),
            hasEnglishVA: voices.data.some(v => v.language === 'English')
        };
    } catch (error) {
        console.error('Error getting character stats:', error);
        return null;
    }
};

// ============================================================================
// POPULAR CHARACTER IDs FOR TESTING
// ============================================================================

export const POPULAR_CHARACTERS = {
    LELOUCH: 417,           // Lelouch Lamperouge (Code Geass)
    LIGHT_YAGAMI: 80,       // Light Yagami (Death Note)
    EDWARD_ELRIC: 11,       // Edward Elric (FMA)
    SPIKE_SPIEGEL: 1,       // Spike Spiegel (Cowboy Bebop)
    GUTS: 422,              // Guts (Berserk)
    LUFFY: 40,              // Monkey D. Luffy (One Piece)
    NARUTO: 17,             // Naruto Uzumaki
    GOKU: 246,              // Son Goku (Dragon Ball)
    EREN: 40882,            // Eren Yeager (Attack on Titan)
    LEVI: 45627,            // Levi Ackerman (Attack on Titan)
    KAKASHI: 85,            // Kakashi Hatake (Naruto)
    ITACHI: 14,             // Itachi Uchiha (Naruto)
    SAITAMA: 73935,         // Saitama (One Punch Man)
    KILLUA: 27,             // Killua Zoldyck (Hunter x Hunter)
    KIRITO: 36765,          // Kirito (SAO)
    REM: 118763,            // Rem (Re:Zero)
};

// ============================================================================
// EXAMPLE USAGE IN COMPONENT
// ============================================================================

/*
import { useState, useEffect } from 'react';
import { 
    buildCharacterProfile,
    getTop25Characters,
    POPULAR_CHARACTERS
} from './characterExamples';

function CharacterPage({ characterId }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function loadCharacter() {
            setLoading(true);
            const data = await buildCharacterProfile(characterId || POPULAR_CHARACTERS.LELOUCH);
            setProfile(data);
            setLoading(false);
        }
        loadCharacter();
    }, [characterId]);
    
    if (loading) return <div>Loading...</div>;
    if (!profile) return <div>Character not found</div>;
    
    return (
        <div>
            <h1>{profile.name}</h1>
            <img src={profile.image} alt={profile.name} />
            <p>Favorites: {profile.favorites.toLocaleString()}</p>
            
            <h2>Anime Appearances ({profile.stats.totalAppearances})</h2>
            {profile.animeAppearances.map(app => (
                <div key={app.anime.mal_id}>
                    <h3>{app.anime.title}</h3>
                    <span>Role: {app.role}</span>
                </div>
            ))}
            
            <h2>Voice Actors</h2>
            {profile.voiceActors.map((va, i) => (
                <div key={i}>
                    <p>{va.person.name} ({va.language})</p>
                </div>
            ))}
        </div>
    );
}
*/
