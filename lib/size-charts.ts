/**
 * Category size charts.
 *
 * Keyed by category slug — every product in a category with a chart here shows
 * a "Size Chart" link on its product page automatically, including products
 * uploaded later. To add a chart for another category (e.g. "shirts"), add an
 * entry with the same shape.
 *
 * All measurements are stored in INCHES; centimetres are derived at render
 * time, so you only ever edit one set of numbers.
 */

export interface SizeChartRow {
  /** Size label — should match the sizes set on the product. */
  size: string;
  /** Measurements in inches, in the same order as `columns`. */
  values: number[];
}

export interface SizeChart {
  title: string;
  /** Column headers for the measurement columns (excluding the Size column). */
  columns: string[];
  rows: SizeChartRow[];
  /** Short note shown under the table. */
  note?: string;
  /** "How to measure" guidance, shown in the second tab. */
  howToMeasure: { label: string; text: string }[];
}

export const SIZE_CHARTS: Record<string, SizeChart> = {
  suits: {
    title: "Suit Set Size Chart",
    columns: [
      "To Fit Bust",
      "Kurta Length",
      "Shoulder",
      "Salwar Waist",
      "Hip",
      "Salwar Length",
    ],
    rows: [
      { size: "XS", values: [34, 44, 13.5, 26, 38, 38] },
      { size: "S", values: [36, 44, 14, 28, 40, 38] },
      { size: "M", values: [38, 44, 14.5, 30, 42, 38] },
      { size: "L", values: [40, 45, 15, 32, 44, 38] },
      { size: "XL", values: [42, 45, 15.5, 34, 46, 38] },
      { size: "XXL", values: [44, 46, 16, 36, 48, 38] },
    ],
    note: "Garments are hand-cut and hand block-printed, so allow a variation of up to 0.5 in. Salwar waists are elasticated with a drawstring for an adjustable fit.",
    howToMeasure: [
      {
        label: "Bust",
        text: "Measure around the fullest part of your bust, keeping the tape level and relaxed.",
      },
      {
        label: "Shoulder",
        text: "Measure across the back, from the edge of one shoulder to the other.",
      },
      {
        label: "Waist",
        text: "Measure around the narrowest part of your natural waistline.",
      },
      {
        label: "Hip",
        text: "Measure around the fullest part of your hips, about 8 in below the waist.",
      },
      {
        label: "Kurta length",
        text: "Measured from the shoulder seam straight down to the hem.",
      },
    ],
  },
};

export function getSizeChart(category: string): SizeChart | undefined {
  return SIZE_CHARTS[category];
}

/** Inches → centimetres, rounded to the nearest whole cm. */
export function toCm(inches: number): number {
  return Math.round(inches * 2.54);
}
