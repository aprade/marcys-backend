import { createClient } from 'redis';
import type { MachineCPUInfo, MachineMemoryInfo } from './api';

export interface Machine {
  ip: string;
  nickname: string;
}

// I need help setting up tests for the FAILED cases
// both in setMachines and getMachines
// I've read the documentation of the ioredis to see
// when it throw erros, but didn't find anything usefull
export enum SetMachineMessage {
  ADDED = 'Successfuly added the machine.',
  FAILED = 'Unkown error when trying to add into the Database'
}

export enum GetMachineMessage {
  FOUND = 'Found one machine register on Database',
  NOT_FOUND = 'Did not found any register on Database',
  UNKNOW_ERROR = 'Unkown error when trying to get it from the Database'
}

export interface GetMachineResponse {
  message: GetMachineMessage;
  machine: Machine | null;
}

export enum GetMachinesMessage {
  FOUND = 'Found all machines register on Database',
  NOT_FOUND = 'Did not found any register on Database',
  UNKNOW_ERROR = 'Unkown error when trying to get it from the Database'
}

export interface GetMachinesResponse {
  message: GetMachinesMessage;
  machines: Array<Machine['nickname']>;
}

interface MachineCPUHistory extends MachineCPUInfo {
  timestamp: Date;
}

interface MachineMemoryHistory extends MachineMemoryInfo {
  timestamp: Date;
}

export interface MachineHistory {
  cpu: Array<MachineCPUHistory>;
  memory: Array<MachineMemoryHistory>;
}

const setMachines = async (machine: Machine['nickname']): Promise<void> => {
  const redis = createClient();
  redis.on('error', err => console.log('Redis Client Error', err));
  await redis.connect();

  try {
    const machines: Array<Machine['nickname']> = JSON.parse(
      (await redis.get('machines')) || '[]'
    );

    if (!machines.includes(machine)) {
      await redis.set('machines', JSON.stringify([...machines, machine]));
    }
  } catch (err: unknown) {
    throw new Error(`add new machine to list.${err}`);
  }
  await redis.quit();
};

export const setMachine = async (
  machine: Machine
): Promise<SetMachineMessage> => {
  let response: SetMachineMessage = SetMachineMessage.ADDED;

  const redis = createClient();
  redis.on('error', err => console.log('Redis Client Error', err));
  await redis.connect();

  try {
    await redis.set(machine.nickname, JSON.stringify(machine));
    await setMachines(machine.nickname);
  } catch (err: unknown) {
    console.log('Redis Client Error on set:', err);
    response = SetMachineMessage.FAILED;
  }
  await redis.quit();

  return response;
};

export const getMachine = async (
  key: Machine['nickname']
): Promise<GetMachineResponse> => {
  const response: GetMachineResponse = {
    message: GetMachineMessage.FOUND,
    machine: null
  };

  const redis = createClient();
  redis.on('error', err => console.log('Redis Client Error', err));
  await redis.connect();

  try {
    const value = await redis.get(key);

    if (value) {
      response.machine = JSON.parse(value);
    } else {
      response.message = GetMachineMessage.NOT_FOUND;
    }
  } catch (err: unknown) {
    console.log('Redis Client Error on get:', err);
    response.message = GetMachineMessage.UNKNOW_ERROR;
  }
  await redis.quit();

  return response;
};

export const getMachines = async (): Promise<GetMachinesResponse> => {
  const response: GetMachinesResponse = {
    message: GetMachinesMessage.FOUND,
    machines: []
  };

  const redis = createClient();
  redis.on('error', err => console.log('Redis Client Error', err));
  await redis.connect();

  try {
    const value = await redis.get('machines');

    if (value) {
      response.machines = JSON.parse(value);
    } else {
      response.message = GetMachinesMessage.NOT_FOUND;
    }
  } catch (err: unknown) {
    console.log('Redis Client Error on get:', err);
    response.message = GetMachinesMessage.UNKNOW_ERROR;
  }
  await redis.quit();

  return response;
};

export const setMachineHistory = async (
  nickname: string,
  cpuState: MachineCPUInfo,
  memoryState: MachineMemoryInfo
): Promise<void> => {
  const redis = createClient();
  redis.on('error', err => console.log('Redis Client Error', err));
  await redis.connect();

  try {
    const currentHistory: MachineHistory = JSON.parse(
      (await redis.get(`${nickname}History`)) || '{"cpu": [], "memory": []}'
    );

    const timestamp = new Date();
    const newHistory: MachineHistory = {
      cpu: [...currentHistory.cpu, { ...cpuState, timestamp }],
      memory: [...currentHistory.memory, { ...memoryState, timestamp }]
    };

    await redis.set(`${nickname}History`, JSON.stringify(newHistory));
  } catch (err: unknown) {
    throw new Error(
      `add current state to machine (${nickname}) history. ${err}`
    );
  }
  await redis.quit();
};

export const getMachineHistory = async (
  nickname: string
): Promise<MachineHistory> => {
  const redis = createClient();
  redis.on('error', err => console.log('Redis Client Error', err));
  await redis.connect();

  const history = JSON.parse(await redis.get(`${nickname}History`)) || { cpu: {}, memory: {} };

  await redis.quit();

  return history;
};
