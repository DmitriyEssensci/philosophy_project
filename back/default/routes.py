# auth/login/routes.py
from fastapi import APIRouter

router = APIRouter(prefix="/default", tags=["default"])

@router.get("/")
async def root():
    return {"message": "Hello World"}