// Jikan API (MyAnimeList Unofficial API) Base URL
export const API_BASE = 'https://api.jikan.moe/v4';

/**
 * Fetch top anime with advanced filtering options
 * @param {Object} params - Query parameters
 * @param {string} params.type - Anime type (tv, movie, ova, special, ona, music, cm, pv, tv_special)
 * @param {string} params.filter - Top filter (airing, upcoming, bypopularity, favorite)
 * @param {string} params.rating - Audience rating (g, pg, pg13, r17, r, rx)
 * @param {boolean} params.sfw - Filter out adult entries
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page (max 25)
 * @returns {Promise<Object>} API response with data and pagination
 */
export const getTopAnime = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();

        if (params.type) queryParams.append('type', params.type);
        if (params.filter) queryParams.append('filter', params.filter);
        if (params.rating) queryParams.append('rating', params.rating);
        if (params.sfw !== undefined) queryParams.append('sfw', params.sfw);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        const url = `${API_BASE}/top/anime${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getTopAnime Error:', error);
        throw error;
    }
};

/**
 * Search anime with advanced filtering options
 * @param {string} query - Search query (optional for advanced filtering)
 * @param {Object} params - Advanced query parameters
 * @param {boolean} params.unapproved - Include unapproved entries
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.type - Anime type (tv, movie, ova, special, ona, music, cm, pv, tv_special)
 * @param {number} params.score - Exact score
 * @param {number} params.min_score - Minimum score filter
 * @param {number} params.max_score - Maximum score filter
 * @param {string} params.status - Airing status (airing, complete, upcoming)
 * @param {string} params.rating - Audience rating (g, pg, pg13, r17, r, rx)
 * @param {boolean} params.sfw - Filter out adult entries
 * @param {string} params.genres - Genre IDs (comma-separated, e.g., "1,2,3")
 * @param {string} params.genres_exclude - Exclude genre IDs (comma-separated)
 * @param {string} params.order_by - Order by property (mal_id, title, start_date, end_date, episodes, score, scored_by, rank, popularity, members, favorites)
 * @param {string} params.sort - Sort direction (desc, asc)
 * @param {string} params.letter - Return entries starting with this letter
 * @param {string} params.producers - Producer IDs (comma-separated, e.g., "1,2,3")
 * @param {string} params.start_date - Filter by start date (YYYY-MM-DD, YYYY-MM, or YYYY)
 * @param {string} params.end_date - Filter by end date (YYYY-MM-DD, YYYY-MM, or YYYY)
 * @returns {Promise<Object>} API response with data and pagination
 */
export const searchAnime = async (query = '', params = {}) => {
    try {
        const queryParams = new URLSearchParams();

        // Search query (optional for advanced filtering)
        if (query) queryParams.append('q', query);

        // Flag parameters
        if (params.unapproved !== undefined) queryParams.append('unapproved', '');
        if (params.sfw !== undefined) queryParams.append('sfw', params.sfw);

        // Pagination
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        // Basic filters
        if (params.type) queryParams.append('type', params.type);
        if (params.status) queryParams.append('status', params.status);
        if (params.rating) queryParams.append('rating', params.rating);

        // Score filters
        if (params.score) queryParams.append('score', params.score);
        if (params.min_score) queryParams.append('min_score', params.min_score);
        if (params.max_score) queryParams.append('max_score', params.max_score);

        // Genre filters
        if (params.genres) queryParams.append('genres', params.genres);
        if (params.genres_exclude) queryParams.append('genres_exclude', params.genres_exclude);

        // Ordering
        if (params.order_by) queryParams.append('order_by', params.order_by);
        if (params.sort) queryParams.append('sort', params.sort);

        // Additional filters
        if (params.letter) queryParams.append('letter', params.letter);
        if (params.producers) queryParams.append('producers', params.producers);
        if (params.start_date) queryParams.append('start_date', params.start_date);
        if (params.end_date) queryParams.append('end_date', params.end_date);

        const url = `${API_BASE}/anime?${queryParams.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('searchAnime Error:', error);
        throw error;
    }
};

