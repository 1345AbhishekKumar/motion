// lib/hooks.ts
"use client";

import { useEffect, useRef } from "react";

/**
 * Runs a passive scroll listener inside a single rAF per frame.
 * Cleans up automatically on unmount.
 */
export function useScrollRaf(cb: () => void, deps: unknown[] = []) {
  const rafRef = useRef<number>(0);
  const cbRef = useRef(cb);
  cbRef.current = cb;

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => cbRef.current());
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Runs a continuous rAF loop.
 */
export function useRafLoop(cb: () => void) {
  const rafRef = useRef<number>(0);
  const cbRef = useRef(cb);
  cbRef.current = cb;

  useEffect(() => {
    const loop = () => {
      cbRef.current();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
}
