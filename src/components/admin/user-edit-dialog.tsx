"use client";

import { useState } from "react";

import { FormCheckbox } from "@/components/forms";
import { Button } from "@/components/ui";
import { updateUser } from "@/lib/admin-api";
import type { AdminUser } from "@/types";

const ALL_ROLES = ["Admin", "Customer"] as const;

interface UserEditDialogProps {
  user: AdminUser;
  /** True when the admin is editing their own account (guards self-lockout). */
  isSelf: boolean;
  onClose: () => void;
  onSaved: (user: AdminUser) => void;
}

/** Modal for toggling a user's active state and roles. */
export function UserEditDialog({
  user,
  isSelf,
  onClose,
  onSaved,
}: UserEditDialogProps) {
  const [isActive, setIsActive] = useState(user.isActive);
  const [roles, setRoles] = useState<string[]>(user.roles);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleRole(role: string, checked: boolean) {
    setRoles((current) =>
      checked ? [...new Set([...current, role])] : current.filter((r) => r !== role),
    );
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateUser(user.id, { isActive, roles });
      onSaved(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save changes.");
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
        <h2 className="text-foreground text-lg font-semibold">Manage user</h2>
        <p className="text-muted mt-1 text-sm">{user.email}</p>

        <div className="mt-5 space-y-4">
          <div>
            <p className="text-foreground text-sm font-medium">Roles</p>
            <div className="mt-2 space-y-2">
              {ALL_ROLES.map((role) => {
                // An admin must not strip their own Admin role.
                const locked = isSelf && role === "Admin";
                return (
                  <FormCheckbox
                    key={role}
                    id={`role-${role}`}
                    label={locked ? `${role} (you)` : role}
                    checked={roles.includes(role)}
                    disabled={locked}
                    onChange={(event) => toggleRole(role, event.target.checked)}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-foreground text-sm font-medium">Account</p>
            <div className="mt-2">
              <FormCheckbox
                id="user-active"
                label="Active (can sign in)"
                checked={isActive}
                disabled={isSelf}
                onChange={(event) => setIsActive(event.target.checked)}
              />
              {isSelf ? (
                <p className="text-muted-2 mt-1 text-xs">
                  You cannot disable your own account.
                </p>
              ) : null}
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving || roles.length === 0}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
