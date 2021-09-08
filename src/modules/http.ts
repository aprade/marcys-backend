import qs from "qs";
import fetch, { Request } from 'node-fetch';

interface Options {
	query?: Record<string, unknown>;
}

interface Init extends Options {
	method: string,
	body?: string,
}

enum Params {
	'TEST',
	'YEES'
}

const request = (endpoint: string, init?: Init, _params?: Params): Request => {
	if (init !== undefined && init.query !== undefined) {
		endpoint = `${endpoint}?${qs.stringify(init.query)}`;
	}

	return new Request(`http://localhost:8000/${endpoint}`, {
		headers: {
			"Content-Type":  "application/json",
		},
		...init,
	});
};

const http = async <T>(req: Request): Promise<T> => {
	const res = await fetch(req);
	const body = await res.json();

	if (!res.ok)
		{throw new Error();}

	return body;
}

export const get = async <T>(endpoint: string, options?: Options, params?: Params): Promise<T> =>
	http<T>(request(endpoint, { method: 'GET', ...options }, params));

export const post = async <I, D>(
	endpoint: string,
	body: I,
	options?: Options,
	params?: Params): Promise<D> =>
		http<D>(
			request(endpoint, {
				method: 'POST',
				body: JSON.stringify(body),	
				...options
			},
			params
		));