/**
 * Get anime by MAL ID
 * @param {number} id - MyAnimeList ID
 * @returns {Promise<Object>} Anime details
 */
export const getAnimeById = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/anime/${id}`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getAnimeById Error:', error);
        throw error;
    }
};

/**
 * Get anime full details including characters, episodes, etc.
 * @param {number} id - MyAnimeList ID
 * @returns {Promise<Object>} Full anime details
 */
export const getAnimeFullById = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/anime/${id}/full`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getAnimeFullById Error:', error);
        throw error;
    }
};

/**
 * Get seasonal anime (History/Archive)
 * @param {number} year - Year
 * @param {string} season - Season (winter, spring, summer, fall)
 * @param {Object} params - Additional parameters
 * @param {string} params.filter - Entry types (tv, movie, ova, special, ona, music)
 * @param {boolean} params.sfw - Filter out adult entries
 * @param {boolean} params.unapproved - Include unapproved entries
 * @param {boolean} params.continuing - Include continuing entries
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} Seasonal anime
 */
export const getSeasonalAnime = async (year, season, params = {}) => {
    try {
        const queryParams = new URLSearchParams();

        if (params.filter) queryParams.append('filter', params.filter);
        if (params.sfw !== undefined) queryParams.append('sfw', '');
        if (params.unapproved !== undefined) queryParams.append('unapproved', '');
        if (params.continuing !== undefined) queryParams.append('continuing', '');
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        const url = `${API_BASE}/seasons/${year}/${season}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getSeasonalAnime Error:', error);
        throw error;
    }
};

/**
 * Get current season anime
 * @param {Object} params - Query parameters
 * @param {string} params.filter - Entry types (tv, movie, ova, special, ona, music)
 * @param {boolean} params.sfw - Filter out adult entries
 * @param {boolean} params.unapproved - Include unapproved entries
 * @param {boolean} params.continuing - Include continuing entries
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} Current season anime
 */
export const getCurrentSeason = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();

        if (params.filter) queryParams.append('filter', params.filter);
        if (params.sfw !== undefined) queryParams.append('sfw', '');
        if (params.unapproved !== undefined) queryParams.append('unapproved', '');
        if (params.continuing !== undefined) queryParams.append('continuing', '');
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        const url = `${API_BASE}/seasons/now${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getCurrentSeason Error:', error);
        throw error;
    }
};

/**
 * Get available list of seasons
 * @returns {Promise<Object>} Available years and seasons
 */
export const getSeasonsList = async () => {
    try {
        const response = await fetch(`${API_BASE}/seasons`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getSeasonsList Error:', error);
        throw error;
    }
};

/**
 * Get upcoming season's anime
 * @param {Object} params - Query parameters
 * @param {string} params.filter - Entry types (tv, movie, ova, special, ona, music)
 * @param {boolean} params.sfw - Filter out adult entries
 * @param {boolean} params.unapproved - Include unapproved entries
 * @param {boolean} params.continuing - Include continuing entries
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} Upcoming season anime
 */
export const getSeasonUpcoming = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();

        if (params.filter) queryParams.append('filter', params.filter);
        if (params.sfw !== undefined) queryParams.append('sfw', '');
        if (params.unapproved !== undefined) queryParams.append('unapproved', '');
        if (params.continuing !== undefined) queryParams.append('continuing', '');
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        const url = `${API_BASE}/seasons/upcoming${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getSeasonUpcoming Error:', error);
        throw error;
    }
};

/**
 * Utility function to filter out invalid anime entries
 * @param {Array} animeList - List of anime objects
 * @returns {Array} Filtered anime list
 */
export const filterValidAnime = (animeList) => {
    return animeList.filter(item =>
        item.title &&
        !item.title.toLowerCase().includes('not available') &&
        !item.images?.webp?.large_image_url?.includes('questionmark')
    );
};

// ============================================================================
// CHARACTER ENDPOINTS
// ============================================================================

/**
 * Get all anime that a character appears in
 * @param {number} id - Character ID (MyAnimeList character ID)
 * @returns {Promise<Object>} List of anime with character roles
 */
export const getCharacterAnime = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/characters/${id}/anime`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getCharacterAnime Error:', error);
        throw error;
    }
};

