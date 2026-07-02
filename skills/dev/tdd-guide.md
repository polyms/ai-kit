# TDD Guide

Red → green loop. Consult before and during every cycle.

## What a good test is

Tests verify behavior through **public interfaces**, not implementation details. A good test reads like a specification and survives refactors.

```typescript
// GOOD: observable behavior
test('user can checkout with valid cart', async () => {
  const cart = createCart()
  cart.add(product)
  const result = await checkout(cart, paymentMethod)
  expect(result.status).toBe('confirmed')
})
```

```typescript
// BAD: implementation-coupled
test('checkout calls paymentService.process', async () => {
  const mockPayment = jest.mock(paymentService)
  await checkout(cart, payment)
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total)
})
```

## Seams

A **seam** is the public boundary you test at. Test only at **confirmed** seams — agree with user before writing.

## Anti-patterns

| Pattern                    | Problem                                                  |
| -------------------------- | -------------------------------------------------------- |
| **Implementation-coupled** | Mocks internals; breaks on refactor                      |
| **Tautological**           | Expected value computed same way as code                 |
| **Horizontal slicing**     | All tests first, then all code — tests imagined behavior |

## Rules of the loop

- **Red before green** — failing test first, minimal code to pass
- **One slice at a time** — one seam, one test, one implementation per cycle
- **Refactor after green** — not during the loop
- **Vertical slices** — tracer bullets, not bulk scaffolding

## Expected values

Must come from independent source of truth — spec, known-good literal, worked example. Never recompute the way the code does.
