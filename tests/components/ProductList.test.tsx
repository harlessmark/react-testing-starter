import { it, describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react'
import ProductList from "../../src/components/ProductList"
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('ProductList', () => {
  it('should render the list of products', async () => {
    render(<ProductList />);

    const products = await screen.findAllByRole('listitem');
    expect(products.length).toBeGreaterThan(0);
  })

  it('should render no products available if no product is found', async () => {
    // Overrides the service worker defined in ../mocks/server
    server.use(http.get('/products', () => HttpResponse.json([])));

    render(<ProductList />)

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  })
})
