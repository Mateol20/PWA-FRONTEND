import { describe, it, expect, vi, beforeEach } from 'vitest';
import { obtenerPeliculaPorId } from './obtenerPeliculaPorId';
import { API_BASE_URL, imagenUrl } from '../config';
import { clearCache } from '../utils/cache';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('obtenerPeliculaPorId', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    clearCache();
  });

  it('llama al endpoint con el ID correcto', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ Id: 1, Title: 'Inception' }),
    });

    await obtenerPeliculaPorId('1');

    const url = new URL(mockFetch.mock.calls[0][0]);
    expect(url.origin + url.pathname).toBe(`${API_BASE_URL}/1`);
  });

  it('retorna null en respuesta 404', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve(),
    });

    const resultado = await obtenerPeliculaPorId('999');
    expect(resultado).toBeNull();
  });

  it('retorna null en caso de error de red', async () => {
    mockFetch.mockRejectedValue(new Error('Error de red'));

    const resultado = await obtenerPeliculaPorId('1');
    expect(resultado).toBeNull();
  });

  it('mapea la pelicula del backend al formato del frontend', async () => {
    const datosMock = { Id: 5, Title: 'Inception', Year: 2010, Poster: 'url.jpg', imdbRating: 8.8, Runtime: 148, Director: 'Nolan', Plot: 'Suenos dentro de suenos', Images: 'img.jpg', Actors: 'DiCaprio' };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(datosMock),
    });

    const resultado = await obtenerPeliculaPorId('5');

    expect(resultado).not.toBeNull();
    expect(resultado.Id).toBe(5);
    expect(resultado.Title).toBe('Inception');
    expect(resultado.Images).toEqual([imagenUrl('img.jpg')]);
    expect(resultado.Type).toBe('movie');
    expect(resultado.Genre).toBe('N/A');
  });

  it('retorna null si la respuesta es null', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(null),
    });

    const resultado = await obtenerPeliculaPorId('999');
    expect(resultado).toBeNull();
  });
});
