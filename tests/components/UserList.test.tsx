import { render, screen } from '@testing-library/react';
import { it, describe, expect } from 'vitest';
import UserList from '../../src/components/UserList';
import { User } from '../../src/entities';
import '@testing-library/jest-dom/vitest';

describe('UserList', () => {
  it('should render no users when the users array is empty', () => {
    render(<UserList users={[]} />);

    // Target keywords to future proof this test.
    const users = screen.getByText(/no users/i);

    expect(users).toBeInTheDocument();
  })

  it('should render a list of users', () => {
    const users: User[] = [
      {
        id: 1,
        name: "Mark"
      },
      {
        id: 2,
        name: "Cait"
      }
    ]

    render(<UserList users={users} />)

    users.forEach(user => {
      const link = screen.getByRole('link', { name: user.name });

      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', `/users/${user.id}`)
    })
  })
})