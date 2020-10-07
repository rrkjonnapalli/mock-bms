const { Router } = require('root/utils');
const { UserCtrl } = require('./controllers');

const router = Router();

router.patch('/change-password', (req, res) => UserCtrl.changePassword(req, res));

router.patch('/', (req, res) => UserCtrl.updateUser(req, res));

router.use('/**', (_req, _res, next) => next());

module.exports = router;
