# KAnime API Documentation

This document explains how to use the Jikan API integration in the KAnime project.

## Base URL
```javascript
https://api.jikan.moe/v4
```

## Available Functions

### 1. `getTopAnime(params)`
Fetch top anime with advanced filtering options.

#### Parameters:
- **type** (string, optional): Anime type
  - Values: `"tv"`, `"movie"`, `"ova"`, `"special"`, `"ona"`, `"music"`, `"cm"`, `"pv"`, `"tv_special"`
- **filter** (string, optional): Top filter
  - Values: `"airing"`, `"upcoming"`, `"bypopularity"`, `"favorite"`
- **rating** (string, optional): Audience rating
  - Values: `"g"`, `"pg"`, `"pg13"`, `"r17"`, `"r"`, `"rx"`
  - Ratings:
    - `g` - All Ages
    - `pg` - Children
    - `pg13` - Teens 13 or older
    - `r17` - 17+ (violence & profanity)
    - `r` - Mild Nudity
    - `rx` - Hentai
- **sfw** (boolean, optional): Filter out adult entries
- **page** (number, optional): Page number for pagination
- **limit** (number, optional): Items per page (max 25)

#### Usage Examples:
```javascript
import { getTopAnime } from '../api';

// Get top 10 anime
const topAnime = await getTopAnime({ limit: 10 });

// Get currently airing anime
const airingAnime = await getTopAnime({ filter: 'airing', limit: 12 });

// Get top TV anime by popularity
const popularTV = await getTopAnime({ 
  type: 'tv', 
  filter: 'bypopularity',
  page: 1,
  limit: 20
});

// Get safe-for-work top anime
const sfwAnime = await getTopAnime({ sfw: true, limit: 15 });

// Get upcoming movies
const upcomingMovies = await getTopAnime({ 
  type: 'movie',
  filter: 'upcoming',
  limit: 10
});
```

#### Response Structure:
```javascript
{
  data: [
    {
      mal_id: 123,
      title: "Anime Title",
      images: {
        jpg: { image_url, small_image_url, large_image_url },
        webp: { image_url, small_image_url, large_image_url }
      },
      type: "TV",
      episodes: 24,
      score: 8.5,
      status: "Finished Airing",
      synopsis: "...",
      genres: [...],
      studios: [...],
      // ... more fields
    }
  ],
  pagination: {
    last_visible_page: 5,
    has_next_page: true,
    current_page: 1,
    items: {
      count: 25,
      total: 100,
      per_page: 25
    }
  }
}
```

---

### 2. `searchAnime(query, params)`
Search for anime with advanced filtering, sorting, and ordering options.

#### Parameters:
- **query** (string, optional): Search query (can be empty for pure filtering)
- **params** (object, optional):

**Pagination:**
  - **page** (number): Page number
  - **limit** (number): Results per page

**Type & Status:**
  - **type** (string): Anime type
    - Values: `"tv"`, `"movie"`, `"ova"`, `"special"`, `"ona"`, `"music"`, `"cm"`, `"pv"`, `"tv_special"`
  - **status** (string): Airing status
    - Values: `"airing"`, `"complete"`, `"upcoming"`
  - **rating** (string): Audience rating
    - Values: `"g"`, `"pg"`, `"pg13"`, `"r17"`, `"r"`, `"rx"`

**Score Filters:**
  - **score** (number): Exact score match
  - **min_score** (number): Minimum score (e.g., 7.5)
  - **max_score** (number): Maximum score (e.g., 9.0)

**Genre Filters:**
  - **genres** (string): Include genre IDs (comma-separated, e.g., `"1,2,3"`)
  - **genres_exclude** (string): Exclude genre IDs (comma-separated)

**Producer Filters:**
  - **producers** (string): Producer IDs (comma-separated, e.g., `"1,2,3"`)

**Date Filters:**
  - **start_date** (string): Filter by start date
    - Formats: `"YYYY"`, `"YYYY-MM"`, or `"YYYY-MM-DD"`
    - Example: `"2024"`, `"2024-01"`, `"2024-01-15"`
  - **end_date** (string): Filter by end date (same formats)

**Sorting & Ordering:**
  - **order_by** (string): Sort property
    - Values: `"mal_id"`, `"title"`, `"start_date"`, `"end_date"`, `"episodes"`, `"score"`, `"scored_by"`, `"rank"`, `"popularity"`, `"members"`, `"favorites"`
  - **sort** (string): Sort direction
    - Values: `"asc"`, `"desc"`

**Other:**
  - **letter** (string): Filter by first letter (e.g., `"A"`)
  - **sfw** (boolean): Filter out adult content
  - **unapproved** (boolean): Include unapproved MAL entries

