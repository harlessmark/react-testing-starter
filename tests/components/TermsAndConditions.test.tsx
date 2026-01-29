import { it, describe, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react'
import TermsAndConditions from '../../src/components/TermsAndConditions'
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';

describe('TermsAndConditions', () => {
  afterEach(() => {
    cleanup();
  });

  const renderComponent = () => {
    render(<TermsAndConditions />);

    return {
      heading: screen.getByRole('heading'),
      checkbox: screen.getByRole('checkbox'),
      button: screen.getByRole('button'),
    }
  }

  it('should render with correct text and initial state', () => {
    const {
      heading,
      checkbox,
      button,
    } = renderComponent()

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/terms/i)
    expect(heading).toHaveTextContent(/conditions/i)

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  })

  it('should enable the button when checkbox is checked', async () => {
    const { checkbox } = renderComponent()
    const event = userEvent.setup();

    await event.click(checkbox);
    expect(screen.getByRole('button')).toBeEnabled();
  })
})