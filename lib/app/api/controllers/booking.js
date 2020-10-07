const mongoose = require('mongoose');
const { Logger, handlePromise, SendResponse } = require('root/utils');
const getBaseCtrl = require('./base');

const BaseCtrl = getBaseCtrl({ primaryModel: 'Booking' });

const logger = Logger.child({ service: 'BKNG_CTRLR' });
logger.trace('Booking controller initialized');

module.exports = class BookingCtrl extends BaseCtrl {
  static async addBooking(req, res) {
    const allowedProperties = ['user', 'show', 'seats'];
    return super.addEntity(req, res, { allowedProperties, addMethod: 'bookTicket' });
  }

  static async deleteBooking(req, res) {
    return super.deleteEntity(req, res);
  }

  static async updateBooking(req, res) {
    const allowedProperties = {
      $set: []
    };
    return super.updateEntity(req, res, { allowedProperties });
  }

  static async getBookings(req, res) {
    return super.getEntities(req, res);
  }

  static async getBooking(req, res) {
    return super.getEntity(req, res);
  }

  static async getAvailableSeats(req, res) {
    const { show } = req.params || {};
    const response = await handlePromise(mongoose.model('Booking').checkFreeSeats(show));
    const { ok } = response;
    if (!ok) return SendResponse.badRequestError(res, response);
    return SendResponse.success(res, response);
  }
};
