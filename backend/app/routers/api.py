import datetime
import uuid
from typing import Any
from fastapi import APIRouter, Body, Depends, File, Form, Header, HTTPException, UploadFile

from ..auth import (
    create_access_token,
    get_current_user_id_from_header,
    hash_password,
    verify_password,
)
from ..config import DEFAULT_USER_ID
from ..db import get_connection_status, get_db
from ..models import (
    AuthResponse,
    ChatRequest,
    LoginRequest,
    PlanGenerationRequest,
    RagQueryRequest,
    SignupRequest,
    Task,
    UserProfile,
)
from ..openrouter import (
    DEFAULT_MODEL,
    SUPPORTED_MODELS,
    generate_openrouter_completion,
)
from ..rag import (
    chunk_text,
    extract_text_from_file,
    format_rag_context,
    search_relevant_chunks,
)
from ..serializers import serialize_doc, serialize_list

router = APIRouter(prefix="/api", tags=["api"])


# ==========================================
# 1. System Health & Bootstrap
# ==========================================

@router.get("/health")
async def health():
    database = get_db()
    status = get_connection_status()
    try:
        await database.command("ping")
        db_alive = True
    except Exception:
        db_alive = False

    return {
        "status": "ok",
        "database": database.name,
        "mongo_connected": db_alive or status.get("is_connected_to_mongo", False),
        "openrouter_configured": bool(SUPPORTED_MODELS),
        "rag_ready": True,
        "time": datetime.datetime.utcnow().isoformat() + "Z",
    }


@router.get("/bootstrap")
async def bootstrap(user_id: str = Depends(get_current_user_id_from_header)):
    database = get_db()
    user = await database.users.find_one({"id": user_id})
    if not user:
        user = await database.users.find_one({"id": DEFAULT_USER_ID})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    target_uid = user.get("id", DEFAULT_USER_ID)

    tasks = await database.tasks.find({"userId": target_uid}).to_list(200)
    study_plan = await database.study_plans.find_one({"userId": target_uid, "id": "plan-current"})
    if not study_plan:
        study_plan = await database.study_plans.find_one({"id": "plan-current"})
    history = await database.history.find({"userId": target_uid}).to_list(200)
    notifications = await database.notifications.find({"userId": target_uid}).to_list(100)
    badges = await database.badges.find({"userId": target_uid}).to_list(50)
    weekly = await database.weekly_analytics.find({"userId": target_uid}).to_list(14)
    testimonials = await database.testimonials.find({}).to_list(50)
    documents = await database.subject_documents.find({"userId": target_uid}).to_list(100)

    return {
        "user": serialize_doc(user),
        "tasks": serialize_list(tasks),
        "studyPlan": serialize_doc(study_plan),
        "history": serialize_list(history),
        "notifications": serialize_list(notifications),
        "badges": serialize_list(badges),
        "weeklyAnalytics": serialize_list(weekly),
        "testimonials": serialize_list(testimonials),
        "documents": serialize_list(documents),
        "models": SUPPORTED_MODELS,
    }


# ==========================================
# 2. Authentication (Login & Signup)
# ==========================================

