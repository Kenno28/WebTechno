import request from 'supertest';
import app from '../src/app';



describe('POST /human', () => {
  it('should create a new human', async () => {
    const humanData = { name: "Levent", password: "Hallo123", alter: 21 };
    const response = await request(app).post('/human').send(humanData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(humanData.name);
    expect(response.body.password).toBe(humanData.password);
    expect(response.body.alter).toBe(humanData.alter);
  });
});

describe('GET /human/:id', () => {
  it('should retrieve a human by id', async () => {
    const humanData = { name: "Levent", password: "Hallo123", alter: 21 };
    const createResponse = await request(app).post('/human').send(humanData);
    const humanId = createResponse.body._id;

    const getResponse = await request(app).get(`/human/${humanId}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty('_id', humanId);
    expect(getResponse.body.name).toBe(humanData.name);
    expect(getResponse.body.password).toBe(humanData.password);
    expect(getResponse.body.alter).toBe(humanData.alter);
  });
});

describe('PUT /human/:id', () => {
  it('should update a human by id', async () => {
    const humanData = { name: "Levent", password: "Hallo123", alter: 21 };
    const createResponse = await request(app).post('/human').send(humanData);
    const humanId = createResponse.body._id;

    const updatedData = { name: "Levent Updated", password: "Hallo12345", alter: 22 };
    const updateResponse = await request(app).put(`/human/${humanId}`).send(updatedData);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toHaveProperty('_id', humanId);
    expect(updateResponse.body.name).toBe(updatedData.name);
    expect(updateResponse.body.password).toBe(updatedData.password);
    expect(updateResponse.body.alter).toBe(updatedData.alter);
  });
});

describe('DELETE /human/:id', () => {
  it('should delete a human by id', async () => {
    const humanData = { name: "Levent", password: "Hallo123", alter: 21 };
    const createResponse = await request(app).post('/human').send(humanData);
    const humanId = createResponse.body._id;//TETS 
    
    const deleteResponse = await request(app).delete(`/human/${humanId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty('message', 'Human deleted successfully');

    const getResponse = await request(app).get(`/human/${humanId}`);
    expect(getResponse.status).toBe(404);
  });
});

describe('POST /human', () => {
  it('should create a new human', async () => {
    const humanData = { name: "Eray", password: "Hallo123", alter: 23 };
    const response = await request(app).post('/human').send(humanData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(humanData.name);
    expect(response.body.password).toBe(humanData.password);
    expect(response.body.alter).toBe(humanData.alter);
  });
});
