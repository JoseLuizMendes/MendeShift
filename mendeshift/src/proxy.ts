import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Tudo, menos caminhos internos do Next, rotas de API, arquivos estáticos
    // e as imagens OG. O Next anuncia a og:image com o locale explícito
    // (/pt/opengraph-image); passando pelo middleware, a do locale padrão
    // levaria um redirect — e nem todo crawler de preview segue redirect.
    "/((?!api|_next|_vercel|.*\\..*|.*opengraph-image.*).*)",
  ],
};
