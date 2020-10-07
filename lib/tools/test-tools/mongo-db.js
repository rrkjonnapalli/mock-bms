const config = require('config');
const mongoose = require('mongoose');
const { Mongodb } = require('root/db');
const { Logger } = require('root/utils');

const logger = Logger.child({ service: 'TST_MNGDB_TL' });

module.exports = class TestMongoDb extends Mongodb {
  static async connect() {
    const options = { dbName: config.MONGO_TEST_DATABASE, autoIndex: true };
    return super.connect(options);
  }

  static async clear() {
    return mongoose.connection.db
      .listCollections()
      .toArray()
      .then((collections) => {
        const names = collections.map((c) => c.name);
        const actions = names.map((name) => {
          logger.debug('Clearing collection %s', name);
          return mongoose.connection.db.collection(name).drop({});
        });
        return Promise.all(actions)
          .then(() => ({ ok: true }))
          .catch((error) => ({ ok: false, error }));
      });
  }
};
