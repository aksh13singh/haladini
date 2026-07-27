"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toCm, type SizeChart } from "@/lib/size-charts";

type Unit = "in" | "cm";
type Tab = "chart" | "measure";

/**
 * "Size Chart" link + dialog for a product. Sizes the product actually offers
 * are highlighted so shoppers can see their options at a glance.
 */
export function SizeChartDialog({
  chart,
  availableSizes = [],
}: {
  chart: SizeChart;
  availableSizes?: string[];
}) {
  const [unit, setUnit] = useState<Unit>("in");
  const [tab, setTab] = useState<Tab>("chart");

  const format = (value: number) =>
    unit === "in"
      ? Number.isInteger(value)
        ? value.toFixed(1)
        : String(value)
      : String(toCm(value));

  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center gap-1.5 text-sm font-medium text-flamingo-deep underline-offset-4 transition-colors hover:text-wine hover:underline">
        <Ruler className="h-4 w-4" />
        Size Chart
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-wine">
            {chart.title}
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 rounded-full bg-cream p-1">
          {(
            [
              ["chart", "Size Chart"],
              ["measure", "How to measure"],
            ] as [Tab, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              aria-pressed={tab === value}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                tab === value
                  ? "bg-white text-wine shadow-sm"
                  : "text-ink/55 hover:text-wine"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "chart" ? (
          <>
            {/* Unit toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink/60">Measurements in</span>
              <div className="inline-flex rounded-full border border-flamingo-tint p-0.5">
                {(["in", "cm"] as Unit[]).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnit(u)}
                    aria-pressed={unit === u}
                    className={cn(
                      "rounded-full px-3.5 py-1 text-xs font-semibold uppercase transition-colors",
                      unit === u
                        ? "bg-flamingo-deep text-white"
                        : "text-ink/55 hover:text-wine"
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="-mx-1 overflow-x-auto px-1">
              <table className="w-full min-w-[34rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-flamingo-tint">
                    <th className="sticky left-0 bg-white py-3 pr-3 text-left font-semibold text-wine">
                      Size
                    </th>
                    {chart.columns.map((col) => (
                      <th
                        key={col}
                        className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-ink/60"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chart.rows.map((row) => {
                    const available =
                      availableSizes.length === 0 ||
                      availableSizes.includes(row.size);
                    return (
                      <tr
                        key={row.size}
                        className={cn(
                          "border-b border-flamingo-tint/60 last:border-0",
                          available ? "bg-flamingo-tint/20" : "opacity-45"
                        )}
                      >
                        <td className="sticky left-0 bg-inherit py-3 pr-3 font-semibold text-wine">
                          {row.size}
                        </td>
                        {row.values.map((value, i) => (
                          <td
                            key={chart.columns[i]}
                            className="px-3 py-3 text-center text-ink/75"
                          >
                            {format(value)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {availableSizes.length > 0 && (
              <p className="text-xs text-ink/50">
                Highlighted rows are the sizes available for this piece.
              </p>
            )}
            {chart.note && (
              <p className="rounded-2xl bg-cream p-3.5 text-xs leading-relaxed text-ink/65">
                {chart.note}
              </p>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-ink/70">
              Measure over light clothing, keeping the tape snug but not tight.
              Compare your measurements with the chart and pick the closest
              size — if you&apos;re between sizes, we suggest sizing up.
            </p>
            <dl className="space-y-3">
              {chart.howToMeasure.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-flamingo-tint bg-white p-3.5"
                >
                  <dt className="text-sm font-semibold text-wine">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink/65">
                    {item.text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
