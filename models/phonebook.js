// if (process.argv.length < 3) {
    //   console.log('give password as argument')
    //   process.exit(1)
    // }

require('dotenv').config()
const mongoose = require("mongoose");

    
    //const password = process.argv[2]
    
    const url = process.env.MONGODB_URI
    
    
    //console.log(url);
    
    
    mongoose.set('strictQuery', false)
    
    mongoose.connect(url).then(response => {
      console.log('Connection to MongoDB successful');
      
    }).catch(error => {
      console.log('Error conntecting to MongoDB', error.message);
      
    })
    
    const phonebookSchema = new mongoose.Schema({
      name: {
        type: String,
        minLength: 3
      },
      number: {
        type: String,
        minLength: 8,
        validate: {
          validator: function (v) {
            return /\d{2}-\d{7}|\d{3}-\d{8}/.test(v)
          },
          message: props => `${props.value} is not valid phone number`
        },
        required: [true, 'user phone number required']
      }
    })
    
    //const Phonebook = mongoose.model('Phonebook', phonebookSchema)

    phonebookSchema.set('toJSON', {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
    })

    module.exports = mongoose.model('Phonebook', phonebookSchema)