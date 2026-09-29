from .config import DEFAULT_USER_ID
from .auth import hash_password

SEED_USER = {
    "id": DEFAULT_USER_ID,
    "email": "khushi@studysync.ai",
    "passwordHash": hash_password("password123"),
    "name": "Khushi & Alex",
    "displayName": "Alex Chen",
    "role": "College Junior • Political Science & CS",
    "university": "Stanford University",
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "gpa": "3.85",
    "targetGpa": "3.90",
    "primaryGoal": "Maintain 3.8+ GPA for Grad School",
    "peakFocusTime": "Morning (8:00 AM - 11:30 AM)",
    "nudgeIntensity": "Balanced",
    "aiTuningScore": 92,
    "weeklyCommitmentHours": 24,
    "streakDays": 12,
    "topicsMastered": 42,
    "tasksCompletedThisWeek": 18,
    "totalStudyHoursWeek": 32.5,
    "isPremium": False,
    "subjects": [
        {"id": "pol_sci", "name": "Political Science", "code": "POL301", "progress": 85, "color": "text-secondary", "bg": "bg-secondary/10", "border": "border-secondary", "icon": "account_balance"},
        {"id": "econ", "name": "Macroeconomics", "code": "ECO204", "progress": 75, "color": "text-primary", "bg": "bg-primary/10", "border": "border-primary", "icon": "trending_up"},
        {"id": "hist", "name": "Modern World History", "code": "HIS102", "progress": 90, "color": "text-tertiary", "bg": "bg-tertiary/10", "border": "border-tertiary", "icon": "history_edu"},
        {"id": "math", "name": "Calculus & Linear Algebra", "code": "MTH201", "progress": 42, "color": "text-error", "bg": "bg-error/10", "border": "border-error", "icon": "calculate"},
        {"id": "bio", "name": "General Biology", "code": "BIO101", "progress": 68, "color": "text-emerald-600", "bg": "bg-emerald-50", "border": "border-emerald-600", "icon": "biotech"},
    ],
}

SEED_TASKS = [
    {"id": "task-1", "userId": DEFAULT_USER_ID, "title": "Federalism & Decentralization", "subject": "Political Science", "subjectId": "pol_sci", "duration": 45, "tag": "Theory & Case Study", "dueTime": "10:00 AM", "status": "pending", "icon": "account_balance", "color": "secondary"},
    {"id": "task-2", "userId": DEFAULT_USER_ID, "title": "The French Revolution: Key Estates", "subject": "Modern World History", "subjectId": "hist", "duration": 60, "tag": "Chapter Analysis", "dueTime": "1:30 PM", "status": "pending", "icon": "history_edu", "color": "tertiary"},
    {"id": "task-3", "userId": DEFAULT_USER_ID, "title": "Polynomials & Roots Decomposition", "subject": "Calculus & Linear Algebra", "subjectId": "math", "duration": 50, "tag": "Practice Problem Set", "dueTime": "4:00 PM", "status": "completed", "icon": "calculate", "color": "outline"},
    {"id": "task-4", "userId": DEFAULT_USER_ID, "title": "Cellular Respiration & Krebs Cycle", "subject": "General Biology", "subjectId": "bio", "duration": 40, "tag": "Spaced Revision", "dueTime": "7:00 PM", "status": "pending", "icon": "biotech", "color": "primary"},
]

