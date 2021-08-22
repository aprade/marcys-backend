import fastapi

from . import (
	add,
)

routes = fastapi.APIRouter()
routes.include_router(add.router, tags=["machines"], prefix="/machines")