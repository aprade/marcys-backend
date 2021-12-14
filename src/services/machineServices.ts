import { PrismaClient } from '@prisma/client';
import { IMachine } from '../entities/machine';

export type MachineCreationParam = Omit<IMachine, 'id' | 'addedAt'>;

export class MachineService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public get(id: string, ip?: string): IMachine {
    return {
      id,
      ip: '192.168.1.111',
      name: 'localmachine',
      addedAt: new Date()
    };
  }

  public create(machineCreationParams: MachineCreationParam): IMachine {
    return {
      id: 'kklkkkk',
      ip: '192.168.1.111',
      name: 'localmachine',
      addedAt: new Date()
    };
  }
}
