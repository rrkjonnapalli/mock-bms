const { Logger } = require('root/utils');

const logger = Logger.child({ service: 'RQ_PRE_PRCR_MW' });
logger.trace('Reques Pre-Processor middleware initialized');

module.exports = (req, res, next) => {
  req.time = Date.now();
  req.on('end', () => {
    const time = Date.now() - req.time;
    logger.debug('[%s] Route hit - [%s] %s took : %d ms',
      res.statusCode, req.method, req.originalUrl, time);
  });
  next();
};
