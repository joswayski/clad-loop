import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next();
  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient({ req, res });
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("I'm in a loop!", new Date().toLocaleTimeString(), session);

  // Check auth condition
  if (session?.user.email?.endsWith("@gmail.com")) {
    // Authentication successful, forward request to protected route.
    return res;
  }

  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = "/dashboard"; // ! Also bad, but just change this to your login page
  redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: "/dashboard",
};
