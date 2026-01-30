import { it, describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest';
import TagList from '../../src/components/TagList';

describe('group', () => {
  it('should render tags', async () => {
    render(<TagList />);

    const items = await screen.findAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  })
})
