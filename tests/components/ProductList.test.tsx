import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react'
import ProductList from "../../src/components/ProductList"
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { db } from '../mocks/db';

describe('ProductList', () => {
  const productIds: number[] = [];

  // Creates 3 product objects before running each test.
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  })

  // Delete all products in the productIds array.
  afterAll(() => {
    db.product.deleteMany({
      where: {
        id: {
          in: productIds,
        }
      }
    })
  })

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

  it('should render an error message when there is an error', async () => {
    // Overrides `/products` http response to return an error instead.
    server.use(http.get('/products', () => HttpResponse.error()));

    render(<ProductList />);

    const error = await screen.findByText(/error/i);
    expect(error).toBeInTheDocument();
  })
});