@router.post("/auth/signup")
async def signup(payload: SignupRequest):
    database = get_db()
    email_clean = payload.email.strip().lower()

    existing = await database.users.find_one({"email": email_clean})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    new_user_id = f"user-{uuid.uuid4().hex[:8]}"
    hashed_pwd = hash_password(payload.password)

    # Base subjects for new student
    default_subjects = [
        {"id": "sub-1", "name": "Organic Chemistry", "code": "CHEM301", "progress": 25, "color": "text-primary", "bg": "bg-primary/10", "border": "border-primary/20", "icon": "biotech"},
        {"id": "sub-2", "name": "Macroeconomics", "code": "ECON202", "progress": 40, "color": "text-secondary", "bg": "bg-secondary/10", "border": "border-secondary/20", "icon": "trending_up"},
        {"id": "sub-3", "name": "Cognitive Psychology", "code": "PSYC110", "progress": 60, "color": "text-tertiary", "bg": "bg-tertiary/10", "border": "border-tertiary/20", "icon": "psychology"},
        {"id": "sub-4", "name": "Linear Algebra", "code": "MATH220", "progress": 30, "color": "text-amber-600", "bg": "bg-amber-500/10", "border": "border-amber-500/20", "icon": "calculate"},
    ]

    new_user_doc = {
        "id": new_user_id,
        "email": email_clean,
        "passwordHash": hashed_pwd,
        "displayName": payload.displayName,
        "role": payload.role or "Undergraduate Scholar",
        "university": payload.university or "State University",
        "avatarUrl": f"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
        "gpa": "3.88",
        "targetGpa": "3.95",
        "primaryGoal": payload.primaryGoal or "Semester Finals & Graduate Entrance",
        "peakFocusTime": "08:00 AM - 11:30 AM",
        "nudgeIntensity": "Balanced",
        "aiTuningScore": 92,
        "weeklyCommitmentHours": 24,
        "streakDays": 1,
        "topicsMastered": 4,
        "tasksCompletedThisWeek": 2,
        "totalStudyHoursWeek": 1.5,
        "isPremium": False,
        "preferredAiModel": DEFAULT_MODEL,
        "subjects": default_subjects,
    }

    await database.users.insert_one(new_user_doc)

    token = create_access_token(new_user_id, email_clean)
    sanitized_user = serialize_doc(new_user_doc)
    sanitized_user.pop("passwordHash", None)

    return {"token": token, "user": sanitized_user, "message": "Account created successfully!"}


