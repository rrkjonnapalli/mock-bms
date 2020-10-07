/* global describe, before, after, it */

const chai = require('chai');
const mongoose = require('mongoose');
const { Logger } = require('root/utils');
const { TestTools } = require('root/tools');
const { constants } = require('../utils');
const TestData = require('./data');

const should = chai.should();

const logger = Logger.child({ service: 'TST_SHW_MDL' });

logger.info('Running test cases for Show Model');

const { MongoDb } = TestTools;

describe('TEST-SHOW-MODEL', () => {
  let user = null;
  let screen = null;
  let movie = null;
  let secondScreen = null;
  const Show = mongoose.model(constants.MODEL.SHOW);
  before(() => MongoDb.connect()
    .then(() => MongoDb.clear())
    .then(() => mongoose
      .model(constants.MODEL.USER)
      .signup(TestData.users.validUser())
      .then((usr) => {
        user = usr;
      }))
    .then(() => {
      movie = TestData.movies.validMovie(user._id);
      return mongoose.model(constants.MODEL.MOVIE).create(movie)
        .then((mv) => {
          movie = mv.toObject();
        });
    })
    .then(() => {
      const s1 = TestData.screens.validScreen(user._id);
      return mongoose.model(constants.MODEL.SCREEN).create(s1)
        .then((scrn) => {
          screen = scrn.toObject();
        });
    })
    .then(() => {
      const s2 = TestData.screens.validScreen(user._id, 'Screen 2');
      return mongoose.model(constants.MODEL.SCREEN).create(s2)
        .then((scrn) => {
          secondScreen = scrn.toObject();
        });
    })
    .catch((err) => {
      throw err;
    }));

  describe('add show', () => {
    it('should add show', async () => {
      const show = TestData.shows.validShow(movie._id, screen._id, user._id);
      show.startsAt = new Date(new Date().getTime() + 10 * 60 * 1000);
      return Show.addShow(show)
        .then((shw) => {
          should.exist(shw);
          shw.updatedBy.should.be.eql(user._id);
          shw.createdBy.should.be.eql(user._id);
        }).catch((err) => {
          logger.error(err);
          should.not.exist(err);
        });
    });
    it('should add show within range of ther screen show', async () => {
      const show = TestData.shows.validShow(movie._id, secondScreen._id, user._id);
      show.startsAt = new Date(new Date().getTime() + 10 * 60 * 1000);
      return Show.addShow(show)
        .then((shw) => {
          should.exist(shw);
          shw.updatedBy.should.be.eql(user._id);
          shw.createdBy.should.be.eql(user._id);
        }).catch((err) => {
          should.not.exist(err);
        });
    });
    it('should throw an error when show is added within range of other show for the same screen', async () => {
      const show = TestData.shows.validShow(movie._id, screen._id, new mongoose.Types.ObjectId());
      show.startsAt = new Date(new Date().getTime() + 1 * 60 * 60 * 1000);
      return Show.addShow(show)
        .then((shw) => {
          should.exist(shw);
          shw.updatedBy.should.be.eql(user._id);
          shw.createdBy.should.be.eql(user._id);
        }).catch((err) => {
          logger.error(err);
          should.exist(err);
        });
    });

    it('should throw an error when show is added with unknown users', async () => {
      const show = TestData.shows.validShow(movie._id, screen._id, new mongoose.Types.ObjectId());
      show.startsAt = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
      return Show.addShow(show)
        .then((shw) => {
          should.exist(shw);
          shw.updatedBy.should.be.eql(user._id);
          shw.createdBy.should.be.eql(user._id);
        }).catch((err) => {
          logger.error(err);
          should.exist(err);
        });
    });

    it('should throw an error when show is added with unknown screen', async () => {
      const show = TestData.shows.validShow(movie._id, new mongoose.Types.ObjectId(), user._id);
      show.startsAt = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
      return Show.addShow(show)
        .then((shw) => {
          should.exist(shw);
          shw.updatedBy.should.be.eql(user._id);
          shw.createdBy.should.be.eql(user._id);
        }).catch((err) => {
          logger.error(err);
          should.exist(err);
        });
    });

    it('should throw an error when show is added with unknown movie', async () => {
      const show = TestData.shows.validShow(new mongoose.Types.ObjectId(), screen._id, user._id);
      show.startsAt = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
      return Show.addShow(show)
        .then((shw) => {
          should.exist(shw);
          shw.updatedBy.should.be.eql(user._id);
          shw.createdBy.should.be.eql(user._id);
        }).catch((err) => {
          logger.error(err);
          should.exist(err);
        });
    });
  });

  after(() => Promise.resolve()
    .then(() => MongoDb.clear())
    .then(() => mongoose.connection.close()));
});
