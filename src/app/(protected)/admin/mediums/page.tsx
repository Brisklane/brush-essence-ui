"use client";

import { useEffect, useState } from "react";

import { Button, ConfirmDialog, Input } from "@/components/ui";
import { createMedium, deleteMedium, listMediums } from "@/lib/catalog-api";
import type { Medium } from "@/types";

export default function MediumsPage() {
  const [mediums, setMediums] = useState<Medium[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Medium | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listMediums()
      .then((result) => {
        if (!cancelled) {
          setError(null);
          setMediums(result);
        }
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(
            caught instanceof Error ? caught.message : "Failed to load mediums.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createMedium({ name: name.trim() });
      setName("");
      setLoading(true);
      setReloadKey((key) => key + 1);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Failed to add medium.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }
    setDeleting(true);
    try {
      await deleteMedium(deleteTarget.id);
      setDeleteTarget(null);
      setLoading(true);
      setReloadKey((key) => key + 1);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Failed to delete medium.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-foreground text-2xl font-semibold">Mediums</h1>
      <p className="text-muted mt-1">
        The reusable list of techniques (e.g. “Oil on canvas”) you can pick from
        when adding a painting.
      </p>

      <form
        onSubmit={handleAdd}
        className="mt-6 flex max-w-xl flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="med-name" className="text-foreground text-sm font-medium">
            Name
          </label>
          <Input
            id="med-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Oil on canvas"
          />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Adding…" : "Add"}
        </Button>
      </form>

      {error ? (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-96 text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="p-6 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : mediums.length > 0 ? (
              mediums.map((medium) => (
                <tr
                  key={medium.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="text-foreground p-3 font-medium">
                    {medium.name}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(medium)}
                      className="font-medium text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="p-6 text-center text-muted">
                  No mediums yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete medium?"
        description={
          deleteTarget
            ? `“${deleteTarget.name}” will be removed. Paintings using it stay but lose their medium.`
            : undefined
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