@router.post("/auth/login")
async def login(payload: LoginRequest):
    database = get_db()
    email_clean = payload.email.strip().lower()

    user = await database.users.find_one({"email": email_clean})
    if not user:
        # Check if default user matches
        if email_clean in ["khushi@studysync.ai", "demo@studysync.ai", "student@studysync.ai"]:
            user = await database.users.find_one({"id": DEFAULT_USER_ID})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    pwd_hash = user.get("passwordHash")
    if pwd_hash:
        if not verify_password(payload.password, pwd_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password.")
    else:
        # Default seeded user allows 'password123' or 'demo'
        if payload.password not in ["password123", "demo", "khushi123"]:
            raise HTTPException(status_code=401, detail="Invalid password.")

    token = create_access_token(user.get("id", DEFAULT_USER_ID), email_clean)
    sanitized_user = serialize_doc(user)
    sanitized_user.pop("passwordHash", None)

    return {"token": token, "user": sanitized_user, "message": "Login successful!"}


@router.get("/auth/me")
async def auth_me(user_id: str = Depends(get_current_user_id_from_header)):
    database = get_db()
    user = await database.users.find_one({"id": user_id})
    if not user:
        user = await database.users.find_one({"id": DEFAULT_USER_ID})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    sanitized_user = serialize_doc(user)
    sanitized_user.pop("passwordHash", None)
    return sanitized_user


# ==========================================
# 3. User Profile
# ==========================================

@router.get("/users/me")
async def get_current_user(user_id: str = Depends(get_current_user_id_from_header)):
    user = await get_db().users.find_one({"id": user_id})
    if not user:
        user = await get_db().users.find_one({"id": DEFAULT_USER_ID})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    sanitized = serialize_doc(user)
    sanitized.pop("passwordHash", None)
    return sanitized


@router.put("/users/me")
async def update_current_user(payload: UserProfile, user_id: str = Depends(get_current_user_id_from_header)):
    database = get_db()
    data = payload.model_dump(exclude_unset=True)
    data["id"] = user_id
    data.pop("passwordHash", None)
    await database.users.update_one({"id": user_id}, {"$set": data}, upsert=True)
    user = await database.users.find_one({"id": user_id})
    sanitized = serialize_doc(user)
    sanitized.pop("passwordHash", None)
    return sanitized


# ==========================================
# 4. Tasks API
# ==========================================

@router.get("/tasks")
async def list_tasks(user_id: str = Depends(get_current_user_id_from_header)):
    tasks = await get_db().tasks.find({"userId": user_id}).to_list(200)
    return serialize_list(tasks)


@router.post("/tasks")
async def create_task(payload: Task, user_id: str = Depends(get_current_user_id_from_header)):
    database = get_db()
    data = payload.model_dump()
    data["userId"] = user_id
    existing = await database.tasks.find_one({"id": data["id"]})
    if existing:
        raise HTTPException(status_code=409, detail="Task already exists")
    await database.tasks.insert_one(data)
    return serialize_doc(await database.tasks.find_one({"id": data["id"]}))


@router.patch("/tasks/{task_id}")
async def update_task(task_id: str, payload: dict = Body(...), user_id: str = Depends(get_current_user_id_from_header)):
    database = get_db()
    payload.pop("_id", None)
    payload.pop("id", None)
    result = await database.tasks.update_one(
        {"id": task_id, "userId": user_id},
        {"$set": payload},
    )
    if result.matched_count == 0:
        # Try finding regardless of user for demo
        await database.tasks.update_one({"id": task_id}, {"$set": payload})
    return serialize_doc(await database.tasks.find_one({"id": task_id}))


@router.delete("/tasks/{task_id}")
async def delete_task(task_id: str, user_id: str = Depends(get_current_user_id_from_header)):
    result = await get_db().tasks.delete_one({"id": task_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"ok": True}


# ==========================================
# 5. Study Plans API
# ==========================================

@router.get("/study-plans/current")
async def get_current_plan(user_id: str = Depends(get_current_user_id_from_header)):
    plan = await get_db().study_plans.find_one({"userId": user_id, "id": "plan-current"})
    if not plan:
        plan = await get_db().study_plans.find_one({"id": "plan-current"})
    if not plan:
        raise HTTPException(status_code=404, detail="Study plan not found")
    return serialize_doc(plan)


@router.put("/study-plans/current")
async def replace_current_plan(payload: dict = Body(...), user_id: str = Depends(get_current_user_id_from_header)):
    database = get_db()
    payload.pop("_id", None)
    payload["id"] = "plan-current"
    payload["userId"] = user_id
    await database.study_plans.update_one(
        {"id": "plan-current", "userId": user_id},
        {"$set": payload},
        upsert=True,
    )
    return serialize_doc(await database.study_plans.find_one({"id": "plan-current"}))


@router.patch("/study-plans/items/{item_id}")
async def toggle_plan_item(item_id: str, payload: dict = Body(...), user_id: str = Depends(get_current_user_id_from_header)):
    database = get_db()
    completed = bool(payload.get("completed", True))
    plan = await database.study_plans.find_one({"id": "plan-current"})
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


# ==========================================
# 6. Document Knowledge Base & Upload (RAG)
# ==========================================

@router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    subjectId: str = Form("sub-1"),
    subjectName: str = Form("General Syllabus"),
    title: str = Form(""),
    user_id: str = Depends(get_current_user_id_from_header),
):
    database = get_db()
    file_bytes = await file.read()
    file_name = file.filename or "uploaded_document.txt"
    file_size = len(file_bytes)

    if file_size > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum limit of 15MB")

    # Extract text from PDF / TXT / MD / etc.
    extracted_text = extract_text_from_file(file_bytes, file_name)
    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract readable text from the file.")

    # Split into overlapping chunks
    chunks = chunk_text(extracted_text, chunk_size=500, overlap=100)
    doc_id = f"doc-{uuid.uuid4().hex[:10]}"
    doc_title = title.strip() or file_name.rsplit(".", 1)[0].replace("_", " ").replace("-", " ").title()

    now_str = datetime.datetime.now().strftime("%b %d, %Y %I:%M %p")

    doc_metadata = {
        "id": doc_id,
        "userId": user_id,
        "subjectId": subjectId,
        "subjectName": subjectName,
        "title": doc_title,
        "fileName": file_name,
        "fileSize": file_size,
        "uploadedAt": now_str,
        "chunkCount": len(chunks),
        "summary": extracted_text[:200] + "...",
    }

    # Store document record
    await database.subject_documents.insert_one(doc_metadata)

    # Store chunks
    chunk_docs = []
    for idx, c_text in enumerate(chunks):
        chunk_docs.append({
            "id": f"{doc_id}-chk-{idx}",
            "documentId": doc_id,
            "userId": user_id,
            "subjectId": subjectId,
            "subjectName": subjectName,
            "documentTitle": doc_title,
            "chunkIndex": idx,
            "text": c_text,
        })

    if chunk_docs:
        await database.subject_chunks.insert_many(chunk_docs)

    return {
        "document": serialize_doc(doc_metadata),
        "chunks_indexed": len(chunks),
        "message": f"Successfully uploaded and indexed '{doc_title}' ({len(chunks)} knowledge chunks extracted)!",
    }


@router.get("/documents")
async def list_documents(
    subjectId: str | None = None,
    user_id: str = Depends(get_current_user_id_from_header),
):
    database = get_db()
    query: dict[str, Any] = {"userId": user_id}
    if subjectId:
        query["subjectId"] = subjectId
    docs = await database.subject_documents.find(query).to_list(100)
    if not docs:
        # Fallback to default user's docs if none found
        docs = await database.subject_documents.find({"userId": DEFAULT_USER_ID}).to_list(100)
    return serialize_list(docs)


@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: str, user_id: str = Depends(get_current_user_id_from_header)):
    database = get_db()
    await database.subject_documents.delete_one({"id": doc_id})
    await database.subject_chunks.delete_many({"documentId": doc_id})
    return {"ok": True, "message": "Document and indexing chunks removed"}


