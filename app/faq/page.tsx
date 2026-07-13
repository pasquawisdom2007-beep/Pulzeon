import type { Metadata } from "next"
import { SectionHeading } from "@/components/section-heading"

export const metadata: Metadata = {
  title: "FAQ — Pulzeon",
  description: "Frequently asked questions about buying digital products and Premium on Pulzeon.",
}

const faqs = [
  {
    q: "How do I pay?",
    a: "We currently accept bank transfer via Opay. At checkout you'll see the account details. After paying, upload your payment proof and transaction reference, and we'll confirm it — usually quickly.",
  },
  {
    q: "How fast will my order be confirmed?",
    a: "Payments are confirmed manually right now. Once confirmed, your product downloads (or Premium access) unlock automatically in your dashboard.",
  },
  {
    q: "Where do I download my products?",
    a: "Go to your Dashboard after logging in. All paid products appear there with download links.",
  },
  {
    q: "What is Pulzeon Premium?",
    a: "A monthly or yearly subscription that unlocks exclusive monthly template drops, early access, a VIP group invite, a 20% discount code and priority support.",
  },
  {
    q: "Can I get a refund?",
    a: "Because these are digital products delivered instantly, refunds are limited. See our Terms & Refund Policy page for details.",
  },
  {
    q: "Do you accept card payments?",
    a: "Not yet — but automated card payments (Paystack/Flutterwave) are coming in a future update.",
  },
]

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SectionHeading eyebrow="Help" title="Frequently asked questions" />
      <div className="mt-10 flex flex-col gap-4">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl border border-cyan-500/20 bg-navy-800/40 p-5 transition-colors open:border-cyan-400/50"
          >
            <summary className="cursor-pointer list-none font-heading text-lg font-semibold text-white marker:hidden">
              <span className="flex items-center justify-between gap-4">
                {item.q}
                <span className="text-cyan-400 transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-pretty leading-relaxed text-slate-300">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
