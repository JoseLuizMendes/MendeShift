import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except for internal Next.js paths, api routes, and static files
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
