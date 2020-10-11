const graphql = require("graphql")

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = graphql

const Movie = require('../models/Movie')
const Director = require('../models/Director')

/* 
  query($id: ID) {
    movie(id: $id) {
      name,
      id,
      genre
    }
  }
*/

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLID },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    rate: { type: GraphQLInt },
    watched: { type: new GraphQLNonNull(GraphQLBoolean) },
    director: {
      type: DirectorType,
      resolve({ directorId }, { }) {
        return Director.findById(directorId)
      }
    }
  })
})

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLID },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve({ id }, { }) {
        return Movie.find({ directorId: id })
      }
    }
  })
})
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, { name, age}) {
        const director = new Director({
          name,
          age
        })
        return director.save()
      }
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLString },
        rate: { type: GraphQLInt },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) }
      },
      resolve(parent, { name, genre, directorId, rate, watched }) {
        const movie = new Movie({
          name,
          genre,
          directorId,
          rate,
          watched
        })
        return movie.save()
      }
    },
    removeDirector: {
      type: DirectorType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, { id }) {
        return Director.findByIdAndRemove(id)
      }
    },
    removeMovie: {
      type: MovieType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, { id }) {
        return Movie.findByIdAndRemove(id)
      }
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, { id, name, age}) {
        return Director.findByIdAndUpdate(
          id, {
            $set: {
              name,
              age
            }
          },
          { new: true }
        )
      }
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLID },
        rate: { type: GraphQLInt },
        watched: { type: new GraphQLNonNull(GraphQLBoolean) }
      },
      resolve(parent, { id, name, genre, directorId, rate, watched  }) {
        return Movie.findByIdAndUpdate(
          id, {
            $set: {
              name,
              genre,
              directorId,
              rate,
              watched
            }
          },
          { new: true }
        )
      }
    },
    updateDataMovies : {
      type: new GraphQLList(MovieType),
      args: { yn: { type: new GraphQLList(GraphQLID) } },
      resolve(parent, { yn }) {
        return yn.map((id, index) => {
          return Movie.findByIdAndUpdate(
            id, {
              $set: {
                watched: index % 2 === 0,
                rate: Math.floor(Math.random() * 10 + 1)
              }
            },
            { new: true }
          )
        })
      }
    }
  }
})

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Movie.findById(id)
      }
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Director.findById(id)
      }
    },
    movies: {
      type: GraphQLList(MovieType),
      args: { name: { type: GraphQLString } },
      resolve(parent, { name }) {
        return Movie.find({name: { $regex: name, $options: "i" }})
      }
    },
    directors: {
      type: GraphQLList(DirectorType),
      args: { name: { type: GraphQLString } },
      resolve(parent, { name }) {
        return Director.find({name: { $regex: name, $options: "i" }})
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})