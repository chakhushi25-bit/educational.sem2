from typing import Any


def serialize_doc(doc: dict[str, Any] | None) -> dict[str, Any] | None:
    if doc is None:
        return None
    data = dict(doc)
    if "_id" in data:
        data["_id"] = str(data["_id"])
    return data


def serialize_list(docs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [serialize_doc(doc) for doc in docs]
