import Link from 'next/link'
import { CheckCircle2, X } from 'lucide-react'

const h2 = "font-display text-2xl md:text-3xl font-bold text-haven-navy mt-12 mb-5"
const h3 = "font-display text-lg md:text-xl font-semibold text-haven-navy mt-8 mb-3"
const p  = "text-haven-gray leading-relaxed mb-5"
const ul = "list-disc list-outside ml-5 space-y-2 mb-6"
const li = "text-haven-gray leading-relaxed"

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-haven-teal-pale border-l-4 border-haven-teal rounded-r-2xl px-6 py-5 my-8">
      {children}
    </div>
  )
}

const rows = [
  { feature: 'Annual price (Standard)',  haven: '$79/yr',         ths: '$129/yr' },
  { feature: 'Annual price (Premium)',   haven: '$129/yr',        ths: '$259/yr' },
  { feature: 'Free trial',               haven: '3 months free',  ths: '14 days only' },
  { feature: 'Credit card required',     haven: 'No',             ths: 'Yes (trial)' },
  { feature: 'Exchange (free) sits',     haven: '✓',              ths: '✓' },
  { feature: 'Browse paid sits',         haven: '✓',              ths: '✗' },
  { feature: 'Vacant home sits',         haven: '✓',              ths: '✓' },
  { feature: 'Application limit',        haven: 'No cap',         ths: '5 per listing' },
  { feature: 'Tip your sitter',          haven: '✓',              ths: '✗' },
  { feature: 'Premium add-ons',          haven: '✓',              ths: '✗' },
  { feature: '24/7 live support',        haven: '✓ (Premium)',    ths: 'Email only' },
  { feature: 'Sit Guarantee',           haven: 'Up to $1,000',   ths: 'Limited' },
]

export default function Content() {
  return (
    <div>
      <p className={p}>
        TrustedHousesitters is the oldest and most established housesitting platform — and for years it was basically the only serious option. Haven is newer and was built to solve the specific frustrations that grew up around TrustedHousesitters: high prices, no paid sits, and application caps that penalise sitters who aren't watching their phones all day.
      </p>
      <p className={p}>
        This comparison goes through the key differences honestly, including where TrustedHousesitters genuinely has an advantage.
      </p>

      <h2 className={h2}>Pricing</h2>
      <p className={p}>
        TrustedHousesitters has two tiers: a Combined plan at $129/year and a Premium plan at $259/year. There's no free tier — only a 14-day trial that requires a credit card. If you don't cancel, you're charged.
      </p>
      <p className={p}>
        Haven has three tiers: a free Explorer plan (3 applications/month), Standard at $79/year, and Premium at $129/year. Every new account gets three months of the Standard plan free, with no credit card required and no auto-charge when the trial ends.
      </p>
      <p className={p}>
        The upshot: Haven's Standard plan costs 38% less than TrustedHousesitters' equivalent, and Haven's Premium plan costs the same as THS's basic plan. And Haven gives you three months to try it properly before spending anything.
      </p>

      <h2 className={h2}>Full feature comparison</h2>

      <div className="overflow-x-auto rounded-2xl border border-haven-sand/40 my-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-haven-navy text-white">
              <th className="p-4 text-left font-semibold">Feature</th>
              <th className="p-4 text-center font-semibold">Haven</th>
              <th className="p-4 text-center font-semibold text-white/70">TrustedHousesitters</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-haven-cream/50'}>
                <td className="p-4 font-medium text-haven-navy">{row.feature}</td>
                <td className="p-4 text-center text-haven-teal font-semibold">{row.haven}</td>
                <td className="p-4 text-center text-haven-gray">{row.ths}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className={h2}>Paid sits — the biggest difference</h2>
      <p className={p}>
        This is the most significant functional gap between the two platforms. TrustedHousesitters is built entirely on the exchange model: sitters stay for free in exchange for care, and no money changes hands. This works well for many situations, but it rules out sits where owners genuinely want to pay for the service — longer sits, multiple pets, or homes that need a higher level of care.
      </p>
      <p className={p}>
        Haven lets sitters browse paid sits by destination and apply directly. Search for housesitting work in Tokyo, Cape Town, or Buenos Aires — and you'll see paid opportunities alongside exchange sits in the same feed. This is something TrustedHousesitters simply doesn't offer, and it's a meaningful difference for anyone who wants to earn income while travelling, not just save on accommodation.
      </p>

      <h2 className={h2}>Application limits</h2>
      <p className={p}>
        TrustedHousesitters closes listings to new applicants after 5 applications. The reasoning is that it creates a less overwhelming choice for owners — but in practice it means that sitters who don't apply within the first few hours of a listing going live often miss out entirely, regardless of how good their profile is.
      </p>
      <p className={p}>
        Haven has no application cap. Owners control how many applications they want to review, but sitters can always apply to any open listing. For owners, this means a larger pool to choose from. For sitters, it means you're never locked out of a listing just because you weren't fast enough.
      </p>

      <h2 className={h2}>Free trial: 14 days vs 3 months</h2>
      <p className={p}>
        A 14-day trial is barely enough time to find a good sit, let alone complete one. Most sitters spend the first week just setting up their profile and browsing — by day 14 they might have applied to two or three sits and haven't heard back yet.
      </p>
      <p className={p}>
        Three months gives you enough time to apply meaningfully, land a sit, complete it, and get your first review. That's the trial period Haven offers, and it doesn't need your credit card to do it.
      </p>

      <h2 className={h2}>When TrustedHousesitters is the better choice</h2>
      <p className={p}>
        To be fair: TrustedHousesitters has been around longer, and has a large established community of listings and sitters. If you specifically want access to the widest possible listing base right now, TrustedHousesitters currently has more volume in certain regions.
      </p>
      <p className={p}>
        If you've built a reputation there over several years, switching platforms also means starting your review count over — worth factoring in.
      </p>

      <h2 className={h2}>When Haven is the better choice</h2>
      <p className={p}>
        Haven makes more sense if you want to earn from paid sits, don't want to pay upfront before trying the platform, care about application fairness, or want features like premium add-ons and sitter tipping that TrustedHousesitters doesn't offer.
      </p>
      <p className={p}>
        For homeowners, Haven gives access to both exchange sitters and the ability to post paid listings — more flexibility than THS allows.
      </p>

      <Callout>
        <p className="font-semibold text-haven-navy mb-1">Currently paying for TrustedHousesitters?</p>
        <p className="text-haven-gray text-sm">
          Haven credits three months of Premium to your account when you switch. Take a screenshot of your active THS subscription and upload it during signup.{' '}
          <Link href="/signup?plan=premium&switcher=true" className="text-haven-teal font-semibold underline underline-offset-2">
            Claim your 3 months free →
          </Link>
        </p>
      </Callout>
    </div>
  )
}
