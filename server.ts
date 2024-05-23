import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Definiere einen Endpunkt für den "Hello World!"-Service
app.get('/hello', (req: Request, res: Response) => {
  // Gib "Hello World!" als JSON zurück
  res.json({ message: 'Hello World!' });
});

// Starte den Server
app.listen(port, () => {
  console.log(`Server gestartet auf Port ${port}`);
});