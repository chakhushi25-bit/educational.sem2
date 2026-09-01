export const initialUserData = {
  name: "Khushi & Alex",
  displayName: "Alex Chen",
  role: "College Junior • Political Science & CS",
  university: "Stanford University",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  gpa: "3.85",
  targetGpa: "3.90",
  primaryGoal: "Maintain 3.8+ GPA for Grad School",
  peakFocusTime: "Morning (8:00 AM - 11:30 AM)",
  nudgeIntensity: "Balanced",
  aiTuningScore: 92,
  weeklyCommitmentHours: 24,
  streakDays: 12,
  topicsMastered: 42,
  tasksCompletedThisWeek: 18,
  totalStudyHoursWeek: 32.5,
  isPremium: false,
  subjects: [
    { id: "pol_sci", name: "Political Science", code: "POL301", progress: 85, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary", icon: "account_balance" },
    { id: "econ", name: "Macroeconomics", code: "ECO204", progress: 75, color: "text-primary", bg: "bg-primary/10", border: "border-primary", icon: "trending_up" },
    { id: "hist", name: "Modern World History", code: "HIS102", progress: 90, color: "text-tertiary", bg: "bg-tertiary/10", border: "border-tertiary", icon: "history_edu" },
    { id: "math", name: "Calculus & Linear Algebra", code: "MTH201", progress: 42, color: "text-error", bg: "bg-error/10", border: "border-error", icon: "calculate" },
    { id: "cs", name: "Data Structures & Algorithms", code: "CS106B", progress: 68, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-600", icon: "code" }
  ]
};

export const initialTasks = [
  {
    id: "task-1",
    title: "Federalism & Decentralization",
    subject: "Political Science",
    subjectId: "pol_sci",
    duration: 45,
    tag: "Theory & Case Study",
    dueTime: "10:00 AM",
    status: "pending", // pending, in_progress, completed, missed
    icon: "account_balance",
    color: "secondary"
  },
  {
    id: "task-2",
    title: "The French Revolution: Key Estates",
    subject: "Modern World History",
    subjectId: "hist",
    duration: 60,
    tag: "Chapter Analysis",
    dueTime: "1:30 PM",
    status: "pending",
    icon: "history_edu",
    color: "tertiary"
  },
  {
    id: "task-3",
    title: "Polynomials & Roots Decomposition",
    subject: "Calculus & Linear Algebra",
    subjectId: "math",
    duration: 50,
    tag: "Practice Problem Set",
    dueTime: "4:00 PM",
    status: "completed",
    icon: "calculate",
    color: "outline"
  },
  {
    id: "task-4",
    title: "Cellular Respiration & Krebs Cycle",
    subject: "General Biology",
    subjectId: "bio",
    duration: 40,
    tag: "Spaced Revision",
    dueTime: "7:00 PM",
    status: "pending",
    icon: "biotech",
    color: "primary"
  }
];

export const initialStudyPlan = {
  goalTitle: "Biology & Social Sciences Finals",
  targetExam: "Final Exams in 35 Days",
  daysRemaining: 35,
  totalTopics: 42,
  completedTopics: 19,
  quizzesScheduled: 15,
  dailyCommitmentHours: 3,
  weeks: [
    {
      weekNumber: 1,
      isCurrent: true,
      title: "Foundations & Core Principles",
      days: [
        {
          dayName: "Mon, Oct 2",
          items: [
            { id: "sp-1", time: "9:00 AM - 10:30 AM", title: "Cellular Respiration Basics", type: "Theory", subject: "Biology", duration: "45m", description: "Focus on glycolysis, electron transport, and Krebs cycle stages.", completed: true },
            { id: "sp-2", time: "11:00 AM - 12:00 PM", title: "Atomic Structure & Chemical Bonds", type: "Revision", subject: "Chemistry", duration: "30m", description: "Review flashcards from last week and orbital hybridization.", completed: true }
          ]
        },
        {
          dayName: "Tue, Oct 3",
          items: [
            { id: "sp-3", time: "10:00 AM - 11:30 AM", title: "Cell Membrane Dynamics & Transport", type: "Theory", subject: "Biology", duration: "60m", description: "Deep dive into fluid mosaic model and active vs passive ion channels.", completed: false },
            { id: "sp-4", time: "2:00 PM - 2:45 PM", title: "Mini-Quiz: Respiration & Energy", type: "Practice", subject: "Biology", duration: "20m", description: "15 high-yield multiple choice questions with instant explanations.", completed: false }
          ]
        },
        {
          dayName: "Wed, Oct 4",
          items: [
            { id: "sp-5", time: "9:30 AM - 11:00 AM", title: "Federal vs Unitary Systems", type: "Theory", subject: "Political Science", duration: "50m", description: "Constitutional distribution of legislative and executive powers.", completed: false },
            { id: "sp-6", time: "4:00 PM - 5:15 PM", title: "Supply & Demand Elasticity Curves", type: "Practice", subject: "Economics", duration: "45m", description: "Calculate price cross-elasticity and deadweight loss scenarios.", completed: false }
          ]
        }
      ]
    },
    {
      weekNumber: 2,
      isCurrent: false,
      title: "Deep Dive & High-Yield Applications",
      days: [
        {
          dayName: "Mon, Oct 9",
          items: [
            { id: "sp-7", time: "9:00 AM - 10:45 AM", title: "Genetics & Mendelian Inheritance", type: "Theory", subject: "Biology", duration: "75m", description: "Punnett squares, sex-linked traits, and pedigree analysis.", completed: false },
            { id: "sp-8", time: "1:00 PM - 2:00 PM", title: "Genetics Rapid Fire Quiz", type: "Practice", subject: "Biology", duration: "30m", description: "25 timed multiple choice questions with error logging.", completed: false }
          ]
        },
        {
          dayName: "Tue, Oct 10",
          items: [
            { id: "sp-9", time: "10:00 AM - 11:30 AM", title: "Monetary Policy & Central Banking", type: "Theory", subject: "Economics", duration: "60m", description: "Interest rate channels, reserve requirements, and quantitative easing.", completed: false }
          ]
        }
      ]
    }
  ]
};

export const initialHistory = [
  {
    id: "hist-1",
    title: "Advanced Calculus Quiz 3",
    subject: "Mathematics",
    category: "quiz",
    status: "completed",
    dateGroup: "Today, Aug 15",
    time: "9:00 AM",
    duration: "45 min",
    score: "94%",
    notes: "Mastered L'Hopital's rule and Taylor series approximation."
  },
  {
    id: "hist-2",
    title: "Microeconomics Reading Ch 4-5",
    subject: "Economics",
    category: "reading",
    status: "missed",
    dateGroup: "Today, Aug 15",
    time: "1:30 PM",
    duration: "0 min",
    score: null,
    notes: "Auto-rescheduled by AI to tomorrow morning's slot."
  },
  {
    id: "hist-3",
    title: "Chemistry Lab Report Draft",
    subject: "Chemistry",
    category: "assignment",
    status: "completed",
    dateGroup: "Yesterday, Aug 14",
    time: "2:00 PM",
    duration: "120 min",
    score: "Complete",
    notes: "Titration curve analysis and error propagation calculations submitted."
  },
  {
    id: "hist-4",
    title: "Spanish II Vocabulary Practice",
    subject: "Spanish II",
    category: "quiz",
    status: "rescheduled",
    dateGroup: "Yesterday, Aug 14",
    time: "4:30 PM",
    duration: "25 min",
    score: null,
    notes: "Moved to Aug 16 due to extended lab session."
  },
  {
    id: "hist-5",
    title: "French Revolution Seminar Notes",
    subject: "Modern World History",
    category: "reading",
    status: "completed",
    dateGroup: "Aug 12, 2026",
    time: "11:00 AM",
    duration: "55 min",
    score: "Complete",
    notes: "Key causes of 1789 crisis and Reign of Terror synthesized."
  }
];

export const initialBadges = [
  { id: "badge-1", name: "Top 10% Macroeconomics", icon: "emoji_events", desc: "Highest quiz accuracy in peer cohort", color: "from-amber-400 to-amber-600", unlocked: true },
  { id: "badge-2", name: "Bookworm", icon: "menu_book", desc: "Read 50 chapters across active syllabi", color: "from-blue-500 to-indigo-600", unlocked: true },
  { id: "badge-3", name: "12-Day Streak Master", icon: "local_fire_department", desc: "Studied 12 consecutive days without gaps", color: "from-rose-500 to-orange-500", unlocked: true },
  { id: "badge-4", name: "Early Bird Scholar", icon: "wb_sunny", desc: "Completed 20 morning focus blocks", color: "from-emerald-400 to-teal-600", unlocked: true },
  { id: "badge-5", name: "Spaced Repetition Pro", icon: "psychology", desc: "Reviewed 100 flashcards on exact AI schedule", color: "from-purple-500 to-pink-600", unlocked: false }
];

export const weeklyAnalyticsData = [
  { day: "Mon", hours: 4.5, target: 4.0 },
  { day: "Tue", hours: 5.2, target: 4.0 },
  { day: "Wed", hours: 3.8, target: 4.0 },
  { day: "Thu", hours: 6.0, target: 4.0 },
  { day: "Fri", hours: 4.8, target: 4.0 },
  { day: "Sat", hours: 5.5, target: 3.0 },
  { day: "Sun", hours: 2.7, target: 3.0 }
];

export const testimonialsList = [
  {
    id: "t-1",
    name: "Aanya Sharma",
    major: "Pre-Med, Biology",
    university: "UC Berkeley",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    metric: "+2 Letter Grades",
    text: "I used to cram everything the night before. StudySync breaks down my syllabus so perfectly, I actually have free weekends now. It feels like magic."
  },
  {
    id: "t-2",
    name: "Marcus Vance",
    major: "Computer Science",
    university: "Georgia Tech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    metric: "4.0 Semester GPA",
    text: "The AI chat is like having a tutor available 24/7. When I get stuck on a calculus or algorithms problem, it doesn't just give the answer, it guides me to it step-by-step."
  },
  {
    id: "t-3",
    name: "Elena Rostova",
    major: "Economics & Finance",
    university: "London School of Economics",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    rating: 5,
    metric: "35% Study Time Saved",
    text: "The auto-rescheduling is a lifesaver. Whenever I have an unexpected exam or practice session, StudySync recalculates my remaining weeks without any stress."
  }
];

export const defaultAiResponses = {
  "explain this simply": "Here is a simple breakdown:\n\n**The Big Idea:** Think of this concept like a traffic roundabout instead of a 4-way stop. Rather than waiting for one item to complete before moving, multiple threads process in parallel.\n\nKey takeaways:\n1. **Input:** Information is broken into bite-sized packets.\n2. **Processing:** Core nodes prioritize urgent tasks.\n3. **Output:** Clean, synchronized results delivered without bottlenecks.",
  "create 10 mcqs": "Here is a quick high-yield MCQ set for your current topic:\n\n**Q1:** What is the primary role of ATP synthase in cellular respiration?\n- A) To hydrolyze glucose\n- B) To generate ATP from ADP using a proton gradient (Correct)\n- C) To produce NADH in the cytoplasm\n- D) To break down fatty acids\n\n*Would you like me to run through the remaining 9 questions interactively?*",
  "help me revise": "Let's do an active recall check! 🧠\n\n**Prompt:** Without checking your notes, can you explain the difference between *proportional representation* and *first-past-the-post* voting systems?\n\nType your thoughts below and I'll grade your answer with instant feedback!",
  "solve step-by-step": "Let's solve this together systematically:\n\n**Step 1:** Identify given variables and constraints.\n**Step 2:** Formulate the governing equation.\n**Step 3:** Differentiate with respect to the target variable.\n**Step 4:** Substitute boundary conditions to evaluate the constant.\n\nPaste your exact equation or problem and I'll walk you through each step!"
};
