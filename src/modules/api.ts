import * as http from "./http";

interface LeadData {
	name: string,
	email_from: string,
	phone: string
}

export const fetchTime = async (): Promise<any> => http.get<any>("v3/time");

export const createLead = async (data: LeadData): Promise<any> => http.post<any, LeadData>("api/lead", data);