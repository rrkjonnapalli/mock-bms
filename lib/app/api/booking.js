const { Router } = require('root/utils');
const { BookingCtrl } = require('./controllers');

const router = Router();

router.get('/available/:show', (req, res) => BookingCtrl.getAvailableSeats(req, res));
router.get('/:id', (req, res) => BookingCtrl.getBooking(req, res));
router.post('/', (req, res) => BookingCtrl.addBooking(req, res));
router.get('/', (req, res) => BookingCtrl.getBookings(req, res));
router.use('/**', (_req, _res, next) => next());

module.exports = router;
