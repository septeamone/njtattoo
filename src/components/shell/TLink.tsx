"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useShell } from "./context";

type Props = Omit<ComponentProps<typeof Link>, "href" | "prefetch"> & {
  href: string;
  /** Text the page-transition veil shows while this destination loads. */
  veil?: string;
};

/** Internal link. Plain modified clicks keep native behaviour; the rest run the page transition. */
export function TLink({ href, veil, onClick, children, ...rest }: Props) {
  const { go } = useShell();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(href, veil);
  };
  return (
    <Link href={href} prefetch={false} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
