import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PieDePagina from './Footer';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe('PieDePagina', () => {
  it('muestra los nombres del equipo', () => {
    render(<PieDePagina />);
    expect(screen.getByText(/mateo garcia/i)).toBeInTheDocument();
    expect(screen.getByText(/ignacio bonorino/i)).toBeInTheDocument();
  });

  it('muestra la descripcion del proyecto', () => {
    render(<PieDePagina />);
    expect(screen.getByText('descripcion')).toBeInTheDocument();
  });

  it('muestra los enlaces a redes sociales', () => {
    render(<PieDePagina />);
    expect(screen.getByRole('link', { name: 'Twitter' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'YouTube' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Facebook' })).toBeInTheDocument();
  });
});
