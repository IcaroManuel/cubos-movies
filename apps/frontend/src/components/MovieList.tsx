import { Link } from 'react-router-dom';
import type { Movie } from '../dtos/movies';

interface MovieCardProps {
  movies: Movie[];
}
export function MovieList({ movies }: MovieCardProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-6 bg-[var(--mauve-13)]">
      {movies?.map((movie) => {
        const radius = 36;
        const circumference = 2 * Math.PI * radius;
        const score = movie.score || 0;
        const offset = circumference - (score / 100) * circumference;

        let scoreColor = '#F2C94C';
        if (score < 60) {
          scoreColor = '#EF4444';
        } else if (score >= 80) {
          scoreColor = '#10B981';
        }
        return (
          <Link
            key={movie.id}
            to={`/movies/${movie.id}`}
            className="group relative flex aspect-[2/3] w-full cursor-pointer flex-col overflow-hidden rounded-lg bg-[#0E0E10] shadow-lg border border-transparent transition-all hover:border-[var(--purple-9)] hover:shadow-purple-900/20"
          >
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[var(--mauve-3)] text-sm text-[var(--mauve-9)]">
                Sem Imagem
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-black/60 backdrop-blur-md shadow-xl">
                <svg className="h-20 w-20 -rotate-90 transform">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#2B2B2B"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke={scoreColor}
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-lg font-bold text-white shadow-black drop-shadow-md">
                  {score}%
                </span>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h2 className="text-lg font-bold uppercase tracking-wide text-white drop-shadow-md">
                {movie.title}
              </h2>
              <div className="grid grid-rows-[0fr] transition-all duration-300 ease-in-out group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <p className="mt-1 text-xs text-gray-300 line-clamp-2">
                    {movie.genres?.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
