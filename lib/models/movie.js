const mongoose = require('mongoose');
const { Logger } = require('root/utils');
const { MongooseBaseMethods, constants } = require('./utils');
const { addOwner } = require('./plugins');

const { MOVIE: MODEL_NAME } = constants.MODEL;

const BaseMethods = MongooseBaseMethods({ MODEL_NAME });

const logger = Logger.child({ service: 'MV_MDL' });
logger.trace('Movie model initialized');

const { Schema } = mongoose;

const MovieSchema = new Schema({
  name: { type: Schema.Types.String },
  duration: { type: Schema.Types.Number, min: 0, required: true }
}, {
  versionKey: false,
  collection: constants.COLLECTION[MODEL_NAME],
  timestamps: true
});

class MovieMethods extends BaseMethods {
}

MovieSchema.plugin(addOwner);

MovieSchema.loadClass(MovieMethods);

const MovieModel = mongoose.model(MODEL_NAME, MovieSchema);

module.exports = MovieModel;
