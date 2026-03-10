import Link from 'next/link'

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

const rateRows = [
  { region: 'Regional cities / rural areas', rate: '$20 – $45 / night' },
  { region: 'Major European cities',         rate: '€35 – €70 / night' },
  { region: 'Sydney, Melbourne',             rate: 'AUD $55 – $90 / night' },
  { region: 'New York, London, Singapore',   rate: '$60 – $100+ / night' },
  { region: 'Bali, Southeast Asia',          rate: '$20 – $40 / night' },
]

export default function Content() {
  return (
    <div>
      <p className={p}>
        Most people discover housesitting as a way to travel for free — you care for someone's home and pets, and in return your accommodation costs nothing. It's a great deal. But there's a whole layer of housesitting that most people don't know exists: paid sits, where the homeowner pays you on top of free accommodation.
      </p>
      <p className={p}>
        This post explains how paid housesitting works, what you can realistically earn, and where to actually find these sits — because the answer isn't where most people look.
      </p>

      <h2 className={h2}>What is a paid housesit?</h2>
      <p className={p}>
        In a standard (exchange) sit, the sitter gets free accommodation in exchange for caring for the home and its pets. No money changes hands — both parties benefit without payment.
      </p>
      <p className={p}>
        In a paid sit, the homeowner sets a rate — usually per night or per week — and compensates the sitter for their time in addition to providing free accommodation. Paid sits tend to arise when:
      </p>
      <ul className={ul}>
        <li className={li}>The sit is longer than a week (owners want committed, compensated help)</li>
        <li className={li}>There are multiple pets or animals with specific care requirements</li>
        <li className={li}>The location makes free-for-accommodation exchange less appealing</li>
        <li className={li}>The owner simply prefers a professional arrangement</li>
      </ul>

      <h2 className={h2}>How much can you earn from paid housesitting?</h2>
      <p className={p}>
        Rates vary based on location, sit duration, number of animals, and what's expected of the sitter. Here's a general sense of the range you'll encounter:
      </p>

      <div className="overflow-x-auto rounded-2xl border border-haven-sand/40 my-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-haven-navy text-white">
              <th className="p-4 text-left font-semibold">Region</th>
              <th className="p-4 text-right font-semibold">Typical nightly rate</th>
            </tr>
          </thead>
          <tbody>
            {rateRows.map((row, i) => (
              <tr key={row.region} className={i % 2 === 0 ? 'bg-white' : 'bg-haven-cream/50'}>
                <td className="p-4 text-haven-navy font-medium">{row.region}</td>
                <td className="p-4 text-right text-haven-teal font-semibold">{row.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={p}>
        A two-week sit in a major city at $60/night brings in $840 — plus free accommodation for the duration. A month-long sit at a more modest rate of $35/night is $1,050. For sitters who chain multiple paid sits together, housesitting can genuinely cover a significant portion of living costs while travelling.
      </p>

      <h2 className={h2}>The problem with Rover and Wag</h2>
      <p className={p}>
        Rover and Wag are the most well-known platforms for paid pet care, and they do have paid housesitting listings. But there's a critical limitation: <strong className="text-haven-navy font-semibold">you can only receive paid sits if homeowners in a specific area find and book you.</strong>
      </p>
      <p className={p}>
        There's no way to go to Rover and search "paid housesitting jobs in Lisbon next month." You'd need to already have a Rover profile visible to Lisbon-based owners, which typically requires being physically based there. For travelling sitters who want to plan a paid sit in a new destination, Rover and Wag are the wrong tools.
      </p>
      <p className={p}>
        Wag similarly focuses on your current location. Both platforms are designed for sitters who want local, repeat business — not for people who want to travel and earn.
      </p>

      <h2 className={h2}>TrustedHousesitters: no paid sits at all</h2>
      <p className={p}>
        TrustedHousesitters is built entirely on the exchange model. All sits on the platform are free exchanges — no money changes hands, and there's no mechanism for owners to post paid sits or for sitters to receive payment for their work.
      </p>
      <p className={p}>
        This is by design, and it works well for exchange sits. But if your goal is to earn income from housesitting, TrustedHousesitters won't get you there.
      </p>

      <h2 className={h2}>Haven: browse paid sits by destination</h2>
      <p className={p}>
        Haven was built with paid sits as a first-class feature. When you search for sits on Haven, you can filter the results to show paid opportunities specifically — and the results show listings worldwide, not just in your current location.
      </p>
      <p className={p}>
        This means you can open Haven, search for paid housesitting in New Zealand, filter by your dates, and see what's available before you book your flights. You can build a housesitting income itinerary across multiple countries, targeting sits that match your schedule and earning goals.
      </p>

      <h3 className={h3}>How payment works on Haven</h3>
      <p className={p}>
        When an owner posts a paid sit, they set their own rate. Sitters browse and apply with a personal message. Once confirmed, the owner pays through Haven's platform and the funds are held securely in escrow.
      </p>
      <p className={p}>
        After the sit completes successfully, Haven releases the payment. The sitter receives the full sit rate minus an 8% platform fee — significantly lower than what Rover charges (typically 15–20%). Tips from owners go entirely to sitters; Haven doesn't take a cut.
      </p>

      <Callout>
        <p className="font-semibold text-haven-navy mb-2">Example: one week, $500 rate</p>
        <div className="space-y-1 text-sm text-haven-gray">
          <div className="flex justify-between"><span>Sit rate set by owner</span><span className="font-semibold text-haven-navy">$500.00</span></div>
          <div className="flex justify-between"><span>Haven platform fee (8%)</span><span className="font-semibold text-haven-error">−$40.00</span></div>
          <div className="flex justify-between border-t border-haven-sand pt-2 mt-2"><span className="font-semibold text-haven-navy">Sitter receives</span><span className="font-bold text-haven-teal">$460.00</span></div>
        </div>
      </Callout>

      <h2 className={h2}>Tips to land your first paid sit</h2>

      <h3 className={h3}>Build reviews on exchange sits first</h3>
      <p className={p}>
        Owners posting paid sits are typically paying for reliability. A handful of positive reviews from exchange sits — even just two or three — gives you the credibility to compete for paid listings. Start with exchange sits, nail them, and use those reviews to unlock paid opportunities.
      </p>

      <h3 className={h3}>Go Premium for early access</h3>
      <p className={p}>
        Haven Premium members get first look at new listings before they open to the broader community. For competitive paid sits in popular destinations, this timing advantage is real. A good paid sit in a major city can fill within hours of posting.
      </p>

      <h3 className={h3}>Apply quickly and personally</h3>
      <p className={p}>
        Paid sits attract more applicants than exchange sits. A fast, specific application beats a slow, generic one every time. Set up alerts for paid sits in your target destinations and apply as soon as a new listing appears.
      </p>

      <h3 className={h3}>Consider less obvious destinations</h3>
      <p className={p}>
        A paid sit in a regional city or mid-sized town is far less competitive than one in Paris or Sydney, and the rate-to-cost-of-living ratio can actually be better. Less competition, higher chance of getting confirmed, and still a real income.
      </p>

      <Callout>
        <p className="font-semibold text-haven-navy mb-1">Ready to find paid sits near your next destination?</p>
        <p className="text-haven-gray text-sm">
          Haven is the only housesitting platform where you can search and apply for paid sits by location. Three months free to start — no credit card needed.{' '}
          <Link href="/paid-sits" className="text-haven-teal font-semibold underline underline-offset-2">
            Browse paid sits →
          </Link>
        </p>
      </Callout>
    </div>
  )
}
