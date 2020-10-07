const mongoose = require('mongoose');
const { Logger } = require('root/utils');
const { MongooseBaseMethods, constants } = require('./utils');
const { addOwner } = require('./plugins');

const { SCREEN: MODEL_NAME } = constants.MODEL;

const BaseMethods = MongooseBaseMethods({ MODEL_NAME });

const logger = Logger.child({ service: 'SCRN_MDL' });
logger.trace('Screen model initialized');

const { Schema } = mongoose;

const ScreenSchema = new Schema({
  name: { type: Schema.Types.String, required: true },
  theatre: { type: Schema.Types.String },
  location: { type: Schema.Types.String }, /* better to have long, lat. currently using city name */
  zipcode: { type: Schema.Types.String },
  seats: { type: Schema.Types.Number, required: true },
  breakTime: {
    type: Schema.Types.Number,
    required: true,
    default: 10,
    min: 0
  }
}, {
  versionKey: false,
  collection: constants.COLLECTION[MODEL_NAME],
  timestamps: true
});

class ScreenMethods extends BaseMethods {
}

ScreenSchema.plugin(addOwner);
ScreenSchema.loadClass(ScreenMethods);

const ScreenModel = mongoose.model(MODEL_NAME, ScreenSchema);

module.exports = ScreenModel;
