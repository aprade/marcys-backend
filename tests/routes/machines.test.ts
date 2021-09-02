jest.mock('../../src/modules/api');

import app from '../../src/app';
import supertest from 'supertest';

import * as api from '../../src/modules/api';

const checkMachineMock = api.checkMachine as jest.Mock<Promise<api.CheckMachine>>; 

describe("POST /machines - create new machine endpoint", () => {
	it("Successfuly create a new application", async () => {
		checkMachineMock.mockResolvedValue(true);

		const payload = {'ip': '0.0.0.0', 'nickname': 'localhost'};
		const result = await supertest(app)
			.post("/machines")
			.set('Content-type', 'application/json')
			.send(payload);

		expect(result.body).toEqual({
			message: "Successfuly added the machine.",
			status_code: 200,
			machine: payload,
		});
		expect(result.statusCode).toEqual(200);
	});

	it("Failed while validating IP", async () => {
		const payload = {'ip': '222.666.111.44', 'nickname': 'localhost'};
		const result = await supertest(app)
			.post("/machines")
			.set('Content-type', 'application/json')
			.send(payload);

		expect(result.body).toEqual({
			message: "The provided IP address is invalid.",
			status_code: 406,
			machine: payload,
		});
		expect(result.statusCode).toEqual(406);
	});

	it("Failed while checking for a valid machine", async () => {
		checkMachineMock.mockResolvedValue(false);

		const payload = {'ip': '0.0.0.0', 'nickname': 'localhost'};
		const result = await supertest(app)
			.post("/machines")
			.set('Content-type', 'application/json')
			.send(payload);

		expect(result.body).toEqual({
			message: "Could not connect to the specified IP. Verify if it can be reached by the outside world",
			status_code: 404,
			machine: payload,
		});
		expect(result.statusCode).toEqual(404);
	});
});

describe("GET /machines - get all registered machines endpoint", () => {
	it("Successfuly received the machines", async () => {
		const result = await supertest(app).get("/machines");

		expect(result.body).toEqual({ message: {} });
		expect(result.statusCode).toEqual(200);
	});
});