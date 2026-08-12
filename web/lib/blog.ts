// Single source of truth for blog posts. Both the index
// (app/(marketing)/blog) and the post page (app/(marketing)/blog/[slug]) read
// from here, so a title or date is only ever edited in one place.

export interface Post {
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  emoji: string
  content: string
}

export type PostMeta = Omit<Post, 'content'> & { slug: string }

export const posts: Record<string, Post> = {
  'how-house-sitting-works': {
    title: 'How House Sitting Works: A Complete Guide for Beginners',
    excerpt: 'Everything you need to know about house sitting — from finding your first sit to building a five-star reputation.',
    category: 'Getting Started',
    date: 'March 5, 2026',
    readTime: '6 min read',
    emoji: '🏠',
    content: `
House sitting is simple: a homeowner goes away and needs someone trustworthy to stay in their home, care for their pets, and keep things running. The sitter gets free (or paid) accommodation. Everyone wins.

## How it works on Haven

**1. Create your profile**
Sign up, add a photo, write a bio, and list your experience with animals. The more detail you add, the more confident owners will feel about accepting you.

**2. Browse available sits**
Search by location, dates, pet type, or sit duration. You can filter for free sits or paid sits — Haven is one of the few platforms that offers both.

**3. Apply with a personal message**
When you find a sit you like, send a message introducing yourself. Be specific about why you'd be a great fit. Owners read every application.

**4. Meet and confirm**
Many owners like a quick video call before confirming. It's a chance for both sides to ask questions and make sure it's a good match.

**5. Do the sit**
Show up on time, follow the owner's instructions, send regular updates and photos, and treat the home like your own.

**6. Leave a review**
After the sit, both parties leave reviews. A strong review history is what unlocks the best sits over time.

## Tips for your first sit

- **Start local.** Your first sit will be easier if you're not travelling far. It's also easier to meet the owners in person.
- **Apply to several sits at once.** Competition can be high for popular listings. Cast a wide net.
- **Be honest about your experience.** If you've never cared for a cat, say so — but explain why you'd be good at it.
- **Respond quickly.** Owners often accept the first sitter who responds thoughtfully.

## What does it cost?

Haven has three plans:

- **Explorer (free):** Browse listings and apply to sits
- **Standard ($79/yr):** Full access to all listings + messaging
- **Premium ($129/yr):** Priority placement, background check badge, early access to new sits

Paid sits are also available — you can earn money while you sit. Haven charges a small platform fee on paid transactions.

---

Ready to get started? [Create your free account](/signup) and browse sits near you.
    `,
  },
  'tips-for-pet-owners': {
    title: '8 Tips for Pet Owners Using House Sitters for the First Time',
    excerpt: 'Leaving your pets with someone new can feel daunting. Here\'s how to find the right sitter and set everyone up for success.',
    category: 'Pet Owners',
    date: 'March 3, 2026',
    readTime: '5 min read',
    emoji: '🐾',
    content: `
Leaving your home and pets in someone else's hands is a big deal. But with the right preparation, house sitting can be an amazing experience for everyone — including your animals. Here's what experienced owners have learned.

## 1. Write a detailed listing

The more information you include, the better applications you'll receive. Include your pets' names, breeds, ages, quirks, feeding schedules, and any health conditions. Mention your home's setup — is it close to a vet? Is there a yard? A good listing attracts serious, well-prepared applicants.

## 2. Ask good questions in your messages

Before accepting someone, have a conversation. Ask about their previous sits, how they handle pet emergencies, and what their typical day looks like. You want someone who asks *you* questions back — it shows genuine interest.

## 3. Do a video call

A 15-minute video call tells you a lot that a profile can't. You get to see how they communicate, whether they're calm and confident, and whether your gut says yes.

## 4. Arrange a meet-and-greet if possible

If your sitter is local or arriving a day early, a brief in-person introduction helps your pets get comfortable before you leave.

## 5. Write clear house notes

Leave written instructions for everything: feeding times, medication, vet contact, Wi-Fi password, bin day, alarm code, and any house quirks. Don't assume anything is obvious.

## 6. Set communication expectations upfront

Tell your sitter how often you'd like updates. Daily photos? A check-in every morning? Be specific so there are no awkward silences (or too many messages).

## 7. Check reviews carefully

Look for patterns in a sitter's reviews. Consistent praise for communication and pet care is a great sign. One or two older reviews with no recent activity is worth asking about.

## 8. Trust the process — and your sitter

Once you've done your homework and chosen well, try to relax and enjoy your trip. Micromanaging from afar creates stress for everyone. A good sitter doesn't need constant supervision.

---

[Post your sit on Haven](/create-listing) and connect with trusted sitters today.
    `,
  },
  'paid-vs-free-sits': {
    title: 'Paid Sits vs. Free Sits: Which Is Right for You?',
    excerpt: 'Haven offers both free and paid house sitting opportunities. We break down the pros, cons, and when each makes sense.',
    category: 'Sitters',
    date: 'February 28, 2026',
    readTime: '4 min read',
    emoji: '💰',
    content: `
Haven is one of the only house sitting platforms that supports both free and paid sits. Here's how to think about which type is right for you.

## Free sits

**What they are:** You sit for free in exchange for free accommodation. No money changes hands.

**Best for:**
- Sitters who want to travel cheaply and experience new places
- Owners who want dedicated, long-term care for their pets
- Sits in desirable locations where demand from sitters is high

**The trade-off:** Free sits are popular, which means more competition. Your profile and application need to stand out.

## Paid sits

**What they are:** The owner pays you a daily rate (set by them) for your time and care. You still get free accommodation on top of the payment.

**Best for:**
- Professional sitters who treat it as part-time income
- Owners with complex care needs (multiple pets, medical requirements, long durations)
- Sits that require significant work or expertise

**The trade-off:** Paid sits are less common and owners expect higher standards. Reviews and experience matter more.

## Haven's platform fee

When money is involved, Haven charges an 8% platform fee on paid transactions. This covers secure payments, dispute resolution, and sitter/owner protection.

## Which should you post as an owner?

If you have a single easy-to-care-for pet and a desirable location, a free sit will attract plenty of great applicants. If you have multiple pets, special needs animals, or you're simply away for a long time, a paid sit will attract more experienced, professional sitters.

## Which should you apply for as a sitter?

If you're new and building your profile, free sits are a great way to collect reviews. Once you have 3–5 strong reviews, you can start applying for paid sits and command a competitive daily rate.

---

[Browse available sits](/search) — filter by free or paid to find what works for you.
    `,
  },
  'build-a-great-sitter-profile': {
    title: 'How to Build a Sitter Profile That Gets Accepted',
    excerpt: 'Your profile is your first impression. Learn what pet owners actually look for when choosing a house sitter.',
    category: 'Sitters',
    date: 'February 24, 2026',
    readTime: '5 min read',
    emoji: '⭐',
    content: `
Your Haven profile is doing a lot of work: it needs to build trust, show personality, and answer the questions owners are already asking before they even message you. Here's how to make it count.

## Use a real, friendly photo

Owners want to see your face. A clear, smiling headshot — or a photo of you with a dog — makes a huge difference. Avoid sunglasses, group shots, or blurry photos.

## Write a bio that sounds like you

Don't write a resume. Write like you're introducing yourself to a neighbour. Mention why you love house sitting, what kinds of animals you've cared for, and anything that makes you memorable.

**Weak:** *"I am a responsible person who loves animals and will take great care of your home."*

**Strong:** *"I've been sitting for three years — mostly dogs, two stints with cats, and one memorable week with a very opinionated parrot. I work remotely, so your pet won't be home alone. I send daily photo updates without being asked."*

## List your real experience

Be specific. "I cared for a 12-year-old border collie named Biscuit who needed twice-daily medication" is more convincing than "I'm experienced with dogs." If you're a first-timer, say so honestly and emphasise why you're still a great choice.

## Get verified

A verified ID badge and background check build trust instantly. Owners shortlist verified sitters first in competitive sits.

## Collect your first reviews strategically

Before applying on Haven, ask previous pet-sitting clients (friends, family, neighbours) if they'd write you a reference. Even informal experience counts when it's documented.

## Apply with custom messages

The owners who get the best sitters write tailored listings. The sitters who get the best sits write tailored applications. Reference specific details from the listing. Show you actually read it.

---

[Complete your profile](/profile) — it takes 10 minutes and makes all the difference.
    `,
  },
  'house-sitting-packing-list': {
    title: 'The Ultimate House Sitting Packing List',
    excerpt: 'From emergency vet numbers to pet food storage — everything you should bring (and ask about) before your sit begins.',
    category: 'Tips & Tricks',
    date: 'February 20, 2026',
    readTime: '4 min read',
    emoji: '🎒',
    content: `
Good house sitting is 80% preparation. Getting these details sorted before you arrive means you can focus on what matters: keeping the home and animals in great shape.

## Before you arrive — information to get from the owner

- [ ] Vet's name, address, and phone number
- [ ] Emergency vet (out-of-hours)
- [ ] Pet insurance details (if applicable)
- [ ] Feeding schedule and portion sizes
- [ ] Medication instructions (if needed)
- [ ] Any pet behaviours to watch for (allergies, anxieties, escape routes)
- [ ] Bin collection day and recycling instructions
- [ ] Alarm code and how to use it
- [ ] Nearest supermarket / pharmacy
- [ ] Neighbour contact in case of emergency
- [ ] Wi-Fi password
- [ ] Any appliances that need explaining (boiler, heating, locks)

## What to pack

**Documents & essentials**
- Printed copy of the owner's instructions
- Your ID
- Travel insurance details

**For the pets**
- Familiar treats (ask if it's okay to bring some)
- A spare lead/harness in case theirs breaks
- Small first aid items (ask the owner what they keep on hand)

**For yourself**
- A small toolkit (screwdriver, plasters) — you'd be surprised
- Earplugs if you're a light sleeper and the pet snores

## Day-one checklist

When you arrive, do a full walkthrough with the owner present:

- [ ] Confirm all pet routines and feeding locations
- [ ] Test the alarm and all door locks
- [ ] Locate the fuse box
- [ ] Check smoke alarm batteries
- [ ] Take photos of the home's condition on arrival (protects you both)
- [ ] Agree on your check-in communication schedule

## Red flags to address before the owner leaves

- Pets with unclear medical histories
- Instructions that seem incomplete or rushed
- Anything that feels off — trust your gut and ask

---

A thorough handover is good for everyone. Owners who prepare well attract sitters who are thorough. [Post your sit on Haven](/create-listing) with all the details.
    `,
  },
  'haven-vs-trustedhousesitters': {
    title: 'Haven vs. TrustedHouseSitters: What\'s Different?',
    excerpt: 'We\'re a new kind of house sitting platform. Here\'s what makes Haven unique — and why sitters and owners are making the switch.',
    category: 'About Haven',
    date: 'February 15, 2026',
    readTime: '3 min read',
    emoji: '🌿',
    content: `
TrustedHouseSitters has been around since 2010. It's a well-known platform. But a lot has changed in house sitting — and Haven was built to address the gaps.

## What's the same

Both platforms connect pet owners with house sitters. Both use reviews and profiles to build trust. Both serve sitters who want free accommodation while caring for animals.

## What Haven does differently

**Paid sits alongside free sits**

TrustedHouseSitters is free-sits-only. Haven supports both. If you're an experienced sitter who wants to earn money, or an owner who needs a professional for complex pet care, Haven is the only platform built for that.

**No listings that go dark**

One of the biggest frustrations on other platforms: you apply to a listing, never hear back, and the listing stays up forever. Haven has response nudges and listing hygiene built in — owners are prompted to respond to applications within a set window.

**Cleaner pricing**

TrustedHouseSitters charges both sitters and owners separately. Haven charges owners a single membership and keeps sitter access free or low-cost, making it easier for new sitters to build their profile without a big upfront commitment.

**Mobile-first**

Haven is built as a real iOS and Android app, not just a responsive website. Messaging, applications, and notifications all work natively on your phone.

**A newer community**

Haven is growing — which means less competition for early sitters and more visibility for early listings. Being an early adopter has real advantages.

## Who Haven is best for

- Sitters who want both free and paid opportunities
- Owners with pets who need more than basic care
- Anyone frustrated by the limitations of older platforms
- People who prefer a clean, modern app experience

---

[Join Haven free](/signup) — your first 3 months of Premium are on us.
    `,
  },
}

/** Post metadata in publication order — everything a listing needs, no bodies. */
export const postList: PostMeta[] = Object.entries(posts).map(
  ([slug, { content, ...meta }]) => ({ slug, ...meta })
)

/** Filter chips for the index, derived so they can't drift from the posts. */
// Deduped by first appearance rather than a Set — tsconfig sets no `target`,
// so it defaults to ES5 and spreading a Set would need downlevelIteration.
export const categories: string[] = [
  'All',
  ...postList.map((p) => p.category).filter((c, i, all) => all.indexOf(c) === i),
]
