export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  synopsis: string;
  posterUrl?: string;
  backgroundUrl?: string;
  trailerUrl?: string;
  releaseDate: string;
  duration: string;
  genres: string[];
  ageRating: string;
  status: string;
  language: string;
  budget: number;
  revenue?: number;
  profit?: number;
  votes: number;
  score: number;
}

export interface MoviesResponse {
  data: Movie[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}
