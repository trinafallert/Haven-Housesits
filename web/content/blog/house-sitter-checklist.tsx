import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

const h2 = "font-display text-2xl md:text-3xl font-bold text-haven-navy mt-12 mb-5"
const h3 = "font-display text-lg md:text-xl font-semibold text-haven-navy mt-8 mb-3"
const p  = "text-haven-gray leading-relaxed mb-5"
const ul = "list-disc list-outside ml-5 space-y-2 mb-6"
const li = "text-haven-gray leading-relaxed"

function CheckSection({ items }: { items: string[] }) {
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

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-haven-teal-pale border-l-4 border-haven-teal rounded-r-2xl px-6 py-5 my-8">
      {children}
    </div>
  )
}

function WarningCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl px-6 py-5 my-8">
      {children}
    </div>
  )
}

export default function Content() {
  return (
    <div>
      <p className={p}>
        The difference between good house sitters and great ones rarely comes down to experience. It comes down to preparation and follow-through. The sitters who consistently land five-star reviews and repeat bookings arrive knowing exactly what they're walking into, communicate proactively, and leave the home in better shape than they found it.
      </p>
      <p className={p}>
        Save this checklist before your next sit. It covers everything from two weeks out to the final handover — including the things most sitters forget until something goes wrong.
      </p>

      <h2 className={h2}>Two weeks before your sit</h2>
      <p className={p}>These are the logistical basics — confirm them early so you have time to resolve any issues.</p>
      <CheckSection items={[
        "Confirm exact arrival and departure times with the owner",
        "Get the full address, parking instructions, and directions to the home",
        "Confirm which keys or access methods you'll be given (physical key, code, lockbox)",
        "Ask whether any trades, cleaners, or other visitors are scheduled during your stay",
        "Confirm payment terms and method if it's a paid sit",
        "Check your travel arrangements — don't assume you can arrive at any time",
      ]} />

      <h2 className={h2}>One week before: understand the home and the pets</h2>
      <p className={p}>
        This is where most preparation happens. Ask everything you need to know before you arrive — it's much easier to get clear answers now than when the owner is rushing to catch a flight.
      </p>

      <h3 className={h3}>For pets</h3>
      <CheckSection items={[
        "Full feeding schedule: what, how much, when",
        "Any medications, supplements, or special dietary requirements",
        "Exercise routine: walks, play time, off-leash areas nearby",
        "Name and number of their regular vet",
        "Emergency vet location and after-hours contact",
        "Any behavioural quirks — separation anxiety, aggression triggers, fears",
        "Which spots they're allowed in (furniture, bedrooms, etc.)",
      ]} />

      <h3 className={h3}>For the home</h3>
      <CheckSection items={[
        "Alarm system codes and instructions",
        "Bin day schedule and which bins go out when",
        "Any temperamental appliances or quirks (boiler, heating, door locks)",
        "Plant watering schedule if applicable",
        "Wi-Fi details",
        "Which rooms or areas are off-limits",
        "Local emergency contact — a neighbour or friend of the owner who can help if needed",
        "How the owner prefers to receive updates (daily message, photo, only if something's wrong)",
      ]} />

      <h2 className={h2}>Arrival day: do the full walkthrough</h2>
      <p className={p}>
        Don't skip the handover. Even if you're in a rush or the owner is, a thorough arrival walkthrough prevents misunderstandings that create problems later.
      </p>
      <CheckSection items={[
        "Walk through every room with the owner — note any pre-existing damage in writing or photos",
        "Watch a live demonstration of anything you're unsure about",
        "Collect all keys and access items; confirm where spares are kept",
        "Meet the pets with the owner present — observe how they interact",
        "Take arrival photos of the home's condition (a habit worth keeping)",
        "Confirm the owner has your contact number and you have theirs",
        "Get the owner's travel details — where they're going, time zone, best way to reach them in an emergency",
      ]} />

      <Callout>
        <p className="font-semibold text-haven-navy mb-1">Tip: take arrival photos</p>
        <p className="text-haven-gray text-sm">
          A quick photo walkthrough when you arrive — walls, floors, appliances, any existing wear — takes five minutes and protects you from any dispute about damage that was already there. It's also useful documentation if something happens during your stay.
        </p>
      </Callout>

      <h2 className={h2}>During the sit: daily habits that make the difference</h2>
      <CheckSection items={[
        "Stick to the pet's routine exactly — feeding times, walks, medications",
        "Send one update per day (usually a photo of the pets is enough — owners love this)",
        "Don't leave pets alone longer than the owner specified",
        "Handle mail, deliveries, and bins as agreed",
        "Deal with small maintenance tasks promptly (lights out, minor leaks, etc.)",
        "Keep the home tidy — clean up after yourself as you go rather than leaving it to the end",
        "Don't have guests without the owner's permission",
      ]} />

      <h2 className={h2}>If something goes wrong</h2>
      <p className={p}>
        Things happen. What matters is how you respond — and owners consistently say transparent, prompt communication is what they care about most.
      </p>
      <ul className={ul}>
        <li className={li}><strong className="text-haven-navy font-semibold">For pet illness or injury:</strong> go to the vet immediately, then update the owner. Don't wait to see if it resolves — and don't wait to tell the owner after the fact. They want to know.</li>
        <li className={li}><strong className="text-haven-navy font-semibold">For home damage:</strong> photograph it, stop any further damage if possible (water, for example), and message the owner with a clear description of what happened and what you've done.</li>
        <li className={li}><strong className="text-haven-navy font-semibold">For emergencies:</strong> use the Haven app to contact support. The Haven Guarantee covers unexpected property damage — don't try to resolve it quietly.</li>
      </ul>

      <WarningCallout>
        <p className="font-semibold text-amber-900 mb-1">What not to do</p>
        <p className="text-amber-800 text-sm">
          Don't hide problems hoping they'll resolve before the owner returns. Owners find out — and discovering an issue after the fact, without any communication, is far worse than hearing about it in the moment with a plan to fix it.
        </p>
      </WarningCallout>

      <h2 className={h2}>End-of-sit checklist</h2>
      <p className={p}>
        Leaving well is what gets you reviewed well. The exit walkthrough is where most five-star reviews are earned or lost.
      </p>
      <CheckSection items={[
        "Clean the home thoroughly — more thoroughly than feels necessary",
        "Strip and wash all bed linen you've used",
        "Clean the kitchen surfaces, oven, and fridge — remove all your food",
        "Empty all bins",
        "Sweep and mop floors if needed",
        "Return all furniture to its original position",
        "Leave a handwritten note if you'd like to make a lasting impression",
        "Return all keys and access items exactly as agreed",
        "Send a final message confirming you've left and a brief summary of how everything went",
        "Leave a review for the homeowner within 24–48 hours",
      ]} />

      <h2 className={h2}>Getting reviewed</h2>
      <p className={p}>
        Reviews are the currency of housesitting. A good review from one sit makes the next one easier to land — and a great review, where the owner specifically describes what you did well, is worth more than a generic five stars.
      </p>
      <p className={p}>
        Leave your review first. It prompts the owner to leave theirs. If a few days pass and they haven't, it's completely fine to send a polite message thanking them again and letting them know you've left a review — most owners just need a gentle nudge.
      </p>

      <Callout>
        <p className="font-semibold text-haven-navy mb-1">Looking for your next sit?</p>
        <p className="text-haven-gray text-sm">
          Browse exchange sits, paid sits, and vacant homes on Haven — all in one place. New members get three months free.{' '}
          <Link href="/search" className="text-haven-teal font-semibold underline underline-offset-2">
            Find your next sit →
          </Link>
        </p>
      </Callout>
    </div>
  )
}