SEED_STUDY_PLAN = {
    "id": "plan-current",
    "userId": DEFAULT_USER_ID,
    "goalTitle": "Biology & Social Sciences Finals",
    "targetExam": "Final Exams in 35 Days",
    "daysRemaining": 35,
    "totalTopics": 42,
    "completedTopics": 19,
    "quizzesScheduled": 15,
    "dailyCommitmentHours": 3,
    "weeks": [
        {
            "weekNumber": 1,
            "isCurrent": True,
            "title": "Foundations & Core Principles",
            "days": [
                {
                    "dayName": "Mon, Oct 2",
                    "items": [
                        {"id": "sp-1", "time": "9:00 AM - 10:30 AM", "title": "Cellular Respiration Basics", "type": "Theory", "subject": "Biology", "duration": "45m", "description": "Focus on glycolysis, electron transport, and Krebs cycle stages.", "completed": True},
                        {"id": "sp-2", "time": "11:00 AM - 12:00 PM", "title": "Atomic Structure & Chemical Bonds", "type": "Revision", "subject": "Chemistry", "duration": "30m", "description": "Review flashcards from last week and orbital hybridization.", "completed": True},
                    ],
                },
                {
                    "dayName": "Tue, Oct 3",
                    "items": [
                        {"id": "sp-3", "time": "10:00 AM - 11:30 AM", "title": "Cell Membrane Dynamics & Transport", "type": "Theory", "subject": "Biology", "duration": "60m", "description": "Deep dive into fluid mosaic model and active vs passive ion channels.", "completed": False},
                        {"id": "sp-4", "time": "2:00 PM - 2:45 PM", "title": "Mini-Quiz: Respiration & Energy", "type": "Practice", "subject": "Biology", "duration": "20m", "description": "15 high-yield multiple choice questions with instant explanations.", "completed": False},
                    ],
                },
                {
                    "dayName": "Wed, Oct 4",
                    "items": [
                        {"id": "sp-5", "time": "9:30 AM - 11:00 AM", "title": "Federal vs Unitary Systems", "type": "Theory", "subject": "Political Science", "duration": "50m", "description": "Constitutional distribution of legislative and executive powers.", "completed": False},
                        {"id": "sp-6", "time": "4:00 PM - 5:15 PM", "title": "Supply & Demand Elasticity Curves", "type": "Practice", "subject": "Economics", "duration": "45m", "description": "Calculate price cross-elasticity and deadweight loss scenarios.", "completed": False},
                    ],
                },
            ],
        },
        {
            "weekNumber": 2,
            "isCurrent": False,
            "title": "Deep Dive & High-Yield Applications",
            "days": [
                {
                    "dayName": "Mon, Oct 9",
                    "items": [
                        {"id": "sp-7", "time": "9:00 AM - 10:45 AM", "title": "Genetics & Mendelian Inheritance", "type": "Theory", "subject": "Biology", "duration": "75m", "description": "Punnett squares, sex-linked traits, and pedigree analysis.", "completed": False},
                        {"id": "sp-8", "time": "1:00 PM - 2:00 PM", "title": "Genetics Rapid Fire Quiz", "type": "Practice", "subject": "Biology", "duration": "30m", "description": "25 timed multiple choice questions with error logging.", "completed": False},
                    ],
                },
                {
                    "dayName": "Tue, Oct 10",
                    "items": [
                        {"id": "sp-9", "time": "10:00 AM - 11:30 AM", "title": "Monetary Policy & Central Banking", "type": "Theory", "subject": "Economics", "duration": "60m", "description": "Interest rate channels, reserve requirements, and quantitative easing.", "completed": False},
                    ],
                },
            ],
        },
    ],
}

SEED_HISTORY = [
    {"id": "hist-1", "userId": DEFAULT_USER_ID, "title": "Advanced Calculus Quiz 3", "subject": "Mathematics", "category": "quiz", "status": "completed", "dateGroup": "Today, Aug 15", "time": "9:00 AM", "duration": "45 min", "score": "94%", "notes": "Mastered L'Hopital's rule and Taylor series approximation."},
    {"id": "hist-2", "userId": DEFAULT_USER_ID, "title": "Microeconomics Reading Ch 4-5", "subject": "Economics", "category": "reading", "status": "missed", "dateGroup": "Today, Aug 15", "time": "1:30 PM", "duration": "0 min", "score": None, "notes": "Auto-rescheduled by AI to tomorrow morning's slot."},
    {"id": "hist-3", "userId": DEFAULT_USER_ID, "title": "Chemistry Lab Report Draft", "subject": "Chemistry", "category": "assignment", "status": "completed", "dateGroup": "Yesterday, Aug 14", "time": "2:00 PM", "duration": "120 min", "score": "Complete", "notes": "Titration curve analysis and error propagation calculations submitted."},
    {"id": "hist-4", "userId": DEFAULT_USER_ID, "title": "Spanish II Vocabulary Practice", "subject": "Spanish II", "category": "quiz", "status": "rescheduled", "dateGroup": "Yesterday, Aug 14", "time": "4:30 PM", "duration": "25 min", "score": None, "notes": "Moved to Aug 16 due to extended lab session."},
    {"id": "hist-5", "userId": DEFAULT_USER_ID, "title": "French Revolution Seminar Notes", "subject": "Modern World History", "category": "reading", "status": "completed", "dateGroup": "Aug 12, 2026", "time": "11:00 AM", "duration": "55 min", "score": "Complete", "notes": "Key causes of 1789 crisis and Reign of Terror synthesized."},
]

