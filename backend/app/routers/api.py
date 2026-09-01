from datetime import datetime

from fastapi import APIRouter, Body, HTTPException

from ..config import DEFAULT_USER_ID
from ..db import get_db, get_connection_status
from ..models import ChatRequest, Task, UserProfile
from ..serializers import serialize_doc, serialize_list

router = APIRouter(prefix="/api", tags=["api"])


@router.get("/health")
async def health():
    database = get_db()
    status = get_connection_status()
    ping = await database.command("ping")
    return {
        "status": "ok",
        "database": database.name,
        "mongo_connected": status.get("is_connected_to_mongo", False),
        "time": datetime.utcnow().isoformat() + "Z",
    }


@router.get("/bootstrap")
async def bootstrap():
    database = get_db()
    user_id = DEFAULT_USER_ID
    user = await database.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    tasks = await database.tasks.find({"userId": user_id}).to_list(200)
    study_plan = await database.study_plans.find_one({"userId": user_id, "id": "plan-current"})
    history = await database.history.find({"userId": user_id}).to_list(200)
    notifications = await database.notifications.find({"userId": user_id}).to_list(100)
    badges = await database.badges.find({"userId": user_id}).to_list(50)
    weekly = await database.weekly_analytics.find({"userId": user_id}).to_list(14)
    testimonials = await database.testimonials.find({}).to_list(50)

    return {
        "user": serialize_doc(user),
        "tasks": serialize_list(tasks),
        "studyPlan": serialize_doc(study_plan),
        "history": serialize_list(history),
        "notifications": serialize_list(notifications),
        "badges": serialize_list(badges),
        "weeklyAnalytics": serialize_list(weekly),
        "testimonials": serialize_list(testimonials),
    }


@router.get("/users/me")
async def get_current_user():
    user = await get_db().users.find_one({"id": DEFAULT_USER_ID})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return serialize_doc(user)


@router.put("/users/me")
async def update_current_user(payload: UserProfile):
    database = get_db()
    data = payload.model_dump()
    data["id"] = DEFAULT_USER_ID
    await database.users.update_one({"id": DEFAULT_USER_ID}, {"$set": data}, upsert=True)
    user = await database.users.find_one({"id": DEFAULT_USER_ID})
    return serialize_doc(user)


@router.get("/tasks")
async def list_tasks():
    tasks = await get_db().tasks.find({"userId": DEFAULT_USER_ID}).to_list(200)
    return serialize_list(tasks)


@router.post("/tasks")
async def create_task(payload: Task):
    database = get_db()
    data = payload.model_dump()
    data["userId"] = DEFAULT_USER_ID
    existing = await database.tasks.find_one({"id": data["id"]})
    if existing:
        raise HTTPException(status_code=409, detail="Task already exists")
    await database.tasks.insert_one(data)
    return serialize_doc(await database.tasks.find_one({"id": data["id"]}))


@router.patch("/tasks/{task_id}")
async def update_task(task_id: str, payload: dict = Body(...)):
    database = get_db()
    payload.pop("_id", None)
    payload.pop("id", None)
    result = await database.tasks.update_one(
        {"id": task_id, "userId": DEFAULT_USER_ID},
        {"$set": payload},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return serialize_doc(await database.tasks.find_one({"id": task_id}))


@router.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    result = await get_db().tasks.delete_one({"id": task_id, "userId": DEFAULT_USER_ID})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"ok": True}


@router.get("/study-plans/current")
async def get_current_plan():
    plan = await get_db().study_plans.find_one({"userId": DEFAULT_USER_ID, "id": "plan-current"})
    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")
    return serialize_doc(plan)


@router.put("/study-plans/current")
async def replace_current_plan(payload: dict = Body(...)):
    database = get_db()
    payload.pop("_id", None)
    payload["id"] = "plan-current"
    payload["userId"] = DEFAULT_USER_ID
    await database.study_plans.update_one(
        {"id": "plan-current", "userId": DEFAULT_USER_ID},
        {"$set": payload},
        upsert=True,
    )
    return serialize_doc(await database.study_plans.find_one({"id": "plan-current"}))


@router.patch("/study-plans/items/{item_id}")
async def toggle_plan_item(item_id: str, payload: dict = Body(...)):
    database = get_db()
    completed = bool(payload.get("completed", True))
    plan = await database.study_plans.find_one({"id": "plan-current", "userId": DEFAULT_USER_ID})
    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")

    found = False
    for week in plan.get("weeks", []):
        for day in week.get("days", []):
            for item in day.get("items", []):
                if item.get("id") == item_id:
                    item["completed"] = completed
                    found = True

    if not found:
        raise HTTPException(status_code=404, detail="Plan item not found")

    await database.study_plans.replace_one({"id": "plan-current"}, plan)
    return serialize_doc(await database.study_plans.find_one({"id": "plan-current"}))


