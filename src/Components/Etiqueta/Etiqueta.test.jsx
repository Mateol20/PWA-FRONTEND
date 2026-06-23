import { render, screen } from '@testing-library/react';
import Etiqueta from './Etiqueta';

describe('Etiqueta', () => {
  it('muestra la etiqueta para pelicula', () => {
    render(<Etiqueta tipo="pelicula" />);
    expect(screen.getByText('pelicula')).toBeInTheDocument();
  });

  it('muestra la etiqueta para serie', () => {
    render(<Etiqueta tipo="serie" />);
    expect(screen.getByText('serie')).toBeInTheDocument();
  });

  it('aplica el color correcto segun el tipo', () => {
    const { container: c1 } = render(<Etiqueta tipo="pelicula" />);
    expect(c1.firstChild.className).toMatch(/emerald/);
    const { container: c2 } = render(<Etiqueta tipo="serie" />);
    expect(c2.firstChild.className).toMatch(/red/);
  });
});
