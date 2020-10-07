const { Logger } = require('root/utils');
const getBaseCtrl = require('./base');

const BaseCtrl = getBaseCtrl({ primaryModel: 'Screen' });

const logger = Logger.child({ service: 'SCRN_CTRLR' });
logger.trace('Screen controller initialized');

module.exports = class ScreenCtrl extends BaseCtrl {
  static async addScreen(req, res) {
    const allowedProperties = ['name', 'seats', 'theatre', 'location', 'zipcode'];
    return super.addEntity(req, res, { allowedProperties });
  }

  static async deleteScreen(req, res) {
    return super.deleteEntity(req, res);
  }

  static async updateScreen(req, res) {
    const allowedProperties = {
      $set: ['name', 'location', 'zipcode', 'theatre']
    };
    return super.updateEntity(req, res, { allowedProperties });
  }

  static async getScreens(req, res) {
    const allowedFilters = [];
    const opts = { allowedFilters };
    return super.getEntitiesWithoutUser(req, res, opts);
  }

  static async getScreen(req, res) {
    return super.getEntityWithoutUser(req, res);
  }
};
