import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ItemPelicula from './ItemPelicula';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('ItemPelicula', () => {
  const peliculaMock = {
    imdbID: 'tt12345',
    Title: 'Película de Prueba',
    Year: '2024',
    Type: 'movie',
    Poster: 'https://foto.com/poster.jpg',
    imdbRating: '8.5'
  };

  it('debe mostrar el título, el año y el rating correctamente', () => {
    render(
      <MemoryRouter>
        <ItemPelicula pelicula={peliculaMock} indice={0} />
      </MemoryRouter>
    );

    expect(screen.getByText(/película de prueba/i)).toBeInTheDocument();
    expect(screen.getByText(/2024/i)).toBeInTheDocument();
    expect(screen.getByText(/8.5/i)).toBeInTheDocument();
  });

  it('debe mostrar el número de índice incrementado en 1', () => {
    render(
      <MemoryRouter>
        <ItemPelicula pelicula={peliculaMock} indice={4} />
      </MemoryRouter>
    );
    expect(screen.getByText(/#5/i)).toBeInTheDocument();
  });

 it('debe llamar a alternarFavorito cuando se hace clic en el botón', async () => {
    const user = userEvent.setup();
    const alternarFavoritoSpy = vi.fn(); 

    render(
      <MemoryRouter>
        <ItemPelicula 
          pelicula={peliculaMock} 
          indice={0} 
          alternarFavorito={alternarFavoritoSpy} 
        />
      </MemoryRouter>
    );

    const boton = screen.getByRole('button');
    await user.click(boton);
    expect(alternarFavoritoSpy).toHaveBeenCalledWith(peliculaMock);
  });

});