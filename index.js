const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (request, response) => JSON.stringify(request.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
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
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    response.send(`<p> Phonebook has info for ${persons.length}</p><br />
<p>${new Date()}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(person => person.id !== request.params.id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const randomId = Math.floor(Math.random() * 1000)

    const found = persons.find(person => body.name === person.name)
    if (!body.name || !body.number || found) {
        return response.status(400).json({
            error: 'Name must be unique and must not be empty'
        })

    }

    const person = {
        "id" : randomId,
        "name" : body.name,
        "number" : body.number,
    }

   persons = persons.concat(person)
   response.json(person)

   
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})