import { it, describe, expect, beforeAll, afterAll} from 'vitest';
import { render, screen } from '@testing-library/react'
import ProductDetail from '../../src/components/ProductDetail';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { db } from '../mocks/db';

describe('ProductDetail', () => {
  let productId: number;

  // Creates 3 product objects before running each test.
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productId = product.id;
    });
  })

  // Delete all products in the productIds array.
  afterAll(() => {
    db.product.delete({
      where: {
        id: {
          equals: productId,
        }
      }
    })
  })

  it('should render a product', async () => {
    const product = db.product.findFirst({
      where: {
        id: {
          equals: productId,
        }
      }
    })

    render(<ProductDetail productId={productId} />);

    // We definitely know `product` exists so we add the `!`.
    const productName = await screen.findByText(new RegExp(product!.name));
    const productPrice = await screen.findByText(new RegExp(product!.price.toString()));

    expect(productName).toBeInTheDocument();
    expect(productPrice).toBeInTheDocument();
  })

  it('should render message if product not found', async () => {
    // Hijack the response and send null instead.
    server.use(http.get(`/products/${productId}`, () => HttpResponse.json(null)));

    render(<ProductDetail productId={productId} />)

    const message = await screen.findByText(/not found/i)
    expect(message).toBeInTheDocument();
  })

  it('should render an error for invalid productId', async () => {
    render(<ProductDetail productId={0} />)

    const isInvalid = await screen.findByText(/invalid/i)
    expect(isInvalid).toBeInTheDocument();
  })

  it('should render an error if fetch fails', async () => {
    server.use(http.get(`/products/${productId}`, () => HttpResponse.error()))

    render(<ProductDetail productId={productId} />);

    const error = await screen.findByText(/error/i);
    expect(error).toBeInTheDocument();
  })
});
