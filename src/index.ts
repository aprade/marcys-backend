import app from './app';

const PORT: string | number = process.env.PORT ?? 3000;

app.listen(PORT, () =>
  console.log(`[server]: running ⚡️  at http://localhost:${PORT}`)
);
