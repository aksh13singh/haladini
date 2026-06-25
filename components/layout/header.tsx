"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CurrencySwitcher } from "@/components/currency/currency-switcher";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useHasMounted } from "@/lib/use-has-mounted";
import { mainNav } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const mounted = useHasMounted();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const openCart = useCartStore((s) => s.openCart);
  const cartCount = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.count());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-flamingo-tint bg-white/90 backdrop-blur-md">
      {/* Top bar */}
      <div className="container">
        <div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center md:h-24">
          {/* Left — search + mobile menu */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 place-items-center rounded-full text-wine transition-colors hover:bg-flamingo-tint lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="hidden h-10 w-10 place-items-center rounded-full text-wine transition-colors hover:bg-flamingo-tint md:grid"
            >
              {searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
            <span className="ml-1 hidden text-xs text-muted-foreground lg:inline">
              {searchOpen ? "" : "Search"}
            </span>
          </div>

          {/* Center — logo */}
          <div className="flex justify-center">
            <Logo
              priority
              imageClassName="w-[116px] sm:w-[132px] md:w-[146px] h-auto"
            />
          </div>

          {/* Right — currency, wishlist, account, cart */}
          <div className="flex items-center justify-end gap-0.5 md:gap-1">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="grid h-10 w-10 place-items-center rounded-full text-wine transition-colors hover:bg-flamingo-tint md:hidden"
            >
              <Search className="h-5 w-5" />
            </button>

            <CurrencySwitcher className="mr-1 hidden sm:block" />

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-10 w-10 place-items-center rounded-full text-wine transition-colors hover:bg-flamingo-tint"
            >
              <Heart className="h-5 w-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-flamingo-deep px-1 text-[0.6rem] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              aria-label="Account"
              className="hidden h-10 w-10 place-items-center rounded-full text-wine transition-colors hover:bg-flamingo-tint sm:grid"
            >
              <User className="h-5 w-5" />
            </Link>

            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-wine transition-colors hover:bg-flamingo-tint"
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-flamingo-deep px-1 text-[0.6rem] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable search field */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            searchOpen ? "max-h-20 pb-4" : "max-h-0"
          )}
        >
          <form onSubmit={handleSearch} className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus={searchOpen}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bedsheets, suits, cushions…"
              className="pl-11"
            />
          </form>
        </div>
      </div>

      {/* Desktop horizontal nav */}
      <nav className="hidden border-t border-flamingo-tint/70 lg:block">
        <div className="container">
          <ul className="flex items-center justify-center gap-8 py-3">
            {mainNav.map((link) => (
              <li key={link.href} className="group relative">
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-wine/80 transition-colors hover:text-flamingo-deep"
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                  )}
                </Link>

                {link.children && (
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <ul className="min-w-[13rem] rounded-2xl border border-flamingo-tint bg-white p-2 shadow-soft">
                      <li>
                        <Link
                          href={link.href}
                          className="block rounded-xl px-3 py-2 text-sm font-medium normal-case tracking-normal text-wine/70 transition-colors hover:bg-flamingo-tint hover:text-wine"
                        >
                          All {link.label}
                        </Link>
                      </li>
                      {link.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-xl px-3 py-2 text-sm font-medium normal-case tracking-normal text-wine transition-colors hover:bg-flamingo-tint"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
