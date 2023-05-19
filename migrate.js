require('dotenv').config();
const { mongoManager } = require('./imports/mongo');

const logger = require('./logger');

(async () => {
  // eslint-disable-next-line no-console
  console.time('migration');
  mongoManager.connect();
  logger.log('info', 'Migration process has started.');

  try {
    logger.log('info', 'Migration process successful.');
  } catch (e) {
    logger.log('info', 'Migration process failed.', e);
    throw e;
  } finally {
    // eslint-disable-next-line no-console
    console.timeEnd('migration');
    process.exit(0);
  }
})();
