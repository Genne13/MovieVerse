import { fetchData, IMG_URL } from "./api.js";

const movieDetails = document.getElementById("movieDetails");
const castContainer = document.getElementById("castContainer");
const trailerContainer = document.getElementById("trailerContainer");
const similarMovies = document.getElementById("similarMovies");

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

// WATCHLIST FUNCTIONS
function getWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
}

function saveWatchlist(list) {
  localStorage.setItem("watchlist", JSON.stringify(list));
}

function addToWatchlist(movie) {
  const watchlist = getWatchlist();

  const exists = watchlist.some(item => item.id === movie.id);

  if (!exists) {
    watchlist.push(movie);
    saveWatchlist(watchlist);
    alert("Added to Watchlist ⭐");
  } else {
    alert("Already in Watchlist!");
  }
}

// DISPLAY MOVIE DETAILS
async function loadMovieDetails() {
  const movie = await fetchData(`/movie/${movieId}`);

  movieDetails.innerHTML = `
    <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
    <div class="movie-text">
      <h1>${movie.title}</h1>
      <p><b>⭐ Rating:</b> ${movie.vote_average.toFixed(1)}</p>
      <p><b>Release Date:</b> ${movie.release_date}</p>
      <p><b>Genres:</b> ${movie.genres.map(g => g.name).join(", ")}</p>
      <p><b>Overview:</b> ${movie.overview}</p>
      <button class="btn" id="watchlistBtn">Add to Watchlist</button>
    </div>
  `;

  document.getElementById("watchlistBtn").addEventListener("click", () => {
    addToWatchlist({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average
    });
  });
}

// LOAD CAST
async function loadCast() {
  const data = await fetchData(`/movie/${movieId}/credits`);
  castContainer.innerHTML = "";

  data.cast.slice(0, 10).forEach(actor => {
    const castCard = document.createElement("div");
    castCard.classList.add("cast-card");

    castCard.innerHTML = `
      <img src="${actor.profile_path ? IMG_URL + actor.profile_path : ''}" alt="${actor.name}">
      <p>${actor.name}</p>
    `;

    castContainer.appendChild(castCard);
  });
}

// LOAD TRAILER
async function loadTrailer() {
  const data = await fetchData(`/movie/${movieId}/videos`);

  const trailer = data.results.find(video => video.type === "Trailer");

  if (trailer) {
    trailerContainer.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${trailer.key}" allowfullscreen></iframe>
    `;
  } else {
    trailerContainer.innerHTML = "<p>No trailer available.</p>";
  }
}

// LOAD SIMILAR MOVIES
async function loadSimilarMovies() {
  const data = await fetchData(`/movie/${movieId}/similar`);
  similarMovies.innerHTML = "";

  data.results.slice(0, 10).forEach(movie => {
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

    similarMovies.appendChild(card);
  });
}

loadMovieDetails();
loadCast();
loadTrailer();
loadSimilarMovies();