export const API_KEY = "2b353109bcee0dc3ca84d45604506bab";
export const BASE_URL = "https://api.themoviedb.org/3";
export const IMG_URL = "https://image.tmdb.org/t/p/w500";

export async function fetchData(endpoint, page = 1) {
  const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}`);
  const data = await response.json();
  return data;
}

export async function fetchSearchData(endpoint, page = 1) {
  const response = await fetch(`${BASE_URL}${endpoint}&api_key=${API_KEY}&page=${page}`);
  const data = await response.json();
  return data;
}