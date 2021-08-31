import app from '../../src/app';
import supertest from 'supertest';

describe("POST /machines - create new machine endpoint", () => {
	it("Successfuly create a new application", async () => {
		const result = await supertest(app)
			.post("/machines")
			.set('Content-type', 'application/json')
			.send({ 'ip': '0.0.0.0', 'nickname': 'localhost'});

		expect(result.body).toEqual({ message: { ip: '0.0.0.0', nickname: 'localhost' } });
		expect(result.statusCode).toEqual(200);
	});
});

describe("GET /machines - get all registered machines endpoint", () => {
	it("Successfuly received the machines", async () => {
		const result = await supertest(app).get("/machines");

		expect(result.body).toEqual({ message: {} });
		expect(result.statusCode).toEqual(200);
	});
});