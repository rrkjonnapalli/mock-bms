/** globals isNaN */
const mongoose = require('mongoose');
const { Logger, handlePromise } = require('root/utils');
const { MongooseBaseMethods, constants } = require('./utils');
const { addOwner } = require('./plugins');

const { MODEL: MODEL_NAMES } = constants;
const { SHOW: MODEL_NAME } = MODEL_NAMES;

const BaseMethods = MongooseBaseMethods({ MODEL_NAME });

const logger = Logger.child({ service: 'SHW_MDL' });
logger.trace('Show model initialized');

const { Schema } = mongoose;

const ShowSchema = new Schema({
  screen: { type: Schema.Types.ObjectId, required: true, ref: constants.MODEL.SCREEN },
  movie: { type: Schema.Types.ObjectId, required: true, ref: constants.MODEL.MOVIE },
  startsAt: { type: Schema.Types.Date, required: true },
  endsAt: { type: Schema.Types.Date, required: true },
  totalSeats: { type: Schema.Types.Number, required: true, min: 0 },
  freeSeats: { type: Schema.Types.Number, required: true, min: 0 }
}, {
  versionKey: false,
  collection: constants.COLLECTION[MODEL_NAME],
  timestamps: true
});

class ShowMethods extends BaseMethods {
  static async addShow(doc) {
    const {
      screen,
      movie,
      updatedBy
    } = doc || {};
    let {
      startsAt
    } = doc || {};
    startsAt = new Date(startsAt);
    if (
      isNaN(startsAt.getTime())
      || startsAt.getTime() <= Date.now()
    ) {
      throw new Error('Invalid show times');
    }
    let { ok, result, error } = await handlePromise(mongoose.model(MODEL_NAMES.SCREEN)
      .findById(screen, { seats: 1, breakTime: 1 }).lean());
    if (!ok) { throw error; }
    if (!result) {
      throw new Error('Screen not found');
    }
    const { breakTime, seats } = result;
    ({ ok, result, error } = await handlePromise(mongoose.model(MODEL_NAMES.MOVIE)
      .findById(movie).select('duration').lean()));
    if (!ok) { throw error; }
    if (!result) {
      throw new Error('Movie not found');
    }
    const endsAt = new Date(startsAt.getTime() + (result.duration + breakTime) * 60 * 1000);
    ({ ok, result, error } = await handlePromise(mongoose.model(MODEL_NAME)
      .findOne({
        screen,
        $or: [
          {
            startsAt: {
              $lte: startsAt
            },
            endsAt: {
              $gt: startsAt
            }
          },
          {
            startsAt: {
              $lt: endsAt
            },
            endsAt: {
              $gte: endsAt
            }
          },
          {
            startsAt: {
              $gte: startsAt
            },
            endsAt: {
              $lte: endsAt
            }
          }
        ]
      }).select('_id').lean()));
    if (!ok) { throw error; }
    if (result) {
      throw new Error('Show is conficting with other show(s)');
    }
    const totalSeats = seats;
    const freeSeats = seats;
    const show = {
      screen,
      movie,
      startsAt,
      endsAt,
      freeSeats,
      totalSeats,
      updatedBy
    };
    ({ ok, error, result } = await handlePromise(mongoose.model(MODEL_NAME).create(show)));
    if (!ok) { throw error; }
    return result;
  }
}

ShowSchema.plugin(addOwner);
ShowSchema.loadClass(ShowMethods);

const ShowModel = mongoose.model(MODEL_NAME, ShowSchema);

module.exports = ShowModel;
