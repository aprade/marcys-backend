import fastapi
import ipaddress

from app.models.machines import (
	MachineSchema
)

from app.models.responses import (
	ResponseModel,
	ErrorResponseModel
)

router = fastapi.APIRouter()

@router.post('/add', response_description="Machine added into the database")
async def add(machine: MachineSchema = fastapi.Body(...)):
	try:
		ipaddress.ip_address(machine.ip)

	except ValueError:
		return ErrorResponseModel("Invalid IP address", 422, "Please provide a valid IP address")

	return ResponseModel(machine, "Machine added successfully!")