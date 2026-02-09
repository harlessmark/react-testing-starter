import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import ProductList from "../../src/components/ProductList"
import { server } from '../mocks/server';
import { http, HttpResponse, delay } from 'msw';
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

  it('should render a loading indicator when fetching data', async () => {
    // Add a delay.
    server.use(http.get('/products', async () => {
      await delay();
      return HttpResponse.json([]);
    }));

    render(<ProductList />);

    const loadingIndicator = await screen.findByText(/loading/i);
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('should remove the loading indicator after data is fetched', async () => {
    render(<ProductList />);

    await waitForElementToBeRemoved(() => screen.queryAllByText(/loading/i));
  })

  it('should remove the loading indicator if data fetching fails', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    render(<ProductList />);

    await waitForElementToBeRemoved(() => screen.queryAllByText(/loading/i));
  })
});
