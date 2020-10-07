const { Router } = require('root/utils');
const { MovieCtrl } = require('./controllers');

const router = Router();

router.get('/:id', (req, res) => MovieCtrl.getMovie(req, res));
router.post('/', (req, res) => MovieCtrl.addMovie(req, res));
router.patch('/:id', (req, res) => MovieCtrl.updateMovie(req, res));
router.get('/', (req, res) => MovieCtrl.getMovies(req, res));
router.use('/**', (_req, _res, next) => next());

module.exports = router;
