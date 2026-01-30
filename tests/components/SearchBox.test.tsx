import { it, describe, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import SearchBox from '../../src/components/SearchBox';

describe('SearchBox', () => {
  afterEach(() => cleanup());

  const renderSearchBox = () => {
    const mockOnChange = vi.fn();
    render(<SearchBox onChange={mockOnChange} />);
    const textbox = screen.getByPlaceholderText(/search.../i)
    const event = userEvent.setup()

    return {
      mockOnChange,
      textbox,
      event,
    }
  }

  it('should render the input field', () => {
    const { textbox } = renderSearchBox()
    expect(textbox).toBeInTheDocument();
  })

  it('should call onChange when Enter is pressed', async () => {
    const { textbox, mockOnChange, event } = renderSearchBox()
    const TERM = "hello derr";

    await event.type(textbox, TERM + "{enter}");

    expect(mockOnChange).toHaveBeenCalledWith(TERM)
  })

  it('should not call onChange if input field is empty', async () => {
    const { textbox, mockOnChange, event } = renderSearchBox()

    await event.type(textbox, "{enter}");

    expect(mockOnChange).not.toHaveBeenCalled();
  })
})
