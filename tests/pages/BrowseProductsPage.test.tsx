import { it, describe, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitForElementToBeRemoved, cleanup } from '@testing-library/react'
import BrowseProducts from '../../src/pages/BrowseProductsPage';
import { server } from '../mocks/server';
import { http, delay, HttpResponse } from 'msw';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';
import { Category, Product } from '../../src/entities';
import { db } from '../mocks/db';
import { CartProvider } from '../../src/providers/CartProvider';

describe('BrowseProductsPage', () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      categories.push(db.category.create({ name: 'Category ' + item }))
      products.push(db.product.create());
    })
  })

  afterEach(() => {
    cleanup();
  })

  afterAll(() => {
    const categoryIds = categories.map(c => c.id);
    const productIds = products.map(p => p.id);

    db.category.deleteMany({
      where: {
        id: {
          in: categoryIds,
        }
      }
    })

    db.category.deleteMany({
      where: {
        id: {
          in: productIds,
        }
      }
    })
  })

  const renderComponent = () => {
    render(
      <Theme>
        <BrowseProducts />
      </Theme>
    , { wrapper: CartProvider });
  }

  it('should show a loading skeleton when fetching categories', () => {
    // Override request handler.
    server.use(http.get('/categories', async () => {
      await delay();
      return HttpResponse.json([]);
    }))

    renderComponent();

    const skeleton = screen.getByRole('progressbar', { name: /categories/i });
    expect(skeleton).toBeInTheDocument();
  })

  it('should hide the loading skeleton after categories are fetched', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryAllByRole('progressbar', { name: /categories/i })
    );
  })

   it('should show a loading skeleton when fetching products', () => {
    // Override request handler.
    server.use(http.get('/products', async () => {
      await delay();
      return HttpResponse.json([]);
    }))

    renderComponent();

    const skeleton = screen.getByRole('progressbar', { name: /products/i });
    expect(skeleton).toBeInTheDocument();
  })

  it('should hide the loading skeleton after products are fetched', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryAllByRole('progressbar', { name: /products/i })
    );
  })

  it('should not render an error if categories cannot be fetched', async () => {
    server.use(http.get('/categories', () => {
      return HttpResponse.error();
    }))

    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryAllByRole('progressbar', { name: /categories/i })
    );

    const error = screen.queryByText(/error/i);
    const dropdown = screen.queryByRole('combobox', { name: /category/i })

    expect(error).not.toBeInTheDocument();
    expect(dropdown).not.toBeInTheDocument();
  })

  it('should render an error if products cannot be fetched', async () => {
    server.use(http.get('/products', () => {
      return HttpResponse.error();
    }))

    renderComponent();

    const error = await screen.findByText(/error/i);
    expect(error).toBeInTheDocument();
  })

  it('should render categories', async () => {
    renderComponent();

    const dropdown = await screen.findByRole('combobox');
    expect(dropdown).toBeInTheDocument();

    // Click on the dropdown.
    const event = userEvent.setup();
    await event.click(dropdown)

    const allOption = await screen.findByRole('option', { name: /all/i });
    expect(allOption).toBeInTheDocument();

    categories.forEach(category => {
      expect(screen.getByRole('option', { name: category.name })).toBeInTheDocument();
    })
  })

  it('should render products', async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: /products/i })
    )

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    })
  })
})
