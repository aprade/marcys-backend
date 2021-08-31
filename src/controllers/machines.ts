import { Request, Response } from 'express';
import validator from "../modules/validator"

interface Machine {
	ip: string;
	nickname: string;
}

const addMachine = async (req: Request<string, Machine>, res: Response): Promise<Response> => {
	if (!await validator.ipValidator(req.body.ip)){
		return res.status(406).json({
			message: 'Invalid IP',
			status_code: 406,
			machine: req.body,
		});
	}
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