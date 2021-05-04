const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
    this.dbName = DB_NAME;
  }

  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect(err => {
          if (err) {
            reject(err);
          }

          console.log('Connected succesfully to mongo');
          resolve(this.client.db(this.dbName));
        });
      });
    }

    return MongoLib.connection;
  }

  getAll(collection, query) {
    return this.connect().then(db => {
      return db
        .collection(collection)
        .find(query)
        .toArray();
    });
  }
//########################################
  getAll1(collection, query) {
    let key = Object.keys(query)
    let value = Object.values(query).toString()
    // https://stackoverflow.com/questions/26699885/how-can-i-use-a-regex-variable-in-a-query-for-mongodb
    //value = `/^${value}.*/i`
    //let queryO = JSON.stringify(query)
    //query.title = `{ $regex: "${query.title}.*"}`
    console.log (`MONGO LIB ${(key)}`)
    console.log (`MONGO LIB 2 ${value}`)
    const buscar = `{"${key}":{ $regex: "${value}.*"}}`
    console.log (`MONGO LIB 3 ${(buscar)}`)
    //  .find({"title":{ $regex: "Canti.*"}})
    //  .find({"year":{ $in: [1954] }})
    //console.log (`MONGO LIB ${JSON.stringify(query)}`)
    return this.connect().then(db => {
      return db
        .collection(collection)
        .find({[key]: new RegExp(value, 'i')})
        .toArray();
    });
  }


  outsert(collection, id, data) {
    return this.connect()
      .then(db => {
        return db
          .collection(collection)
          .updateOne({ _id: ObjectId(id) }, { $pull:data } );
      })
      .then(result => result.upsertedId || id);
  }

  get(collection, id) {
    return this.connect().then(db => {
      return db.collection(collection).findOne({ _id: ObjectId(id) });
    });
  }

  create(collection, data) {
    return this.connect()
      .then(db => {
        return db.collection(collection).insertOne(data);
      })
      .then(result => result.insertedId);
  }

  update(collection, id, data) {
    return this.connect()
      .then(db => {
        return db
          .collection(collection)
          .updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
      })
      .then(result => result.upsertedId || id);
  }


  insert(collection, id, data) {
    return this.connect()
      .then(db => {
        return db
          .collection(collection)
          .updateOne({ _id: ObjectId(id) }, { $addToSet:data } );
      })
      .then(result => result.upsertedId || id);
  }



  delete(collection, id) {
    return this.connect()
      .then(db => {
        return db.collection(collection).deleteOne({ _id: ObjectId(id) });
      })
      .then(() => id);
  }
}

module.exports = MongoLib;