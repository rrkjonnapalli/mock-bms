const { Logger } = require('root/utils');
const getBaseCtrl = require('./base');

const BaseCtrl = getBaseCtrl({ primaryModel: 'Show' });

const logger = Logger.child({ service: 'SHW_CTRLR' });
logger.trace('Show controller initialized');

module.exports = class ShowCtrl extends BaseCtrl {
  static async addShow(req, res) {
    const allowedProperties = ['screen', 'movie', 'startsAt'];
    return super.addEntity(req, res, { allowedProperties, addMethod: 'addShow' });
  }

  static async deleteShow(req, res) {
    return super.deleteEntity(req, res);
  }

  static async updateShow(req, res) {
    const allowedProperties = {
      $set: []
    };
    return super.updateEntity(req, res, { allowedProperties });
  }

  static async getShows(req, res) {
    const allowedFilters = [];
    const opts = { allowedFilters };
    return super.getEntitiesWithoutUser(req, res, opts);
  }

  static async getShow(req, res) {
    return super.getEntityWithoutUser(req, res);
  }
};
