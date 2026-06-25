"use client";

import { convertPrice, formatMoney } from "@/lib/currency";
import { useCurrency } from "./currency-provider";

/**
 * Renders a ₹-base amount in the visitor's selected currency.
 * Drop-in replacement for `{formatINR(amount)}` — returns just the text, so it
 * can sit inside any existing styled wrapper.
 */
export function Price({ amount }: { amount: number }) {
  const { currency } = useCurrency();
  return <>{formatMoney(convertPrice(amount, currency), currency)}</>;
}
