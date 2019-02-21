const authors = require('./randomAuthor.js')
const words = require('./randomWord.js')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const LOOPTIME = 10000
const NS_PER_SEC = 1e9

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)]
}

function getRandomName () {
  return authors.sample().concat(' ', authors.sample())
}

function getRandomBook () {
  return words.sample().concat(' ', words.sample(), ' ', words.sample())
}

async function dbSeed (data, collectionName, mode = 'one', indexOptions = {}) {
  if (!data) return console.log('Error: Nothing to seed')
  if (!collectionName) return console.log('Error: Dont know which collection to seed')
  const url = 'mongodb://localhost:27017'
  const dbName = 'mongoo'
  const client = new MongoClient(url, { useNewUrlParser: true })
  try {
    await client.connect()
    console.log('Connect to server correctly')
    const t1 = process.hrtime()
    const db = client.db(dbName)
    if (mode !== 'one') {
      await db.collection(collectionName).insertMany(data)
      // assert.strict.equal(data.length, r.insertedCount)
    } else {
      await db.collection(collectionName).insertOne(data)
      // assert.strict.equal(1, r.insertedCount)
    }
    if (Object.getOwnPropertyNames(indexOptions).length > 0) {
      await db.collection(collectionName).createIndex(indexOptions, (err, result) => {
        if (err) console.log(err)
        console.log(result)
      })
    }
    const diff = process.hrtime(t1)
    console.log('----------------------------------------------------------------------------\n', 'Taken ', diff[0] * NS_PER_SEC + diff[1], 'ns')
    client.close()
    console.log('Seeding completed')
  } catch (err) {
    console.log(err.stack)
  }
}

async function seedOperation () {
  const data = []
  for (let i = 0; i < LOOPTIME; i++) {
    data.push({ title: getRandomBook(), author: getRandomName() })
  }
  // await dbSeed(data, 'bookI', 'many', { title: 1 }) // Single field Index
  // await dbSeed(data, 'bookI, 'many', { title: 'text' }) // Text field Index
  await dbSeed(data, 'book', 'many')
}

async function main () {
  seedOperation()
}

main()
