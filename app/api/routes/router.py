import fastapi

from . import (
	machines,
)

routes = fastapi.APIRouter()
routes.include_router(machines.router.routes, tags=["machines"])