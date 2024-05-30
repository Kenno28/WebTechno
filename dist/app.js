"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sentry = __importStar(require("@sentry/node"));
const profiling_node_1 = require("@sentry/profiling-node");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const HelloService_1 = require("./HelloService");
const Human_1 = require("./Human");
// Initialize Sentry
Sentry.init({
    dsn: "https://09ad21d48a680657059ef15f98c380db@o4507346130239488.ingest.de.sentry.io/4507346138431568",
    integrations: [
        (0, profiling_node_1.nodeProfilingIntegration)(),
    ],
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    profilesSampleRate: 1.0, // Set sampling rate for profiling
});
const app = (0, express_1.default)();
const port = 3000;
const helloService = new HelloService_1.HelloService();
// Middleware to parse JSON bodies
// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);
app.use(body_parser_1.default.json());
// All your controllers should live here
app.get('/', (req, res) => {
    const message = helloService.getHelloMessage();
    res.json({ message: message });
});
app.post('/human', async (req, res) => {
    try {
        const { name, password, alter } = req.body;
        const human = new Human_1.Human({ name, password, alter });
        const result = await human.save();
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
app.get('/human/:id', async (req, res) => {
    try {
        const human = await Human_1.Human.findById(req.params.id);
        if (!human) {
            return res.status(404).json({ error: 'Human not found' });
        }
        res.status(200).json(human);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
app.put('/human/:id', async (req, res) => {
    try {
        const { name, password, alter } = req.body;
        const human = await Human_1.Human.findByIdAndUpdate(req.params.id, { name, password, alter }, { new: true, runValidators: true });
        if (!human) {
            return res.status(404).json({ error: 'Human not found' });
        }
        res.status(200).json(human);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
});
app.delete('/human/:id', async (req, res) => {
    try {
        const human = await Human_1.Human.findByIdAndDelete(req.params.id);
        if (!human) {
            return res.status(404).json({ error: 'Human not found' });
        }
        res.status(200).json({ message: 'Human deleted successfully' });
    }
    catch (error) {
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
exports.default = app;
