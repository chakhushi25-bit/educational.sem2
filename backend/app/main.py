from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import close_db, connect_db, get_db
from .routers.api import router as api_router
from .seed import seed_if_empty


@asynccontextmanager
async def lifespan(_app: FastAPI):
    await connect_db()
    await seed_if_empty(get_db())
    yield
    await close_db()


app = FastAPI(
    title="StudySync API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
async def root():
    return {"app": "StudySync API", "docs": "/docs", "health": "/api/health"}
