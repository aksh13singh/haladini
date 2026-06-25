"use client";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { CURRENCIES, CURRENCY_CODES, type CurrencyCode } from "@/lib/currency";
import { useCurrency } from "./currency-provider";

/** Compact currency selector for the header (₹ INR / $ USD / £ GBP / € EUR). */
export function CurrencySwitcher({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={cn("relative", className)}>
      <label className="sr-only" htmlFor="currency-switcher">
        Currency
      </label>
      <select
        id="currency-switcher"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="h-9 cursor-pointer appearance-none rounded-full border border-flamingo-tint bg-white pl-3 pr-7 text-xs font-semibold text-wine transition-colors hover:border-flamingo-deep focus:border-flamingo-deep focus:outline-none"
      >
        {CURRENCY_CODES.map((code) => (
          <option key={code} value={code}>
            {CURRENCIES[code].symbol} {code}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-wine/60" />
    </div>
  );
}
