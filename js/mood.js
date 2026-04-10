import { fetchData, fetchSearchData, IMG_URL, API_KEY, BASE_URL } from "./api.js";

// MOOD TO GENRE MAPPING (TMDB Genre IDs)
const moodGenreMap = {
  happy: [35, 10751, 10402],      // Comedy, Family, Music
  sad: [18, 10749],               // Drama, Romance (heartbreak)
  adventurous: [28, 12, 878],     // Action, Adventure, Sci-Fi
  romantic: [10749, 35, 18],      // Romance, Rom-Com, Drama
  thrilling: [53, 80, 9648],      // Thriller, Crime, Mystery
  scary: [27, 53],                // Horror, Thriller
  inspirational: [18, 36, 10752], // Drama, History, War
  relaxed: [35, 10751, 16],       // Comedy, Family, Animation
  energetic: [28, 12, 16],        // Action, Adventure, Animation
  nostalgic: [36, 18, 10749],     // History, Drama, Romance
  mysterious: [9648, 53, 80],     // Mystery, Thriller, Crime
  fantasy: [14, 12, 16],          // Fantasy, Adventure, Animation
};

// MOOD OPTIONS WITH EMOJIS AND DESCRIPTIONS
const moodOptions = [
  { id: "happy", emoji: "😊", label: "Happy", description: "Feel-good comedies & family movies" },
  { id: "sad", emoji: "😢", label: "Sad", description: "Emotional dramas & heartbreak stories" },
  { id: "adventurous", emoji: "🗺️", label: "Adventurous", description: "Action-packed adventures" },
  { id: "romantic", emoji: "💕", label: "Romantic", description: "Love stories & rom-coms" },
  { id: "thrilling", emoji: "😰", label: "Thrilling", description: "Edge-of-your-seat thrillers" },
  { id: "scary", emoji: "😱", label: "Scary", description: "Horror & supernatural scares" },
  { id: "inspirational", emoji: "🌟", label: "Inspirational", description: "Uplifting & motivating stories" },
  { id: "relaxed", emoji: "😌", label: "Relaxed", description: "Light & easy watching" },
  { id: "energetic", emoji: "⚡", label: "Energetic", description: "High-energy action & animation" },
  { id: "nostalgic", emoji: "🕰️", label: "Nostalgic", description: "Classic & historical films" },
  { id: "mysterious", emoji: "🔍", label: "Mysterious", description: "Mind-bending mysteries" },
  { id: "fantasy", emoji: "🐉", label: "Fantasy", description: "Magical worlds & creatures" },
];

// CUSTOM MOOD KEYWORDS
const customMoodKeywords = {
  "feel good": [35, 10751],
  "cry": [18, 10749],
  "laugh": [35],
  "excited": [28, 12],
  "love": [10749, 35],
  "scared": [27],
  "motivated": [18, 36],
  "chill": [35, 10751],
  "pumped": [28],
  "dreamy": [14, 10749],
  "curious": [9648, 53],
  "hopeful": [18, 10752],
};

let moviesContainer;
let sectionTitle;
let currentPage = 1;
let currentMood = null;
let isLoading = false;

export function initMoodFeature() {
  moviesContainer = document.getElementById("moviesContainer");
  sectionTitle = document.getElementById("sectionTitle");

  setupMoodModal();
  setupMoodButton();
}

