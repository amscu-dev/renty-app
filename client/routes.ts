export const publicRoutes = ["/", "/landing", "/search"];

export const authRoutes = ["/signin", "/signup", "/confirmSignUp"];

export const tenantRoutes = [
  "/tenants/applications",
  "/tenants/favorites",
  "/tenants/residences",
  "/tenants/settings",
];

export const managerRoutes = [
  "/managers/applications",
  "/managers/newproperty",
  "/managers/properties",
  "/managers/settings",
];

export const DEFAULT_LOGIN_REDIRECT_TENANTS = "/tenants/favorites";
export const DEFAULT_LOGIN_REDIRECT_MANAGERS = "/managers/properties";

export const DEFAULT_LOGOUT_REDIRECT = "/settings";
