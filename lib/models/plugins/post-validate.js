const mongoose = require('mongoose');
const { handlePromise, Logger } = require('root/utils');
const { constants } = require('../utils');

const logger = Logger.child({ service: 'JWT_MW' });
logger.trace('Post validate plugin initialized');

module.exports = function postValidator(schema) {
  const { collection } = schema.options;
  async function postValidate(data) {
    const Model = mongoose.model(constants.COLLECTION_MODEL[collection]);
    const User = mongoose.model(constants.MODEL.USER);
    let users = new Set();
    if (data.updatedBy) { users.add(data.updatedBy); }
    if (data.createdBy) { users.add(data.createdBy); }
    users = Array.from(users);
    let { ok, error, result } = await handlePromise(User
      .find({ _id: { $in: users } })
      .select('_id')
      .limit(users.length)
      .lean());
    if (!ok) throw error;
    if (result.length !== users.length) {
      throw new Error('Given user(s) does not found.');
    }
    const indexes = schema.indexes();
    for (const record of indexes) {
      const [keys, options] = record;
      if (options.unique) {
        const fields = Object.keys(keys);
        let isNull = false;
        const query = fields
          .reduce((r, k) => {
            if (!data[k] && !options.sparse) isNull = true;
            return Object.assign(r, { [k]: data[k] });
          }, {});
        if (isNull) {
          throw new Error('Required fields are missing');
        }
        let sparseNull = false;
        for (const f of fields) {
          if (!query[f]) {
            sparseNull = true;
            break;
          }
        }
        if (sparseNull) { continue; }
        // eslint-disable-next-line no-await-in-loop
        ({ ok, error, result } = await handlePromise(
          Model
            .findOne(query)
            .select('_id')
            .lean()
        ));
        if (!ok) throw error;
        if (result) {
          const msgPart = fields.join(', ');
          throw new Error(`Record already exists with ${msgPart}`);
        }
      }
    }
  }
  schema.post('validate', postValidate);
  schema.post('validateSync', postValidate);
};
