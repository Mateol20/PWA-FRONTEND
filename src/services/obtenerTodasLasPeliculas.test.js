import { describe, it, expect, vi, beforeEach } from 'vitest';
import { obtenerTodasLasPeliculas } from './obtenerTodasLasPeliculas';
import { API_BASE_URL, ITEMS_PER_PAGE, imagenUrl } from '../config';
import { clearCache } from '../utils/cache';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('obtenerTodasLasPeliculas', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    clearCache();
  });

  it('construye la URL correcta sin cursor (primera pagina)', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [], total: 0, nextCursor: null }),
    });

    await obtenerTodasLasPeliculas();

    const url = new URL(mockFetch.mock.calls[0][0]);
    expect(url.origin + url.pathname).toBe(API_BASE_URL);
    expect(url.searchParams.get('limit')).toBe(ITEMS_PER_PAGE.toString());
    expect(url.searchParams.has('cursor')).toBe(false);
  });

  it('agrega cursor cuando se proporciona', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [], total: 0, nextCursor: null }),
    });

    await obtenerTodasLasPeliculas(5);

    const url = new URL(mockFetch.mock.calls[0][0]);
    expect(url.searchParams.get('cursor')).toBe('5');
  });

  it('agrega el parametro de busqueda cuando se proporciona', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [], total: 0, nextCursor: null }),
    });

    await obtenerTodasLasPeliculas(null, 'Inception');

    const url = new URL(mockFetch.mock.calls[0][0]);
    expect(url.searchParams.get('search')).toBe('Inception');
  });

  it('retorna data vacia en respuesta 404', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve(),
    });

    const resultado = await obtenerTodasLasPeliculas(1);
    expect(resultado).toEqual({ data: [], nextCursor: null });
  });

  it('retorna data vacia en caso de error de red', async () => {
    mockFetch.mockRejectedValue(new Error('Error de red'));

    const resultado = await obtenerTodasLasPeliculas(1);
    expect(resultado).toEqual({ data: [], nextCursor: null });
  });

  it('mapea los datos del backend al formato del frontend', async () => {
    const datosMock = {
      data: [
        { Id: 1, Title: 'Inception', Year: 2010, Poster: 'url.jpg', imdbRating: 8.8, Runtime: 148, Director: 'Nolan', Plot: '...', Images: 'img.jpg', Actors: 'DiCaprio' },
        { Id: 2, Title: 'Interstellar', Year: 2014, Poster: 'url2.jpg', imdbRating: 8.7, Runtime: 169, Director: 'Nolan', Plot: '...', Images: 'img2.jpg', Actors: 'McConaughey' },
      ],
      total: 2,
      nextCursor: 2,
    };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(datosMock),
    });

    const resultado = await obtenerTodasLasPeliculas();

    expect(resultado.data).toHaveLength(2);
    expect(resultado.nextCursor).toBe(2);
    expect(resultado.data[0].Id).toBe(1);
    expect(resultado.data[0].Title).toBe('Inception');
    expect(resultado.data[0].Images).toEqual([imagenUrl('img.jpg')]);
    expect(resultado.data[0].Type).toBe('movie');
    expect(resultado.data[1].Id).toBe(2);
  });

  it('retorna data vacia si la respuesta no tiene data', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ no: 'data' }),
    });

    const resultado = await obtenerTodasLasPeliculas(1);
    expect(resultado).toEqual({ data: [], nextCursor: null });
  });
});
