import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { CreateMovie } from './pages/CreateMovie';
import { MovieDetails } from './pages/MovieDetails';
import { Layout } from './layout';
import { EditMovie } from './pages/EditMovie';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('@cubos-movies:token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('@cubos-movies:token');
  return !token ? <>{children}</> : <Navigate to="/movies" replace />;
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/login" replace />,
      },
      {
        path: '/login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: '/movies',
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: '/movies/new',
        element: (
          <PrivateRoute>
            <CreateMovie />
          </PrivateRoute>
        ),
      },
      {
        path: '/movies/:id',
        element: (
          <PrivateRoute>
            <MovieDetails />
          </PrivateRoute>
        ),
      },
      {
        path: '/movies/:id/edit',
        element: (
          <PrivateRoute>
            <EditMovie />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

const saved = localStorage.getItem('theme') ?? 'dark';
document.documentElement.classList.add(saved);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
