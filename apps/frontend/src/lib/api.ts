import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@cubos-movies:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token expirado ou inválido. Deslogando...');
      localStorage.removeItem('@cubos-movies:token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  });