SEED_NOTIFICATIONS = [
    {"id": "n-1", "userId": DEFAULT_USER_ID, "title": "Optimal Revision Time", "body": "AI suggests a 15-minute spaced review of Political Science before 11:00 AM.", "time": "10m ago", "read": False, "icon": "lightbulb", "actionTab": "dashboard"},
    {"id": "n-2", "userId": DEFAULT_USER_ID, "title": "Streak Milestone! 🔥", "body": "You have completed 12 consecutive study days. Keep going to earn the 2-Week Master badge!", "time": "1h ago", "read": False, "icon": "local_fire_department", "actionTab": "analytics"},
    {"id": "n-3", "userId": DEFAULT_USER_ID, "title": "Biology Roadmap Updated", "body": "35 days remaining till finals. 2 chapters marked as high retention.", "time": "Yesterday", "read": True, "icon": "auto_awesome", "actionTab": "study_plan"},
]

SEED_BADGES = [
    {"id": "badge-1", "userId": DEFAULT_USER_ID, "name": "Top 10% Macroeconomics", "icon": "emoji_events", "desc": "Highest quiz accuracy in peer cohort", "color": "from-amber-400 to-amber-600", "unlocked": True},
    {"id": "badge-2", "userId": DEFAULT_USER_ID, "name": "Bookworm", "icon": "menu_book", "desc": "Read 50 chapters across active syllabi", "color": "from-blue-500 to-indigo-600", "unlocked": True},
    {"id": "badge-3", "userId": DEFAULT_USER_ID, "name": "12-Day Streak Master", "icon": "local_fire_department", "desc": "Studied 12 consecutive days without gaps", "color": "from-rose-500 to-orange-500", "unlocked": True},
    {"id": "badge-4", "userId": DEFAULT_USER_ID, "name": "Early Bird Scholar", "icon": "wb_sunny", "desc": "Completed 20 morning focus blocks", "color": "from-emerald-400 to-teal-600", "unlocked": True},
    {"id": "badge-5", "userId": DEFAULT_USER_ID, "name": "Spaced Repetition Pro", "icon": "psychology", "desc": "Reviewed 100 flashcards on exact AI schedule", "color": "from-purple-500 to-pink-600", "unlocked": False},
]

SEED_ANALYTICS = [
    {"userId": DEFAULT_USER_ID, "day": "Mon", "hours": 4.5, "target": 4.0},
    {"userId": DEFAULT_USER_ID, "day": "Tue", "hours": 5.2, "target": 4.0},
    {"userId": DEFAULT_USER_ID, "day": "Wed", "hours": 3.8, "target": 4.0},
    {"userId": DEFAULT_USER_ID, "day": "Thu", "hours": 6.0, "target": 4.0},
    {"userId": DEFAULT_USER_ID, "day": "Fri", "hours": 4.8, "target": 4.0},
    {"userId": DEFAULT_USER_ID, "day": "Sat", "hours": 5.5, "target": 3.0},
    {"userId": DEFAULT_USER_ID, "day": "Sun", "hours": 2.7, "target": 3.0},
]

