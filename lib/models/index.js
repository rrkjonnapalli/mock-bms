const mongoose = require('mongoose');
const { postValidate, removeSensitive } = require('./plugins');

mongoose.plugin(postValidate);
mongoose.plugin(removeSensitive);

const Counter = require('./counter');
const User = require('./user');
const Movie = require('./movie');
const Screen = require('./screen');
const Show = require('./show');
const Booking = require('./booking');

module.exports = {
  Counter,
  User,
  Movie,
  Screen,
  Show,
  Booking
};
