const CONSTANTS = {
  MODEL: {
    NOTE: 'Note',
    USER: 'User',
    TASK: 'Task',
    COUNTER: 'Counter',
    MOVIE: 'Movie',
    SCREEN: 'Screen',
    SHOW: 'Show',
    BOOKING: 'Booking'
  },
  get COLLECTION() {
    return {
      [this.MODEL.USER]: 'users',
      [this.MODEL.TASK]: 'tasks',
      [this.MODEL.NOTE]: 'notes',
      [this.MODEL.COUNTER]: 'counters',
      [this.MODEL.MOVIE]: 'movies',
      [this.MODEL.SCREEN]: 'screens',
      [this.MODEL.SHOW]: 'shows',
      [this.MODEL.BOOKING]: 'bookings'
    };
  },
  get MODELS() {
    return Object.keys(this.COLLECTION);
  },
  get COLLECTIONS() {
    return Object.values(this.COLLECTION);
  },
  get COLLECTION_MODEL() {
    return Object
      .entries(this.COLLECTION)
      .reduce((result, [k, v]) => Object.assign(result, { [v]: k }), {});
  }
};
module.exports = CONSTANTS;
