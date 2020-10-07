const { Router } = require('root/utils');
const { ShowCtrl } = require('./controllers');

const router = Router();

router.get('/:id', (req, res) => ShowCtrl.getShow(req, res));
router.post('/', (req, res) => ShowCtrl.addShow(req, res));
router.get('/', (req, res) => ShowCtrl.getShows(req, res));
router.use('/**', (_req, _res, next) => next());

module.exports = router;
