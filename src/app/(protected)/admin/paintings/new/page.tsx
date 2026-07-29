import type { Metadata } from "next";

import { PaintingForm } from "@/components/admin/painting-form";

export const metadata: Metadata = { title: "Add painting" };

export default function NewPaintingPage() {
  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-foreground text-2xl font-semibold">Add painting</h1>
      <p className="text-muted mt-1">Create a new piece for the catalogue.</p>
      <div className="mt-6">
        <PaintingForm />
      </div>
    </div>
  );
}
