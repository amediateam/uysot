// Role-based access (recovered from the build). Roles are ranked; a check passes when
// the user's role ranks at or above the required one.
export type Role = "VIEWER" | "ADMIN" | "SUPER_ADMIN";

export const ROLE_RANK: Record<Role, number> = {
  VIEWER: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

export const hasRole = (role: Role | undefined | null, minimum: Role): boolean =>
  role ? ROLE_RANK[role] >= ROLE_RANK[minimum] : false;

export const isAdmin = (role: Role | undefined | null): boolean => hasRole(role, "ADMIN");
export const isSuperAdmin = (role: Role | undefined | null): boolean => hasRole(role, "SUPER_ADMIN");

// Purpose-named guards used by the router and sidebar. The build had several
// finer-grained predicates that all collapsed to one of the two checks above; names
// here reflect their call sites.
// TODO: inferred from build — original predicate names are unrecoverable.
export const canViewAudit = isAdmin;
export const canManageEskiz = isAdmin;
export const canManageOperators = isSuperAdmin;
