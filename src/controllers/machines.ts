import { Request, Response } from 'express';

import * as api from "../modules/api";
import * as database from "../modules/database";
import validator from "../modules/validator";

interface MachineResponse {
	message: string;
	status_code: number;
	machine: database.Machine;
	status: string;
}

const addMachine = async (req: Request<string, database.Machine>, res: Response): Promise<Response<MachineResponse>> => {
	if (!await validator.ipValidator(req.body.ip))
		return res.status(406).json({
			message: "The provided IP address is invalid.",
			status_code: 406,
			machine: req.body,
			status: "FAILED",
		});

	if (!await api.checkMachine())
		return res.status(404).json({
			message: "Could not connect to the specified IP. Verify if it can be reached by the outside world",
			status_code: 404,
			machine: req.body,
			status: "FAILED",
		});

	let databaseResult = await database.setMachine(req.body);

	switch (databaseResult) {
		case database.SetMachineMessage.ADDED:
			return res.status(200).json({
				message: databaseResult,
				status_code: 200,
				machine: req.body,
				status: "SUCCESS",
			});
		case database.SetMachineMessage.FAILED:
			return res.status(500).json({
				message: databaseResult,
				status_code: 500,
				machine: req.body,
				status: "FAILED",
			});
		default:
			return res.status(500).json({
				message: "Unkown error type",
				status_code: 500,
				machine: req.body,
				status: "FAILED",
			});
	}
}

const getMachines = async (req: Request<string, database.Machine["nickname"]>, res: Response): Promise<Response> => {
	let databaseResult = await database.getMachine(req.body.nickname);

	switch (databaseResult.message) {
		case database.GetMachineMessage.FOUND:
			return res.status(200).json({
				...databaseResult,
				status_code: 200,
			});
		case database.GetMachineMessage.NOT_FOUND:
			return res.status(404).json({
				...databaseResult,
				status_code: 404, 
			});
		case database.GetMachineMessage.UNKNOW_ERROR:
			return res.status(500).json({
				...databaseResult,
				status_code: 500,
			});
		default:
			return res.status(500).json({
				message: "Unkown error type",
				machine: null,
				status_code: 500,
			});
	}
}

export default {
	addMachine,
	getMachines,
};