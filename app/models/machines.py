from pydantic import (
	BaseModel,
	Field
)

class MachineSchema(BaseModel):
	ip: str = Field(...)
	custom_name: str = Field(...)