"use client";

import { useState } from "react";
import { Check, Copy, Gift } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/site-config";

export function CouponTab() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const { coupon } = siteConfig;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Newsletter capture is wired to Supabase later; reveal the code now.
    setSubmitted(true);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <>
      {/* Sticky vertical tab pinned to the right edge */}
      <button
        onClick={() => setOpen(true)}
        aria-label={coupon.tabLabel}
        className="fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 origin-right items-center gap-1.5 rounded-l-2xl bg-flamingo-deep px-2.5 py-4 text-white shadow-lift transition-colors hover:bg-wine md:flex md:[writing-mode:vertical-rl]"
      >
        <Gift className="h-4 w-4 rotate-90" />
        <span className="text-xs font-bold uppercase tracking-[0.2em]">
          {coupon.tabLabel}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-md">
          <div className="bg-flamingo-tint px-8 pb-6 pt-10 text-center">
            <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-white text-flamingo-deep shadow-soft">
              <Gift className="h-7 w-7" />
            </span>
            <DialogHeader className="items-center text-center">
              <DialogTitle className="text-center">
                {coupon.headline}
              </DialogTitle>
              <DialogDescription className="mt-2 text-center text-wine/70">
                {coupon.subhead}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-8 pb-8 pt-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                />
                <Button type="submit" size="lg" className="w-full">
                  Reveal my code
                </Button>
                <p className="text-center text-[0.7rem] text-muted-foreground">
                  No spam, just handcrafted updates. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Use this code at checkout:
                </p>
                <button
                  onClick={copyCode}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-flamingo-deep bg-flamingo-tint py-3 font-display text-2xl font-bold tracking-[0.2em] text-wine transition-colors hover:bg-flamingo/20"
                >
                  {coupon.code}
                  {copied ? (
                    <Check className="h-5 w-5 text-flamingo-deep" />
                  ) : (
                    <Copy className="h-5 w-5 text-flamingo-deep" />
                  )}
                </button>
                <p className="mt-2 text-xs text-flamingo-deep">
                  {copied ? "Copied to clipboard!" : "Tap the code to copy"}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
