import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--mauve-1)]">
      <Header />
      <main className="relative flex w-full flex-1 flex-col p-8">
        <Outlet />
      </main>
    </div>
  );
}
