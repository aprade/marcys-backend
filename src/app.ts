import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { registerRoutes } from './register-routes';

const PORT: string | number = process.env.PORT ?? 3000;

export const app = express()
  .use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  .use(bodyParser.json())
  .use(express.static('public'))
  .use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: '/swagger.json'
      }
    })
  );

app.get('/', (req, res) => res.json('working'));

registerRoutes(app);

app.listen(PORT, () =>
  console.log(`[server]: running ⚡️ at http://localhost:${PORT}`)
);
