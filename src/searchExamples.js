/**
 * Advanced Search Examples for KAnime
 * 
 * This file demonstrates practical use cases for the enhanced searchAnime function
 * with all the advanced filtering capabilities from the Jikan API.
 */

import { searchAnime, filterValidAnime } from './api';

// ============================================================================
// 1. BASIC SEARCHES
// ============================================================================

/**
 * Simple text search
 */
export const basicSearch = async (searchTerm) => {
    const results = await searchAnime(searchTerm, { limit: 20 });
    return filterValidAnime(results.data);
};

/**
 * Search by specific type
 */
export const searchByType = async (searchTerm, type) => {
    const results = await searchAnime(searchTerm, {
        type, // 'tv', 'movie', 'ova', etc.
        limit: 20
    });
    return filterValidAnime(results.data);
};

// ============================================================================
// 2. SCORE-BASED SEARCHES
// ============================================================================

/**
 * Find high-rated anime (score >= 8.0)
 */
export const getHighRatedAnime = async () => {
    const results = await searchAnime('', {
        min_score: 8.0,
        order_by: 'score',
        sort: 'desc',
        limit: 25,
        sfw: true
    });
    return filterValidAnime(results.data);
};

/**
 * Find anime within a score range
 */
export const getAnimeByScoreRange = async (minScore, maxScore) => {
    const results = await searchAnime('', {
        min_score: minScore,
        max_score: maxScore,
        order_by: 'popularity',
        sort: 'asc',
        limit: 25
    });
    return filterValidAnime(results.data);
};

/**
 * Find hidden gems (high score but lower popularity)
 */
export const getHiddenGems = async () => {
    const results = await searchAnime('', {
        min_score: 7.5,
        order_by: 'score',
        sort: 'desc',
        status: 'complete',
        limit: 50
    });

    // Filter for anime with fewer members (less popular)
    const filtered = filterValidAnime(results.data);
    return filtered.filter(anime => anime.members < 100000);
};

// ============================================================================
// 3. GENRE-BASED SEARCHES
// ============================================================================

/**
 * Find action anime
 * Genre ID 1 = Action
 */
export const getActionAnime = async () => {
    const results = await searchAnime('', {
        genres: '1',
        type: 'tv',
        min_score: 7.0,
        order_by: 'score',
        sort: 'desc',
        limit: 25
    });
    return filterValidAnime(results.data);
};

/**
 * Find romantic comedies
 * Genre ID 4 = Comedy, 22 = Romance
 */
export const getRomanticComedies = async () => {
    const results = await searchAnime('', {
        genres: '4,22',
        type: 'tv',
        status: 'complete',
        min_score: 7.0,
        sfw: true,
        limit: 25
    });
    return filterValidAnime(results.data);
};

/**
 * Find anime excluding horror and thriller
 * Genre ID 14 = Horror, 41 = Thriller
 */
export const getNoScaryAnime = async () => {
    const results = await searchAnime('', {
        genres_exclude: '14,41',
        min_score: 7.5,
        sfw: true,
        limit: 25
    });
    return filterValidAnime(results.data);
};

/**
 * Find fantasy adventure anime
 * Genre ID 2 = Adventure, 10 = Fantasy
 */
export const getFantasyAdventure = async () => {
    const results = await searchAnime('', {
        genres: '2,10',
        type: 'tv',
        min_score: 7.5,
        order_by: 'members',
        sort: 'desc',
        limit: 25
    });
    return filterValidAnime(results.data);
};

// ============================================================================
// 4. DATE-BASED SEARCHES
// ============================================================================

/**
 * Find anime from a specific year
 */
export const getAnimeByYear = async (year) => {
    const results = await searchAnime('', {
        start_date: `${year}`,
        type: 'tv',
        order_by: 'score',
        sort: 'desc',
        limit: 25
    });
    return filterValidAnime(results.data);
};

/**
 * Find recent anime (2024+)
 */
