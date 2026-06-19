import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Encabezado from './Header';

const mockChangeLanguage = vi.hoisted(() => vi.fn());

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'es', changeLanguage: mockChangeLanguage },
  }),
}));

vi.mock('../../context/ContextoBusqueda', () => ({
  useBusqueda: () => ({
    termino: '',
    buscar: vi.fn(),
    limpiar: vi.fn(),
  }),
}));

vi.mock('../../context/ContextoAuth', () => ({
  useAuth: () => ({
    usuario: null,
    login: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: false,
    isAdmin: false,
  }),
}));

describe('Encabezado', () => {
  it('muestra el boton de inicio', () => {
    render(
      <MemoryRouter>
        <Encabezado />
      </MemoryRouter>
    );
    expect(screen.getByText('inicio')).toBeInTheDocument();
  });

  it('muestra el campo de busqueda con el placeholder correcto', () => {
    render(
      <MemoryRouter>
        <Encabezado />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('buscar')).toBeInTheDocument();
  });

  it('muestra el boton de idioma', () => {
    render(
      <MemoryRouter>
        <Encabezado />
      </MemoryRouter>
    );
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('muestra el boton de favoritos', () => {
    render(
      <MemoryRouter>
        <Encabezado />
      </MemoryRouter>
    );
    expect(screen.getByText('favoritos')).toBeInTheDocument();
  });

  it('llama a changeLanguage cuando se hace clic en el boton de idioma', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Encabezado />
      </MemoryRouter>
    );
    const botonIdioma = screen.getByText('EN');
    await user.click(botonIdioma);
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });
});
