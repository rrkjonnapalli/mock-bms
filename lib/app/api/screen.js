const { Router } = require('root/utils');
const { ScreenCtrl } = require('./controllers');

const router = Router();

router.get('/:id', (req, res) => ScreenCtrl.getScreen(req, res));
router.post('/', (req, res) => ScreenCtrl.addScreen(req, res));
router.patch('/:id', (req, res) => ScreenCtrl.updateScreen(req, res));
router.get('/', (req, res) => ScreenCtrl.getScreens(req, res));
router.use('/**', (_req, _res, next) => next());

module.exports = router;
