"use client";

import { useState } from "react";

import { FormField, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui";
import { setRequestQuote } from "@/lib/admin-api";
import type { AdminCustomRequestListItem, CustomRequest } from "@/types";

interface RequestQuoteDialogProps {
  request: AdminCustomRequestListItem;
  onClose: () => void;
  onSaved: (updated: CustomRequest) => void;
}

/** Admin dialog to send a price quote for a custom request. */
export function RequestQuoteDialog({
  request,
  onClose,
  onSaved,
}: RequestQuoteDialogProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a quote amount greater than 0.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      onSaved(await setRequestQuote(request.id, value, note.trim() || undefined));
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send the quote.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default bg-black/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="border-border bg-surface relative w-full max-w-md rounded-xl border p-6 shadow-xl"
      >
        <h2 className="text-foreground text-lg font-semibold">Send a quote</h2>
        <p className="text-muted mt-1 text-sm">{request.title}</p>

        <div className="mt-5 space-y-4">
          <FormField
            id="quote-amount"
            label="Quote amount (PKR)"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <FormTextarea
            id="quote-note"
            label="Message to customer (optional)"
            rows={3}
            placeholder="What's included, timeline, etc."
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Sending…" : "Send quote"}
          </Button>
        </div>
      </div>
    </div>
  );
}
