import express, { Request, Response, ErrorRequestHandler } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { HelloService } from './HelloService';
import { Human } from './Human';

const tracer = require('dd-trace').init({
  logInjection: true,
  analytics: true
});

const app = express();
const port = 3000;
const helloService = new HelloService();

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  const message = helloService.getHelloMessage();
  res.json({ message });
});

app.post('/human', async (req: Request, res: Response) => {
  try {
    const { name, password, alter } = req.body;
    const human = new Human({ name, password, alter });
    const result = await human.save();
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Fehlerbehandlung
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
