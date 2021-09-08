jest.mock('../../src/modules/api');

import 'jest-extended';
import app from '../../src/app';
import supertest from 'supertest';

import * as api from '../../src/modules/api';

const checkMachineMock = api.checkMachine as jest.Mock<
  Promise<api.CheckMachine>
>;
const getMachineCPUInfoMock = api.getMachineCPUInfo as jest.Mock<
  Promise<api.MachineCPUInfo>
>;
const getMachineMemoryInfoMock = api.getMachineMemoryInfo as jest.Mock<
  Promise<api.MachineMemoryInfo>
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
  it('Failed when the machine does not exist on the Database', async () => {
    const result = await supertest(app)
      .get('/machines/discord')
      .set('Content-type', 'application/json');

    expect(result.body.message).toEqual(
      'Did not found any register on Database'
    );
    expect(result.body.status_code).toEqual(404);
  });

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

describe('GET /machines/:nickname - retrieve machine state and history', () => {
  it('Failed when the machine does not exist on the Database', async () => {
    const result = await supertest(app)
      .get('/machines/discord')
      .set('Content-type', 'application/json');

    expect(result.body.message).toEqual(
      'Did not found any register on Database'
    );
    expect(result.body.status_code).toEqual(404);
  });

  it('Failed when checking if machine is operating', async () => {
    checkMachineMock.mockResolvedValue(false);

    const result = await supertest(app)
      .get('/machines/localhost')
      .set('Content-type', 'application/json');

    expect(result.body.message).toEqual(
      'Could not connect to the specified IP. Verify if it can be reached by the outside world'
    );
    expect(result.body.status_code).toEqual(404);
  });

  it('Successfuly retrive machine history and state', async () => {
    checkMachineMock.mockResolvedValue(true);
    getMachineCPUInfoMock.mockResolvedValue({
      frequency: 3900000000,
      logical_cores: 16,
      physical_cores: 16,
      load_average: {
        one: 1.3466796875,
        five: 1.7275390625,
        fifteen: 1.62744140625
      }
    });
    getMachineMemoryInfoMock.mockResolvedValue({
      total: 32768,
      free: 2811,
      used: 16686,
      shared: 0,
      buffers: 0,
      cached: 0
    });

    const result = await supertest(app)
      .get('/machines/localhost')
      .set('Content-type', 'application/json');

    expect(result.body).toContainAllKeys([
      'machineHistory',
      'machineState',
      'status_code'
    ]);
    expect(result.body.machineHistory).toContainAnyKeys(['cpu', 'memory']);
    expect(result.body.machineState).toContainAnyKeys(['cpu', 'memory']);
    expect(result.body.machineState.memory).toContainAllKeys([
      'total',
      'free',
      'used',
      'shared',
      'buffers',
      'cached'
    ]);
    expect(result.body.machineState.cpu).toContainAllKeys([
      'frequency',
      'logical_cores',
      'physical_cores',
      'load_average'
    ]);
    expect(result.body.status_code).toEqual(200);
  });
});
