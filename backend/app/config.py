from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = Path(__file__).resolve().parents[1]
TMB_PATH = PROJECT_ROOT / ".tmb"

DATABASE_NAME = "studysync"
DEFAULT_USER_ID = "user-khushi"


def _normalize_mongo_uri(raw: str) -> str:
    uri = raw.strip().strip('"').strip("'")
    if not uri:
        raise RuntimeError(f"MongoDB URL is empty. Put the Atlas URL in {TMB_PATH}")

    if uri.startswith("MONGODB_URI="):
        uri = uri.split("=", 1)[1].strip()

    if not uri.startswith("mongodb"):
        uri = f"mongodb+srv://{uri}"

    if "retryWrites=" not in uri:
        joiner = "&" if "?" in uri else "?"
        uri = f"{uri}{joiner}retryWrites=true&w=majority"

    return uri


def load_mongo_uri() -> str:
    if not TMB_PATH.exists():
        raise RuntimeError(f"Missing {TMB_PATH}. Create it with your MongoDB Atlas URL.")

    first_non_empty = ""
    for line in TMB_PATH.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if stripped and not stripped.startswith("#"):
            first_non_empty = stripped
            break

    return _normalize_mongo_uri(first_non_empty)
