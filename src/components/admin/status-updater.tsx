"use client";

import { useState } from "react";

import { Button, Select, Spinner } from "@/components/ui";

interface StatusUpdaterProps<T extends string> {
  /** Allowed next statuses for the current value. */
  next: readonly T[];
  labels: Record<T, string>;
  /** Persists the chosen status; should update the parent's row on success. */
  onApply: (status: T) => Promise<void>;
}

/**
 * Inline "advance status" control shared by the manage-orders and
 * manage-requests tables. Generic over the status string union so the same UI
 * drives both lifecycles.
 */
export function StatusUpdater<T extends string>({
  next,
  labels,
  onApply,
}: StatusUpdaterProps<T>) {
  const [selected, setSelected] = useState<T | "">("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (next.length === 0) {
    return <span className="text-muted-2 text-xs">No further changes</span>;
  }

  async function apply() {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      await onApply(selected);
      setSelected("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <Select
          aria-label="Advance status to"
          value={selected}
          disabled={busy}
          onChange={(event) => setSelected(event.target.value as T)}
          className="h-9 w-40 text-sm"
        >
          <option value="">Advance to…</option>
          {next.map((status) => (
            <option key={status} value={status}>
              {labels[status]}
            </option>
          ))}
        </Select>
        <Button
          size="sm"
          variant="outline"
          disabled={!selected || busy}
          onClick={apply}
        >
          {busy ? <Spinner className="size-4" /> : "Apply"}
        </Button>
      </div>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
