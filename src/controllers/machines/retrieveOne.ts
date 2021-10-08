import { Request, Response } from 'express';
import {
  checkMachine,
  getMachineCPUInfo,
  getMachineMemoryInfo
} from '../../modules/api';
import {
  getMachine,
  getMachineHistory,
  GetMachineMessage,
  setMachineHistory
} from '../../modules/database';

const handler = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { nickname } = request.body;

  const databaseResult = await getMachine(nickname);

  switch (databaseResult.message) {
    case GetMachineMessage.FOUND:
      break;
    case GetMachineMessage.NOT_FOUND:
      return response.status(404).json({
        ...databaseResult
      });
    case GetMachineMessage.UNKNOW_ERROR:
      return response.status(500).json({
        ...databaseResult
      });
    default:
      return response.status(500).json({
        message: 'Unkown error type',
        machine: null
      });
  }

  if (await checkMachine()) {
    return response.status(404).json({
      message:
        'Could not connect to the specified IP. Verify if it can be reached by the outside world',
      machine: request.body,
      status: 'FAILED'
    });
  }

  const machineHistory = await getMachineHistory(nickname);
  const machineCPUInfo = await getMachineCPUInfo();
  const machineMemoryInfo = await getMachineMemoryInfo();

  await setMachineHistory(nickname, machineCPUInfo, machineMemoryInfo);

  return response.status(200).json({
    machineHistory,
    machineState: {
      cpu: { ...machineCPUInfo },
      memory: { ...machineMemoryInfo }
    }
  });
};

export default handler;
