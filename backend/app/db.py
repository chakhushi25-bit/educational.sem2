import copy
import logging
from typing import Any
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from .config import DATABASE_NAME, load_mongo_uri

logger = logging.getLogger("studysync.db")

mongo_client: AsyncIOMotorClient | None = None
db: Any = None
is_connected_to_mongo: bool = False


class _InMemoryCursor:
    def __init__(self, docs: list[dict]):
        self._docs = docs

    async def to_list(self, length: int | None = None) -> list[dict]:
        if length is None:
            return [copy.deepcopy(d) for d in self._docs]
        return [copy.deepcopy(d) for d in self._docs[:length]]


class _InMemoryCollection:
    def __init__(self, name: str):
        self.name = name
        self._docs: list[dict] = []

    def _matches(self, doc: dict, query: dict) -> bool:
        for k, v in query.items():
            if doc.get(k) != v:
                return False
        return True

    async def create_index(self, *args, **kwargs) -> str:
        return "idx_ok"

    def find(self, query: dict | None = None) -> _InMemoryCursor:
        query = query or {}
        matched = [d for d in self._docs if self._matches(d, query)]
        return _InMemoryCursor(matched)

    async def find_one(self, query: dict) -> dict | None:
        for d in self._docs:
            if self._matches(d, query):
                return copy.deepcopy(d)
        return None

    async def count_documents(self, query: dict) -> int:
        return sum(1 for d in self._docs if self._matches(d, query))

    async def insert_one(self, doc: dict) -> Any:
        d = copy.deepcopy(doc)
        if "_id" not in d:
            d["_id"] = str(len(self._docs) + 1)
        self._docs.append(d)
        class Res:
            inserted_id = d["_id"]
        return Res()

    async def insert_many(self, docs: list[dict]) -> Any:
        for doc in docs:
            await self.insert_one(doc)
        class Res:
            pass
        return Res()

    async def update_one(self, query: dict, update: dict, upsert: bool = False) -> Any:
        target = None
        for d in self._docs:
            if self._matches(d, query):
                target = d
                break

        class Res:
            matched_count = 0
            modified_count = 0

        res = Res()
        if target is not None:
            res.matched_count = 1
            if "$set" in update:
                target.update(copy.deepcopy(update["$set"]))
                res.modified_count = 1
            return res

        if upsert:
            new_doc = copy.deepcopy(query)
            if "$set" in update:
                new_doc.update(copy.deepcopy(update["$set"]))
            await self.insert_one(new_doc)
            res.matched_count = 0
            res.modified_count = 1
            return res

        return res

    async def replace_one(self, query: dict, replacement: dict) -> Any:
        for i, d in enumerate(self._docs):
            if self._matches(d, query):
                rep = copy.deepcopy(replacement)
                if "_id" not in rep and "_id" in d:
                    rep["_id"] = d["_id"]
                self._docs[i] = rep
                class Res:
                    matched_count = 1
                    modified_count = 1
                return Res()
        class Res:
            matched_count = 0
            modified_count = 0
        return Res()

    async def delete_one(self, query: dict) -> Any:
        for i, d in enumerate(self._docs):
            if self._matches(d, query):
                self._docs.pop(i)
                class Res:
                    deleted_count = 1
                return Res()
        class Res:
            deleted_count = 0
        return Res()


class _InMemoryDatabase:
    def __init__(self, name: str = DATABASE_NAME):
        self.name = name
        self._collections: dict[str, _InMemoryCollection] = {}

    def __getattr__(self, item: str) -> _InMemoryCollection:
        if item not in self._collections:
            self._collections[item] = _InMemoryCollection(item)
        return self._collections[item]

    async def command(self, cmd: str | dict) -> dict:
        return {"ok": 1}


async def connect_db() -> None:
    global mongo_client, db, is_connected_to_mongo
    uri = load_mongo_uri()
    try:
        logger.info(f"Connecting to MongoDB...")
        client = AsyncIOMotorClient(
            uri,
            serverSelectionTimeoutMS=5000,
            tls=True,
        )
        # Attempt ping
        await client.admin.command("ping")
        mongo_client = client
        db = mongo_client[DATABASE_NAME]
        is_connected_to_mongo = True
        logger.info("Successfully connected to MongoDB Atlas!")
    except Exception as e:
        logger.warning(
            f"Could not connect to MongoDB Atlas directly: {e}. "
            "Falling back to local high-speed in-memory database. "
            "To connect to live Atlas, ensure .tmb has valid credentials: "
            "mongodb+srv://<username>:<password>@cluster0.lxbtm2g.mongodb.net/?appName=Cluster0"
        )
        mongo_client = None
        db = _InMemoryDatabase(DATABASE_NAME)
        is_connected_to_mongo = False


async def close_db() -> None:
    global mongo_client, db, is_connected_to_mongo
    if mongo_client is not None:
        mongo_client.close()
    mongo_client = None
    db = None
    is_connected_to_mongo = False


def get_db():
    global db
    if db is None:
        db = _InMemoryDatabase(DATABASE_NAME)
    return db


def get_connection_status() -> dict:
    return {
        "is_connected_to_mongo": is_connected_to_mongo,
        "database_name": DATABASE_NAME,
    }
