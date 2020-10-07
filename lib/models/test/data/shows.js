module.exports = {
  validShow: (movie, screen, updatedBy, startsAt = new Date()) => ({
    movie,
    screen,
    updatedBy,
    startsAt
  })
};