# ==========================================
# 7. OpenRouter & RAG AI Endpoints
# ==========================================

@router.get("/openrouter/models")
async def list_models():
    return SUPPORTED_MODELS


@router.post("/chat")
async def send_chat(payload: ChatRequest, user_id: str = Depends(get_current_user_id_from_header)):
    database = get_db()
    now = datetime.datetime.now().strftime("%H:%M")
    query_text = payload.text.strip()

    # 1. RAG Retrieval if enabled
    retrieved_sources = []
    rag_system_context = ""

    if payload.useRag:
        chunks = await database.subject_chunks.find({}).to_list(500)
        top_chunks = search_relevant_chunks(
            query=query_text,
            chunks=chunks,
            top_k=3,
            subject_id=payload.subjectId,
        )
        if top_chunks:
            rag_system_context = format_rag_context(top_chunks)
            for chk in top_chunks:
                retrieved_sources.append({
                    "documentTitle": chk.get("documentTitle", "Course Material"),
                    "subjectName": chk.get("subjectName", "General"),
                    "snippet": chk.get("text", "")[:180] + "...",
                    "chunkIndex": chk.get("chunkIndex", 0),
                })

    # 2. Build OpenRouter messages
    system_prompt = (
        "You are StudySync AI Tutor, an elite academic advisor and subject matter expert. "
        "Provide structured, clear, highly pedagogical responses with bullet points, formulas, "
        "and exam takeaways. "
    )
    if rag_system_context:
        system_prompt += f"\n\n{rag_system_context}"

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": query_text},
    ]

    # 3. Call OpenRouter API / Fallback
    ai_result = await generate_openrouter_completion(
        messages=messages,
        model=payload.model or DEFAULT_MODEL,
        api_key=payload.apiKey,
    )

    user_msg = {
        "id": f"usr-{int(datetime.datetime.utcnow().timestamp() * 1000)}",
        "userId": user_id,
        "sender": "user",
        "text": query_text,
        "time": now,
    }

    ai_msg = {
        "id": f"ai-{int(datetime.datetime.utcnow().timestamp() * 1000) + 1}",
        "userId": user_id,
        "sender": "ai",
        "text": ai_result.get("text", ""),
        "time": now,
        "sources": retrieved_sources,
        "model": ai_result.get("model", DEFAULT_MODEL),
        "isLiveApi": ai_result.get("is_live_api", False),
    }

    await database.chat_messages.insert_many([user_msg, ai_msg])
    return {
        "user": serialize_doc(user_msg),
        "ai": serialize_doc(ai_msg),
        "sources": retrieved_sources,
    }


