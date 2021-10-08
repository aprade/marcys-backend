import { Request, Response } from 'express';
import { getMachines, GetMachinesMessage } from '../../modules/database';

const handler = async (
  _request: Request,
  response: Response
): Promise<Response> => {
  const databaseResult = await getMachines();

  switch (databaseResult.message) {
    case GetMachinesMessage.FOUND:
      return response.status(200).json({
        ...databaseResult,
        status_code: 200
      });
    case GetMachinesMessage.NOT_FOUND:
      return response.status(404).json({
        ...databaseResult,
        status_code: 404
      });
    case GetMachinesMessage.UNKNOW_ERROR:
      return response.status(500).json({
        ...databaseResult,
        status_code: 500
      });
    default:
      return response.status(500).json({
        message: 'Unkown error type',
        machine: null,
        status_code: 500
      });
  }
};

export default handler;
