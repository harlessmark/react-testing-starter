import { it, describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react'
import ProductDetail from '../../src/components/ProductDetail';
import { products } from '../mocks/data';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('ProductDetail', () => {
  it('should render a product', async () => {
    render(<ProductDetail productId={1} />);

    const productName = await screen.findByText(new RegExp(products[0].name));
    const productPrice = await screen.findByText(new RegExp(products[0].price.toString()));

    expect(productName).toBeInTheDocument();
    expect(productPrice).toBeInTheDocument();
  })

  it('should render message if product not found', async () => {
    // Hijack the response and send null instead.
    server.use(http.get('/products/1', () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />)

    const message = await screen.findByText(/not found/i)

    expect(message).toBeInTheDocument();
  })

  it('should render an error for invalid productId', async () => {
    render(<ProductDetail productId={0} />)

    const error = await screen.findByText(/invalid/i)

    expect(error).toBeInTheDocument();
  })
});
