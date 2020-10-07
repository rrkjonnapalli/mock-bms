/* global describe, before, after, it */

const chai = require('chai');
const mongoose = require('mongoose');
const { Logger } = require('root/utils');
const { TestTools } = require('root/tools');
const { constants } = require('../utils');
const TestData = require('./data');

const should = chai.should();

const logger = Logger.child({ service: 'TST_SCRN_MDL' });

logger.info('Running test cases for Screen Model');

const { MongoDb } = TestTools;

describe('TEST-SCREEN-MODEL', () => {
  let user = null;
  const Screen = mongoose.model(constants.MODEL.SCREEN);
  before(() => MongoDb.connect()
    .then(() => MongoDb.clear())
    .then(() => mongoose.model('User').signup(TestData.users.validUser()))
    .then((result) => {
      user = result;
    })
    .catch((err) => {
      throw err;
    }));

  describe('add screen', () => {
    it('should add screen', async () => {
      const screen = TestData.screens.validScreen();
      screen.updatedBy = user._id;
      return Screen.create(screen)
        .then((scrn) => {
          should.exist(scrn);
          scrn.updatedBy.should.be.eql(user._id);
          scrn.createdBy.should.be.eql(user._id);
        }).catch((err) => {
          should.not.exist(err);
        });
    });

    it('should not add screen when wrong is present', async () => {
      const screen = TestData.screens.validScreen();
      screen.updatedBy = new mongoose.Types.ObjectId();
      return Screen.create(screen)
        .then((scrn) => {
          should.not.exist(scrn);
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
