import { siteConfig } from "@/lib/site-config";

/**
 * Slim flamingo-pink announcement bar pinned to the very top.
 * Edit the copy in `lib/site-config.ts` → `announcement`.
 */
export function AnnouncementBar() {
  return (
    <div className="bg-flamingo text-white">
      <div className="container flex h-9 items-center justify-center">
        <p className="text-center text-[0.72rem] font-medium tracking-[0.16em] md:text-xs">
          {siteConfig.announcement}
        </p>
      </div>
    </div>
  );
}
