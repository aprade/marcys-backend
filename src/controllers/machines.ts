import { Request, Response } from 'express';

interface Machine {
	ip: string;
	nickname: string;
}

const addMachine = async (req: Request<string, Machine>, res: Response): Promise<Response> => {
	console.log('body', req.body);

	return res.status(200).json({
		message: req.body
	});
}

const getMachines = async (req: Request, res: Response): Promise<Response> => {
	return res.status(200).json({
		message: req.body
	});
}

export default {
	addMachine,
	getMachines,
};