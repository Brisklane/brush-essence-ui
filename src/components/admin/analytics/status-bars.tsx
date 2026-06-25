import { cn } from "@/lib/utils";

export interface StatusBarItem {
  label: string;
  value: number;
  /** Tailwind background class for the bar fill. */
  colorClass?: string;
}

/**
 * Horizontal proportional bars for a categorical breakdown (e.g. orders by
 * status). Reusable across the orders and requests breakdowns.
 */
export function StatusBars({ items }: { items: StatusBarItem[] }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return <p className="text-muted-2 text-sm">No data yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const pct = Math.round((item.value / total) * 100);
        return (
          <li key={item.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted">{item.label}</span>
              <span className="text-foreground tabular-nums">
                {item.value}
                <span className="text-muted-2"> · {pct}%</span>
              </span>
            </div>
            <div className="bg-surface-2 h-2 overflow-hidden rounded-full">
              <div
                className={cn("h-full rounded-full", item.colorClass ?? "bg-brand-500")}
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
