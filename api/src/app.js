import Koa from 'koa';
import chalk from 'chalk';
import logger from 'koa-logger';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { checkHasError } from './errors';

const corsOptions = {
  credentials: true
};

class App extends Koa {
  constructor() {
    super();

    this.initErrorsHandler();
    this.use(logger());
    this.use(cors(corsOptions));
    this.use(bodyParser());
  }

  useRoutes(routers) {
    for (const router of routers) {
      this.use(router.routes());
      this.use(router.allowedMethods({ throw: true }));
    }
    return this;
  }

  initErrorsHandler() {
    this.use(async (ctx, next) => {
      try {
        await next();
        checkHasError(ctx);
      } catch (error) {
        ctx.status = error.status || 500;
        ctx.body = {
          error: true,
          ...(error.details ? { details: error.details } : {})
        };
        ctx.app.emit('error', error, ctx);
      }
    });

    this.on('error', (error) => {
      console.log(chalk.red('[error]', error.message));
    });
  }

  start() {
    try {
      const port = Number(process.env.API_PORT);
      this.listen(port, () => {
        console.log(chalk.green('App started on port'), chalk.blue(port));
      });
    } catch (error) {
      console.log(chalk.red(error));
    }
  }
}

export default App;
