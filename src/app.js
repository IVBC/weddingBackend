import express from 'express';
import { resolve } from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import cors from 'cors';
import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

const http = require('http');
const socketIO = require('socket.io');

class App {
  constructor() {
    this.server = express();
    this.app = http.Server(this.server);
    this.io = socketIO(this.app);

    if (process.NODE_ENV === 'production') {
      Sentry.init(sentryConfig);
    }

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    if (process.NODE_ENV === 'production') {
      this.server.use(Sentry.Handlers.requestHandler());
    }
    this.server.use((req, res, next) => {
      req.io = this.io;

      next();
    });
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    if (process.NODE_ENV === 'production') {
      this.server.use(Sentry.Handlers.errorHandler());
    }
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'production') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      if (
        process.env.NODE_ENV === 'test' ||
        process.env.NODE_ENV === 'development'
      ) {
        // eslint-disable-next-line no-console
        console.log(err);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().app;
