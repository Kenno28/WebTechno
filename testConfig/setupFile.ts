// cf. https://nodkz.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

/**
 * This file is configured in jest.config.js and automatically called before all tests.
 * 
 * This setup requires globalSetup.ts to be run before the tests, i.e. globalSetup.ts
 * must be configured in jest.config.js as well.
 * 
 * This file must be configured in 'setupFilesAfterEnv' in jest.config.js in order to
 * be run after globalSetup.ts and have access to the URI of the MongoMemoryServer in
 * the environment variable `MONGO_URI`.
 */
let mongoServer: MongoMemoryServer;
/**
 * Connects to the MongoDB instance. It uses the URI stored in the environment variable
 * `MONGO_URI`. This variable is set in globalSetup.ts.
 */
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { dbName: 'test'});
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    const collections = Object.values(mongoose.connection.collections);
    for (const collection of collections) {
        await collection.deleteMany({});
    }
});