SEED_TESTIMONIALS = [
    {"id": "t-1", "name": "Aanya Sharma", "major": "Pre-Med, Biology", "university": "UC Berkeley", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", "rating": 5, "metric": "+2 Letter Grades", "text": "I used to cram everything the night before. StudySync breaks down my syllabus so perfectly, I actually have free weekends now. It feels like magic."},
    {"id": "t-2", "name": "Marcus Vance", "major": "Computer Science", "university": "Georgia Tech", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", "rating": 5, "metric": "4.0 Semester GPA", "text": "The AI chat is like having a tutor available 24/7. When I get stuck on a calculus or algorithms problem, it doesn't just give the answer, it guides me to it step-by-step."},
    {"id": "t-3", "name": "Elena Rostova", "major": "Economics & Finance", "university": "London School of Economics", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", "rating": 5, "metric": "35% Study Time Saved", "text": "The auto-rescheduling is a lifesaver. Whenever I have an unexpected exam or practice session, StudySync recalculates my remaining weeks without any stress."},
]

SEED_DOCUMENTS = [
    {
        "id": "doc-bio-101",
        "userId": DEFAULT_USER_ID,
        "subjectId": "bio",
        "subjectName": "General Biology",
        "title": "Cellular Respiration & Bioenergetics Syllabus Notes",
        "fileName": "BIO101_Module_3_Respiration.pdf",
        "fileSize": 142800,
        "uploadedAt": "Sep 20, 2026 10:15 AM",
        "chunkCount": 3,
        "summary": "Core principles of glycolysis, Krebs Cycle, ATP synthase proton gradients, and oxidative phosphorylation in eukaryotic mitochondria.",
    },
    {
        "id": "doc-econ-204",
        "userId": DEFAULT_USER_ID,
        "subjectId": "econ",
        "subjectName": "Macroeconomics",
        "title": "IS-LM Curve Equilibrium & Monetary Policy",
        "fileName": "ECO204_IS_LM_Framework.pdf",
        "fileSize": 218500,
        "uploadedAt": "Sep 22, 2026 02:40 PM",
        "chunkCount": 3,
        "summary": "Goods market IS curve derivation, money market LM curve, fiscal expansion shifts, central bank interest rate targeting, and liquidity trap dynamics.",
    },
    {
        "id": "doc-pol-301",
        "userId": DEFAULT_USER_ID,
        "subjectId": "pol_sci",
        "subjectName": "Political Science",
        "title": "Comparative Federalism & Devolution Case Studies",
        "fileName": "POL301_Federalism_Constitutions.txt",
        "fileSize": 89400,
        "uploadedAt": "Sep 25, 2026 09:30 AM",
        "chunkCount": 2,
        "summary": "Distribution of legislative jurisdiction between national and state legislatures, symmetrical vs asymmetrical federalism, and fiscal transfer mechanisms.",
    }
]

SEED_CHUNKS = [
    {
        "id": "chk-bio-1",
        "documentId": "doc-bio-101",
        "userId": DEFAULT_USER_ID,
        "subjectId": "bio",
        "subjectName": "General Biology",
        "documentTitle": "Cellular Respiration & Bioenergetics Syllabus Notes",
        "chunkIndex": 0,
        "text": "Cellular Respiration occurs in four distinct phases: 1) Glycolysis in the cytoplasm breaks 1 glucose (6C) into 2 pyruvate (3C), netting 2 ATP and 2 NADH. 2) Pyruvate oxidation forms Acetyl-CoA in the mitochondrial matrix releasing CO2. 3) The Citric Acid (Krebs) Cycle yields 2 ATP, 6 NADH, and 2 FADH2 per glucose molecule. 4) Oxidative phosphorylation via the electron transport chain (ETC) drives chemiosmotic ATP synthesis.",
    },
    {
        "id": "chk-bio-2",
        "documentId": "doc-bio-101",
        "userId": DEFAULT_USER_ID,
        "subjectId": "bio",
        "subjectName": "General Biology",
        "documentTitle": "Cellular Respiration & Bioenergetics Syllabus Notes",
        "chunkIndex": 1,
        "text": "ATP Synthase Mechanism: Protons (H+) are pumped across the inner mitochondrial membrane by Complexes I, III, and IV into the intermembrane space, generating a high proton-motive force (electrochemical gradient). As protons flow down their gradient back into the matrix through the F0 rotor subunit of ATP synthase, rotational conformational changes in the F1 catalytic head phosphorylate ADP + Pi into ATP, yielding ~28-32 ATP per glucose.",
    },
    {
        "id": "chk-econ-1",
        "documentId": "doc-econ-204",
        "userId": DEFAULT_USER_ID,
        "subjectId": "econ",
        "subjectName": "Macroeconomics",
        "documentTitle": "IS-LM Curve Equilibrium & Monetary Policy",
        "chunkIndex": 0,
        "text": "The IS Curve represents equilibrium in the goods market where aggregate output Y equals planned expenditure: Y = C(Y - T) + I(r) + G. As real interest rate r falls, investment I rises, increasing national income Y, giving the IS curve a downward slope. Fiscal expansion (increasing government spending G or cutting taxes T) shifts the IS curve rightward.",
    },
    {
        "id": "chk-econ-2",
        "documentId": "doc-econ-204",
        "userId": DEFAULT_USER_ID,
        "subjectId": "econ",
        "subjectName": "Macroeconomics",
        "documentTitle": "IS-LM Curve Equilibrium & Monetary Policy",
        "chunkIndex": 1,
        "text": "The LM Curve represents money market equilibrium where real money supply (M/P) equals real money demand L(r, Y). As income Y increases, demand for transaction money increases, forcing interest rates r upward to equilibrate the money market. An expansionary monetary policy (increasing money supply M) shifts the LM curve rightward and lowers equilibrium interest rates.",
    },
    {
        "id": "chk-pol-1",
        "documentId": "doc-pol-301",
        "userId": DEFAULT_USER_ID,
        "subjectId": "pol_sci",
        "subjectName": "Political Science",
        "documentTitle": "Comparative Federalism & Devolution Case Studies",
        "chunkIndex": 0,
        "text": "Federalism distributes sovereignty constitutionally between a central union and constituent sub-national states. Symmetrical federalism grants uniform powers to all sub-units, while asymmetrical federalism accords special constitutional autonomy or rights to specific cultural, linguistic, or historical regions (e.g. Quebec in Canada, Catalonia in Spain).",
    }
]


async def ensure_indexes(database) -> None:
    await database.users.create_index("id", unique=True)
    await database.users.create_index("email")
    await database.tasks.create_index("id", unique=True)
    await database.tasks.create_index("userId")
    await database.study_plans.create_index("id", unique=True)
    await database.study_plans.create_index("userId")
    await database.history.create_index("id", unique=True)
    await database.history.create_index("userId")
    await database.notifications.create_index("id", unique=True)
    await database.notifications.create_index("userId")
    await database.badges.create_index("id", unique=True)
    await database.chat_messages.create_index("userId")
    await database.testimonials.create_index("id", unique=True)
    await database.subject_documents.create_index("id", unique=True)
    await database.subject_documents.create_index("userId")
    await database.subject_documents.create_index("subjectId")
    await database.subject_chunks.create_index("id", unique=True)
    await database.subject_chunks.create_index("documentId")
    await database.subject_chunks.create_index("userId")


async def seed_if_empty(database) -> None:
    await ensure_indexes(database)

    if await database.users.count_documents({}) == 0:
        await database.users.insert_one(SEED_USER)
    else:
        # Ensure email and passwordHash are present on default user
        await database.users.update_one(
            {"id": DEFAULT_USER_ID, "email": {"$exists": False}},
            {"$set": {"email": "khushi@studysync.ai", "passwordHash": hash_password("password123")}}
        )

    if await database.tasks.count_documents({}) == 0:
        await database.tasks.insert_many(SEED_TASKS)
    if await database.study_plans.count_documents({}) == 0:
        await database.study_plans.insert_one(SEED_STUDY_PLAN)
    if await database.history.count_documents({}) == 0:
        await database.history.insert_many(SEED_HISTORY)
    if await database.notifications.count_documents({}) == 0:
        await database.notifications.insert_many(SEED_NOTIFICATIONS)
    if await database.badges.count_documents({}) == 0:
        await database.badges.insert_many(SEED_BADGES)
    if await database.weekly_analytics.count_documents({}) == 0:
        await database.weekly_analytics.insert_many(SEED_ANALYTICS)
    if await database.testimonials.count_documents({}) == 0:
        await database.testimonials.insert_many(SEED_TESTIMONIALS)
    if await database.subject_documents.count_documents({}) == 0:
        await database.subject_documents.insert_many(SEED_DOCUMENTS)
    if await database.subject_chunks.count_documents({}) == 0:
        await database.subject_chunks.insert_many(SEED_CHUNKS)