#### Usage Examples:
```javascript
import { searchAnime } from '../api';

// Basic search
const results = await searchAnime('Naruto');

// Search with type filter
const tvOnly = await searchAnime('One Piece', { 
  type: 'tv',
  limit: 10
});

// Search for high-rated anime (min score 8.0)
const highRated = await searchAnime('', {
  min_score: 8.0,
  order_by: 'score',
  sort: 'desc',
  limit: 20
});

// Filter by genre (Action = 1, Adventure = 2)
const actionAdventure = await searchAnime('', {
  genres: '1,2',
  type: 'tv',
  status: 'complete'
});

// Exclude certain genres
const noHorror = await searchAnime('', {
  genres_exclude: '14', // 14 = Horror
  sfw: true
});

// Filter by date range
const winter2024 = await searchAnime('', {
  start_date: '2024-01-01',
  end_date: '2024-03-31',
  type: 'tv'
});

// Popular anime from specific studio (e.g., Studio Ghibli = 21)
const studioPicks = await searchAnime('', {
  producers: '21',
  order_by: 'popularity',
  sort: 'asc'
});

// Anime starting with 'D'
const letterD = await searchAnime('', {
  letter: 'D',
  type: 'tv',
  min_score: 7.0
});

// Complex multi-filter search
const complexSearch = await searchAnime('', {
  type: 'tv',
  status: 'complete',
  min_score: 8.0,
  genres: '1,10', // Action, Fantasy
  genres_exclude: '14,41', // No Horror, No Thriller
  order_by: 'members',
  sort: 'desc',
  sfw: true,
  limit: 25
});

// Search with scoring range
const midRangeScores = await searchAnime('school', {
  min_score: 6.5,
  max_score: 8.0,
  type: 'tv'
});
```

#### Common Genre IDs:
- `1` - Action
- `2` - Adventure
- `4` - Comedy
- `8` - Drama
- `10` - Fantasy
- `14` - Horror
- `22` - Romance
- `24` - Sci-Fi
- `30` - Sports
- `36` - Slice of Life

*For complete genre list, visit: https://myanimelist.net/anime.php*

---

### 3. `getAnimeById(id)`
Get detailed information about a specific anime by its MyAnimeList ID.

#### Parameters:
- **id** (number, required): MyAnimeList ID

#### Usage Example:
```javascript
import { getAnimeById } from '../api';

// Get specific anime details
const anime = await getAnimeById(5114); // Fullmetal Alchemist: Brotherhood
console.log(anime.data.title);
console.log(anime.data.synopsis);
```

---

### 4. `getAnimeFullById(id)`
Get comprehensive details including characters, staff, episodes, etc.

#### Parameters:
- **id** (number, required): MyAnimeList ID

#### Usage Example:
```javascript
import { getAnimeFullById } from '../api';

// Get full anime details
const fullData = await getAnimeFullById(5114);
console.log(fullData.data.characters);
console.log(fullData.data.staff);
```

---

### 5. `getSeasonalAnime(year, season, params)`
Get anime archive from a specific season.

#### Parameters:
- **year** (number, required): Year (e.g., `2024`).
- **season** (string, required): Season name.
  - Values: `"winter"`, `"spring"`, `"summer"`, `"fall"`
- **filter** (string, optional): Entry types.
  - Values: `"tv"`, `"movie"`, `"ova"`, `"special"`, `"ona"`, `"music"`
- **sfw** (boolean, optional): Filter out adult entries.
- **unapproved** (boolean, optional): Include unapproved entries.
- **continuing** (boolean, optional): Include entries continuing from previous seasons.
- **page** (number, optional): Page number.
- **limit** (number, optional): Items per page.

#### Usage Example:
```javascript
import { getSeasonalAnime } from '../api';

// Get Winter 2023 TV series
const winter2023 = await getSeasonalAnime(2023, 'winter', { filter: 'tv' });
console.log(winter2023.data);
```

---

### 6. `getCurrentSeason(params)`
Get anime from the current season.

#### Parameters:
- **filter** (string, optional): Entry types.
  - Values: `"tv"`, `"movie"`, `"ova"`, `"special"`, `"ona"`, `"music"`
- **sfw** (boolean, optional): Filter out adult entries.
- **unapproved** (boolean, optional): Include unapproved entries.
- **continuing** (boolean, optional): Include entries continuing from previous seasons.
- **page** (number, optional): Page number.
- **limit** (number, optional): Items per page.

#### Usage Example:
```javascript
import { getCurrentSeason } from '../api';

// Get current series only (excluding movies)
const series = await getCurrentSeason({ filter: 'tv' });
console.log(series.data);

// Get family friendly current season
const familyFriendly = await getCurrentSeason({ sfw: true });
```

