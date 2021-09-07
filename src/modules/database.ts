// import ioredis from 'ioredis';
import { createClient } from 'redis';

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
	UNKNOW_ERROR = "Unkown error when trying to get it from the Database",
}

export interface GetMachineResponse {
	message: GetMachineMessage,
	machine: Machine | null;
}

export const setMachine = async (machine: Machine): Promise<SetMachineMessage> => {
	let response: SetMachineMessage = SetMachineMessage.ADDED;

	const redis = createClient();
	redis.on('error', err => console.log('Redis Client Error', err));
	await redis.connect();

	try {
		await redis.set(machine.nickname, JSON.stringify(machine));
	} catch (err) {
		console.log('Redis Client Error on set:', err);
		response = SetMachineMessage.FAILED;
	}
	await redis.quit();

	return response;
}

export const getMachine = async (key: Machine["nickname"]): Promise<GetMachineResponse> => {
	let response: GetMachineResponse = { message: GetMachineMessage.FOUND, machine: null };

	const redis = createClient();
	redis.on('error', err => console.log('Redis Client Error', err));
	await redis.connect();

	try {
		const value = await redis.get(key);

		if (value) {
			response.machine = JSON.parse(value);
		} else {
			response.message = GetMachineMessage.NOT_FOUND;
		}
	} catch (err) {
		console.log('Redis Client Error on get:', err);
		response.message = GetMachineMessage.UNKNOW_ERROR;
	}
	await redis.quit();

	return response;
}
