"use client";

import type { ComponentProps, MouseEvent } from "react";
import { jumpTo } from "@/lib/jump";

/** A link to a section of the landing: scrolls there smoothly (instantly with reduced motion) and keeps the address in step. */
export function SectionLink({ id, onClick, ...rest }: Omit<ComponentProps<"a">, "href"> & { id: string }) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    jumpTo(id);
  };
  return <a href={`#${id}`} onClick={handle} {...rest} />;
}
