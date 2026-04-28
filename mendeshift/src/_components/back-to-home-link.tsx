"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/context";
import { ActionLink } from "@/_components/ui/action-link";

type Props = Omit<
  React.ComponentPropsWithoutRef<typeof ActionLink>,
  "href"
>;

/**
 * A "Back to Home" link that leverages `router.back()` to return
 * the user to their previous scroll position on the homepage.
 *
 * When the user arrived directly (bookmark / external link),
 * falls back to navigating to the homepage root.
 */
export function BackToHomeLink({ children, onClick, ...props }: Props) {
  const router = useRouter();
  const locale = useLocale();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.(e);

    const cameFromOurSite =
      document.referrer &&
      new URL(document.referrer).origin === window.location.origin;

    if (cameFromOurSite) {
      router.back();
    } else {
      router.push(`/${locale}`);
    }
  };

  return (
    <ActionLink href={`/${locale}`} onClick={handleClick} {...props}>
      {children}
    </ActionLink>
  );
}
