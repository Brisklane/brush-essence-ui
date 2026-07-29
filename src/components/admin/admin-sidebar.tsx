"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/paintings", label: "Paintings" },
  { href: "/admin/promotions", label: "Promotions" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/mediums", label: "Mediums" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border bg-surface w-full shrink-0 border-b sm:w-56 sm:border-r sm:border-b-0">
      <div className="sm:sticky sm:top-20">
        <nav className="flex flex-wrap gap-1 p-3 sm:flex-col sm:flex-nowrap">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                    : "text-muted hover:bg-surface-2",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
