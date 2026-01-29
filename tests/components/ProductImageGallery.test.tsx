import ProductImageGallery from "../../src/components/ProductImageGallery";
import { it, describe, expect } from 'vitest';
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest';

describe('ProductImageGallery', () => {
  it('should render the DOM empty if there are no imageUrls', () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />)
    expect(container).toBeEmptyDOMElement();
  })

  it('should render with a list of images with the correct urls', () => {
    const imageUrls = ['https://google.com', 'https://steampowered.com'];
    render(<ProductImageGallery imageUrls={imageUrls} />)

    const images = screen.getAllByRole('img');

    expect(images).toHaveLength(2);

    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute('src', url)
    })
  })
})