// CREATE MOOD MODAL HTML
function setupMoodModal() {
  // Check if modal already exists
  if (document.getElementById("moodModal")) return;

  const modalHTML = `
    <div id="moodModal" class="mood-modal">
      <div class="mood-modal-content">
        <span class="mood-close">&times;</span>
        <h2>How are you feeling today?</h2>
        <p class="mood-subtitle">Select a mood or describe it in your own words</p>

        <div class="mood-grid">
          ${moodOptions.map(mood => `
            <div class="mood-card" data-mood="${mood.id}">
              <span class="mood-emoji">${mood.emoji}</span>
              <span class="mood-label">${mood.label}</span>
              <span class="mood-desc">${mood.description}</span>
            </div>
          `).join("")}
        </div>

        <div class="custom-mood-section">
          <p>Or describe your mood:</p>
          <div class="custom-mood-input">
            <input type="text" id="customMoodInput" placeholder="e.g., I want to feel motivated and inspired...">
            <button id="customMoodBtn">Find Movies</button>
          </div>
          <div class="quick-moods">
            <span class="quick-mood-chip" data-mood="feel good">Feel Good</span>
            <span class="quick-mood-chip" data-mood="excited">Excited</span>
            <span class="quick-mood-chip" data-mood="chill">Chill</span>
            <span class="quick-mood-chip" data-mood="dreamy">Dreamy</span>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Add event listeners for modal
  document.querySelector(".mood-close").addEventListener("click", () => {
    document.getElementById("moodModal").classList.remove("active");
  });

  document.getElementById("moodModal").addEventListener("click", (e) => {
    if (e.target.id === "moodModal") {
      document.getElementById("moodModal").classList.remove("active");
    }
  });

  // Mood card clicks
  document.querySelectorAll(".mood-card").forEach(card => {
    card.addEventListener("click", () => {
      const mood = card.dataset.mood;
      handleMoodSelection(mood);
    });
  });

  // Custom mood input
  document.getElementById("customMoodBtn").addEventListener("click", handleCustomMood);
  document.getElementById("customMoodInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleCustomMood();
  });

  // Quick mood chips
  document.querySelectorAll(".quick-mood-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const mood = chip.dataset.mood;
      handleMoodSelection(mood);
    });
  });
}

// SETUP MOOD BUTTON IN NAVBAR
function setupMoodButton() {
  const navbar = document.querySelector(".navbar");
  const existingMoodBtn = document.getElementById("moodBtn");

  if (existingMoodBtn) return;

  const moodBtnHTML = `
    <button id="moodBtn" class="mood-btn">
      <span>🎭</span> Movies by Mood
    </button>
  `;

  const searchBox = navbar.querySelector(".search-box");
  searchBox.insertAdjacentHTML("afterend", moodBtnHTML);

  document.getElementById("moodBtn").addEventListener("click", () => {
    document.getElementById("moodModal").classList.add("active");
  });
}

// HANDLE PREDEFINED MOOD SELECTION
async function handleMoodSelection(mood) {
  console.log("Mood selected:", mood);
  console.log("moviesContainer:", moviesContainer);
  console.log("sectionTitle:", sectionTitle);

  document.getElementById("moodModal").classList.remove("active");

  currentMood = mood;
  currentPage = 1;

  const selectedMood = moodOptions.find(m => m.id === mood);
  const moodLabel = selectedMood ? selectedMood.label : mood;

  sectionTitle.innerText = `Movies for ${moodLabel} Mood ${selectedMood ? selectedMood.emoji : ""}`;
  moviesContainer.innerHTML = "";

  // Notify main.js to set mode and handle state
  notifyMoodSelected(mood);
  console.log("Mode set, now loading movies for mood:", mood);

  await loadMoodMovies(mood);
}

// LOAD MOVIES BY MOOD (using genre filter)
async function loadMoodMovies(mood) {
  console.log("loadMoodMovies called with mood:", mood);
  if (isLoading) {
    console.log("Already loading, returning");
    return;
  }
  isLoading = true;

  const genreIds = moodGenreMap[mood] || moodGenreMap.happy;
  const genreString = genreIds.join(",");

  console.log("Genre IDs for", mood, ":", genreIds);
  console.log("Fetching:", `/discover/movie?with_genres=${genreString}&sort_by=popularity.desc`);

  try {
    // Use & instead of ? since endpoint already has query params
    const url = `/discover/movie?with_genres=${genreString}&sort_by=popularity.desc&api_key=${API_KEY}&page=${currentPage}`;
    const response = await fetch(`${BASE_URL}${url}`);
    const data = await response.json();

    console.log("Received data:", data);

    if (data.status_code) {
      console.error("TMDB API Error:", data.status_message);
      moviesContainer.innerHTML = `<p style="text-align:center;color:#ff6b6b;">Error: ${data.status_message}</p>`;
      return;
    }

    console.log("Movies count:", data.results?.length);
    if (!data.results || data.results.length === 0) {
      moviesContainer.innerHTML = `<p style="text-align:center;">No movies found for this mood.</p>`;
      return;
    }

    displayMoodMovies(data.results);
  } catch (error) {
    console.error("Error loading mood movies:", error);
    moviesContainer.innerHTML = `<p style="text-align:center;color:#ff6b6b;">Failed to load movies. Please check your internet connection or API key.</p>`;
  }

  isLoading = false;
}

// HANDLE CUSTOM MOOD INPUT
async function handleCustomMood() {
  const input = document.getElementById("customMoodInput");
  const customText = input.value.trim().toLowerCase();

  if (!customText) return;

  document.getElementById("moodModal").classList.remove("active");

  sectionTitle.innerText = `Movies for: "${input.value}"`;
  moviesContainer.innerHTML = "";
  currentPage = 1;
  currentMood = null;

  // Notify main.js to set mode and handle state
  notifyMoodSelected(null);

  // Try to match custom keywords
  let genreIds = [];
  for (const [keyword, genres] of Object.entries(customMoodKeywords)) {
    if (customText.includes(keyword)) {
      genreIds = [...new Set([...genreIds, ...genres])];
    }
  }

  if (genreIds.length > 0) {
    // Use genre discovery - build URL properly with api_key
    const genreString = genreIds.join(",");
    const url = `/discover/movie?with_genres=${genreString}&sort_by=popularity.desc&api_key=${API_KEY}&page=${currentPage}`;
    const response = await fetch(`${BASE_URL}${url}`);
    const data = await response.json();
    if (data.results) {
      displayMoodMovies(data.results);
    }
  } else {
    // Fallback to keyword search
    const data = await fetchSearchData(`/search/movie?query=${encodeURIComponent(customText)}`, currentPage);
    displayMoodMovies(data.results);
  }
}

// DISPLAY MOOD MOVIES
function displayMoodMovies(movies) {
  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>⭐ Rating: ${movie.vote_average.toFixed(1)}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `movie.html?id=${movie.id}`;
    });

    moviesContainer.appendChild(card);
  });
}

// EXPORT FOR MAIN.JS TO USE WITH INFINITE SCROLL
export function getCurrentMood() {
  return currentMood;
}

// Export a callback that main.js can set to be notified when mood is selected
let onMoodSelected = null;

export function setMoodSelectedCallback(callback) {
  onMoodSelected = callback;
}

// Internal function to notify main.js about mood selection
function notifyMoodSelected(mood) {
  if (onMoodSelected) {
    onMoodSelected(mood);
  }
}

export async function loadMoreMoodMovies() {
  if (!currentMood) return;
  currentPage++;
  await loadMoodMovies(currentMood);
}

export function resetMoodState() {
  currentMood = null;
  currentPage = 1;
}
