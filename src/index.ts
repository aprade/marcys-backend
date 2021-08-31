import app from './app';

const PORT: string | number = process.env.POST ?? 8080;

app.listen(PORT, () => 
	console.log(`[server]: running ⚡️  at http://localhost:${PORT}`)
);