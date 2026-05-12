const mongoose = require('mongoose')

const mongoUri = process.env.MONGODB_URI
const mongoUser = process.env.MONGODB_USER

if (!mongoUri && process.argv.length < 3) {
  console.log('node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const url = mongoUri || (mongoUser && password
  ? `mongodb+srv://${encodeURIComponent(mongoUser)}:${encodeURIComponent(password)}@cluster0.bk8rzmr.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
  : null)

if (!url) {
  console.log('Set MONGODB_URI, or set MONGODB_USER and pass password as first argument')
  process.exit(1)
}
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if ((mongoUri && process.argv.length === 2) || (!mongoUri && process.argv.length === 3)) {
  // List all entries
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else if ((mongoUri && process.argv.length === 4) || (!mongoUri && process.argv.length === 5)) {
  // Add a new entry
  const name = process.argv[mongoUri ? 2 : 3]
  const number = process.argv[mongoUri ? 3 : 4]

  const person = new Person({ name, number })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Usage: node mongo.js <password> [name] [number]')
  mongoose.connection.close()
}
