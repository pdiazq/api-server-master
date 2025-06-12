const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;

// ❗ Sin puerto porque es SRV
const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI);
    this.dbName = DB_NAME;
  }

  async connect() {
    if (!this.client.isConnected?.()) {
      try {
        await this.client.connect();
        console.log('✅ Connected successfully to MongoDB');
      } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err);
        throw err;
      }
    }
    return this.client.db(this.dbName);
  }

  getAll(collection, query) {
    return this.connect().then(db => db.collection(collection).find(query).toArray());
  }

  getAllFilter(collection, query) {
    let key = Object.keys(query);
    let value = Object.values(query).toString();
    return this.connect().then(db => {
      if (key.toString() === 'year') {
        return db.collection(collection).find(query).toArray();
      } else {
        return db.collection(collection).find({ [key]: new RegExp(value, 'i') }).toArray();
      }
    });
  }

  get(collection, id) {
    return this.connect().then(db => db.collection(collection).findOne({ _id: ObjectId(id) }));
  }

  create(collection, data) {
    return this.connect()
      .then(db => db.collection(collection).insertOne(data))
      .then(result => result.insertedId);
  }

  update(collection, id, data) {
    return this.connect()
      .then(db =>
        db.collection(collection).updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true })
      )
      .then(result => result.upsertedId || id);
  }

  insert(collection, id, data) {
    return this.connect()
      .then(db =>
        db.collection(collection).updateOne({ _id: ObjectId(id) }, { $addToSet: data })
      )
      .then(result => result.upsertedId || id);
  }

  outsert(collection, id, data) {
    return this.connect()
      .then(db =>
        db.collection(collection).updateOne({ _id: ObjectId(id) }, { $pull: data })
      )
      .then(result => result.upsertedId || id);
  }

  delete(collection, id) {
    return this.connect()
      .then(db => db.collection(collection).deleteOne({ _id: ObjectId(id) }))
      .then(() => id);
  }
}

module.exports = MongoLib;