---

### 7. `filterValidAnime(animeList)`
Utility function to filter out invalid or placeholder anime entries.

#### Parameters:
- **animeList** (array, required): Array of anime objects

#### Usage Example:
```javascript
import { getTopAnime, filterValidAnime } from '../api';

const data = await getTopAnime({ limit: 50 });
const validAnime = filterValidAnime(data.data);
// Removes entries with:
// - Missing titles
// - "Not Available" in title
// - Question mark placeholder images
```

---

## Character Endpoints

### 8. `getCharacterAnime(id)`
Get all anime that a specific character appears in.

#### Parameters:
- **id** (number, required): Character ID (MyAnimeList character ID)

#### Usage Example:
```javascript
import { getCharacterAnime } from '../api';

// Get all anime featuring character ID 40
const characterAnime = await getCharacterAnime(40); // Lelouch Lamperouge
console.log(characterAnime.data);
// Returns array of anime with character's role
```

#### Response Structure:
```javascript
{
  data: [
    {
      role: "Main",  // or "Supporting"
      anime: {
        mal_id: 1575,
        url: "https://myanimelist.net/anime/1575/Code_Geass",
        images: {
          jpg: { image_url, small_image_url, large_image_url },
          webp: { image_url, small_image_url, large_image_url }
        },
        title: "Code Geass: Hangyaku no Lelouch"
      }
    }
  ]
}
```

---

### 9. `getCharacterById(id)`
Get basic character information by ID.

#### Parameters:
- **id** (number, required): Character ID

#### Usage Example:
```javascript
import { getCharacterById } from '../api';

// Get character details
const character = await getCharacterById(40);
console.log(character.data.name);
console.log(character.data.about);
```

---

### 10. `getCharacterFull(id)`
Get comprehensive character details including anime, manga, and voice actors.

#### Parameters:
- **id** (number, required): Character ID

#### Usage Example:
```javascript
import { getCharacterFull } from '../api';

// Get full character info
const fullChar = await getCharacterFull(40);
console.log(fullChar.data.anime);     // All anime appearances
console.log(fullChar.data.voices);    // Voice actors
console.log(fullChar.data.manga);     // Manga appearances
```

---

### 11. `getCharacterVoiceActors(id)`
Get all voice actors for a character.

#### Parameters:
- **id** (number, required): Character ID

#### Usage Example:
```javascript
import { getCharacterVoiceActors } from '../api';

// Get voice actors
const voices = await getCharacterVoiceActors(40);
console.log(voices.data);
// Returns list of voice actors with language info
```

---

### 12. `searchCharacters(query, params)`
Search for characters.

#### Parameters:
- **query** (string, optional): Search query
- **params** (object, optional):
  - **page** (number): Page number
  - **limit** (number): Results per page
  - **order_by** (string): Order by property (`mal_id`, `name`, `favorites`)
  - **sort** (string): Sort direction (`asc`, `desc`)
  - **letter** (string): Filter by first letter

#### Usage Examples:
```javascript
import { searchCharacters } from '../api';

// Basic character search
const chars = await searchCharacters('Naruto');

// Search with sorting
const popular = await searchCharacters('', {
  order_by: 'favorites',
  sort: 'desc',
  limit: 25
});

// Search by letter
const aChars = await searchCharacters('', {
  letter: 'A',
  limit: 20
});
```

---

### 13. `getTopCharacters(params)`
Get top characters ranked by favorites.

#### Parameters:
- **params** (object, optional):
  - **page** (number): Page number
  - **limit** (number): Results per page (max 25)

#### Usage Example:
```javascript
import { getTopCharacters } from '../api';

// Get top 25 most favorited characters
const topChars = await getTopCharacters({ limit: 25 });
console.log(topChars.data);
```

---

### 14. `getCharacterPictures(id)`
Get all pictures for a character.

#### Parameters:
- **id** (number, required): Character ID

#### Usage Example:
```javascript
import { getCharacterPictures } from '../api';

// Get character pictures
const pictures = await getCharacterPictures(40);
console.log(pictures.data);
// Returns array of image URLs
```

---

## Error Handling

All API functions include built-in error handling. Wrap calls in try-catch blocks:

```javascript
try {
  const anime = await getTopAnime({ limit: 10 });
  console.log(anime.data);
} catch (error) {
  console.error('Failed to fetch anime:', error);
}
```

---

## Rate Limiting

The Jikan API has rate limits. Best practices:
- Implement caching for frequently accessed data
- Add delays between rapid successive calls
- Use pagination wisely

---

## Example: Complete Integration

