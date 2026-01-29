import { render, screen, cleanup } from '@testing-library/react';
import { it, describe, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import ExpandableText from '../../src/components/ExpandableText';
import userEvent from '@testing-library/user-event';

describe('ExpandableText', () => {
  afterEach(() => cleanup());

  const LIMIT = 255;
  const longText = 'x'.repeat(LIMIT + 1);
  const truncatedText = longText.substring(0, LIMIT) + '...';

  it('should render the full text if less than 255 chars', () => {
    const SHORT_TEXT = "Short text";
    render(<ExpandableText text={SHORT_TEXT} />);

    const article = screen.getByText(SHORT_TEXT);
    const button = screen.queryByRole('button');

    expect(article).toBeInTheDocument();
    expect(button).not.toBeInTheDocument();
  })

  it('should truncate text if over 255 chars', () => {
    render(<ExpandableText text={longText} />);

    const text = screen.queryByText(truncatedText);
    const button = screen.getByRole('button');

    expect(text).toBeInTheDocument();
    expect(button).toHaveTextContent(/more/i);
  })

  it('should toggle text when Show More button is clicked', async () => {
    render(<ExpandableText text={longText} />);

    const showButton = screen.getByRole('button', { name: /more/i });
    const event = userEvent.setup();

    expect(showButton).toHaveTextContent(/more/i);

    await event.click(showButton);


    expect(showButton).toHaveTextContent(/less/i);
  })
})