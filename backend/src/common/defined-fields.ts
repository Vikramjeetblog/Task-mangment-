/**
 * Drops keys whose value is `undefined`.
 *
 * A validated PATCH body arrives as a DTO *instance*, so every optional field
 * exists as a key — just with no value. Handing that straight to
 * `document.set()` would overwrite stored values with `undefined` and trip the
 * schema's `required` validators, so we keep only the fields actually sent.
 */
export function definedFields<T extends object>(dto: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(dto).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}
