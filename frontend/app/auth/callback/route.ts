import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { getSafeRedirectPath } from "@/src/lib/auth/redirects";
import {
  PASSWORD_RECOVERY_COOKIE,
  PASSWORD_RECOVERY_COOKIE_MAX_AGE,
} from "@/src/lib/auth/recovery";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeRedirectPath(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const response = NextResponse.redirect(new URL(next, requestUrl.origin));

      if (next === "/reset-password") {
        response.cookies.set(PASSWORD_RECOVERY_COOKIE, "1", {
          httpOnly: true,
          maxAge: PASSWORD_RECOVERY_COOKIE_MAX_AGE,
          path: "/",
          sameSite: "lax",
          secure: requestUrl.protocol === "https:",
        });
      }

      return response;
    }
  }

  return NextResponse.redirect(
    new URL("/login?authError=callback", requestUrl.origin),
  );
}
