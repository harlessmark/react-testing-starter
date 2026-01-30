import { it, describe, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest';
import TagList from '../../src/components/TagList';

describe('group', () => {
  it('should render tags', async () => {
    render(<TagList />);

    const items = await screen.findAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  })
})
