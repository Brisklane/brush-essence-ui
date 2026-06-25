"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui";
import { listCategories, listPaintings } from "@/lib/catalog-api";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [paintingCount, setPaintingCount] = useState<number | null>(null);
  const [categoryCount, setCategoryCount] = useState<number | null>(null);

  useEffect(() => {
    listPaintings({ page: 1, pageSize: 1 })
      .then((result) => setPaintingCount(result.totalCount))
      .catch(() => setPaintingCount(null));
    listCategories()
      .then((categories) => setCategoryCount(categories.length))
      .catch(() => setCategoryCount(null));
  }, []);

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-ink text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-stone-600">Manage your painting catalogue.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent>
            <CardTitle>Paintings</CardTitle>
            <CardDescription className="mt-1">
              {paintingCount ?? "—"} total
            </CardDescription>
            <Link
              href="/admin/paintings"
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "mt-4",
              )}
            >
              Manage paintings
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <CardTitle>Categories</CardTitle>
            <CardDescription className="mt-1">
              {categoryCount ?? "—"} total
            </CardDescription>
            <Link
              href="/admin/categories"
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "mt-4",
              )}
            >
              Manage categories
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
