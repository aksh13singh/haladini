"use client";

import { useEffect, useState } from "react";

/**
 * Returns true only after the component has mounted on the client.
 * Used to safely render persisted (localStorage) state — cart count,
 * wishlist hearts — without triggering hydration mismatches.
 */
export function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
