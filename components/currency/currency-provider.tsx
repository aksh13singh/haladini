"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  DEFAULT_CURRENCY,
  isCurrencyCode,
  type CurrencyCode,
} from "@/lib/currency";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
});

/**
 * Holds the visitor's selected currency. The initial value is resolved on the
 * server (cookie → geo → INR) and passed in, so the first render already shows
 * the right currency (no hydration flash). Changes are persisted to a cookie.
 */
export function CurrencyProvider({
  initialCurrency = DEFAULT_CURRENCY,
  children,
}: {
  initialCurrency?: CurrencyCode;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(
    isCurrencyCode(initialCurrency) ? initialCurrency : DEFAULT_CURRENCY
  );

  const setCurrency = useCallback((code: CurrencyCode) => {
    if (!isCurrencyCode(code)) return;
    setCurrencyState(code);
    if (typeof document !== "undefined") {
      // 1 year, site-wide.
      document.cookie = `currency=${code}; path=/; max-age=31536000; samesite=lax`;
    }
  }, []);

  const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
