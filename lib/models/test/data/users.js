module.exports = {
  validUser: (name = 'User', username) => ({
    name,
    email: `${name.replace(' ', '').toLowerCase()}@mocker.com`,
    username: username || name.replace(' ', '').toLowerCase(),
    password: 'pass$wd'
  })
};