@router.get("/history")
async def list_history():
    items = await get_db().history.find({"userId": DEFAULT_USER_ID}).to_list(200)
    return serialize_list(items)


@router.get("/notifications")
async def list_notifications():
    items = await get_db().notifications.find({"userId": DEFAULT_USER_ID}).to_list(100)
    return serialize_list(items)


@router.patch("/notifications/{notification_id}")
async def mark_notification(notification_id: str, payload: dict = Body(...)):
    database = get_db()
    result = await database.notifications.update_one(
        {"id": notification_id, "userId": DEFAULT_USER_ID},
        {"$set": {"read": bool(payload.get("read", True))}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return serialize_doc(await database.notifications.find_one({"id": notification_id}))


@router.get("/analytics/weekly")
async def weekly_analytics():
    items = await get_db().weekly_analytics.find({"userId": DEFAULT_USER_ID}).to_list(14)
    return serialize_list(items)


@router.get("/badges")
async def list_badges():
    items = await get_db().badges.find({"userId": DEFAULT_USER_ID}).to_list(50)
    return serialize_list(items)


@router.get("/testimonials")
async def list_testimonials():
    items = await get_db().testimonials.find({}).to_list(50)
    return serialize_list(items)


AI_REPLIES = {
    "mcq": "Here is a quick high-yield MCQ set for your current topic:\n\n**Q1:** What is the primary role of ATP synthase in cellular respiration?\n- A) To hydrolyze glucose\n- B) To generate ATP from ADP using a proton gradient (Correct)\n- C) To produce NADH in the cytoplasm\n- D) To break down fatty acids\n\n*Would you like me to run through the remaining 9 questions interactively?*",
    "explain": "Here is a simple breakdown:\n\n**The Big Idea:** Think of this concept like a traffic roundabout instead of a 4-way stop. Rather than waiting for one item to complete before moving, multiple threads process in parallel.\n\nKey takeaways:\n1. **Input:** Information is broken into bite-sized packets.\n2. **Processing:** Core nodes prioritize urgent tasks.\n3. **Output:** Clean, synchronized results delivered without bottlenecks.",
    "revise": "Let's do an active recall check! 🧠\n\n**Prompt:** Without checking your notes, can you explain the difference between *proportional representation* and *first-past-the-post* voting systems?\n\nType your thoughts below and I'll grade your answer with instant feedback!",
    "solve": "Let's solve this together systematically:\n\n**Step 1:** Identify given variables and constraints.\n**Step 2:** Formulate the governing equation.\n**Step 3:** Differentiate with respect to the target variable.\n**Step 4:** Substitute boundary conditions to evaluate the constant.\n\nPaste your exact equation or problem and I'll walk you through each step!",
}


def _ai_reply(query: str) -> str:
    lower = query.lower()
    if "mcq" in lower or "quiz" in lower or "questions" in lower:
        return AI_REPLIES["mcq"]
    if "simply" in lower or "simple" in lower or "explain" in lower:
        return AI_REPLIES["explain"]
    if "revise" in lower or "revision" in lower or "recall" in lower:
        return AI_REPLIES["revise"]
    if "solve" in lower or "step" in lower or "calculate" in lower:
        return AI_REPLIES["solve"]
    return (
        f"That's a great question regarding **{query}**.\n\n"
        "In our syllabus analysis, this relates directly to your upcoming exam objectives. "
        "Here is how you should structure your mastery:\n\n"
        "1. **Core Concept:** First, grasp the fundamental definitions and underlying axioms.\n"
        "2. **Common Exam Trap:** Watch out for edge cases and sign changes in multi-step questions.\n"
        "3. **Quick Practice:** Would you like me to generate 3 practice questions or a 5-minute summary sheet for this topic?"
    )


@router.get("/chat")
async def list_chat():
    items = await get_db().chat_messages.find({"userId": DEFAULT_USER_ID}).to_list(200)
    return serialize_list(items)


@router.post("/chat")
async def send_chat(payload: ChatRequest):
    database = get_db()
    now = datetime.now().strftime("%H:%M")
    user_msg = {
        "id": f"usr-{int(datetime.utcnow().timestamp() * 1000)}",
        "userId": DEFAULT_USER_ID,
        "sender": "user",
        "text": payload.text,
        "time": now,
    }
    ai_msg = {
        "id": f"ai-{int(datetime.utcnow().timestamp() * 1000) + 1}",
        "userId": DEFAULT_USER_ID,
        "sender": "ai",
        "text": _ai_reply(payload.text),
        "time": now,
    }
    await database.chat_messages.insert_many([user_msg, ai_msg])
    return {"user": serialize_doc(user_msg), "ai": serialize_doc(ai_msg)}
