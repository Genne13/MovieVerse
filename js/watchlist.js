import { IMG_URL } from "./api.js";

const watchlistContainer = document.getElementById("watchlistContainer");

function getWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
}

function saveWatchlist(list) {
  localStorage.setItem("watchlist", JSON.stringify(list));
}

function removeFromWatchlist(movieId) {
  let watchlist = getWatchlist();
  watchlist = watchlist.filter(movie => movie.id !== movieId);
  saveWatchlist(watchlist);
  displayWatchlist();
}

function displayWatchlist() {
  const watchlist = getWatchlist();
  watchlistContainer.innerHTML = "";

  if (watchlist.length === 0) {
    watchlistContainer.innerHTML = "<h3>No movies in watchlist.</h3>";
    return;
  }

  watchlist.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>⭐ Rating: ${movie.vote_average.toFixed(1)}</p>
        <button class="btn remove-btn">Remove</button>
      </div>
    `;

    card.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromWatchlist(movie.id);
    });

    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) return;
      window.location.href = `movie.html?id=${movie.id}`;
    });

    watchlistContainer.appendChild(card);
  });
}

displayWatchlist();