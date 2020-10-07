const { Logger } = require('root/utils');
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
};
