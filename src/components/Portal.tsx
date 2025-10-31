"use client";

import { createPortal } from "react-dom";
import type { ReactNode } from "react";

type PortalProps = {
  children: ReactNode;
  container?: HTMLElement | null;
};

export const Portal = ({ children, container }: PortalProps) => {
  const target =
    typeof window === "undefined"
      ? null
      : container ?? document.body ?? null;

  if (!target) {
    return null;
  }

  return createPortal(children, target);
};
