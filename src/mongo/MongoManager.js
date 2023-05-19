const mongoose = require('mongoose');

class MongoManager {
  constructor() {
    this.mongoUrl = process.env.MONGO_URL;
  }

  getMongoUrl() {
    return this.mongoUrl;
  }

  connect() {
    // mongoose.set('useFindAndModify', false);
    // mongoose.set('useCreateIndex', true);

    // const mongoOptions = {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   poolSize: process.env.MONGO_POOL_SIZE || 200,
    //   socketTimeoutMS: 120000,
    // };
    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 120000,
    };

    return mongoose.connect(this.getMongoUrl(), mongoOptions);
  }

  disconnect() {
    return this.disconnect();
  }
}

const mongoManager = new MongoManager();

module.exports = { mongoManager };
