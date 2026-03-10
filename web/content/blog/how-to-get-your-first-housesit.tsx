import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

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

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 mb-6">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-haven-gray leading-relaxed">
          <CheckCircle2 className="h-5 w-5 text-haven-teal flex-shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Content() {
  return (
    <div>
      <p className={p}>
        Housesitting is one of the smartest ways to travel affordably — and it's far more accessible than most people think. You stay in someone's home, care for their pets and property, and in return pay nothing for your accommodation. Sometimes you even get paid.
      </p>
      <p className={p}>
        The challenge? Getting that very first sit when you have no reviews to your name. This guide walks you through every step — from picking the right platform to nailing your first sit and building the reputation that makes the next one easy to land.
      </p>

      <h2 className={h2}>Step 1 — Choose the right platform</h2>
      <p className={p}>
        Most people start with a quick Google search and end up on TrustedHousesitters. It works, but at $129/year for the basic plan, it's a significant upfront cost before you've applied anywhere or proven the model works for you.
      </p>
      <p className={p}>
        <strong className="text-haven-navy font-semibold">Haven Housesits</strong> is specifically designed for people starting out. The free Explorer plan lets you browse all listings and send three applications per month. Every new account gets three months of the Standard plan free — no credit card, no automatic charge. You get time to actually try housesitting before you pay anything.
      </p>
      <p className={p}>
        Haven also has paid sits — listings where homeowners pay you a nightly or weekly rate on top of free accommodation. It's the only platform where you can browse these by destination and apply directly, which opens up income possibilities that other platforms don't offer beginners at all.
      </p>

      <h2 className={h2}>Step 2 — Build a profile that earns trust</h2>
      <p className={p}>
        Your profile is your first impression. Homeowners are handing over their home and their pets to a stranger — they're looking for signals that you're someone they can trust. A weak profile gets skipped even when your application is good.
      </p>

      <h3 className={h3}>Your photo</h3>
      <p className={p}>
        Use a clear, friendly headshot — not a holiday snap cropped from a group photo. A proper portrait where you're smiling and making eye contact with the camera signals approachability and confidence. Profiles with a good photo get meaningfully more responses.
      </p>

      <h3 className={h3}>Your bio</h3>
      <p className={p}>
        Lead with your most relevant experience. If you've grown up with dogs, say so. If you've house-sat informally for friends or family — yes, this counts — mention it. If you're a homeowner yourself, say that too; it signals you understand the responsibility owners are trusting you with.
      </p>
      <p className={p}>
        End with something genuine about your travel style and what draws you to housesitting specifically. Owners respond to people who clearly understand and respect what they're offering.
      </p>

      <h3 className={h3}>Pet and home experience</h3>
      <p className={p}>
        Be specific. "I'm comfortable with dogs and cats" is weaker than "I've cared for two border collies for the past three years and understand how to manage high-energy breeds." Specificity builds trust in a way that vague enthusiasm never does.
      </p>

      <h3 className={h3}>References</h3>
      <p className={p}>
        References matter enormously for first-time sitters. Haven lets you add references from people who know you — not just previous sit owners. Ask a friend whose dog you've looked after, a neighbour who can vouch for your character, or a previous landlord. Even two or three solid references make a meaningful difference when you're competing against more experienced sitters.
      </p>

      <h2 className={h2}>Step 3 — Write applications that actually get replies</h2>
      <p className={p}>
        Most sitters send generic applications that owners can tell were copy-pasted. The applications that get responses are personal, specific, and short.
      </p>

      <Callout>
        <p className="font-semibold text-haven-navy mb-2">A good application should:</p>
        <CheckList items={[
          "Mention something specific from this listing — the pet's name, the neighbourhood, the dates",
          "Share your most relevant experience briefly",
          "Ask one thoughtful question about the sit",
          "Be under 200 words",
        ]} />
      </Callout>

      <p className={p}>What to avoid:</p>
      <ul className={ul}>
        <li className={li}>Opening with "I would love to housesit for you" — everyone says this</li>
        <li className={li}>Listing your CV without connecting it to their specific situation</li>
        <li className={li}>Being overly formal — owners want someone they'd trust in their home, not a job applicant</li>
        <li className={li}>Applying to 20 listings with the same message — owners can tell</li>
      </ul>

      <h2 className={h2}>Step 4 — Ace the video call</h2>
      <p className={p}>
        Most owners want a video call before confirming a sitter. Think of it as a friendly get-to-know-you, not an interview.
      </p>
      <p className={p}>Come prepared with questions:</p>
      <ul className={ul}>
        <li className={li}>What's the pet's daily routine? Any quirks or anxieties?</li>
        <li className={li}>Who is the emergency vet contact?</li>
        <li className={li}>Are there any house rules or maintenance tasks I should know about?</li>
        <li className={li}>How would you like to receive updates while you're away?</li>
      </ul>
      <p className={p}>
        Ask about the pets genuinely — owners love sitters who are curious about their animals. It signals you actually care about the job, not just the free accommodation.
      </p>

      <h2 className={h2}>Step 5 — Deliver a great first sit</h2>
      <p className={p}>
        Once confirmed, the sit itself is how you build the reputation that makes every future sit easier to land. A few habits that separate good sitters from great ones:
      </p>
      <p className={p}>
        <strong className="text-haven-navy font-semibold">Communicate without overdoing it.</strong> Send one photo update per day — usually of the pet. Owners want reassurance that everything's fine, not a constant stream of messages. One meaningful update beats five check-ins.
      </p>
      <p className={p}>
        <strong className="text-haven-navy font-semibold">Leave the home cleaner than you found it.</strong> This is the most common thing mentioned in glowing reviews. Strip the bed, wash the sheets if you have time, clean the kitchen, and empty the bins. Don't just tidy — actually clean.
      </p>
      <p className={p}>
        <strong className="text-haven-navy font-semibold">Handle problems calmly and transparently.</strong> If something breaks or a pet gets sick, message the owner, describe clearly what happened, and explain what you've done or plan to do. Don't hide problems hoping they'll go away — prompt, clear communication always gets a better response than a surprise after the fact.
      </p>

      <h2 className={h2}>How to get reviews when you're starting from zero</h2>
      <p className={p}>
        The classic catch-22 of housesitting: you need reviews to get sits, but you need sits to get reviews. Here's how to get around it:
      </p>
      <ul className={ul}>
        <li className={li}><strong className="text-haven-navy font-semibold">House-sit informally first.</strong> Friends, family, neighbours — any informal sit counts as experience, and many people will happily leave a reference or review if you ask.</li>
        <li className={li}><strong className="text-haven-navy font-semibold">Target longer or less competitive sits.</strong> Rural locations, multiple pets, longer durations — these sits get fewer applicants than popular city weekenders. A well-crafted profile has a real chance.</li>
        <li className={li}><strong className="text-haven-navy font-semibold">Apply quickly.</strong> Owners often reach out to the first few strong applicants. Speed matters — check notifications and apply within a few hours of a listing going live.</li>
        <li className={li}><strong className="text-haven-navy font-semibold">Look at vacant sits.</strong> Sits with no pets are less competitive because many sitters specifically want animals. A vacant home sit is an easier first win.</li>
        <li className={li}><strong className="text-haven-navy font-semibold">Be responsive.</strong> Reply to messages quickly. Owners who are comparing applicants will often go with whoever engages first.</li>
      </ul>

      <Callout>
        <p className="font-semibold text-haven-navy mb-1">Ready to find your first sit?</p>
        <p className="text-haven-gray text-sm">
          Haven gives every new member three months free — no credit card needed. Browse exchange sits, paid sits, and vacant homes all in one place.{' '}
          <Link href="/signup" className="text-haven-teal font-semibold underline underline-offset-2">
            Create your free profile →
          </Link>
        </p>
      </Callout>
    </div>
  )
}
