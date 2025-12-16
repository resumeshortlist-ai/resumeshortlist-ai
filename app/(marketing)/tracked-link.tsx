"use client";

import Link from "next/link";
import { useCallback } from "react";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
  event?: string;
};

export default function TrackedLink({ href, className, children, event = "cta_click" }: Props) {
  const onClick = useCallback(() => {
    // Placeholder analytics hook.
    // Replace with PostHog / GA4 / Plausible etc.
    try {
      (window as any).track?.(event, { href });
    } catch {}
    // Always log so you can see it in dev.
    console.log("[track]", event, { href });
  }, [event, href]);

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
