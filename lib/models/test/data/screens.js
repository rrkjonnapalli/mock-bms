module.exports = {
  validScreen: (updatedBy, name = 'Screen 1', seats = 300) => ({
    name,
    theatre: 'PVR Icon',
    location: 'Hyderabad',
    zipcode: '500032',
    seats,
    updatedBy
  })
};
