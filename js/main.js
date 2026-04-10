const loadingText = document.getElementById("loadingText");
import { fetchData, fetchSearchData, IMG_URL } from "./api.js";
import { initMoodFeature, getCurrentMood, loadMoreMoodMovies, resetMoodState, setMoodSelectedCallback } from "./mood.js";

const moviesContainer = document.getElementById("moviesContainer");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const sectionTitle = document.getElementById("sectionTitle");

let currentPage = 1;
let currentQuery = "";
let isLoading = false;
let mode = "trending"; // trending, search, or mood

// Initialize mood feature
initMoodFeature();

// Set up callback for when mood is selected
setMoodSelectedCallback((mood) => {
  mode = "mood";
  if (mood === null) {
    // Custom mood search - reset mood state but keep mode
    resetMoodState();
  }
});

// DISPLAY MOVIES (append, not replace)
function displayMovies(movies) {
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

// LOAD TRENDING MOVIES PAGE-WISE
async function loadTrendingMovies() {
  loadingText.style.display = "block";
  if (isLoading) return;
  isLoading = true;
  loadingText.style.display = "none";

  const data = await fetchData("/trending/movie/day", currentPage);
  displayMovies(data.results);

  isLoading = false;
}

// LOAD SEARCH MOVIES PAGE-WISE
async function loadSearchMovies(query) {
  loadingText.style.display = "block";
  if (isLoading) return;
  isLoading = true;
  loadingText.style.display = "none";

  const data = await fetchSearchData(`/search/movie?query=${query}`, currentPage);
  displayMovies(data.results);

  isLoading = false;
}

// INITIAL LOAD
sectionTitle.innerText = "Trending Movies";
loadTrendingMovies();

// SEARCH BUTTON CLICK
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();

  if (query === "") return;

  mode = "search";
  currentQuery = query;
  currentPage = 1;
  resetMoodState();

  sectionTitle.innerText = `Search Results for: "${query}"`;
  moviesContainer.innerHTML = "";

  loadSearchMovies(query);
});

// INFINITE SCROLL EVENT
window.addEventListener("scroll", () => {
  const scrollPosition = window.innerHeight + window.scrollY;
  const bottom = document.body.offsetHeight - 200;

  if (scrollPosition >= bottom && !isLoading) {
    currentPage++;

    if (mode === "trending") {
      loadTrendingMovies();
    } else if (mode === "search") {
      loadSearchMovies(currentQuery);
    } else if (mode === "mood") {
      loadMoreMoodMovies();
    }
  }
});