const { Logger } = require('root/utils');
const getBaseCtrl = require('./base');

const BaseCtrl = getBaseCtrl({ primaryModel: 'Movie' });

const logger = Logger.child({ service: 'MV_CTRLR' });
logger.trace('Movie controller initialized');

module.exports = class MovieCtrl extends BaseCtrl {
  static async addMovie(req, res) {
    const allowedProperties = ['name', 'duration'];
    return super.addEntity(req, res, { allowedProperties });
  }

  static async deleteMovie(req, res) {
    return super.deleteEntity(req, res);
  }

  static async updateMovie(req, res) {
    const allowedProperties = {
      $set: ['name']
    };
    return super.updateEntity(req, res, { allowedProperties });
  }

  static async getMovies(req, res) {
    const allowedFilters = [];
    const opts = { allowedFilters };
    return super.getEntitiesWithoutUser(req, res, opts);
  }

  static async getMovie(req, res) {
    return super.getEntityWithoutUser(req, res);
  }
};
