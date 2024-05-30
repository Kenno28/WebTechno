import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { HelloService } from './HelloService';
import { Human } from './Human';

// Initialize Sentry
Sentry.init({
  dsn: "https://09ad21d48a680657059ef15f98c380db@o4507346130239488.ingest.de.sentry.io/4507346138431568",
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  profilesSampleRate: 1.0, // Set sampling rate for profiling
});

const app = express();
const port = 3000;
const helloService = new HelloService();

// Middleware to parse JSON bodies

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);
app.use(bodyParser.json());

// All your controllers should live here
app.get('/', (req, res) => {
  const message = helloService.getHelloMessage();
  res.json({ message: message });
});

app.post('/human', async (req, res) => {
  try {
    const { name, password, alter } = req.body;
    const human = new Human({ name, password, alter });
    const result = await human.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get('/human/:id', async (req, res) => {
  try {
    const human = await Human.findById(req.params.id);
    if (!human) {
      return res.status(404).json({ error: 'Human not found' });
    }
    res.status(200).json(human);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.put('/human/:id', async (req, res) => {
  try {
    const { name, password, alter } = req.body;
    const human = await Human.findByIdAndUpdate(
      req.params.id,
      { name, password, alter },
      { new: true, runValidators: true }
    );
    if (!human) {
      return res.status(404).json({ error: 'Human not found' });
    }
    res.status(200).json(human);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.delete('/human/:id', async (req, res) => {
  try {
    const human = await Human.findByIdAndDelete(req.params.id);
    if (!human) {
      return res.status(404).json({ error: 'Human not found' });
    }
    res.status(200).json({ message: 'Human deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});


// Optional fallthrough error handler
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
