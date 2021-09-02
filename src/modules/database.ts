import ioredis from 'ioredis';

export interface Machine {
	ip: string;
	nickname: string;
}

// I need help setting up tests for the FAILED cases
// both in setMachines and getMachines
// I've read the documentation of the ioredis to see
// when it throw erros, but didn't find anything usefull
export enum SetMachineMessage {
	ADDED = "Successfuly added the machine.",
	FAILED = "Unkown error when trying to add into the Database",
}

export enum GetMachineMessage {
	FOUND = "Found one machine register on Database",
	NOT_FOUND = "Did not found any register on Database",
	UNKNOW_ERROR = "Unkown error when trying to add into the Database",
}

export interface GetMachineResponse {
	message: GetMachineMessage,
	machine: Machine | null;
}

export const setMachine = async (machine: Machine): Promise<SetMachineMessage> => {
	const redis = new ioredis();
	let response: SetMachineMessage = SetMachineMessage.ADDED;

	redis.set(machine.nickname, JSON.stringify(machine))
	.catch(_ => response = SetMachineMessage.FAILED);

	return response;
}

export const getMachine = async (machineNickname: Machine["nickname"]): Promise<GetMachineResponse> => {
	const redis = new ioredis();
	let response: GetMachineResponse = { message: GetMachineMessage.FOUND, machine: null };

	try {
		let result = await redis.get(machineNickname);

		if (result) {
			response.machine = JSON.parse(result);
		} else {
			response.message = GetMachineMessage.NOT_FOUND;
		}
	} catch (error) {
		response.message = GetMachineMessage.UNKNOW_ERROR;
	}

	return response;
}