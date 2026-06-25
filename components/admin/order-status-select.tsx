"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateOrderStatus } from "@/app/admin/actions";

const STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);

  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    const prev = value;
    setValue(next);
    setBusy(true);
    const res = await updateOrderStatus(id, next);
    setBusy(false);
    if ("error" in res) {
      alert(res.error);
      setValue(prev);
    } else {
      router.refresh();
    }
  };

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={busy}
      className="rounded-full border border-flamingo-tint bg-white px-3 py-1.5 text-xs font-semibold capitalize text-wine focus:border-flamingo-deep focus:outline-none"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
