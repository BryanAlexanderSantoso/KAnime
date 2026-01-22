# Advanced Search Quick Reference

## 🔍 searchAnime() - Complete Parameter Guide

### Basic Syntax
```javascript
searchAnime(query, params)
```

---

## 📋 All Parameters

| Category | Parameter | Type | Description | Example Values |
|----------|-----------|------|-------------|----------------|
| **Search** | `query` | string | Search text | `"Naruto"`, `""` |
| **Pagination** | `page` | number | Page number | `1`, `2`, `3` |
| | `limit` | number | Results per page | `25`, `50` |
| **Type** | `type` | string | Anime format | `"tv"`, `"movie"`, `"ova"` |
| **Status** | `status` | string | Airing status | `"airing"`, `"complete"`, `"upcoming"` |
| **Rating** | `rating` | string | Age rating | `"g"`, `"pg"`, `"pg13"`, `"r"` |
| **Score** | `score` | number | Exact score | `8`, `7.5` |
| | `min_score` | number | Minimum score | `7.0`, `8.5` |
| | `max_score` | number | Maximum score | `9.0`, `10` |
| **Genres** | `genres` | string | Include genres | `"1,2,3"` |
| | `genres_exclude` | string | Exclude genres | `"14,41"` |
| **Producer** | `producers` | string | Studio/Producer | `"1,2,3"` |
| **Dates** | `start_date` | string | Start date | `"2024"`, `"2024-01"`, `"2024-01-15"` |
| | `end_date` | string | End date | `"2024"`, `"2024-12"`, `"2024-12-31"` |
| **Sorting** | `order_by` | string | Sort field | `"score"`, `"members"`, `"popularity"` |
| | `sort` | string | Sort order | `"asc"`, `"desc"` |
| **Other** | `letter` | string | First letter | `"A"`, `"N"`, `"Z"` |
| | `sfw` | boolean | Safe for work | `true`, `false` |
| | `unapproved` | boolean | Include unapproved | `true` |

---

## 🎬 Anime Types

| Type | Description | Example |
|------|-------------|---------|
| `tv` | TV Series | Naruto, One Piece |
| `movie` | Movies | Spirited Away, Your Name |
| `ova` | Original Video Animation | Hellsing Ultimate |
| `special` | TV Specials | One Piece Special |
| `ona` | Original Net Animation | Devilman Crybaby |
| `music` | Music Videos | K-On! Concert |
| `cm` | Commercials | - |
| `pv` | Promotional Videos | - |
| `tv_special` | TV Specials | - |

---

## 📊 Status Values

| Status | Description |
|--------|-------------|
| `airing` | Currently broadcasting |
| `complete` | Finished airing |
| `upcoming` | Not yet aired |

---

## 🔞 Rating Values

| Rating | Code | Description |
|--------|------|-------------|
| All Ages | `g` | Suitable for everyone |
| Children | `pg` | Parental guidance |
| Teens 13+ | `pg13` | For teenagers |
| 17+ | `r17` | Violence & profanity |
| Mild Nudity | `r` | Mature content |
| Hentai | `rx` | Adult only |

---

## 🎭 Common Genre IDs

### Popular Genres
- **1** - Action
- **2** - Adventure
- **4** - Comedy
- **8** - Drama
- **10** - Fantasy
- **22** - Romance
- **24** - Sci-Fi
- **36** - Slice of Life

### Themes
- **7** - Mystery
- **14** - Horror
- **37** - Supernatural
- **40** - Psychological
- **41** - Thriller

### Demographics
- **25** - Shoujo (young girls)
- **27** - Shounen (young boys)
- **42** - Seinen (adult men)
- **43** - Josei (adult women)

### Specific
- **18** - Mecha
- **30** - Sports
- **31** - Super Power
- **35** - Harem
- **16** - Magic

*Full list available at: https://myanimelist.net/anime.php*

---

## 📈 Order By Options

| Value | Description |
|-------|-------------|
| `mal_id` | MyAnimeList ID |
| `title` | Alphabetical by title |
| `start_date` | Air start date |
| `end_date` | Air end date |
| `episodes` | Episode count |
| `score` | Average rating |
| `scored_by` | Number of ratings |
| `rank` | Overall rank |
| `popularity` | Popularity rank |
| `members` | Member count |
| `favorites` | Favorites count |

---

## 💡 Quick Examples

### Most Popular
```javascript
searchAnime('', { order_by: 'members', sort: 'desc', limit: 25 })
```

### Top Rated
```javascript
searchAnime('', { order_by: 'score', sort: 'desc', min_score: 8, limit: 25 })
```

### Currently Airing
```javascript
searchAnime('', { status: 'airing', order_by: 'members', sort: 'desc' })
```

### Action Anime
```javascript
searchAnime('', { genres: '1', min_score: 7, order_by: 'score', sort: 'desc' })
```

### Romance Without Horror
```javascript
searchAnime('', { genres: '22', genres_exclude: '14', sfw: true })
```

### Movies from 2020+
```javascript
searchAnime('', { type: 'movie', start_date: '2020', min_score: 7 })
```

### Anime Starting with 'A'
```javascript
searchAnime('', { letter: 'A', type: 'tv', min_score: 7 })
```

### High Score Range
```javascript
searchAnime('', { min_score: 8.0, max_score: 9.0, order_by: 'popularity' })
```

---

## 🎯 Pro Tips

1. **Empty Query for Filtering**: Use `searchAnime('', { ... })` to filter without text search
2. **Combine Genres**: Multiple genre IDs with comma: `"1,2,10"` (Action, Adventure, Fantasy)
3. **Exclude Genres**: Remove unwanted content: `genres_exclude: "14,41"` (No Horror/Thriller)
4. **Date Flexibility**: Use `"2024"`, `"2024-01"`, or `"2024-01-15"` formats
5. **SFW Mode**: Always add `sfw: true` for safe content
6. **Score Sweet Spot**: Try `min_score: 7.5` for quality without being too restrictive
7. **Popularity vs Score**: `order_by: 'members'` for popular, `order_by: 'score'` for quality
8. **Pagination**: Always include `limit` to control results

---

## 🚀 Common Use Cases

### Discovery Page
```javascript
// Top rated this year
const topThisYear = await searchAnime('', {
    start_date: '2024',
    min_score: 7.5,
    order_by: 'score',
    sort: 'desc'
});
```

### Genre Browser
```javascript
// All comedy anime
const comedies = await searchAnime('', {
    genres: '4',
    type: 'tv',
    status: 'complete',
    min_score: 6.5,
    order_by: 'members',
    sort: 'desc'
});
```

### Family Filter
```javascript
// Safe for everyone
const familyAnime = await searchAnime('', {
    rating: 'g',
    genres_exclude: '14,41', // No horror/thriller
    min_score: 7.0,
    sfw: true
});
```

### Seasonal Archive
```javascript
// Winter 2024 anime
const winter2024 = await searchAnime('', {
    start_date: '2024-01-01',
    end_date: '2024-03-31',
    type: 'tv'
});
```

---

## ⚠️ Important Notes

- Maximum `limit` is **25** items per request
- Rate limiting applies - don't spam requests
- Some older anime may have incomplete data
- Genre/Producer IDs are specific numbers from MyAnimeList
- Date formats: YYYY, YYYY-MM, or YYYY-MM-DD
- Query can be empty `''` for pure filtering
