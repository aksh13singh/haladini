"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteProduct } from "@/app/admin/actions";

export function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onDelete = async () => {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    setBusy(true);
    const res = await deleteProduct(id);
    setBusy(false);
    if ("error" in res) alert(res.error);
    else router.refresh();
  };

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={busy}
      aria-label={`Delete ${name}`}
      className="grid h-9 w-9 place-items-center rounded-full text-ink/50 transition-colors hover:bg-red-50 hover:text-destructive disabled:opacity-40"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
