import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logoUrl from '../assets/logo.png';

export function Header() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);

  const isAuthenticated = !!localStorage.getItem('@cubos-movies:token');

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggleTheme() {
    const newIsDark = !isDark;
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    setIsDark(newIsDark);
  }

  function handleLogout() {
    localStorage.removeItem('@cubos-movies:token');
    navigate('/login');
  }

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-[var(--mauve-4)] bg-[var(--mauve-2)] px-6 shadow-sm z-10">
      <Link
        to="/movies"
        className="flex items-center gap-2 text-[var(--mauve-12)] transition-opacity hover:opacity-80"
      >
        <img src={logoUrl} alt="Cubos logo" className={!isDark ? 'invert' : ''} />
      </Link>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded bg-[var(--purple-3)] text-[var(--purple-11)] transition-colors hover:bg-[var(--purple-4)]"
          title="Alternar Tema"
        >
          {isDark ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>

        {/* Só mostra o botão de Logout se estiver logado! */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="rounded bg-[var(--purple-9)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--purple-10)]"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