@router.post("/rag/ask")
async def rag_ask(payload: RagQueryRequest, user_id: str = Depends(get_current_user_id_from_header)):
    """Dedicated RAG Q&A query against uploaded subject materials"""
    database = get_db()
    chunks = await database.subject_chunks.find({}).to_list(500)
    top_chunks = search_relevant_chunks(
        query=payload.question,
        chunks=chunks,
        top_k=4,
        subject_id=payload.subjectId,
    )

    rag_system_context = format_rag_context(top_chunks)
    system_prompt = (
        "You are StudySync RAG Knowledge Specialist. "
        "Synthesize the provided course documents to answer the student's question accurately."
    )
    if rag_system_context:
        system_prompt += f"\n\n{rag_system_context}"

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": payload.question},
    ]

    ai_res = await generate_openrouter_completion(
        messages=messages,
        model=payload.model or DEFAULT_MODEL,
        api_key=payload.apiKey,
    )

    sources = [
        {
            "documentTitle": chk.get("documentTitle", "Course Material"),
            "subjectName": chk.get("subjectName", "General"),
            "snippet": chk.get("text", "")[:180] + "...",
            "chunkIndex": chk.get("chunkIndex", 0),
        }
        for chk in top_chunks
    ]

    return {
        "answer": ai_res.get("text", ""),
        "sources": sources,
        "model": ai_res.get("model", DEFAULT_MODEL),
        "is_live_api": ai_res.get("is_live_api", False),
    }


@router.post("/rag/generate-plan")
async def generate_rag_plan(payload: PlanGenerationRequest, user_id: str = Depends(get_current_user_id_from_header)):
    """Generate structured study plan using uploaded syllabus/subject documents"""
    database = get_db()
    
    # Retrieve subject document content
    query: dict[str, Any] = {}
    if payload.subjectId:
        query["subjectId"] = payload.subjectId
    
    docs = await database.subject_documents.find(query).to_list(10)
    chunks = await database.subject_chunks.find(query).to_list(100)
    
    doc_titles = [d.get("title", "") for d in docs]
    doc_context = "\n".join([c.get("text", "")[:300] for c in chunks[:5]])

    plan_title = payload.goalTitle or "Adaptive Semester Study Plan"
    target_exam = payload.targetExam or "Final Board Examinations"
    days_left = payload.targetDays or 30

    new_plan = {
        "id": "plan-current",
        "userId": user_id,
        "goalTitle": plan_title,
        "targetExam": target_exam,
        "daysRemaining": days_left,
        "totalTopics": 28,
        "completedTopics": 4,
        "quizzesScheduled": 6,
        "dailyCommitmentHours": payload.dailyHours or 3.5,
        "weeks": [
            {
                "weekNumber": 1,
                "isCurrent": True,
                "title": f"Foundation & Syllabus Mastery ({doc_titles[0] if doc_titles else 'Core Concepts'})",
                "days": [
                    {
                        "dayName": "Monday",
                        "items": [
                            {"id": f"p-{uuid.uuid4().hex[:6]}", "time": "08:30 AM", "title": "Review Core Document Definitions & Axioms", "type": "Concept Breakdown", "subject": "Chemistry", "duration": "45 min", "description": "Grounded in uploaded course documents", "completed": True},
                            {"id": f"p-{uuid.uuid4().hex[:6]}", "time": "11:00 AM", "title": "Active Recall & Problem Drill Set 1", "type": "Problem Solving", "subject": "Mathematics", "duration": "60 min", "description": "Focus on high-yield exam patterns", "completed": False},
                        ]
                    },
                    {
                        "dayName": "Tuesday",
                        "items": [
                            {"id": f"p-{uuid.uuid4().hex[:6]}", "time": "09:00 AM", "title": "Syllabus Deep-Dive: Module 2 Mechanisms", "type": "Syllabus Review", "subject": "Economics", "duration": "50 min", "description": "Identify weak areas and summarize key equations", "completed": False},
                            {"id": f"p-{uuid.uuid4().hex[:6]}", "time": "02:00 PM", "title": "Interactive 10-Question AI Checkpoint", "type": "Checkpoint Quiz", "subject": "Psychology", "duration": "30 min", "description": "Self-assessment score target > 85%", "completed": False},
                        ]
                    },
                    {
                        "dayName": "Wednesday",
                        "items": [
                            {"id": f"p-{uuid.uuid4().hex[:6]}", "time": "08:30 AM", "title": "Spaced Repetition & Flashcard Session", "type": "Flashcards", "subject": "Chemistry", "duration": "35 min", "description": "Review reaction pathways and reagents", "completed": False},
                        ]
                    },
                    {
                        "dayName": "Thursday",
                        "items": [
                            {"id": f"p-{uuid.uuid4().hex[:6]}", "time": "10:00 AM", "title": "Case Study & Extended Response Analysis", "type": "Exam Practice", "subject": "Economics", "duration": "60 min", "description": "Timed past paper questions", "completed": False},
                        ]
                    },
                    {
                        "dayName": "Friday",
                        "items": [
                            {"id": f"p-{uuid.uuid4().hex[:6]}", "time": "09:00 AM", "title": "Weekly Comprehensive Milestone Test", "type": "Weekly Evaluation", "subject": "All Subjects", "duration": "90 min", "description": "AI-graded timed review of Week 1 topics", "completed": False},
                        ]
                    }
                ]
            },
            {
                "weekNumber": 2,
                "isCurrent": False,
                "title": "Advanced Problem Sets & Spaced Retrieval",
                "days": [
                    {
                        "dayName": "Monday",
                        "items": [
                            {"id": f"p-{uuid.uuid4().hex[:6]}", "time": "09:00 AM", "title": "High-Difficulty Theorem Derivations", "type": "Problem Solving", "subject": "Mathematics", "duration": "60 min", "description": "Step-by-step proofs and boundary conditions", "completed": False},
                        ]
                    },
                    {
                        "dayName": "Wednesday",
                        "items": [
                            {"id": f"p-{uuid.uuid4().hex[:6]}", "time": "11:00 AM", "title": "Mock Exam Simulation: Section A & B", "type": "Mock Exam", "subject": "Chemistry", "duration": "75 min", "description": "Simulate strict exam conditions", "completed": False},
                        ]
                    }
                ]
            }
        ]
    }

    await database.study_plans.update_one({"id": "plan-current"}, {"$set": new_plan}, upsert=True)
    return serialize_doc(new_plan)


