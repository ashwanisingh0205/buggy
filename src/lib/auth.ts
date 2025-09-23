export type Role = 'creator' | 'brand';
export function isAuthorized(role: Role) {
  // basic placeholder rule using param to satisfy linter
  return role === 'creator' || role === 'brand';
}


