import Link from 'next/link'
import { Button } from '@/components/ui/button'

const FAQ_SECTIONS = [
  {
    title: 'Getting started',
    faqs: [
      {
        q: 'Is Haven really free for 3 months?',
        a: "Yes! Every new Haven account — sitter or owner — gets 3 months of Standard plan features completely free. No credit card required. After 3 months you can stay on the free Explorer plan (3 applications/month) or upgrade to Standard ($79/yr) or Premium ($129/yr).",
      },
      {
        q: 'Can I be both a sitter and a home owner on one account?',
        a: "Absolutely. Choose the 'Both' role when signing up. One profile, one login — switch between searching for sitters and browsing sits from the same dashboard.",
      },
      {
        q: 'Do you offer a student discount?',
        a: "Yes — 30% off Standard and Premium plans for students with a verified school email (.edu, .ac.uk, .edu.au etc). The discount is applied automatically when you sign up with your school email.",
      },
      {
        q: 'I currently use TrustedHousesitters / Rover. Can I switch?',
        a: "We offer a switcher credit — 3 free months of Premium if you show proof of an active subscription on another platform (screenshot of your billing page). Contact support@havenhousesits.com to claim it.",
      },
    ],
  },
  {
    title: 'For sitters',
    faqs: [
      {
        q: 'How many sits can I apply to?',
        a: "Explorer (free) plan: 3 applications per month. Standard: unlimited. Premium: unlimited + priority placement in listings. We believe removing artificial limits helps sitters find better matches faster.",
      },
      {
        q: 'How does the Sit Match Score work?',
        a: "Haven's Match Score (%) is calculated from your profile data: pet types you care for, preferred countries, ID verification, background check status, total sits, and average rating. A higher score appears at the top of your results for relevant listings.",
      },
      {
        q: 'What happens if I need to cancel a confirmed sit?',
        a: "Please contact the home owner and Haven support as soon as possible. For free sits, Haven will help find a replacement sitter. For paid sits, cancellation within 7 days of the start date incurs a 25% cancellation fee; outside 7 days is fully refunded.",
      },
      {
        q: 'How do tips work?',
        a: "Home owners can leave a tip after any sit — free or paid. 100% of the tip goes to you. Haven takes zero commission on tips. Tips are paid out within 2 business days.",
      },
      {
        q: 'Do I need a background check?',
        a: "Background checks are optional but strongly recommended. Sitters with a background check badge receive 3× more applications from home owners. The one-time check costs $19.99 for US residents and is powered by Evident.",
      },
    ],
  },
  {
    title: 'For home owners',
    faqs: [
      {
        q: 'How many applicants will I get?',
        a: "Haven allows up to 7 active applications per listing. When you decline one, a new applicant can come in automatically — so you always have a full backup pool. Unlike TrustedHousesitters where declining closes the slot forever.",
      },
      {
        q: 'How do paid sits work?',
        a: "You set a daily rate when posting your listing. When you accept a sitter, Haven collects the full amount via secure Stripe escrow. The funds are held until 24 hours after the sit ends, then automatically released to the sitter (minus Haven's 8% service fee).",
      },
      {
        q: 'What is the Haven Guarantee?',
        a: "Every sit comes with Haven's built-in Guarantee: up to $1,000 for accidental property damage by the sitter, plus emergency vet coverage up to $500. For higher coverage, upgrade to HomeOwner Plus ($25,000) or PetGuard ($3,000 vet) — both available as sit add-ons.",
      },
      {
        q: 'What are add-ons?',
        a: "Add-ons are optional paid services sitters can offer: a professional deep clean before you return ($120). Haven takes 15% of add-on fees; the rest goes to the sitter.",
      },
      {
        q: 'Can I request a video call before confirming?',
        a: "Yes — and we encourage it. Video calls can be scheduled directly inside Haven's inbox. Many owners do a quick call + optional in-person meet for local sitters.",
      },
    ],
  },
  {
    title: 'Payments & security',
    faqs: [
      {
        q: 'Is my payment information safe?',
        a: "Your card number never touches Haven's servers. All payment data is handled by Stripe (PCI DSS Level 1 certified — the highest possible security standard). We store only a payment token. Our servers are encrypted at rest (AES-256) and in transit (TLS 1.3).",
      },
      {
        q: 'How does Haven make money?',
        a: "Multiple revenue streams keep Haven profitable without hiking membership prices: membership subscriptions, 8% service fee on paid sits, 15% on add-ons, listing boosts, premium verifications, insurance referrals, and referral bounties. This lets us charge less than TrustedHousesitters while offering more.",
      },
      {
        q: 'What if there\'s a dispute?',
        a: "Contact Haven support 24/7. For property damage claims, our Trust & Safety team investigates within 48 hours using photos, messages, and sitter history. Escrow funds for paid sits can be held pending resolution. Serious cases are escalated to our insurance partners.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="bg-haven-cream min-h-screen">

      {/* Header */}
      <section className="py-20 text-center">
        <div className="container-haven max-w-2xl">
          <h1 className="font-display text-5xl font-bold text-haven-navy mb-4">
            Frequently asked questions
          </h1>
          <p className="text-haven-gray text-lg">
            Can't find your answer? Our support team is available 24/7.
          </p>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="pb-20">
        <div className="container-haven max-w-3xl">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.title} className="mb-10">
              <h2 className="font-display text-2xl font-bold text-haven-navy mb-4">{section.title}</h2>
              <div className="space-y-3">
                {section.faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="card overflow-hidden group"
                  >
                    <summary className="p-5 flex items-center justify-between cursor-pointer list-none font-semibold text-haven-navy hover:text-haven-teal-dark transition-colors">
                      {faq.q}
                      <span className="ml-3 h-6 w-6 rounded-full bg-haven-sand/50 group-open:bg-haven-teal-pale flex items-center justify-center flex-shrink-0 transition-colors text-haven-navy group-open:text-haven-teal text-sm font-bold">
                        +
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-haven-gray text-sm leading-relaxed border-t border-haven-sand/30 pt-4">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* Contact CTA */}
          <div className="card p-6 text-center bg-haven-teal text-white border-0">
            <h3 className="font-display text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-white/80 mb-4 text-sm">Our support team replies in under 4 minutes, 24 hours a day.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="white">Chat now</Button>
              <Link href="mailto:support@havenhousesits.com">
                <Button variant="white">Email us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
