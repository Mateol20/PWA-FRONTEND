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

  it('aplica la clase de color esmeralda cuando es pelicula', () => {
    render(<Etiqueta tipo="pelicula" />);
    expect(screen.getByText('pelicula')).toHaveClass('text-emerald-400');
  });

  it('aplica la clase de color rojo cuando es serie', () => {
    render(<Etiqueta tipo="serie" />);
    expect(screen.getByText('serie')).toHaveClass('text-red-500');
  });
});
