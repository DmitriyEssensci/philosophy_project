from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from default.routes import router as default_router
from data_contoller.routes import router as data_router
from data_contoller.api import router as data_router_api

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(default_router)

app.include_router(data_router_api)
app.include_router(data_router)
