/* global describe, before, after, it */

const chai = require('chai');
const mongoose = require('mongoose');
const { Logger } = require('root/utils');
const { TestTools } = require('root/tools');
const { constants } = require('../utils');
const TestData = require('./data');

const { MODEL: MODEL_NAMES } = constants;

const should = chai.should();

const logger = Logger.child({ service: 'TST_BKNG_MDL' });

logger.info('Running test cases for Booking Model');

const { MongoDb } = TestTools;

describe('TEST-BOOKING-MODEL', () => {
  let user = null;
  let screen = null;
  let movie = null;
  let secondScreen = null;
  let show1 = null;
  let show2 = null;

  const User = mongoose.model(MODEL_NAMES.USER);
  const Booking = mongoose.model(MODEL_NAMES.BOOKING);
  const Movie = mongoose.model(MODEL_NAMES.MOVIE);
  const Show = mongoose.model(MODEL_NAMES.SHOW);
  const Screen = mongoose.model(MODEL_NAMES.SCREEN);

  before(() => MongoDb.connect()
    .then(() => MongoDb.clear())
    .then(() => User
      .signup(TestData.users.validUser())
      .then((usr) => {
        user = usr;
      }))
    .then(() => {
      movie = TestData.movies.validMovie(user._id);
      return Movie.create(movie)
        .then((mv) => {
          movie = mv.toObject();
        });
    })
    .then(() => {
      const s1 = TestData.screens.validScreen(user._id);
      return Screen.create(s1)
        .then((scrn) => {
          screen = scrn.toObject();
        });
    })
    .then(() => {
      const s2 = TestData.screens.validScreen(user._id, 'Screen 2', 3);
      return Screen.create(s2)
        .then((scrn) => {
          secondScreen = scrn.toObject();
        });
    })
    .then(() => {
      const sh = TestData.shows.validShow(movie._id, screen._id, user._id);
      sh.startsAt = new Date(Date.now() + 10 * 60 * 1000);
      return Show.addShow(sh)
        .then((shw) => {
          show1 = shw.toObject();
        });
    })
    .then(() => {
      const sh = TestData.shows.validShow(movie._id, secondScreen._id, user._id);
      sh.startsAt = new Date(Date.now() + 10 * 60 * 1000);
      return Show.addShow(sh)
        .then((shw) => {
          show2 = shw.toObject();
        });
    })
    .catch((err) => {
      throw err;
    }));

  describe('Book seats', () => {
    it('should book seats', async () => {
      const b1 = {
        user: user._id,
        show: show1._id,
        seats: [1, 2, 3],
        updatedBy: user._id
      };
      return Booking.bookTicket(b1)
        .then((bookings) => {
          should.exist(bookings);
          bookings.length.should.be.eql(b1.seats.length);
        }).catch((err) => {
          should.not.exist(err);
        });
    });

    it('should throw error if seats conflicting with other bookings', async () => {
      const b1 = {
        user: user._id,
        show: show1._id,
        seats: [3, 4],
        updatedBy: user._id
      };
      return Booking.bookTicket(b1)
        .then((bookings) => {
          should.not.exist(bookings);
        }).catch((err) => {
          logger.error(err);
          should.exist(err);
        }).then(() => {
          Booking.find({
            user: user._id,
            show: show1._id,
            seats: { $in: b1.seats }
          }, { _id: 1 })
            .lean()
            .then((records) => {
              records.length.should.be.eql(0);
            });
        });
    });

    it('should book other available seats', async () => {
      const b1 = {
        user: user._id,
        show: show1._id,
        seats: [4, 5],
        updatedBy: user._id
      };
      return Booking.bookTicket(b1)
        .then((bookings) => {
          should.exist(bookings);
          bookings.length.should.be.eql(b1.seats.length);
        }).catch((err) => {
          logger.error(err);
          should.not.exist(err);
        });
    });

    it('should throw error if requested with invalid seats', async () => {
      const b1 = {
        user: user._id,
        show: show2._id,
        seats: [3, 4],
        updatedBy: user._id
      };
      return Booking.bookTicket(b1)
        .then((bookings) => {
          should.not.exist(bookings);
        }).catch((err) => {
          logger.error(err);
          should.exist(err);
        });
    });

    it('should book if requested with valid seats', async () => {
      const b1 = {
        user: user._id,
        show: show2._id,
        seats: [3, 1],
        updatedBy: user._id
      };
      return Booking.bookTicket(b1)
        .then((bookings) => {
          should.exist(bookings);
        }).catch((err) => {
          logger.error(err);
          should.not.exist(err);
        });
    });

    it('should throw error if requested with more than available free seats', async () => {
      const b1 = {
        user: user._id,
        show: show2._id,
        seats: [2, 3],
        updatedBy: user._id
      };
      return Booking.bookTicket(b1)
        .then((bookings) => {
          should.not.exist(bookings);
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
