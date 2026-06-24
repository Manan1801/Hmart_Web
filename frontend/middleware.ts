import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseEnv } from "@/src/lib/supabase/env";
import { AUTH_ROLES, type AuthRole } from "@/src/lib/auth/types";

type UserRoleRow = {
  roles: { code: string } | { code: string }[] | null;
};

const protectedRoutes: Array<{
  prefix: string;
  allowedRoles?: AuthRole[];
}> = [
  { prefix: "/account" },
  { prefix: "/orders" },
  { prefix: "/checkout" },
  { prefix: "/admin", allowedRoles: [AUTH_ROLES.admin] },
  {
    prefix: "/delivery",
    allowedRoles: [AUTH_ROLES.admin, AUTH_ROLES.deliveryPartner],
  },
];

function getProtectedRoute(pathname: string) {
  return protectedRoutes.find(
    (route) => pathname === route.prefix || pathname.startsWith(`${route.prefix}/`),
  );
}

function hasAllowedRole(rows: UserRoleRow[] | null, allowedRoles: AuthRole[]) {
  const userRoles = (rows ?? []).flatMap((row) => {
    const roles = Array.isArray(row.roles) ? row.roles : [row.roles];

    return roles.map((role) => role?.code).filter(Boolean);
  });

  return userRoles.some((role) => allowedRoles.includes(role as AuthRole));
}

export async function middleware(request: NextRequest) {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseEnv();
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  const protectedRoute = getProtectedRoute(pathname);

  if (!protectedRoute) {
    return response;
  }

  if (!userId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (protectedRoute.allowedRoles) {
    const { data: roleRows, error } = await supabase
      .from("user_roles")
      .select("role_id")
      .eq("user_id", userId);
  
    console.log("RAW USER ROLES:", roleRows);
    console.log("RAW ERROR:", error);
  
    const ADMIN_ROLE_ID = "e2342b12-1e48-4bea-8bb3-d199a02971f9";
  
    const isAdmin =
      roleRows?.some(
        (row) => row.role_id === ADMIN_ROLE_ID
      ) ?? false;
  
    console.log("IS ADMIN:", isAdmin);
  
    if (error || !isAdmin) {
      return NextResponse.redirect(
        new URL("/unauthorized", request.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
