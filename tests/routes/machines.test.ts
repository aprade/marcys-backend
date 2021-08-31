import app from '../../src/app';
import supertest from 'supertest';

describe("POST /machines - create new machine endpoint", () => {
	it("Successfuly create a new application", async () => {
		const payload = {'ip': '0.0.0.0', 'nickname': 'localhost'};
		const result = await supertest(app)
			.post("/machines")
			.set('Content-type', 'application/json')
			.send(payload);

		expect(result.body).toEqual({ message: payload });
		expect(result.statusCode).toEqual(200);
	});

	it("Failed while validating IP", async () => {
		const payload = {'ip': '222.666.111.44', 'nickname': 'localhost'};
		const result = await supertest(app)
			.post("/machines")
			.set('Content-type', 'application/json')
			.send(payload);

		expect(result.body).toEqual({
			message: 'Invalid IP',
			status_code: 406,
			machine: payload,
		});
		expect(result.statusCode).toEqual(406);
	});
});



describe("GET /machines - get all registered machines endpoint", () => {
	it("Successfuly received the machines", async () => {
		const result = await supertest(app).get("/machines");

		expect(result.body).toEqual({ message: {} });
		expect(result.statusCode).toEqual(200);
	});
});