import { it, describe } from 'vitest'
import { db } from './mocks/db'

describe('Sample Test Suite', () => {
  it('should',  () => {
    // Example of force setting a propert to Apple.
    const product = db.product.create({ name: 'Apple' });
    console.log(product);
  })
})
