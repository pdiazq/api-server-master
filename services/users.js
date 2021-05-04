const MongoLib = require('../lib/mongo');
const bcrypt = require('bcryptjs');

class UsersService {
  constructor() {
    this.collection = 'users';
    this.mongoDB = new MongoLib();
  }

  async getUser({ email }) {
    console.log (`prestando servicio de traida de datos`)
    const [user] = await this.mongoDB.getAll(this.collection, { email });
    return user;
  }

  async getUserInfo(  {userId} ) {
    console.log (`prestando servicio de traida de datos ${JSON.stringify( userId )}`)
    const user = await this.mongoDB.get(this.collection,  userId  );
    return user;
  }
  
  async insertUserMovies({ userId, movies } = {}) {
    console.log (`Servicio de actualizado de usuario (((((((((((((()))))))))))))) ${userId}, ${movies}`)
    const updatedMovieId = await this.mongoDB.insert(
      this.collection,
      userId,
      movies
    );
    return updatedMovieId;
  }

  async deleteUserMovies({ userId, movies } = {}) {
    console.log (`Servicio de bortrado depeli (((((((((((((()))))))))))))) ${userId}, ${movies}`)
    const deletedMovieId = await this.mongoDB.outsert(
      this.collection,
      userId,
      movies
    );
    return deletedMovieId;
  }


  async createUser({ user }) {
    const { name, email, password, movies } = user;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserId = await this.mongoDB.create(this.collection, {
      name,
      email,
      password: hashedPassword,
      movies
    });

    return createUserId;
  }
}

module.exports = UsersService;