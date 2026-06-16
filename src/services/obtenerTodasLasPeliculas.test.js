import { describe, it, expect, vi, beforeEach } from 'vitest';
import { obtenerTodasLasPeliculas } from './obtenerTodasLasPeliculas';
import { API_BASE_URL, ITEMS_PER_PAGE } from '../config';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('obtenerTodasLasPeliculas', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('construye la URL correcta con pagina y limite', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [], total: 0 }),
    });

    await obtenerTodasLasPeliculas(1);

    const url = new URL(mockFetch.mock.calls[0][0]);
    expect(url.origin + url.pathname).toBe(API_BASE_URL);
    expect(url.searchParams.get('page')).toBe('1');
    expect(url.searchParams.get('limit')).toBe(ITEMS_PER_PAGE.toString());
  });

  it('agrega el parametro de busqueda cuando se proporciona', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [], total: 0 }),
    });

    await obtenerTodasLasPeliculas(1, 'Inception');

    const url = new URL(mockFetch.mock.calls[0][0]);
    expect(url.searchParams.get('search')).toBe('Inception');
  });

  it('retorna arreglo vacio en respuesta 404', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve(),
    });

    const resultado = await obtenerTodasLasPeliculas(1);
    expect(resultado).toEqual([]);
  });

  it('retorna arreglo vacio en caso de error de red', async () => {
    mockFetch.mockRejectedValue(new Error('Error de red'));

    const resultado = await obtenerTodasLasPeliculas(1);
    expect(resultado).toEqual([]);
  });

  it('mapea los datos del backend al formato del frontend', async () => {
    const datosMock = {
      data: [
        { Id: 1, Title: 'Inception', Year: 2010, Poster: 'url.jpg', imdbRating: 8.8, Runtime: 148, Director: 'Nolan', Plot: '...', Images: 'img.jpg', Actors: 'DiCaprio' },
        { Id: 2, Title: 'Interstellar', Year: 2014, Poster: 'url2.jpg', imdbRating: 8.7, Runtime: 169, Director: 'Nolan', Plot: '...', Images: 'img2.jpg', Actors: 'McConaughey' },
      ],
      total: 2,
    };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(datosMock),
    });

    const resultado = await obtenerTodasLasPeliculas(1);

    expect(resultado).toHaveLength(2);
    expect(resultado[0].imdbID).toBe('1');
    expect(resultado[0].Title).toBe('Inception');
    expect(resultado[0].Images).toEqual(['img.jpg']);
    expect(resultado[0].Type).toBe('movie');
    expect(resultado[1].imdbID).toBe('2');
  });

  it('retorna arreglo vacio si la respuesta no tiene data', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ no: 'data' }),
    });

    const resultado = await obtenerTodasLasPeliculas(1);
    expect(resultado).toEqual([]);
  });
});
