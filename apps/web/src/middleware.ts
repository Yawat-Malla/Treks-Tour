import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);
const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || "studio-7f3a";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === `/${adminPath}` || pathname.startsWith(`/${adminPath}/`)) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(`/${adminPath}`, "/cms") || "/cms";
    return NextResponse.rewrite(url);
  }

  if (pathname === "/cms" || pathname.startsWith("/cms/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  return intl(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|uploads|.*\\..*).*)"],
};
