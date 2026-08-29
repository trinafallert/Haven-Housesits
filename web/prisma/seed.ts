import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Haven database...')

  // Clean
  await prisma.review.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.savedListing.deleteMany()
  await prisma.message.deleteMany()
  await prisma.conversationParticipant.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.application.deleteMany()
  await prisma.pet.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.user.deleteMany()

  const pw = await bcrypt.hash('Haven2026!', 12)

  const users = await Promise.all([
    prisma.user.create({ data: {
      email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Mitchell', password: pw,
      city: 'Sydney', state: 'NSW', country: 'Australia',
      bio: "Cat lover and digital nomad. I've been housesitting for 3 years across 12 countries.",
      tagline: 'Experienced sitter with a passion for pets',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      membershipPlan: 'PREMIUM', role: 'BOTH', idVerified: true,
      backgroundCheckStatus: 'VERIFIED', averageRating: 4.9, totalSits: 24, totalReviews: 18,
    }}),
    prisma.user.create({ data: {
      email: 'marco@example.com', firstName: 'Marco', lastName: 'Rivera', password: pw,
      city: 'Barcelona', country: 'Spain',
      bio: 'Full-time traveler who funds adventures through housesitting.',
      tagline: 'Your home is in safe hands',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      membershipPlan: 'STANDARD', role: 'SITTER', idVerified: true,
      backgroundCheckStatus: 'VERIFIED', averageRating: 4.8, totalSits: 15, totalReviews: 12,
    }}),
    prisma.user.create({ data: {
      email: 'priya@example.com', firstName: 'Priya', lastName: 'Nair', password: pw,
      city: 'London', country: 'United Kingdom',
      bio: 'Veterinary nurse turned housesitter.',
      tagline: 'Professional pet care meets housesitting',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      membershipPlan: 'PREMIUM', role: 'BOTH', idVerified: true,
      backgroundCheckStatus: 'VERIFIED', averageRating: 5.0, totalSits: 31, totalReviews: 28,
    }}),
    prisma.user.create({ data: {
      email: 'james@example.com', firstName: 'James', lastName: 'Chen', password: pw,
      city: 'Vancouver', country: 'Canada',
      bio: 'Retired teacher who loves pets and exploring new cities.',
      tagline: 'Reliable and experienced',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      membershipPlan: 'STANDARD', role: 'OWNER', idVerified: true,
      averageRating: 4.7, totalSits: 8, totalReviews: 6,
    }}),
    prisma.user.create({ data: {
      email: 'emma@example.com', firstName: 'Emma', lastName: 'Taylor', password: pw,
      city: 'Austin', state: 'TX', country: 'United States',
      bio: 'Couple who loves animals. We work remotely.',
      tagline: 'Couple sitters, double the love',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      membershipPlan: 'PREMIUM', role: 'BOTH', idVerified: true,
      backgroundCheckStatus: 'VERIFIED', averageRating: 4.9, totalSits: 19, totalReviews: 16,
    }}),
    prisma.user.create({ data: {
      email: 'trina@havensits.com', firstName: 'Trina', lastName: 'Fallert', password: pw,
      city: 'San Francisco', state: 'CA', country: 'United States',
      bio: 'Founder of Haven Housesits.',
      tagline: 'Making housesitting better',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      membershipPlan: 'PREMIUM', role: 'BOTH', idVerified: true,
      backgroundCheckStatus: 'VERIFIED', averageRating: 5.0, totalSits: 5, totalReviews: 5,
    }}),
  ])

  const [sarah, marco, priya, james, emma, trina] = users
  console.log(`✅ ${users.length} users`)

  // Helper to create listing + pets
  async function mkListing(data: any, pets: any[]) {
    return prisma.listing.create({
      data: { ...data, pets: { create: pets } },
    })
  }

  const listings = await Promise.all([
    mkListing({
      title: 'Cozy apartment with 2 cats in central Sydney',
      description: 'Beautiful 2-bed in Surry Hills. Our ragdoll cats Luna and Mochi are friendly and independent. Close to cafes, parks, public transport.',
      address: 'Surry Hills', city: 'Sydney', country: 'Australia', lat: -33.88, lng: 151.21,
      startDate: new Date('2026-04-01'), endDate: new Date('2026-04-15'),
      type: 'FREE', status: 'ACTIVE', ownerId: sarah.id,
      photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600'],
    }, [{ type: 'CAT', name: 'Luna', breed: 'Ragdoll', age: 3 }, { type: 'CAT', name: 'Mochi', breed: 'Ragdoll', age: 2 }]),

    mkListing({
      title: 'Beachfront villa with golden retriever in Barcelona',
      description: 'Stunning 3-bed villa overlooking the Mediterranean. Golden retriever Max loves beach walks. Pool, garden.',
      address: 'Barceloneta', city: 'Barcelona', country: 'Spain', lat: 41.39, lng: 2.17,
      startDate: new Date('2026-04-10'), endDate: new Date('2026-05-10'),
      type: 'FREE', status: 'ACTIVE', ownerId: marco.id,
      photos: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600'],
    }, [{ type: 'DOG', name: 'Max', breed: 'Golden Retriever', age: 4 }]),

    mkListing({
      title: 'Victorian townhouse with 3 cats in Notting Hill',
      description: 'Charming Victorian in Notting Hill. Three rescue cats, lovely garden, Portobello market nearby.',
      address: 'Notting Hill', city: 'London', country: 'United Kingdom', lat: 51.52, lng: -0.20,
      startDate: new Date('2026-05-01'), endDate: new Date('2026-05-21'),
      type: 'FREE', status: 'ACTIVE', ownerId: priya.id,
      photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600'],
    }, [{ type: 'CAT', name: 'Whiskers', breed: 'Tabby', age: 5 }, { type: 'CAT', name: 'Shadow', breed: 'Black shorthair', age: 3 }, { type: 'CAT', name: 'Ginger', breed: 'Orange tabby', age: 7 }]),

    mkListing({
      title: '💰 Mountain cabin with 2 huskies — $45/night',
      description: 'Beautiful log cabin in Whistler with 2 huskies. Daily hikes required. Fireplace, mountain views.',
      address: 'Whistler Village', city: 'Whistler', country: 'Canada', lat: 50.12, lng: -122.95,
      startDate: new Date('2026-04-15'), endDate: new Date('2026-05-15'),
      type: 'PAID', isPaid: true, price: 45, status: 'ACTIVE', ownerId: james.id,
      photos: ['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600'],
    }, [{ type: 'DOG', name: 'Storm', breed: 'Husky', age: 3 }, { type: 'DOG', name: 'Blizzard', breed: 'Husky', age: 5 }]),

    mkListing({
      title: 'Modern loft with French bulldog in Austin',
      description: "Trendy loft in East Austin. Frenchie Biscuit is a couch potato. Walk him twice a day. Great neighborhood.",
      address: 'East Austin', city: 'Austin', state: 'TX', country: 'United States', lat: 30.27, lng: -97.74,
      startDate: new Date('2026-04-05'), endDate: new Date('2026-04-20'),
      type: 'FREE', status: 'ACTIVE', ownerId: emma.id,
      photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600'],
    }, [{ type: 'DOG', name: 'Biscuit', breed: 'French Bulldog', age: 2 }]),

    mkListing({
      title: '💰 Luxury penthouse with 2 Persian cats — $60/night',
      description: 'Stunning penthouse with panoramic SF views. Two pampered Persians. Doorman, gym, rooftop pool.',
      address: 'SOMA', city: 'San Francisco', state: 'CA', country: 'United States', lat: 37.77, lng: -122.42,
      startDate: new Date('2026-04-20'), endDate: new Date('2026-05-20'),
      type: 'PAID', isPaid: true, price: 60, status: 'ACTIVE', ownerId: trina.id,
      photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600', 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600'],
    }, [{ type: 'CAT', name: 'Cleo', breed: 'Persian', age: 4 }, { type: 'CAT', name: 'Pharaoh', breed: 'Persian', age: 6 }]),

    mkListing({
      title: 'Farmhouse with dogs & a goat in Tuscany',
      description: 'Authentic Italian farmhouse. Two border collies and a friendly goat named Luigi. Olive groves.',
      address: 'Chianti', city: 'Florence', country: 'Italy', lat: 43.77, lng: 11.25,
      startDate: new Date('2026-06-01'), endDate: new Date('2026-07-01'),
      type: 'FREE', status: 'ACTIVE', ownerId: sarah.id,
      photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'],
    }, [{ type: 'DOG', name: 'Bella', breed: 'Border Collie', age: 4 }, { type: 'DOG', name: 'Rocco', breed: 'Border Collie', age: 6 }]),

    mkListing({
      title: 'Tropical house with cockatoo in Bali',
      description: "Open-plan tropical house with pool in Ubud. Cockatoo Sunny says 'good morning' and dances to music.",
      address: 'Ubud Center', city: 'Ubud', country: 'Indonesia', lat: -8.51, lng: 115.27,
      startDate: new Date('2026-05-10'), endDate: new Date('2026-06-10'),
      type: 'FREE', status: 'ACTIVE', ownerId: marco.id,
      photos: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600'],
    }, [{ type: 'BIRD', name: 'Sunny', breed: 'Cockatoo', age: 8 }]),

    mkListing({
      title: '💰 NYC apartment with 2 rescue dogs — $55/night',
      description: 'Spacious Brooklyn Heights 2-bed. Two rescue mutts who love park walks. Coffee shops, subway nearby.',
      address: 'Brooklyn Heights', city: 'New York', state: 'NY', country: 'United States', lat: 40.70, lng: -73.99,
      startDate: new Date('2026-04-15'), endDate: new Date('2026-05-05'),
      type: 'PAID', isPaid: true, price: 55, status: 'ACTIVE', ownerId: james.id,
      photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'],
    }, [{ type: 'DOG', name: 'Patches', breed: 'Mixed breed', age: 4 }, { type: 'DOG', name: 'Buddy', breed: 'Labrador mix', age: 6 }]),

    mkListing({
      title: 'Countryside cottage with rabbits in Cotswolds',
      description: 'Idyllic stone cottage with a garden full of rabbits. Perfect for writers and walkers.',
      address: 'Cotswolds', city: 'Cotswolds', country: 'United Kingdom', lat: 51.83, lng: -1.68,
      startDate: new Date('2026-05-15'), endDate: new Date('2026-06-15'),
      type: 'FREE', status: 'ACTIVE', ownerId: priya.id,
      photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'],
    }, []),

    mkListing({
      title: 'Long-term: Beach house with lab in Gold Coast',
      description: '3 months on the Gold Coast! Our chocolate lab needs someone who loves the beach.',
      address: 'Surfers Paradise', city: 'Gold Coast', country: 'Australia', lat: -28.02, lng: 153.43,
      startDate: new Date('2026-06-01'), endDate: new Date('2026-09-01'),
      type: 'LONG_TERM', status: 'ACTIVE', ownerId: sarah.id,
      photos: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600'],
    }, [{ type: 'DOG', name: 'Sandy', breed: 'Chocolate Labrador', age: 3 }]),

    mkListing({
      title: 'Vacant home — no pets, Portland hills',
      description: 'Beautiful home in West Hills. No pets — just water plants, collect mail, keep the house lived-in.',
      address: 'West Hills', city: 'Portland', state: 'OR', country: 'United States', lat: 45.52, lng: -122.68,
      startDate: new Date('2026-04-20'), endDate: new Date('2026-05-10'),
      type: 'VACANT', status: 'ACTIVE', ownerId: emma.id,
      photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'],
    }, []),
  ])
  console.log(`✅ ${listings.length} listings`)

  // Applications
  await prisma.application.create({ data: {
    listing: { connect: { id: listings[0].id } },
    sitter: { connect: { id: marco.id } },
    message: "Hi Sarah! I'd love to look after Luna and Mochi. I've had ragdoll cats before!",
    status: 'PENDING',
  }})
  await prisma.application.create({ data: {
    listing: { connect: { id: listings[2].id } },
    sitter: { connect: { id: emma.id } },
    message: "We'd love to stay in Notting Hill and look after your cats! References available.",
    status: 'ACCEPTED',
  }})
  console.log('✅ Applications')

  // Conversations
  const convo = await prisma.conversation.create({ data: {} })
  await prisma.conversationParticipant.createMany({ data: [
    { conversationId: convo.id, userId: sarah.id },
    { conversationId: convo.id, userId: marco.id },
  ]})
  await prisma.message.createMany({ data: [
    { conversationId: convo.id, senderId: marco.id, content: "Hi Sarah! I applied for your Sydney sit. Super excited! 🐱", createdAt: new Date('2026-03-07T10:00:00Z') },
    { conversationId: convo.id, senderId: sarah.id, content: "Hey Marco! Your profile looks great. The cats will love you!", createdAt: new Date('2026-03-07T10:05:00Z') },
    { conversationId: convo.id, senderId: marco.id, content: "I have experience with ragdolls — they're the sweetest. Would love to video call!", createdAt: new Date('2026-03-07T10:10:00Z') },
  ]})
  console.log('✅ Conversations')

  // Reviews
  await prisma.review.createMany({ data: [
    { reviewerId: sarah.id, revieweeId: marco.id, rating: 5, comment: "Marco was incredible. Cats adored him! Apartment spotless.", listingId: listings[1].id },
    { reviewerId: marco.id, revieweeId: sarah.id, rating: 5, comment: "Amazing host! Apartment as described. Would sit again.", listingId: listings[0].id },
    { reviewerId: priya.id, revieweeId: emma.id, rating: 5, comment: "Emma was wonderful. All three cats happy and healthy.", listingId: listings[2].id },
  ]})
  console.log('✅ Reviews')

  // Notifications
  await prisma.notification.createMany({ data: [
    { userId: sarah.id, type: 'NEW_APPLICATION', title: 'New application!', body: 'Marco Rivera applied for your Sydney sit' },
    { userId: sarah.id, type: 'NEW_MESSAGE', title: 'New message', body: 'Marco sent you a message' },
    { userId: marco.id, type: 'REVIEW_RECEIVED', title: 'New review!', body: 'Sarah left you a 5-star review ⭐', isRead: true },
    { userId: emma.id, type: 'APPLICATION_ACCEPTED', title: 'Application accepted!', body: 'Priya accepted your London sit application' },
  ]})
  console.log('✅ Notifications')

  console.log('\n🎉 Seed complete! Login: any email + Haven2026!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
