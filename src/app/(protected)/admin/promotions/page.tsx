import { ManagePromotions } from "@/components/admin/manage-promotions";

export default function AdminPromotionsPage() {
  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-foreground text-2xl font-semibold">Promotions</h1>
      <p className="text-muted mt-1">
        Run discounts across all paintings, a category, or a hand-picked set. The
        sale price applies in the gallery, cart and at checkout.
      </p>
      <div className="mt-6">
        <ManagePromotions />
      </div>
    </div>
  );
}
