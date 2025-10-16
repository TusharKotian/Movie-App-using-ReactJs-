import MovieCard from "../components/MovieCard.jsx";
import {useEffect, useState} from "react"
import { searchMovies,getPopularMovies } from "../Services/api.js";
import "../css/Home.css"

function Home(){
  const [searchQuery,setSearchQuery]=useState("");
  const [movies, setMovies]= useState([]);
  const [error,setError] = useState(null);
  const [loading, setLoading] =useState(true)

  useEffect(()=>{
    const loadPopularMovies=async() =>{
      try {
        console.log("Loading popular movies...");
        const popularMovies= await getPopularMovies();
        console.log("Popular movies loaded:", popularMovies);
        setMovies(popularMovies)
      } catch (err) {
        console.error("Error loading movies:", err)
        setError("Failed to load movies. Please check console for details.")
      }
      finally{
        setLoading(false)
      }
    }

    loadPopularMovies()
  },[])

  const handleSearch = async (e) => {
  e.preventDefault();
  if (!searchQuery.trim()) return;
  if (loading) return;

  setLoading(true);
  try {
    const searchResults = await searchMovies(searchQuery);
    setMovies(searchResults);
    setError(null);
  } catch (err) {
    console.log(err);
    setError("Failed to search Movies...");
  } finally {
    setLoading(false);
    setSearchQuery("");
  }
};

 

  return (
  <div className="Home">
    <form onSubmit={handleSearch} className="search-form">
        <input type="text" placeholder="Search for Movies..." className="search-input" value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button>Search</button>
    </form>
      {error && <div className="error-message">{error}</div>}
      
      
    {loading ? (<div className="loading">Loading...</div>
    ):(
    <div className="movies-grid">
      {movies.map((movie) => 
        (
        <MovieCard movie={movie} key={movie.id} />
        ))}
    </div>
    )}
    
  </div>
  
  );
}


export default Home