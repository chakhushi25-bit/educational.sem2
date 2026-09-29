from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class Subject(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    name: str
    code: str
    progress: int = 0
    color: str | None = None
    bg: str | None = None
    border: str | None = None
    icon: str | None = None


class UserProfile(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str = "user-khushi"
    email: str | None = None
    passwordHash: str | None = None
    name: str | None = None
    displayName: str
    role: str | None = None
    university: str | None = None
    avatarUrl: str | None = None
    gpa: str | None = None
    targetGpa: str | None = None
    primaryGoal: str | None = None
    peakFocusTime: str | None = None
    nudgeIntensity: str | None = None
    aiTuningScore: int = 0
    weeklyCommitmentHours: int = 0
    streakDays: int = 0
    topicsMastered: int = 0
    tasksCompletedThisWeek: int = 0
    totalStudyHoursWeek: float = 0
    isPremium: bool = False
    openRouterApiKey: str | None = None
    preferredAiModel: str | None = None
    subjects: list[Subject] = Field(default_factory=list)


class SignupRequest(BaseModel):
    email: str
    password: str
    displayName: str
    university: str | None = "State University"
    role: str | None = "Undergraduate Scholar"
    primaryGoal: str | None = "Semester Finals (Target: 3.9 GPA)"


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    token: str
    user: dict[str, Any]
    message: str | None = None


class SubjectDocument(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    userId: str
    subjectId: str
    subjectName: str
    title: str
    fileName: str
    fileSize: int
    uploadedAt: str
    chunkCount: int = 0
    summary: str | None = None


class RagQueryRequest(BaseModel):
    question: str
    subjectId: str | None = None
    model: str | None = None
    useRag: bool = True
    apiKey: str | None = None


class PlanGenerationRequest(BaseModel):
    goalTitle: str
    targetExam: str | None = None
    targetDays: int = 30
    subjectId: str | None = None
    dailyHours: float = 3.5
    apiKey: str | None = None
    model: str | None = None


class Task(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    title: str
    subject: str
    subjectId: str | None = None
    duration: int = 30
    tag: str | None = None
    dueTime: str | None = None
    status: str = "pending"
    icon: str | None = None
    color: str | None = None


class StudyPlanItem(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    time: str | None = None
    title: str
    type: str | None = None
    subject: str | None = None
    duration: str | None = None
    description: str | None = None
    completed: bool = False


class StudyPlanDay(BaseModel):
    model_config = ConfigDict(extra="allow")

    dayName: str
    items: list[StudyPlanItem] = Field(default_factory=list)


class StudyPlanWeek(BaseModel):
    model_config = ConfigDict(extra="allow")

    weekNumber: int
    isCurrent: bool = False
    title: str | None = None
    days: list[StudyPlanDay] = Field(default_factory=list)


class StudyPlan(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str = "plan-current"
    userId: str = "user-khushi"
    goalTitle: str
    targetExam: str | None = None
    daysRemaining: int = 0
    totalTopics: int = 0
    completedTopics: int = 0
    quizzesScheduled: int = 0
    dailyCommitmentHours: float = 3
    weeks: list[StudyPlanWeek] = Field(default_factory=list)


class HistoryItem(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    title: str
    subject: str
    category: str
    status: str
    dateGroup: str | None = None
    time: str | None = None
    duration: str | None = None
    score: str | None = None
    notes: str | None = None


class Notification(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    title: str
    body: str
    time: str | None = None
    read: bool = False
    icon: str | None = None
    actionTab: str | None = None


class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    sender: str
    text: str
    time: str | None = None
    sources: list[dict[str, Any]] | None = None
    model: str | None = None


class ChatRequest(BaseModel):
    text: str
    subjectId: str | None = None
    useRag: bool = True
    model: str | None = None
    apiKey: str | None = None


class BootstrapPayload(BaseModel):
    user: dict[str, Any]
    tasks: list[dict[str, Any]]
    studyPlan: dict[str, Any] | None
    history: list[dict[str, Any]]
    notifications: list[dict[str, Any]]
    badges: list[dict[str, Any]]
    weeklyAnalytics: list[dict[str, Any]]
    testimonials: list[dict[str, Any]]