```javascript
import { 
  getTopAnime, 
  searchAnime, 
  getAnimeById,
  filterValidAnime 
} from '../api';

function AnimeComponent() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getTopAnime({ 
          filter: 'airing',
          limit: 12,
          sfw: true
        });
        
        const validAnime = filterValidAnime(data.data);
        setAnime(validAnime);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        anime.map(item => (
          <div key={item.mal_id}>
            <h3>{item.title}</h3>
            <img src={item.images.webp.large_image_url} alt={item.title} />
          </div>
        ))
      )}
    </div>
  );
}
```

---

## API Response Fields Reference

### Common Anime Object Fields:
- `mal_id` - MyAnimeList ID
- `url` - MyAnimeList URL
- `images` - Image URLs (JPG and WebP formats)
- `trailer` - YouTube trailer info
- `title` - Main title
- `titles` - All titles (English, Japanese, synonyms)
- `type` - Anime type (TV, Movie, etc.)
- `source` - Original source material
- `episodes` - Episode count
- `status` - Airing status
- `airing` - Currently airing boolean
- `aired` - Aired date range
- `duration` - Episode duration
- `rating` - Audience rating
- `score` - Average score
- `scored_by` - Number of users who scored
- `rank` - Overall rank
- `popularity` - Popularity rank
- `members` - Number of members
- `favorites` - Number of favorites
- `synopsis` - Description
- `background` - Background info
- `season` - Season (winter, spring, summer, fall)
- `year` - Year
- `broadcast` - Broadcast time
- `producers` - Production companies
- `licensors` - Licensing companies
- `studios` - Animation studios
- `genres` - Genre list
- `themes` - Theme tags
- `demographics` - Target demographic

---

---

### 15. `getAnimeGenres(params)`
Get anime genres, explicit_genres, themes and demographics.

#### Parameters:
- **filter** (string, optional): Filter genres by type.
  - Values: `"genres"`, `"explicit_genres"`, `"themes"`, `"demographics"`

#### Usage Example:
```javascript
import { getAnimeGenres } from '../api';

// Get main genres
const genres = await getAnimeGenres({ filter: 'genres' });
console.log(genres.data);

// Get demographics (Shounen, Shoujo, etc.)
const demographics = await getAnimeGenres({ filter: 'demographics' });
```

#### Response Structure:
```javascript
{
  data: [
    {
      mal_id: 1,
      name: "Action",
      url: "https://myanimelist.net/anime/genre/1/Action",
      count: 5021
    }
  ]
}
```

---

---

### 16. `getSchedules(params)`
Get weekly anime broadcast schedule.

#### Parameters:
- **filter** (string, optional): Filter by day.
  - Values: `"monday"`, `"tuesday"`, `"wednesday"`, `"thursday"`, `"friday"`, `"saturday"`, `"sunday"`, `"unknown"`, `"other"`
- **kids** (boolean, optional): Filter for Kids Genre Demographic.
- **sfw** (boolean, optional): Filter for Hentai Genre (Safe For Work).
- **page** (number, optional): Page number.
- **limit** (number, optional): Results per page.

#### Usage Example:
```javascript
import { getSchedules } from '../api';

// Get Monday's schedule
const monday = await getSchedules({ filter: 'monday' });
console.log(monday.data);

// Get SFW schedule for today
const today = await getSchedules({ sfw: true });
```

---

---

### 17. `getSeasonsList()`
Get available list of seasons and years.

#### Usage Example:
```javascript
import { getSeasonsList } from '../api';

const seasons = await getSeasonsList();
console.log(seasons.data);
```

#### Response Structure:
```javascript
{
  "data": [
    {
      "year": 2024,
      "seasons": ["winter", "spring", "summer", "fall"]
    },
    {
      "year": 2023,
      "seasons": ["winter", "spring", "summer", "fall"]
    }
  ]
}
```

---

---

### 18. `getSeasonUpcoming(params)`
Get upcoming season's anime.

#### Parameters:
- **filter** (string, optional): Entry types.
  - Values: `"tv"`, `"movie"`, `"ova"`, `"special"`, `"ona"`, `"music"`
- **sfw** (boolean, optional): Filter out adult entries.
- **unapproved** (boolean, optional): Include unapproved entries.
- **continuing** (boolean, optional): Include entries continuing from previous seasons.
- **page** (number, optional): Page number.
- **limit** (number, optional): Items per page.

#### Usage Example:
```javascript
import { getSeasonUpcoming } from '../api';

// Get next season's TV series
const upcoming = await getSeasonUpcoming({ filter: 'tv' });
console.log(upcoming.data);
```

---

## Need More?

For additional endpoints and features, refer to the official [Jikan API Documentation](https://docs.api.jikan.moe/).
