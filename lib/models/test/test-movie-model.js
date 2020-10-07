/* global describe, before, after, it */

const chai = require('chai');
const mongoose = require('mongoose');
const { Logger } = require('root/utils');
const { TestTools } = require('root/tools');
const { constants } = require('../utils');
const TestData = require('./data');

const should = chai.should();

const logger = Logger.child({ service: 'TST_MV_MDL' });

logger.info('Running test cases for Movie Model');

const { MongoDb } = TestTools;

describe('TEST-MOVIE-MODEL', () => {
  let user = null;
  const Movie = mongoose.model(constants.MODEL.MOVIE);
  before(() => MongoDb.connect()
    .then(() => MongoDb.clear())
    .then(() => mongoose.model('User').signup(TestData.users.validUser()))
    .then((result) => {
      user = result;
    })
    .catch((err) => {
      throw err;
    }));

  describe('add movie', () => {
    it('should add movie', async () => {
      const movie = TestData.movies.validMovie();
      movie.updatedBy = user._id;
      return Movie.create(movie)
        .then((mv) => {
          should.exist(mv);
          mv.updatedBy.should.be.eql(user._id);
          mv.createdBy.should.be.eql(user._id);
        }).catch((err) => {
          should.not.exist(err);
        });
    });

    it('should not add movie when wrong is present', async () => {
      const movie = TestData.movies.validMovie();
      movie.updatedBy = new mongoose.Types.ObjectId();
      return Movie.create(movie)
        .then((mv) => {
          should.not.exist(mv);
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
