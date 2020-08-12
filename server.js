const faker = require('faker')

const couchbase = require('couchbase')
const cluster = new couchbase.Cluster('couchbase://localhost', { username: "Administrator", password: "password" })
const bucket = cluster.bucket('travel-sample')
const collection = bucket.defaultCollection()

/* Lookups */
const headings = [
  "north", "south", "east", "west", "southeast", "northeast", "north northwest", "south southeast", "east northeast", "west southwest"
]
const directions = [
  "left", "right", "corner", 
]

const hotel_types = [
  "Inn", "Garden", "Resort", "Loft", "Casino"
]

const hotel_postfix = [
  "and Suites", "and Spa", "on the Green", "Bed and Breakfast", "Lakefront", "Oceanside", "on the Block"
]

const random_numbers = [
  12304, 41223, 4142634, 0988700, 471328, 84957, 93726, 04384747, 924347
]

/* Initialize arrays */
const hotels = []

faker.seed(faker.random.number())

for (i = 0; i < 2; i++) {
  hotels.push({
    address: faker.address.streetAddress(),
    alias: faker.lorem.word().charAt(0).toUpperCase(),
    checkin: null,
    checkout: null,
    city: faker.address.city(),
    country: faker.address.country(),
    description: faker.lorem.paragraph(),
    directions: `Head ${headings[Math.floor(Math.random() * headings.length)]} until ${faker.address.streetName()} and turn ${headings[Math.floor(Math.random() * headings.length)]} until you get to ${faker.address.streetName()} and make a right. The hotel is on the ${directions[Math.floor(Math.random() * directions.length)]}`,
    email: faker.internet.email(),
    fax: faker.phone.phoneNumber(),
    free_breakfast: faker.random.boolean(),
    free_internet: faker.random.boolean(),
    free_parking: faker.random.boolean(),
    geo: { accuracy: "ROOFTOP", lat: faker.address.latitude(), lon: faker.address.longitude() },
    id: `5551234${faker.random.number()}0001110${random_numbers[Math.floor(Math.random() * random_numbers.length)]}`,
    name: `${faker.company.companyName()} ${hotel_types[Math.floor(Math.random() * hotel_types.length)]} ${hotel_postfix[Math.floor(Math.random() * hotel_postfix.length)]}`,
    pets_ok: faker.random.boolean(),
    phone: faker.phone.phoneNumber(),
    price: `$${faker.finance.amount()}`,
    public_likes: [
      `${faker.name.firstName()} ${faker.name.lastName()}`,
      `${faker.name.firstName()} ${faker.name.lastName()}`,
    ],
    reviews: [],
    state: faker.address.state(),
    title: null,
    tollfree: faker.phone.phoneNumber(),
    type: "hotel",
    url: faker.internet.url(),
    vacancy: faker.random.boolean()
  })
}

let asyncHotelUpsert = async (promise, hotel) => {
  await promise
  await collection.upsert(`hotel_${hotel.id}`, hotel)
}

async function upsertHotels() {
  await hotels.reduce(asyncHotelUpsert, Promise.resolve())
    .catch(err => console.error(err))
    .then(() => {
      console.log(`Document upsert complete!\n`)
      setTimeout(() => process.exit(22), 1000)
    })
}

upsertHotels()
.catch(e => console.log("~ERROR: " + e))
.then(() => setTimeout(() => process.exit(22), 1000))