/**
 * Get character by ID
 * @param {number} id - Character ID (MyAnimeList character ID)
 * @returns {Promise<Object>} Character details
 */
export const getCharacterById = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/characters/${id}`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getCharacterById Error:', error);
        throw error;
    }
};

/**
 * Get full character details including anime, manga, and voice actors
 * @param {number} id - Character ID (MyAnimeList character ID)
 * @returns {Promise<Object>} Full character details
 */
export const getCharacterFull = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/characters/${id}/full`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getCharacterFull Error:', error);
        throw error;
    }
};

/**
 * Get character's voice actors
 * @param {number} id - Character ID (MyAnimeList character ID)
 * @returns {Promise<Object>} Voice actors list
 */
export const getCharacterVoiceActors = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/characters/${id}/voices`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getCharacterVoiceActors Error:', error);
        throw error;
    }
};

/**
 * Search for characters
 * @param {string} query - Search query
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Results per page
 * @param {string} params.order_by - Order by property (mal_id, name, favorites)
 * @param {string} params.sort - Sort direction (asc, desc)
 * @param {string} params.letter - Filter by first letter
 * @returns {Promise<Object>} Search results
 */
export const searchCharacters = async (query = '', params = {}) => {
    try {
        const queryParams = new URLSearchParams();

        if (query) queryParams.append('q', query);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.order_by) queryParams.append('order_by', params.order_by);
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.letter) queryParams.append('letter', params.letter);

        const url = `${API_BASE}/characters?${queryParams.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('searchCharacters Error:', error);
        throw error;
    }
};

/**
 * Get top characters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Results per page
 * @returns {Promise<Object>} Top characters
 */
export const getTopCharacters = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        const url = `${API_BASE}/top/characters${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getTopCharacters Error:', error);
        throw error;
    }
};

/**
 * Get character pictures
 * @param {number} id - Character ID
 * @returns {Promise<Object>} Character pictures
 */
export const getCharacterPictures = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/characters/${id}/pictures`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getCharacterPictures Error:', error);
        throw error;
    }
};

/**
 * Get anime genres, explicit_genres, themes and demographics
 * @param {Object} params - Query parameters
 * @param {string} params.filter - Filter genres by type (genres, explicit_genres, themes, demographics)
 * @returns {Promise<Object>} List of genres
 */
export const getAnimeGenres = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (params.filter) queryParams.append('filter', params.filter);

        const url = `${API_BASE}/genres/anime${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getAnimeGenres Error:', error);
        throw error;
    }
};

/**
 * Get weekly anime schedule
 * @param {Object} params - Query parameters
 * @param {string} params.filter - Filter by day (monday, tuesday, wednesday, thursday, friday, saturday, sunday, unknown, other)
 * @param {boolean} params.kids - Filter for kids demographic (true/false)
 * @param {boolean} params.sfw - Filter for Hentai (true/false)
 * @param {boolean} params.unapproved - Include unapproved entries
 * @param {number} params.page - Page number
 * @param {number} params.limit - Results per page
 * @returns {Promise<Object>} Weekly schedule
 */
export const getSchedules = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (params.filter) queryParams.append('filter', params.filter);
        if (params.kids !== undefined) queryParams.append('kids', params.kids);
        if (params.sfw !== undefined) queryParams.append('sfw', params.sfw);
        if (params.unapproved) queryParams.append('unapproved', '');
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        const url = `${API_BASE}/schedules?${queryParams.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getSchedules Error:', error);
        throw error;
    }
};
