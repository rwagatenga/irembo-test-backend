require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const router = require('./src/routers/router');

const { mongoManager } = require('./src/mongo');

const { errorHandler } = require('./src/middlewares/errorMiddleware');
const logger = require('./logger');

const app = express();

// mongoManager.connect();

app.use(
  helmet({
    contentSecurityPolicy: { directives: { scriptSrc: ["'self'"] } },
    frameguard: { action: 'sameorigin' },
    hsts: { maxAge: 31536000, includeSubDomains: true },
    referrerPolicy: { policy: 'no-referrer' },
  }),
);

// CORS Options
const whitelist = [process.env.BASE_URL, 'http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['User-Count'],
};

app.use(cors(corsOptions));

// HTTP request logger with Morgan
app.use(
  morgan('combined', {
    skip: (req, res) => res.statusCode < 400,
  }),
);

// Parse the body request to json
app.use(express.json());
app.get('/', (req, res) => res.status(200).send('Irembo Backend API'));

app.use(router);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV !== 'test') {
  mongoManager
    .connect()
    .then(() => {
      app.listen(PORT, () => {
        logger.log('info', `API Server 2 listening on port ${PORT}`);
      });
    })
    .catch((e) => {
      logger.error(e);
      throw new Error(e);
    });
}

module.exports = app;
