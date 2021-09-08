import app from '../src/app';
import supertest from 'supertest';

describe('ALL / - root endpoint', () => {
  it('Application is up', async () => {
    const result = await supertest(app).get('/');

    expect(result.body).toEqual({
      body: 'Use the correct route you dumbass!!!'
    });
    expect(result.statusCode).toEqual(200);
  });
});
