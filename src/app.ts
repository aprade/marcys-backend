import morgan from 'morgan';
import express, { Express } from 'express';

import routesMachines from './routes/machines';

const app: Express = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  next();
});

app.all('/', (_, res) =>
  res.json({ body: 'Use the correct route you dumbass!!!' })
);

app.use('/', routesMachines);

export default app;
