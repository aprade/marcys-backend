import express from 'express';

const PORT: string | number = process.env.PORT ?? 3000;
const app = express();

app.get('/', (req, res) => res.json('working'));

app.listen(PORT, () =>
  console.log(`[server]: running ⚡️ at http://localhost:${PORT}`)
);
