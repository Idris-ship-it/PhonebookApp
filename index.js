const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
const Phonebook = require('./models/phonebook')
const phonebook = require('./models/phonebook')


morgan.token('body', (request, response) => JSON.stringify(request.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = [

  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },

]

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(contacts => {
    response.json(contacts)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then(person => {
      response.json(person)
    }).catch(error => next(error))
})

app.get('/api/info', (request, response) => {
  console.log(Phonebook.collection.length);

  Phonebook.countDocuments({})
    .then(totalPersons => {
      response.send(`<p> There are ${totalPersons} contacts in the phonebook </p><br />
      <p>${new Date()}</p>`)
    }).catch(error => next(error))
})


// app.delete('/api/persons/:id', (request, response) => {
//     persons = persons.filter(person => person.id !== request.params.id)
//     response.status(204).end()
// })

// app.post('/api/persons', (request, response) => {
//     const body = request.body

//     const randomId = Math.floor(Math.random() * 1000)

//     const found = persons.find(person => body.name === person.name)
//     if (!body.name || !body.number || found) {
//         return response.status(400).json({
//             error: 'Name must be unique and must not be empty'
//         })

//     }

//     const person = {
//         "id" : randomId,
//         "name" : body.name,
//         "number" : body.number,
//     }

//    persons = persons.concat(person)
//    response.json(person)


// })

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then(deletedPerson => {
      response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons/', (request, response, next) => {

  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = Phonebook({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    }).catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Phonebook.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: query })

    .then(result => {
      response.json(result)
    }).catch(error => {
      console.log(error.name);
      
    })
})


const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(404).send({ error: 'Unknown ID' })
  } else if (error.name === 'ValidationError') {
    return response.status(404).json({ error: error.message })
  }

  //next(error)

}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})