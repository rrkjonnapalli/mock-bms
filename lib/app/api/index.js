const { Router } = require('root/utils');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const movieRoutes = require('./movie');
const screenRoutes = require('./screen');
const showRoutes = require('./show');
const bookingRouters = require('./booking');
const { jwtMw } = require('../middlewares');

const router = Router();

router.use('/auth', authRoutes);

router.use(jwtMw);

router.use('/users', userRoutes);

router.use('/movies', movieRoutes);

router.use('/screens', screenRoutes);

router.use('/shows', showRoutes);

router.use('/booking', bookingRouters);

module.exports = router;
