"use client";

import { useEffect, useState } from "react";

import { Button, ConfirmDialog, Input } from "@/components/ui";
import {
  createCategory,
  deleteCategory,
  listCategories,
} from "@/lib/catalog-api";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listCategories()
      .then((result) => {
        if (!cancelled) {
          setError(null);
          setCategories(result);
        }
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Failed to load categories.",
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
      await createCategory({
        name: name.trim(),
        description: description.trim() || null,
      });
      setName("");
      setDescription("");
      setLoading(true);
      setReloadKey((key) => key + 1);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Failed to add category.",
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
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      setLoading(true);
      setReloadKey((key) => key + 1);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Failed to delete category.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-foreground text-2xl font-semibold">Categories</h1>

      <form
        onSubmit={handleAdd}
        className="mt-6 flex max-w-2xl flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-end"
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="cat-name" className="text-foreground text-sm font-medium">
            Name
          </label>
          <Input
            id="cat-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Landscapes"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="cat-desc" className="text-foreground text-sm font-medium">
            Description (optional)
          </label>
          <Input
            id="cat-desc"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
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
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Slug</th>
              <th className="p-3 font-medium">Description</th>
              <th className="p-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="text-foreground p-3 font-medium">{category.name}</td>
                  <td className="p-3 text-muted">{category.slug}</td>
                  <td className="p-3 text-muted">
                    {category.description ?? "—"}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(category)}
                      className="font-medium text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete category?"
        description={
          deleteTarget
            ? `“${deleteTarget.name}” will be removed. Its paintings stay but become uncategorized.`
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
