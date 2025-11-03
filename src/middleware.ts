import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const ADMIN_ROLES = new Set(["admin", "agent"]);

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (!token || !token.role || !ADMIN_ROLES.has(token.role as string)) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: ["/admin/:path*"],
};