export const getRecentAnime = async () => {
    const results = await searchAnime('', {
        start_date: '2024-01-01',
        order_by: 'start_date',
        sort: 'desc',
        limit: 25,
        sfw: true
    });
    return filterValidAnime(results.data);
};

/**
 * Find classic anime (before 2000)
 */
export const getClassicAnime = async () => {
    const results = await searchAnime('', {
        end_date: '1999-12-31',
        min_score: 7.5,
        order_by: 'score',
        sort: 'desc',
        limit: 25
    });
    return filterValidAnime(results.data);
};

/**
 * Find anime from a specific season
 */
export const getSeasonalAnime = async (year, startMonth, endMonth) => {
    const startDate = `${year}-${String(startMonth).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(endMonth).padStart(2, '0')}-31`;

    const results = await searchAnime('', {
        start_date: startDate,
        end_date: endDate,
        type: 'tv',
        order_by: 'score',
        sort: 'desc',
        limit: 25
    });
    return filterValidAnime(results.data);
};

// ============================================================================
// 5. STATUS-BASED SEARCHES
// ============================================================================

/**
 * Find currently airing anime
 */
export const getCurrentlyAiring = async () => {
    const results = await searchAnime('', {
        status: 'airing',
        order_by: 'members',
        sort: 'desc',
        limit: 25,
        sfw: true
    });
    return filterValidAnime(results.data);
};

/**
 * Find upcoming anime
 */
export const getUpcoming = async () => {
    const results = await searchAnime('', {
        status: 'upcoming',
        order_by: 'members',
        sort: 'desc',
        limit: 25
    });
    return filterValidAnime(results.data);
};

/**
 * Find completed anime
 */
export const getCompleted = async () => {
    const results = await searchAnime('', {
        status: 'complete',
        min_score: 8.0,
        order_by: 'score',
        sort: 'desc',
        limit: 25
    });
    return filterValidAnime(results.data);
};

// ============================================================================
// 6. COMPLEX MULTI-FILTER SEARCHES
// ============================================================================

/**
 * Find the best completed TV anime
 */
export const getBestCompletedTV = async () => {
    const results = await searchAnime('', {
        type: 'tv',
        status: 'complete',
        min_score: 8.5,
        order_by: 'score',
        sort: 'desc',
        sfw: true,
        limit: 25
    });
    return filterValidAnime(results.data);
};

/**
 * Find popular movies
 */
export const getPopularMovies = async () => {
    const results = await searchAnime('', {
        type: 'movie',
        min_score: 7.0,
        order_by: 'members',
        sort: 'desc',
        sfw: true,
        limit: 25
    });
    return filterValidAnime(results.data);
};

/**
 * Find family-friendly anime
 */
export const getFamilyFriendly = async () => {
    const results = await searchAnime('', {
        rating: 'g', // G - All Ages
        min_score: 7.0,
        order_by: 'score',
        sort: 'desc',
        limit: 25
    });
    return filterValidAnime(results.data);
};

/**
 * Find short anime (OVA, Special, ONA)
 */
export const getShortAnime = async () => {
    // Note: You'd need to make multiple calls for multiple types
    const ovaResults = await searchAnime('', {
        type: 'ova',
        min_score: 7.0,
        limit: 10
    });

    const specialResults = await searchAnime('', {
        type: 'special',
        min_score: 7.0,
        limit: 10
    });

    const onaResults = await searchAnime('', {
        type: 'ona',
        min_score: 7.0,
        limit: 10
    });

    const combined = [
        ...filterValidAnime(ovaResults.data),
        ...filterValidAnime(specialResults.data),
        ...filterValidAnime(onaResults.data)
    ];

    return combined.sort((a, b) => b.score - a.score);
};

/**
 * Find anime by letter
 */
export const getAnimeByLetter = async (letter) => {
    const results = await searchAnime('', {
        letter: letter.toUpperCase(),
        type: 'tv',
        min_score: 7.0,
        order_by: 'score',
        sort: 'desc',
        limit: 25
    });
    return filterValidAnime(results.data);
};

