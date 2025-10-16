// src/services/api.js

// OMDB API Configuration (Works in India)
//const API_KEY = "31fd4032"; // Your working API key from omdbapi.com
//const BASE_URL = "http://www.omdbapi.com";

// Alternative: TMDB API (if accessible)
const TMDB_API_KEY = "5f5e5a10b5abf65315ef74fb740d00e4";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Mock data for testing
const MOCK_MOVIES = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    release_date: "1994-09-23",
    overview: "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.",
    vote_average: 8.7
  },
  {
    id: 2,
    title: "The Godfather",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    release_date: "1972-03-14",
    overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",
    vote_average: 8.7
  },
  {
    id: 3,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    release_date: "2008-07-16",
    overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.",
    vote_average: 8.5
  },
  {
    id: 4,
    title: "Pulp Fiction",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    release_date: "1994-09-10",
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine.",
    vote_average: 8.5
  },
  {
    id: 5,
    title: "Forrest Gump",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    release_date: "1994-06-23",
    overview: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold.",
    vote_average: 8.5
  }
];

// Fetch 2025 movies using TMDB API
export const getPopularMovies = async () => {
  try {
    console.log("🎬 Attempting to fetch 2025 movies from TMDB API...");
    
    // Get current year and upcoming movies
    const currentYear = new Date().getFullYear();
    console.log(`🔍 Searching for movies from ${currentYear}...`);
    
    // Try multiple approaches to get 2025 movies
    const moviePromises = [];
    
    // Approach 1: Search for movies released in 2025
    moviePromises.push(
      fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&primary_release_year=${currentYear}&sort_by=popularity.desc&page=1`)
        .then(response => response.json())
    );
    
    // Approach 2: Get upcoming movies
    moviePromises.push(
      fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&page=1`)
        .then(response => response.json())
    );
    
    // Approach 3: Get now playing movies
    moviePromises.push(
      fetch(`${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&page=1`)
        .then(response => response.json())
    );
    
    const responses = await Promise.all(moviePromises);
    let allMovies = [];
    
    // Combine results from all approaches
    responses.forEach(response => {
      if (response.results && Array.isArray(response.results)) {
        allMovies.push(...response.results);
      }
    });
    
    // Filter for 2025 movies and remove duplicates
    const movies2025 = allMovies.filter((movie, index, self) => {
      const releaseYear = new Date(movie.release_date).getFullYear();
      return releaseYear === currentYear && 
             index === self.findIndex(m => m.id === movie.id);
    });
    
    // Sort by popularity and rating
    const sortedMovies = movies2025.sort((a, b) => {
      // First by release date (newest first)
      const dateA = new Date(a.release_date);
      const dateB = new Date(b.release_date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }
      // Then by popularity
      return b.popularity - a.popularity;
    });
    
    // Take top 12 movies
    const finalMovies = sortedMovies.slice(0, 12);
    
    if (finalMovies.length > 0) {
      console.log(`🎉 Successfully loaded ${finalMovies.length} movies from ${currentYear}!`);
      console.log("📊 Movies loaded:", finalMovies.map(m => `${m.title} (${new Date(m.release_date).getFullYear()}) - ${m.vote_average}/10`));
      return finalMovies;
    } else {
      // Fallback: Get popular movies if no 2025 movies found
      console.log("⚠️ No 2025 movies found, fetching popular movies...");
      const popularResponse = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=1`);
      const popularData = await popularResponse.json();
      
      if (popularData.results && popularData.results.length > 0) {
        console.log(`🎉 Loaded ${popularData.results.length} popular movies as fallback!`);
        return popularData.results.slice(0, 12);
      } else {
        throw new Error("No movies found");
      }
    }
    
  } catch (error) {
    console.error("❌ Failed to load 2025 movies from TMDB API:", error.message);
    console.log("❌ No movies available. Please check your internet connection and API key.");
    return []; // Return empty array instead of mock data
  }
};

// Search movies using TMDB API
export const searchMovies = async (query) => {
  try {
    console.log("🔍 Searching for:", query, "using TMDB API");
    
    const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`);
    
    if (!response.ok) {
      console.error("❌ Search API Response not OK:", response.status, response.statusText);
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("✅ Search API Response received:", data);
    
    if (data.results && Array.isArray(data.results)) {
      console.log(`🎉 Found ${data.results.length} movies for "${query}"`);
      return data.results;
    } else {
      console.log("No movies found for search query");
      return [];
    }
    
  } catch (error) {
    console.error("❌ Failed to search movies from TMDB API:", error.message);
    console.log("❌ Search unavailable. Please check your internet connection and API key.");
    return []; // Return empty array instead of mock data
  }
};
