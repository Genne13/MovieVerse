# MovieVerse

A modern, responsive web application for discovering and exploring movies using The Movie Database (TMDB) API. Built with vanilla JavaScript, HTML5, and CSS3.

![MovieVerse](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Trending Movies**: View the latest trending movies on the homepage
- **Search**: Search for any movie by title
- **Movies by Mood**: Select from 12 predefined moods or describe your mood in natural language to get personalized movie recommendations
- **Movie Details**: View detailed information including overview, rating, release date, and genres
- **Cast & Crew**: See the top 10 cast members for any movie
- **Trailers**: Watch official YouTube trailers
- **Similar Movies**: Discover movies similar to the one you're viewing
- **Watchlist**: Save movies to your personal watchlist (stored in localStorage)
- **Infinite Scroll**: Automatically load more movies as you scroll
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Project Structure

```
movieverse/
├── index.html          # Homepage with trending movies and search
├── movie.html          # Movie details page
├── watchlist.html      # User's saved watchlist
├── css/
│   └── style.css       # All styles and animations
├── js/
│   ├── api.js          # API configuration and fetch utilities
│   ├── main.js         # Homepage logic (trending, search, infinite scroll)
│   ├── mood.js         # Mood-based movie discovery feature
│   ├── movie.js        # Movie details page logic
│   └── watchlist.js    # Watchlist management
└── assets/
    └── logo.png        # Application logo
```

## Pages

### 1. Home (`index.html`)
- Displays trending movies on load
- Search bar to find movies by title
- "Movies by Mood" button for mood-based recommendations
- Infinite scroll for loading more results

### 2. Movie Details (`movie.html`)
- Full movie information (title, rating, overview, genres, release date)
- Top 10 cast members with photos
- YouTube trailer embed
- Similar movie recommendations
- "Add to Watchlist" button

### 3. Watchlist (`watchlist.html`)
- View all saved movies
- Remove movies from watchlist
- Click on a movie to view details

## Mood Feature

The mood-based discovery system offers two ways to find movies:

### Predefined Moods (12 options)
| Mood | Emoji | Genres |
|------|-------|--------|
| Happy | 😊 | Comedy, Family, Music |
| Sad | 😢 | Drama, Romance |
| Adventurous | 🗺️ | Action, Adventure, Sci-Fi |
| Romantic | 💕 | Romance, Rom-Com, Drama |
| Thrilling | 😰 | Thriller, Crime, Mystery |
| Scary | 😱 | Horror, Thriller |
| Inspirational | 🌟 | Drama, History, War |
| Relaxed | 😌 | Comedy, Family, Animation |
| Energetic | ⚡ | Action, Adventure, Animation |
| Nostalgic | 🕰️ | History, Drama, Romance |
| Mysterious | 🔍 | Mystery, Thriller, Crime |
| Fantasy | 🐉 | Fantasy, Adventure, Animation |

### Custom Mood Input
- Type your mood in natural language (e.g., "I want to feel motivated")
- Quick mood chips: Feel Good, Excited, Chill, Dreamy
- Keyword matching maps to appropriate genres

## API Configuration

The application uses [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api).

To use this project, you need your own API key:

1. Sign up at [TMDB](https://www.themoviedb.org/)
2. Go to Settings → API → Create an API key
3. Copy your **API Key (v3 auth)**
4. Update `js/api.js` with your key:

```javascript
export const API_KEY = "YOUR_API_KEY_HERE";
```

## Local Development

1. Clone the repository
2. Add your TMDB API key to `js/api.js`
3. Open `index.html` in a browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

4. Visit `http://localhost:8000` (or your configured port)

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Styling with gradients, animations, and responsive grid layouts
- **Vanilla JavaScript (ES6+)** - No frameworks, pure JavaScript with modules
- **TMDB API** - Movie data, images, and metadata
- **LocalStorage** - Persistent watchlist storage
- **YouTube Embed** - Trailer playback

## Code Architecture

### Modules

| File | Purpose |
|------|---------|
| `api.js` | API key, base URLs, and fetch utility functions |
| `main.js` | Homepage initialization, search, infinite scroll |
| `mood.js` | Mood modal, mood-to-genre mapping, mood-based fetching |
| `movie.js` | Movie details, cast, trailer, similar movies |
| `watchlist.js` | Display and manage saved movies |

### Key Functions

- `fetchData(endpoint, page)` - Fetch data from TMDB API
- `fetchSearchData(endpoint, page)` - Fetch search results
- `displayMovies(movies)` - Render movie cards
- `handleMoodSelection(mood)` - Process mood button clicks
- `loadMoodMovies(mood)` - Fetch movies by genre filter
- `addToWatchlist(movie)` - Save movie to localStorage
- `removeFromWatchlist(id)` - Remove movie from watchlist

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires ES6 module support.

## License

MIT License - feel free to use this project for learning or personal use.

## Acknowledgments

- Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Icons and emojis for mood selection
- Google Fonts (Poppins) for typography
