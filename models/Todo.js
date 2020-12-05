const { Schema, model } = require('mongoose')

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  visits:{
    type: Array
  },
  completed: {
    type: Boolean,
    default: false
  }
})

module.exports = model('Todo', schema)
