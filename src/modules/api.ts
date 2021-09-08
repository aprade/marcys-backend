import * as http from './http';

export type CheckMachine = boolean;

export const checkMachine = async (): Promise<CheckMachine> => {
  try {
    await http.get<string>('/');
  } catch (err: unknown) {
    return false;
  }

  return true;
};
