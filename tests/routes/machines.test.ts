jest.mock('../../src/modules/api');

import 'jest-extended';
import app from '../../src/app';
import supertest from 'supertest';

import * as api from '../../src/modules/api';

const checkMachineMock = api.checkMachine as jest.Mock<
  Promise<api.CheckMachine>
>;

describe('POST /machines - create new machine', () => {
  it('Failed while validating IP', async () => {
    const payload = { ip: '222.666.111.44', nickname: 'localhost' };
    const result = await supertest(app)
      .post('/machines')
      .set('Content-type', 'application/json')
      .send(payload);

    expect(result.body).toEqual({
      message: 'The provided IP address is invalid.',
      status_code: 406,
      machine: payload,
      status: 'FAILED'
    });
    expect(result.statusCode).toEqual(406);
  });

  it('Failed while checking for a valid machine IP', async () => {
    checkMachineMock.mockResolvedValue(false);

    const payload = { ip: '0.0.0.0', nickname: 'localhost' };
    const result = await supertest(app)
      .post('/machines')
      .set('Content-type', 'application/json')
      .send(payload);

    expect(result.body).toEqual({
      message:
        'Could not connect to the specified IP. Verify if it can be reached by the outside world',
      status_code: 404,
      machine: payload,
      status: 'FAILED'
    });
    expect(result.statusCode).toEqual(404);
  });

  it('Successfuly create a new application', async () => {
    checkMachineMock.mockResolvedValue(true);

    const payload = { ip: '0.0.0.0', nickname: 'localhost' };
    const result = await supertest(app)
      .post('/machines')
      .set('Content-type', 'application/json')
      .send(payload);

    expect(result.body).toEqual({
      message: 'Successfuly added the machine.',
      status_code: 200,
      machine: payload,
      status: 'SUCCESS'
    });
    expect(result.statusCode).toEqual(200);
  });
});

describe('GET /machines - retrieve all machine', () => {
  it('Successfuly retrived machines', async () => {
    const result = await supertest(app)
      .get('/machines')
      .set('Content-type', 'application/json');

    expect(result.body.message).toEqual(
      'Found all machines register on Database'
    );
    expect(result.body.machines).toIncludeAnyMembers([
      'my-computer',
      'localhost'
    ]);
    expect(result.body.status_code).toEqual(200);
    expect(result.statusCode).toEqual(200);
  });
});
