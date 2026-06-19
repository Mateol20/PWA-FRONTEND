import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import TarjetaPelicula from './TarjetaPelicula';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock('../../context/ContextoFavoritos.jsx', () => ({
  useFavoritos: () => ({
    alternarFavorito: vi.fn(),
    esFavorito: vi.fn(() => false),
  }),
}));

describe('TarjetaPelicula', () => {
  it('no renderiza nada cuando la lista está vacía', () => {
    const { container } = render(
      <MemoryRouter>
        <TarjetaPelicula datos={[]} />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza correctamente las películas', () => {
    const peliculasMock = [
      {
        Id: 123,
        Title: 'Película de Prueba 1',
        Poster: 'https://foto.com/1.jpg',
        Type: 'movie',
        Year: '2024',
      },
    ];

    render(
      <MemoryRouter>
        <TarjetaPelicula datos={peliculasMock} />
      </MemoryRouter>
    );

    expect(screen.getByText(/película de prueba 1/i)).toBeInTheDocument();
  });

  it('renderiza múltiples películas', () => {
    const peliculasMock = [
      { Id: 1, Title: 'Peli 1', Poster: '', Type: 'movie', Year: '2020' },
      { Id: 2, Title: 'Peli 2', Poster: '', Type: 'movie', Year: '2021' },
    ];

    render(
      <MemoryRouter>
        <TarjetaPelicula datos={peliculasMock} />
      </MemoryRouter>
    );

    expect(screen.getByText('Peli 1')).toBeInTheDocument();
    expect(screen.getByText('Peli 2')).toBeInTheDocument();
  });
});