/**
 * Advanced recommendation finder
 * Finds anime based on multiple criteria
 */
export const getRecommendations = async ({
    genres = '',
    excludeGenres = '',
    minScore = 7.0,
    type = 'tv',
    status = '',
    year = null
}) => {
    const params = {
        min_score: minScore,
        type,
        order_by: 'score',
        sort: 'desc',
        sfw: true,
        limit: 25
    };

    if (genres) params.genres = genres;
    if (excludeGenres) params.genres_exclude = excludeGenres;
    if (status) params.status = status;
    if (year) params.start_date = `${year}`;

    const results = await searchAnime('', params);
    return filterValidAnime(results.data);
};

// ============================================================================
// 7. UTILITY FUNCTIONS
// ============================================================================

/**
 * Search with pagination support
 */
export const searchWithPagination = async (query, filters, page = 1, limit = 25) => {
    const results = await searchAnime(query, {
        ...filters,
        page,
        limit
    });

    return {
        data: filterValidAnime(results.data),
        pagination: results.pagination
    };
};

/**
 * Get total results for a search
 */
export const getSearchStats = async (query, filters = {}) => {
    const results = await searchAnime(query, { ...filters, limit: 1 });
    return {
        total: results.pagination?.items?.total || 0,
        lastPage: results.pagination?.last_visible_page || 0
    };
};

// ============================================================================
// GENRE ID REFERENCE
// ============================================================================

export const GENRE_IDS = {
    ACTION: '1',
    ADVENTURE: '2',
    CARS: '3',
    COMEDY: '4',
    DEMENTIA: '5',
    DEMONS: '6',
    MYSTERY: '7',
    DRAMA: '8',
    ECCHI: '9',
    FANTASY: '10',
    GAME: '11',
    HENTAI: '12',
    HISTORICAL: '13',
    HORROR: '14',
    KIDS: '15',
    MAGIC: '16',
    MARTIAL_ARTS: '17',
    MECHA: '18',
    MUSIC: '19',
    PARODY: '20',
    SAMURAI: '21',
    ROMANCE: '22',
    SCHOOL: '23',
    SCI_FI: '24',
    SHOUJO: '25',
    SHOUJO_AI: '26',
    SHOUNEN: '27',
    SHOUNEN_AI: '28',
    SPACE: '29',
    SPORTS: '30',
    SUPER_POWER: '31',
    VAMPIRE: '32',
    YAOI: '33',
    YURI: '34',
    HAREM: '35',
    SLICE_OF_LIFE: '36',
    SUPERNATURAL: '37',
    MILITARY: '38',
    POLICE: '39',
    PSYCHOLOGICAL: '40',
    THRILLER: '41',
    SEINEN: '42',
    JOSEI: '43'
};

// ============================================================================
// EXAMPLE USAGE IN COMPONENT
// ============================================================================

/*
import { useState, useEffect } from 'react';
import { 
    getHighRatedAnime, 
    getCurrentlyAiring, 
    getAnimeByScoreRange,
    GENRE_IDS 
} from './searchExamples';

function DiscoverPage() {
    const [topRated, setTopRated] = useState([]);
    const [airing, setAiring] = useState([]);
    
    useEffect(() => {
        async function loadData() {
            const rated = await getHighRatedAnime();
            const current = await getCurrentlyAiring();
            
            setTopRated(rated);
            setAiring(current);
        }
        loadData();
    }, []);
    
    return (
        <div>
            <section>
                <h2>Top Rated Anime</h2>
                {topRated.map(anime => <AnimeCard key={anime.mal_id} anime={anime} />)}
            </section>
            
            <section>
                <h2>Currently Airing</h2>
                {airing.map(anime => <AnimeCard key={anime.mal_id} anime={anime} />)}
            </section>
        </div>
    );
}
*/
