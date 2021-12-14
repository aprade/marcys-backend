import express from 'express';
import methodOverride from 'method-override';
import { RegisterRoutes } from './routes';

interface IError {
  status?: number;
  fields?: string[];
  message?: string;
  name?: string;
}

export const registerRoutes = (app: express.Express) => {
  app.use(methodOverride()).use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      `Origin, X-Requested-With, Content-Type, Accept, Authorization`
    );
    next();
  });

  RegisterRoutes(app);
};
