import os
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = PROJECT_ROOT / ".env"
TMB_PATH = PROJECT_ROOT / ".tmb"

DATABASE_NAME = "studysync"
DEFAULT_USER_ID = "user-khushi"


def _normalize_mongo_uri(raw: str) -> str:
    uri = raw.strip().strip('"').strip("'")
    if not uri:
        raise RuntimeError("MongoDB URL is empty. Please set MONGODB_URI in .env or .tmb")

    if uri.startswith("MONGODB_URI="):
        uri = uri.split("=", 1)[1].strip().strip('"').strip("'")

    if not uri.startswith("mongodb"):
        uri = f"mongodb+srv://{uri}"

    if "retryWrites=" not in uri:
        joiner = "&" if "?" in uri else "?"
        uri = f"{uri}{joiner}retryWrites=true&w=majority"

    return uri


def load_mongo_uri() -> str:
    # 1. Check environment variable
    if os.environ.get("MONGODB_URI"):
        return _normalize_mongo_uri(os.environ["MONGODB_URI"])

    # 2. Check .env file
    if ENV_PATH.exists():
        for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
            stripped = line.strip()
            if stripped.startswith("MONGODB_URI="):
                val = stripped.split("=", 1)[1].strip().strip('"').strip("'")
                if val:
                    return _normalize_mongo_uri(val)

    # 3. Check .tmb file
    if TMB_PATH.exists():
        for line in TMB_PATH.read_text(encoding="utf-8").splitlines():
            stripped = line.strip()
            if stripped and not stripped.startswith("#"):
                return _normalize_mongo_uri(stripped)

    raise RuntimeError(f"Missing MongoDB configuration. Please provide MONGODB_URI in {ENV_PATH} or {TMB_PATH}.")
