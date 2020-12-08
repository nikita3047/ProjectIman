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
  mapClient: {
    type: String
  },
  ratingG:{
    type: Boolean,
    default:true
  },
  
  ratingB:{
    type: Boolean,
    default:false
  },
  ratingVB:{
    type: Boolean,
    default:false
  }
})

module.exports = model('Todo', schema)
