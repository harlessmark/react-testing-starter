import { it, expect, describe } from 'vitest'

describe('Sample Test Suite', () => {
  it('should', async () => {
    const res = await fetch('/categories');
    const data = await res.json();
    console.log(data);
    expect(data).toHaveLength(3);
  })
})