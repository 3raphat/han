export function sanitizeId(id: string) {
  return id.replace(/[^0-9]/g, '')
}
