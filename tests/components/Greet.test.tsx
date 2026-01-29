import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import Greet from '../../src/components/Greet';
import '@testing-library/jest-dom/vitest';

describe('Greet', () => {
  it('should render Hello with the name when provided', () => {
    render(<Greet name="Mark" />)

    const heading = screen.getByRole('heading');

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/hello mark/i);
  })

  it('should render login button when name isn\'t provided', () => {
    render(<Greet />)

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/login/i);
  })
})