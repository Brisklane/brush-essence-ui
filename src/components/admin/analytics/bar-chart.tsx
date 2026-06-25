"use client";

import { cn } from "@/lib/utils";

export interface BarChartPoint {
  /** X-axis label (e.g. a date). */
  label: string;
  /** Bar height value. */
  value: number;
  /** Optional tooltip text. */
  title?: string;
}

interface BarChartProps {
  data: BarChartPoint[];
  /** Formats the (max) value shown on the y-axis caption. */
  formatValue?: (value: number) => string;
  className?: string;
  barClassName?: string;
}

/**
 * Dependency-free vertical bar chart built with flex + scaled heights. Suitable
 * for compact dashboard time-series (revenue, orders, signups per day).
 */
export function BarChart({
  data,
  formatValue = (v) => String(v),
  className,
  barClassName,
}: BarChartProps) {
  const max = Math.max(1, ...data.map((point) => point.value));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="text-muted-2 flex justify-between text-xs">
        <span>0</span>
        <span>{formatValue(max)}</span>
      </div>
      <div className="flex h-40 items-end gap-px" role="img">
        {data.map((point, index) => (
          <div
            key={`${point.label}-${index}`}
            title={point.title ?? `${point.label}: ${formatValue(point.value)}`}
            className="flex flex-1 items-end"
            style={{ height: "100%" }}
          >
            <div
              className={cn(
                "bg-brand-500/80 hover:bg-brand-600 w-full rounded-t-sm transition-colors",
                barClassName,
              )}
              style={{
                height: `${Math.max((point.value / max) * 100, point.value > 0 ? 2 : 0)}%`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