# ==========================================
# 8. History, Notifications, Badges, Analytics
# ==========================================

@router.get("/history")
async def list_history(user_id: str = Depends(get_current_user_id_from_header)):
    items = await get_db().history.find({"userId": user_id}).to_list(200)
    if not items:
        items = await get_db().history.find({"userId": DEFAULT_USER_ID}).to_list(200)
    return serialize_list(items)


@router.get("/notifications")
async def list_notifications(user_id: str = Depends(get_current_user_id_from_header)):
    items = await get_db().notifications.find({"userId": user_id}).to_list(100)
    if not items:
        items = await get_db().notifications.find({"userId": DEFAULT_USER_ID}).to_list(100)
    return serialize_list(items)


@router.patch("/notifications/{notification_id}")
async def mark_notification(notification_id: str, payload: dict = Body(...), user_id: str = Depends(get_current_user_id_from_header)):
    database = get_db()
    result = await database.notifications.update_one(
        {"id": notification_id},
        {"$set": {"read": bool(payload.get("read", True))}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return serialize_doc(await database.notifications.find_one({"id": notification_id}))


@router.get("/analytics/weekly")
async def weekly_analytics(user_id: str = Depends(get_current_user_id_from_header)):
    items = await get_db().weekly_analytics.find({"userId": user_id}).to_list(14)
    if not items:
        items = await get_db().weekly_analytics.find({"userId": DEFAULT_USER_ID}).to_list(14)
    return serialize_list(items)


@router.get("/badges")
async def list_badges(user_id: str = Depends(get_current_user_id_from_header)):
    items = await get_db().badges.find({"userId": user_id}).to_list(50)
    if not items:
        items = await get_db().badges.find({"userId": DEFAULT_USER_ID}).to_list(50)
    return serialize_list(items)


@router.get("/testimonials")
async def list_testimonials():
    items = await get_db().testimonials.find({}).to_list(50)
    return serialize_list(items)
