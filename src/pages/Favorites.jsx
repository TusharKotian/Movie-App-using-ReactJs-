import "../css/Favorites.css"
import {useMovieContext} from "../contexts/MovieContext"
import MovieCard from "../components/MovieCard"

function Favorite(){
  const {favorites} = useMovieContext();
  
  // Determine grid class based on number of favorites
  const getGridClass = () => {
    if (!favorites || favorites.length === 0) return '';
    if (favorites.length === 1) return 'movies-grid movies-grid-single';
    if (favorites.length === 2) return 'movies-grid movies-grid-double';
    if (favorites.length === 3) return 'movies-grid movies-grid-triple';
    return 'movies-grid movies-grid-multiple';
  };
  
  return(
    <div className="favorites">
      <h2>Your Favorites</h2>
      {favorites && favorites.length > 0 ? (
        <div className={getGridClass()}>
          {favorites.map((movie) => 
            (
            <MovieCard movie={movie} key={movie.id} />
            ))}
        </div>
      ) : (
        <div className="favorites-empty">
          <h2>No favorites yet</h2>
          <p>Start adding your favorite movies by clicking the heart icon on any movie card!</p>
        </div>
      )}
    </div>
  )
}
 export default Favorite