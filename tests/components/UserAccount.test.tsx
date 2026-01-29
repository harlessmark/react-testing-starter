import { it, expect, describe, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import UserAccount from "../../src/components/UserAccount";
import '@testing-library/jest-dom/vitest';
import { User } from '../../src/entities';

describe('UserAccount', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render an edit button if the user is an admin', () => {
    const user: User = {
      isAdmin: true,
      id: 1,
      name: 'Mark',
    };

    render(<UserAccount user={user} />)

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
  })

  it('should not render an edit button if the user is not an admin', () => {
    const user: User = {
      isAdmin: false,
      id: 2,
      name: 'Cait',
    };

    render(<UserAccount user={user} />)

    const button = screen.queryByRole('button');

    expect(button).not.toBeInTheDocument();
  })

  it('renders the user\'s name', () => {
    const user: User = {
      name: "Finn",
      id: 3,
      isAdmin: true,
    }

    render(<UserAccount user={user} />)

    const name = screen.getByText(/Finn/i)

    expect(name).toBeInTheDocument();
  })
})