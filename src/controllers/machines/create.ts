import { Request, Response } from 'express';
import validator from '../../modules/validator';
import { checkMachine } from '../../modules/api';
import { setMachine, SetMachineMessage } from '../../modules/database';

const handler = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { ip, nickname } = request.body;

  if (!validator.ipValidator(ip)) {
    return response.status(406).json({
      message: 'The provided IP address is invalid.',
      machine: request.body,
      status: 'FAILED'
    });
  }

  if (!(await checkMachine())) {
    return response.status(404).json({
      message: 'Could not connect to the specified IP.',
      machine: request.body,
      status: 'FAILED'
    });
  }

  const databaseResult = await setMachine({ ip, nickname });

  switch (databaseResult) {
    case SetMachineMessage.ADDED:
      return response.status(200).json({
        message: databaseResult,
        machine: request.body,
        status: 'SUCCESS'
      });
    case SetMachineMessage.FAILED:
      return response.status(500).json({
        message: databaseResult,
        machine: request.body,
        status: 'FAILED'
      });
    default:
      return response.status(500).json({
        message: 'Unkown error type',
        machine: request.body,
        status: 'FAILED'
      });
  }
};

export default handler;
