// Lógica de negocios real

const MongoLib = require('../lib/mongo');

class MoviesService {
  constructor() {
    this.collection = 'movies';
    this.mongoDB = new MongoLib();
  }

  // Agregar comentarios a movies
  async insertComment({ movieId, comment } = {}) {
    const insertComment = await this.mongoDB.insert(
      this.collection,
      movieId,
      comment
    );
    return insertComment;
  }


  async getMoviesFilter( {body} ) {
    console.log (`SERVICIOS EN GET MOVIES ${JSON.stringify(body)}`)
    const movies = await this.mongoDB.getAllFilter(this.collection, body);
    return movies || [];
  }


  async getMovies( {body} ) {
    console.log (`SERVICIOS EN GET MOVIES ${JSON.stringify(body)}`)
    const movies = await this.mongoDB.getAll(this.collection, body);
    return movies || [];
  }


  async getMovie({ movieId }) {
    const movie = await this.mongoDB.get(this.collection, movieId);
    return movie || {};
  }

  async createMovie({ movie }) {
    const createMovieId = await this.mongoDB.create(this.collection, movie);
    return createMovieId;
  }
// Como ejemplo
  async updateMovie({ movieId, movie } = {}) {
    const updatedMovieId = await this.mongoDB.update(
      this.collection,
      movieId,
      movie
    );
    return updatedMovieId;
  }

  async deleteMovie({ movieId }) {
    const deletedMovieId = await this.mongoDB.delete(this.collection, movieId);
    return deletedMovieId;
  }
}

module.exports = MoviesService;
