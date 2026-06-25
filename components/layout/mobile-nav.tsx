"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HaladiniMark } from "@/components/brand/logo";
import { mainNav, contact } from "@/lib/site-config";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex w-full flex-col p-0 sm:max-w-xs">
        <SheetHeader className="border-b border-flamingo-tint px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-wine">
            <HaladiniMark className="h-6 w-6" />
            Haladini
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col">
            {mainNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold text-wine transition-colors hover:bg-flamingo-tint"
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4 text-flamingo-deep" />
                </Link>

                {link.children && (
                  <ul className="mb-1 ml-4 border-l border-flamingo-tint pl-3">
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => onOpenChange(false)}
                          className="block rounded-xl px-4 py-2 text-sm font-medium text-wine/70 transition-colors hover:bg-flamingo-tint hover:text-wine"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-flamingo-tint px-6 py-5">
          <Button asChild className="w-full" onClick={() => onOpenChange(false)}>
            <Link href="/account">Sign in / Register</Link>
          </Button>
          <a
            href={contact.emailHref}
            className="mt-3 block text-center text-xs text-muted-foreground"
          >
            {contact.email}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
