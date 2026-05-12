const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const mongoUser = process.env.MONGODB_USER || 'wmal44884_db_user'
const url = `mongodb+srv://${mongoUser}:${password}@cluster0.bk8rzmr.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // List all entries
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  // Add a new entry
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({ name, number })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Usage: node mongo.js <password> [name] [number]')
  mongoose.connection.close()
}
