import fastapi
import starlette.middleware.cors

from app.api.routes import router

def initialize_app() -> fastapi.FastAPI:
	app = fastapi.FastAPI(title='Marcys iteration between client and interface.', version='0.0.1')

	app.add_middleware(
		starlette.middleware.cors.CORSMiddleware,
		allow_origins=['*'],
		allow_credentials=True,
		allow_methods=['*'],
		allow_headers=['*']
	)

	app.include_router(router.routes)

	return app

app = initialize_app()