"use client";

import { useEffect, useState } from "react";

import { Badge, Button, Input, Select, Spinner } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { listUsers } from "@/lib/admin-api";
import type { AdminUser, PagedResult } from "@/types";

import { AdminPagination } from "./admin-pagination";
import { UserEditDialog } from "./user-edit-dialog";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

export function ManageUsers() {
  const { user: currentUser } = useAuth();
  const [data, setData] = useState<PagedResult<AdminUser> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminUser | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"" | "true" | "false">("");

  // State is set in async callbacks (not synchronously in the effect body).
  useEffect(() => {
    let cancelled = false;
    listUsers({
      page,
      search: search.trim() || undefined,
      isActive: activeFilter === "" ? undefined : activeFilter === "true",
    })
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Couldn't load users.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, search, activeFilter]);

  function onSaved(updated: AdminUser) {
    setData((current) =>
      current
        ? {
            ...current,
            items: current.items.map((item) =>
              item.id === updated.id ? updated : item,
            ),
          }
        : current,
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search name or email…"
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          className="max-w-xs"
        />
        <Select
          value={activeFilter}
          onChange={(event) => {
            setPage(1);
            setActiveFilter(event.target.value as "" | "true" | "false");
          }}
          className="max-w-48"
        >
          <option value="">All accounts</option>
          <option value="true">Active</option>
          <option value="false">Disabled</option>
        </Select>
      </div>

      {error ? <p className="mt-6 text-red-600">{error}</p> : null}

      <div className="border-border mt-5 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-176 text-sm">
          <thead className="bg-surface-2 text-muted text-left text-xs uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Roles</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {loading && !data ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center">
                  <Spinner className="mx-auto size-6" />
                </td>
              </tr>
            ) : data && data.items.length > 0 ? (
              data.items.map((user) => (
                <tr key={user.id} className="hover:bg-surface-2/50">
                  <td className="px-4 py-3">
                    <p className="text-foreground font-medium">
                      {user.fullName ?? "—"}
                    </p>
                    <p className="text-muted-2 text-xs">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge
                          key={role}
                          variant={role === "Admin" ? "gold" : "neutral"}
                          size="sm"
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={user.isActive ? "success" : "danger"}
                      size="sm"
                    >
                      {user.isActive ? "Active" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="text-muted px-4 py-3">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditing(user)}
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-muted px-4 py-10 text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data ? (
        <AdminPagination
          page={data.page}
          totalPages={data.totalPages}
          hasPrevious={data.hasPrevious}
          hasNext={data.hasNext}
          onPage={setPage}
        />
      ) : null}

      {editing ? (
        <UserEditDialog
          user={editing}
          isSelf={currentUser?.id === editing.id}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
        />
      ) : null}
    </div>
  );
}
