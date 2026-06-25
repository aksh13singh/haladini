/**
 * Multi-currency display layer.
 *
 * All prices are STORED and CHARGED in ₹ (INR) — the database, the cart and
 * Razorpay only ever deal in rupees. This module converts that ₹ base into the
 * visitor's chosen currency *for display only*, applying an international markup
 * so overseas prices are higher (to cover shipping, duties & handling).
 *
 * To tune pricing you only edit two things here:
 *   1. CURRENCIES[*].inrPerUnit  — the exchange reference rates
 *   2. INTERNATIONAL_MARKUP       — the overseas markup multiplier
 */

export type CurrencyCode = "INR" | "USD" | "GBP" | "EUR";

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
  /** How many ₹ (INR) equal one unit of this currency. INR itself = 1. */
  inrPerUnit: number;
}

/**
 * Reference exchange rates — ₹ per 1 unit of the currency.
 * These are FIXED/approximate (not live). Update them here whenever you want.
 */
export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  INR: { code: "INR", symbol: "₹", label: "Indian Rupee", locale: "en-IN", inrPerUnit: 1 },
  USD: { code: "USD", symbol: "$", label: "US Dollar", locale: "en-US", inrPerUnit: 84 },
  GBP: { code: "GBP", symbol: "£", label: "British Pound", locale: "en-GB", inrPerUnit: 106 },
  EUR: { code: "EUR", symbol: "€", label: "Euro", locale: "en-IE", inrPerUnit: 91 },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];
export const DEFAULT_CURRENCY: CurrencyCode = "INR";

/**
 * Markup applied to international (non-INR) prices on top of the ₹ price, to
 * cover international shipping, duties & handling. 1.0 = no markup, 1.4 = +40%.
 * Change this ONE number to re-price every overseas product at once.
 */
export const INTERNATIONAL_MARKUP = 1.4;

/** Convert an amount in ₹ (INR base) into the target currency's numeric value. */
export function convertPrice(amountINR: number, code: CurrencyCode): number {
  if (code === "INR") return amountINR;
  const meta = CURRENCIES[code] ?? CURRENCIES.INR;
  return (amountINR * INTERNATIONAL_MARKUP) / meta.inrPerUnit;
}

/** Format a value that is already in `code` currency for display. */
export function formatMoney(value: number, code: CurrencyCode): string {
  const meta = CURRENCIES[code] ?? CURRENCIES.INR;
  // Whole-number display for a clean retail look; round up overseas so we never under-price.
  const rounded = code === "INR" ? Math.round(value) : Math.ceil(value);
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(rounded);
}

/** Convenience: convert a ₹ amount and format it in one step. */
export function priceIn(amountINR: number, code: CurrencyCode): string {
  return formatMoney(convertPrice(amountINR, code), code);
}

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && value in CURRENCIES;
}

const EURO_COUNTRIES = new Set([
  "AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES",
]);

/** Pick the best default display currency for an ISO country code. */
export function currencyForCountry(country?: string | null): CurrencyCode {
  if (!country) return DEFAULT_CURRENCY;
  const c = country.toUpperCase();
  if (c === "IN") return "INR";
  if (c === "GB") return "GBP";
  if (EURO_COUNTRIES.has(c)) return "EUR";
  // US and every other country default to USD.
  return "USD";
}
