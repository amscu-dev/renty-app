import { NextResponse, NextRequest } from "next/server";
import { authenticatedUser } from "./services/auth/amplify-server-utils";
import { authRoutes, publicRoutes } from "../routes";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log("Hit Middleware");
  const response = NextResponse.next();
  const { nextUrl } = request;
  const user = await authenticatedUser({ request, response });

  // Indentify if USER
  const isUserAuth = Boolean(user);
  // Indentify USER ROLE
  const isTenant = user?.role === "tenant";
  const isManager = user?.role === "manager";
  // Identify the current ROUTE:
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isTenantRoute = nextUrl.pathname.startsWith("/tenants");
  const isManagerRoute = nextUrl.pathname.startsWith("/managers");
  const isProtectedRoute = isTenantRoute || isManagerRoute;
  const isIncompleteTenantRoute = nextUrl.pathname === "/tenants";
  const isIncompleteManagerRoute = nextUrl.pathname === "/managers";

  // CASE 0: If a user is not authenticated and tries to access a protected router redirect to login page;
  if (!isUserAuth && isProtectedRoute) {
    console.log("CASE 0");
    return Response.redirect(new URL("/signin", nextUrl));
  }
  // CASE 1: If a user is authenticated and tries to access a route user for authentification;
  if (isUserAuth && isAuthRoute) {
    console.log("CASE 1");
    return Response.redirect(new URL("/landing", nextUrl));
  }
  // CASE 2: If a manager tries to use a route specific for a tenant redirect;
  if (isUserAuth && isManager && isTenantRoute) {
    console.log("CASE 2");
    return Response.redirect(new URL("/managers/properties", nextUrl));
  }
  // CASE 3: If a tenant tries to use a route specific for a manager redirect;
  if (isUserAuth && isTenant && isManagerRoute) {
    console.log("CASE 3");
    return Response.redirect(new URL("/tenants/favorites", nextUrl));
  }
  // CASE 4 REDIRECT INCOMPLETE ROUTES
  if (isUserAuth && isTenant && isIncompleteTenantRoute) {
    console.log("CASE 4");
    return Response.redirect(new URL("/tenants/favorites", nextUrl));
  }
  if (isUserAuth && isManager && isIncompleteManagerRoute) {
    console.log("CASE 5");
    return Response.redirect(new URL("/mangers/properties", nextUrl));
  }
  console.log("CASE 6");
  // IF THE ROUTE IS PUBLIC LET THE REQUEST TO GO ON.
  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
