import { createContext,useState,useContext,useEffect } from "react"

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext);


export const MovieProvider = ({children}) => {
  const [favorites,setFavorites]=useState([])

  useEffect(() =>{
    const storedFavorites = localStorage.getItem('favorites')

    if (storedFavorites) setFavorites(JSON.parse(storedFavorites))
  },[])
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  },[favorites])

  const addToFavorites =(movie) => {
    console.log("Adding to favorites:", movie.title);
    setFavorites(prev => {
      // Check if movie is already in favorites to avoid duplicates
      if (prev.some(fav => fav.id === movie.id)) {
        console.log("Movie already in favorites, not adding duplicate");
        return prev;
      }
      console.log("Movie added to favorites successfully");
      return [...prev, movie];
    })
  }
  const removeFromFavorites = (movieId) => {
    console.log("Removing from favorites, movie ID:", movieId);
    setFavorites(prev => prev.filter(movie => movie.id !== movieId))
  }
  const isFavorite = (movieId) =>{
    return favorites.some(movie => movie.id === movieId)
  }
  const value={
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
   }


  return <MovieContext.Provider value={value}>
    {children}
  </MovieContext.Provider>
}