const mongoose = require('mongoose');
const { Logger, handlePromise } = require('root/utils');
const { MongooseBaseMethods, constants } = require('./utils');
const { addOwner } = require('./plugins');

const MODEL_NAMES = constants.MODEL;
const { BOOKING: MODEL_NAME } = MODEL_NAMES;

const BaseMethods = MongooseBaseMethods({ MODEL_NAME });

const logger = Logger.child({ service: 'BKNG_MDL' });
logger.trace('Booking model initialized');

const { Schema } = mongoose;

const BookingSchema = new Schema({
  show: { type: Schema.Types.ObjectId, ref: constants.MODEL.SHOW, required: true },
  user: { type: Schema.Types.ObjectId, ref: constants.MODEL.USER, required: true },
  type: {
    type: Schema.Types.String,
    default: 'booked',
    enum: ['booked', 'hold', 'cancelled'],
    required: true
  },
  seat: { type: Schema.Types.Number, min: 1, required: true }
}, {
  versionKey: false,
  collection: constants.COLLECTION[MODEL_NAME],
  timestamps: true
});

BookingSchema.index({ user: 1, show: 1, seat: 1 }, { unique: 1, background: 1 });

class BookingMethods extends BaseMethods {
  static async bookTicket(booking) {
    const { show, updatedBy } = booking || {};
    let { seats, user } = booking || {};
    user = user || updatedBy;
    seats = Array.from(new Set(seats));
    let { ok, error, result } = await handlePromise(mongoose
      .model(MODEL_NAMES.USER)
      .findById(user).select('_id'));
    if (!ok) { throw error; }
    if (!result) { throw new Error('User not found'); }
    ({ ok, error, result } = await handlePromise(mongoose
      .model(MODEL_NAMES.SHOW)
      .findById(show).select('freeSeats totalSeats')));
    if (!ok) { throw error; }
    if (!result) { throw new Error('Show not found'); }
    const { freeSeats, totalSeats } = result;
    if (freeSeats < seats.length) {
      throw new Error('Some or all of the selected seats are not available');
    }
    ({ ok, error, result } = await handlePromise(mongoose
      .model(MODEL_NAME)
      .find({ show, seat: { $in: seats } }).select('seat')));
    if (!ok) { throw error; }
    if (result && result.length > 0) {
      throw new Error(`Seat no(s): ${result.map((r) => r.seat).join(' , ')} is/are not available`);
    }
    const bookings = [];
    for (const seat of seats) {
      if (seat > totalSeats) {
        throw new Error(`Invalid seat number ${seat}`);
      }
      bookings.push({
        seat,
        show,
        user,
        updatedBy
      });
    }
    ({ ok, error, result } = await handlePromise(mongoose.model(MODEL_NAME)
      .insertMany(bookings)));
    if (!ok) {
      await mongoose.model(MODEL_NAME)
        .deleteMany({ $or: bookings })
        .catch((err) => {
          logger.error('Error while reverting bookings');
          logger.error(err);
        });
      throw error;
    }
    ({ ok, error } = await handlePromise(mongoose.model(MODEL_NAMES.SHOW)
      .updateOne({ _id: show }, { $inc: { freeSeats: -bookings.length } })));
    if (!ok) { throw error; }
    return result;
  }
}

BookingSchema.plugin(addOwner);

BookingSchema.loadClass(BookingMethods);

const BookingModel = mongoose.model(MODEL_NAME, BookingSchema);

module.exports = BookingModel;
