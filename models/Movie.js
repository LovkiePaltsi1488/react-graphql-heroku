const mongoose = require('mongoose')
const { Schema, model } = mongoose

const Movie = new Schema({
  name: String,
  genre: String,
  directorId: String,
  rate: Number,
  watched: Boolean
})

module.exports = model('Movie', Movie)