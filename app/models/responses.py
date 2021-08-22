from fastapi.responses import JSONResponse

def ResponseModel(data, message):
	return {
		"data": [_data for _data in data] if isinstance(data, list) else [data],
		"code": 200,
		"message": message
	}

def ErrorResponseModel(error, code, message):
	return JSONResponse(
		status_code=code,
		content={
			"error": error,
			"code": code,
			"message": message
		}
	)