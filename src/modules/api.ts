import * as http from './http';

export type CheckMachine = boolean;

interface MachineCPULoadAverage {
  one: number;
  five: number;
  fifteen: number;
}

export interface MachineCPUInfo {
  frequency: number;
  logical_cores: number;
  physical_cores: number;
  load_average: MachineCPULoadAverage;
}

export interface MachineMemoryInfo {
  total: number;
  free: number;
  used: number;
  shared: number;
  buffers: number;
  cached: number;
}

export const checkMachine = async (): Promise<CheckMachine> => {
  try {
    await http.get<string>('/');
  } catch (err: unknown) {
    return false;
  }

  return true;
};

export const getMachineCPUInfo = async (): Promise<MachineCPUInfo> =>
  await http.get<MachineCPUInfo>('/cpu');

export const getMachineMemoryInfo = async (): Promise<MachineMemoryInfo> =>
  await http.get<MachineMemoryInfo>('/memory');
