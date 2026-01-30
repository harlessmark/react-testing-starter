import { it, describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest';
import ToastDemo from '../../src/components/ToastDemo';
import { Toaster } from 'react-hot-toast';
import userEvent from '@testing-library/user-event';

describe('ToastDemo', () => {
  it('should render a toast on click', async () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    const button = screen.getByRole('button');
    const event = userEvent.setup();
    await event.click(button);

    const toast = await screen.findByText(/success/i);
    expect(toast).toBeInTheDocument();
  })
})
