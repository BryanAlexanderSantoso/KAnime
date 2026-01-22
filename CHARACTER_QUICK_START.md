# 🚀 KAnime Character API - Quick Start Guide

## ⚡ Get Started in 30 Seconds

### 1. Import the Function
```javascript
import { getCharacterAnime } from './api';
```

### 2. Use It!
```javascript
// Get all anime featuring a character
const result = await getCharacterAnime(417); // Lelouch Lamperouge

// result.data contains array of anime with roles
result.data.forEach(item => {
    console.log(`${item.anime.title} - Role: ${item.role}`);
});
```

---

## 📋 All Character Functions - One Line Each

```javascript
import { 
    getCharacterAnime,      // Get character's anime appearances
    getCharacterById,       // Get character basic info
    getCharacterFull,       // Get everything about a character
    getCharacterVoiceActors, // Get voice actors
    searchCharacters,       // Search for characters
    getTopCharacters,       // Get top characters
    getCharacterPictures    // Get character images
} from './api';

// Example usage
const anime = await getCharacterAnime(417);           // Anime appearances
const info = await getCharacterById(417);             // Basic info
const full = await getCharacterFull(417);             // Complete data
const voices = await getCharacterVoiceActors(417);    // Voice actors
const search = await searchCharacters('Naruto');      // Search
const top = await getTopCharacters({ limit: 25 });    // Top 25
const pics = await getCharacterPictures(417);         // Pictures
```

---

## 🎯 Most Common Use Cases

### Get Character Profile
```javascript
const char = await getCharacterById(417);
console.log(char.data.name);        // "Lamperouge, Lelouch"
console.log(char.data.favorites);   // 123456
console.log(char.data.about);       // Character description
```

### Get Character's Anime List
```javascript
const data = await getCharacterAnime(417);

// All anime
console.log('Total anime:', data.data.length);

// Main roles only
const mainRoles = data.data.filter(a => a.role === 'Main');
console.log('Main roles:', mainRoles.length);

// Supporting roles only
const supporting = data.data.filter(a => a.role === 'Supporting');
console.log('Supporting:', supporting.length);
```

### Get Voice Actors
```javascript
const voices = await getCharacterVoiceActors(417);

// Japanese VA
const jpVA = voices.data.find(v => v.language === 'Japanese');
console.log('Japanese VA:', jpVA?.person.name);

// English VA
const enVA = voices.data.find(v => v.language === 'English');
console.log('English VA:', enVA?.person.name);
```

### Search Characters
```javascript
// Search by name
const results = await searchCharacters('Luffy');

// Most popular
const popular = await searchCharacters('', {
    order_by: 'favorites',
    sort: 'desc',
    limit: 25
});

// By letter
const aChars = await searchCharacters('', { letter: 'A' });
```

---

## 🔥 Ready-to-Use Examples

Check `src/characterExamples.js` for 25+ ready-made functions:

```javascript
import {
    getCharacterInfo,           // Basic info wrapper
    getCharacterAppearances,    // All anime appearances
    getCharacterMainRoles,      // Only main roles
    getMostPopularCharacters,   // Top popular
    buildCharacterProfile,      // Complete profile
    POPULAR_CHARACTERS          // Popular character IDs
} from './characterExamples';

// Use them directly!
const profile = await buildCharacterProfile(POPULAR_CHARACTERS.LELOUCH);
```

---

## 🎭 Popular Character IDs for Testing

```javascript
const POPULAR_CHARACTERS = {
    LELOUCH: 417,           // Code Geass
    LIGHT_YAGAMI: 80,       // Death Note
    EDWARD_ELRIC: 11,       // Fullmetal Alchemist
    LUFFY: 40,              // One Piece
    NARUTO: 17,             // Naruto
    GOKU: 246,              // Dragon Ball
    EREN: 40882,            // Attack on Titan
    LEVI: 45627,            // Attack on Titan
    SAITAMA: 73935,         // One Punch Man
    REM: 118763,            // Re:Zero
};
```

---

## 📦 Response Structure

### getCharacterAnime(id)
```javascript
{
  data: [
    {
      role: "Main",              // "Main" or "Supporting"
      anime: {
        mal_id: 1575,
        url: "...",
        title: "Code Geass",
        images: {
          jpg: { ... },
          webp: { ... }
        }
      }
    }
  ]
}
```

### getCharacterById(id)
```javascript
{
  data: {
    mal_id: 417,
    name: "Lamperouge, Lelouch",
    name_kanji: "ルルーシュ・ランペルージ",
    nicknames: ["Lulu", "The Black Prince"],
    about: "...",
    images: { ... },
    favorites: 123456
  }
}
```

---

## 💡 Pro Tips

1. **Use Character IDs** - Character IDs are from MyAnimeList
2. **Async/Await** - All functions are async, use `await`
3. **Error Handling** - Wrap in try-catch
4. **Rate Limits** - Don't spam requests
5. **Ready Examples** - Use `characterExamples.js` functions

---

## 📚 Full Documentation

- **Complete Guide**: `CHARACTER_API_SUMMARY.md`
- **API Docs**: `API_DOCUMENTATION.md` (sections 8-14)
- **Code Examples**: `src/characterExamples.js`

---

## 🎨 Component Example

```javascript
import { useState, useEffect } from 'react';
import { getCharacterAnime, getCharacterById } from './api';

function CharacterPage({ charId = 417 }) {
    const [character, setCharacter] = useState(null);
    const [anime, setAnime] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function loadData() {
            try {
                const [charData, animeData] = await Promise.all([
                    getCharacterById(charId),
                    getCharacterAnime(charId)
                ]);
                
                setCharacter(charData.data);
                setAnime(animeData.data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }
        
        loadData();
    }, [charId]);
    
    if (loading) return <div>Loading...</div>;
    if (!character) return <div>Not found</div>;
    
    return (
        <div>
            <h1>{character.name}</h1>
            <img src={character.images.webp.image_url} alt={character.name} />
            <p>Favorites: {character.favorites.toLocaleString()}</p>
            
            <h2>Anime Appearances ({anime.length})</h2>
            {anime.map(item => (
                <div key={item.anime.mal_id}>
                    <h3>{item.anime.title}</h3>
                    <span>Role: {item.role}</span>
                </div>
            ))}
        </div>
    );
}

export default CharacterPage;
```

---

## ✅ You're Ready!

Start using character APIs now! Try:

```javascript
import { getCharacterAnime } from './api';

// Test it!
const test = await getCharacterAnime(417);
console.log('Success!', test.data);
```

🎉 **Happy coding!**
