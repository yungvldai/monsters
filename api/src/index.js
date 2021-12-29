import 'dotenv/config';
import "core-js/stable";
import "regenerator-runtime/runtime";

import App from './app';
import routes from './api/v1/routes';

const app = new App();

app.useRoutes(routes);
app.start();
