import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | HMART",
  description: "HMART refund and return policy for all products.",
};

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-zinc-950">Refund & Return Policy</h1>
      <p className="mt-2 text-sm text-zinc-600">Last updated: June 2025</p>

      <div className="mt-8 space-y-6 text-sm leading-7 text-zinc-700">
        <section>
          <h2 className="text-base font-semibold text-zinc-950">1. Return Eligibility</h2>
          <p className="mt-2">
            Items purchased from HMART can be returned within <strong>7 days</strong> of delivery if they meet the following criteria:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Product is unused, unopened, and in original packaging</li>
            <li>Product is defective, damaged, or incorrect</li>
            <li>Product received differs from the description on the website</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-950">2. Non-Returnable Items</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Perishable goods (food, beverages) once opened</li>
            <li>Personal care items that have been used or opened</li>
            <li>Customized or personalized products</li>
            <li>Products with broken seals (safety/hygiene reasons)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-950">3. How to Initiate a Return</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Go to <strong>My Orders</strong> and select the order</li>
            <li>Click "Request Return" on the item you wish to return</li>
            <li>Select a reason and upload a photo (if applicable)</li>
            <li>Our team will review and approve within 24-48 hours</li>
          </ol>
          <p className="mt-2">
            Alternatively, you can <Link className="font-medium text-green-700 underline" href="/contact">contact our support team</Link> directly.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-950">4. Refund Process</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Refunds are processed within <strong>5-7 business days</strong> after the return is approved</li>
            <li>Refund will be credited to the original payment method</li>
            <li>For COD orders, refund is issued to your bank account (NEFT/UPI)</li>
            <li>Shipping charges are non-refundable unless the return is due to our error</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-950">5. Damaged or Defective Products</h2>
          <p className="mt-2">
            If you receive a damaged or defective product, we will arrange a free pickup and provide a full refund or replacement at no additional cost. Please report within 48 hours of delivery with photo evidence.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-950">6. Cancellation Policy</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Orders can be cancelled before dispatch at no charge</li>
            <li>Once dispatched, cancellation is treated as a return</li>
            <li>Partial cancellation is supported for multi-item orders</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-950">7. Contact</h2>
          <p className="mt-2">
            For any refund-related queries, reach out via our{" "}
            <Link className="font-medium text-green-700 underline" href="/contact">Contact Us</Link> page or email{" "}
            <a className="font-medium text-green-700 underline" href="mailto:support@hmart.in">support@hmart.in</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
