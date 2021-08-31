import morgan from 'morgan';
import express, { Express } from 'express';

import routesMachines from './routes/machines';

const app: Express = express();
const PORT: string | number = process.env.PORT ?? 8080;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With, Content-Type, Accept, Authorization');

	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
		return res.status(200).json({});
	}
	next();
});

app.all('/', (_, res) => res.json({'body': 'Use the correct route you dumbass!!!'}));

app.use('/', routesMachines);

app.listen(PORT, () => 
	console.log(`[server]: running ⚡️  at http://localhost:${PORT}`)
);