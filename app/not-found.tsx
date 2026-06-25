import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[68vh] flex-col items-center justify-center py-20 text-center">
      <Image
        src="/haladini-logo.png"
        alt="Haladini"
        width={220}
        height={70}
        className="h-14 w-auto opacity-90"
      />
      <p className="eyebrow mt-9">Error 404</p>
      <h1 className="display-heading mt-3 text-balance text-4xl sm:text-5xl md:text-6xl">
        This page wandered off.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-ink/65">
        The page you&apos;re looking for doesn&apos;t exist — but there&apos;s
        plenty of handcrafted beauty waiting to be discovered.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/shop">Shop the collection</Link>
        </Button>
      </div>
    </div>
  );
}
