const mongoose = require('mongoose')
const { Schema, model } = mongoose

const Director = new Schema({
  name: String,
  age: Number
})

module.exports = model('Director', Director)