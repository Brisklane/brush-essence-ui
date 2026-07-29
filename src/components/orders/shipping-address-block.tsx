import type { ShippingAddress } from "@/types";

/** Read-only display of a shipping address. */
export function ShippingAddressBlock({
  address,
}: {
  address: ShippingAddress;
}) {
  return (
    <address className="text-muted text-sm leading-relaxed not-italic">
      <span className="text-foreground font-medium">{address.fullName}</span>
      <br />
      {address.line1}
      <br />
      {address.line2 ? (
        <>
          {address.line2}
          <br />
        </>
      ) : null}
      {address.city}
      {address.region ? `, ${address.region}` : ""} {address.postalCode}
      <br />
      {address.country}
      {address.phone ? (
        <>
          <br />
          {address.phone}
        </>
      ) : null}
    </address>
  );
}
