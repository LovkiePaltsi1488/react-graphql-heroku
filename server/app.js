const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')
const graphHttp = require('express-graphql')
const cors = require('cors')

const schema = require('../schemas/schema')

const url = `mongodb+srv://${config.get('user')}:${config.get('password')}@cluster0-nkstn.mongodb.net/cinema?retryWrites=true&w=majority`
const mongoOptions = config.get('mongoOptions')

const PORT = process.env.PORT || 5624
const app = express()

const violet = chalk.rgb(93, 95, 255)

app.use(cors())
app.use('/graphql', graphHttp({
  schema,
  graphiql: true
}))

mongoose.connect(url, mongoOptions).then(() => console.log(`Mongoose have been started...`)).then(() => {
  app.listen(PORT, () => {
    console.log(violet(`Server has been started on port `) + chalk.redBright(`${PORT}...`))
  })
}).catch(err => console.log(chalk.red(err)))