import json

def test_add_machine_success(test_app):
	test_request_payload = {"ip": "192.168.1.101", "custom_name": "my-computer"}
	test_response_payload = {"data":[test_request_payload],"code":200,"message":"Machine added successfully!"}

	response = test_app.post("/machines/add", json=test_request_payload)

	assert response.status_code == 200
	assert response.json() == test_response_payload

def test_add_machine_invalid_json(test_app):
	test_request_payload = {"ip": "192.168.1.101"}
	test_response_payload = {"detail": [{"loc": ["body", "custom_name"], "msg": "field required", "type": "value_error.missing"}]}

	response = test_app.post("/machines/add", json=test_request_payload)

	assert response.status_code == 422
	assert response.json() == test_response_payload

def test_add_machine_invalid_ip(test_app):
	test_request_payload = {"ip": "222.666.111.44", "custom_name": "my-pc"}
	test_response_payload = {"error": "Invalid IP address", "code": 422, "message": "Please provide a valid IP address"}

	response = test_app.post("/machines/add", json=test_request_payload)

	assert response.status_code == 422
	assert response.json() == test_response_payload