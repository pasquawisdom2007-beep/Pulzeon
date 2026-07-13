import type { Metadata } from "next"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Terms, Privacy & Refund Policy — Pulzeon",
  description: "Pulzeon terms of service, privacy policy and refund policy.",
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-white text-glow">Terms, Privacy &amp; Refund Policy</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-10 flex flex-col gap-8 text-pretty leading-relaxed text-slate-300">
        <section>
          <h2 className="mb-2 font-heading text-xl font-semibold text-cyan-300">1. Terms of Service</h2>
          <p>
            By using {SITE.name}, you agree to use the platform lawfully and not to redistribute, resell or share
            purchased digital products without permission. Accounts are personal to you and must not be shared.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-xl font-semibold text-cyan-300">2. Payments</h2>
          <p>
            Payments are currently processed via bank transfer to Opay ({SITE.payment.accountName}). After payment you
            must submit proof and a transaction reference. Access is granted once your payment is confirmed. A future
            update may add automated card payments via Paystack or Flutterwave.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-xl font-semibold text-cyan-300">3. Digital Delivery</h2>
          <p>
            All products are digital and delivered through your dashboard after confirmation. Premium content is
            available for the duration of an active subscription.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-xl font-semibold text-cyan-300">4. Refund Policy</h2>
          <p>
            Because products are digital and delivered instantly, all sales are generally final. If you were charged in
            error or received the wrong item, contact us via our WhatsApp or Telegram channels within 48 hours and we
            will review your case.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-xl font-semibold text-cyan-300">5. Privacy</h2>
          <p>
            We store only the information needed to run your account and orders (email, hashed password, order history
            and payment proof). We never sell your data. Passwords are hashed and never stored in plain text.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-heading text-xl font-semibold text-cyan-300">6. Contact</h2>
          <p>For any questions about these policies, reach us through our WhatsApp or Telegram channels.</p>
        </section>
      </div>
    </div>
  )
}
