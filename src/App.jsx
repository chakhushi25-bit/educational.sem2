import React, { useEffect, useState } from 'react';
import { api } from './api';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import FocusTimerModal from './components/FocusTimerModal';
import NewPlanModal from './components/NewPlanModal';
import CheckoutModal from './components/CheckoutModal';
import NotificationToast from './components/NotificationToast';

import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import StudyPlanPage from './pages/StudyPlanPage';
import AiAssistantPage from './pages/AiAssistantPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import PremiumPage from './pages/PremiumPage';
import AboutPage from './pages/AboutPage';
import TestimonialsPage from './pages/TestimonialsPage';

import {
  initialUserData,
  initialTasks,
  initialStudyPlan
} from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [user, setUser] = useState(initialUserData);
  const [tasks, setTasks] = useState(initialTasks);
  const [studyPlan, setStudyPlan] = useState(initialStudyPlan);

  // Modals & Overlays
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState(null);
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState('yearly');

  // Toasts
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const [history, setHistory] = useState([]);
  const [badges, setBadges] = useState([]);
  const [weeklyAnalytics, setWeeklyAnalytics] = useState([]);

  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'Optimal Revision Time',
      body: 'AI suggests a 15-minute spaced review of Political Science before 11:00 AM.',
      time: '10m ago',
      read: false,
      icon: 'lightbulb',
      actionTab: 'dashboard'
    },
    {
      id: 'n-2',
      title: 'Streak Milestone! 🔥',
      body: 'You have completed 12 consecutive study days. Keep going to earn the 2-Week Master badge!',
      time: '1h ago',
      read: false,
      icon: 'local_fire_department',
      actionTab: 'analytics'
    },
    {
      id: 'n-3',
      title: 'Biology Roadmap Updated',
      body: '35 days remaining till finals. 2 chapters marked as high retention.',
      time: 'Yesterday',
      read: true,
      icon: 'auto_awesome',
      actionTab: 'study_plan'
    }
  ]);

  useEffect(() => {
    let cancelled = false;
    api.bootstrap()
      .then((data) => {
        if (cancelled) return;
        if (data.user) setUser(data.user);
        if (data.tasks) setTasks(data.tasks);
        if (data.studyPlan) setStudyPlan(data.studyPlan);
        if (data.notifications) setNotifications(data.notifications);
        if (data.history) setHistory(data.history);
        if (data.badges) setBadges(data.badges);
        if (data.weeklyAnalytics) setWeeklyAnalytics(data.weeklyAnalytics);
      })
      .catch(() => {
        // Keep local mock data if the API is offline.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Task Actions
  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        if (nextStatus === 'completed') {
          showToast(`Completed task: ${t.title}! 🎉`, 'success');
          setUser(u => {
            const next = { ...u, tasksCompletedThisWeek: u.tasksCompletedThisWeek + 1 };
            api.updateUser(next).catch(() => {});
            return next;
          });
        }
        api.updateTask(taskId, { status: nextStatus }).catch(() => {});
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleStartFocus = (task) => {
    setActiveFocusTask(task);
    setIsTimerOpen(true);
  };

  const handleCompleteSession = (task) => {
    showToast(`Focus session recorded! +25 mins added to study volume`, 'success');
    setUser(u => {
      const next = { ...u, totalStudyHoursWeek: +(u.totalStudyHoursWeek + 0.4).toFixed(1) };
      api.updateUser(next).catch(() => {});
      return next;
    });
    if (task) {
      handleToggleTask(task.id);
    }
  };

  const handleAddTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    api.createTask(newTask).catch(() => {});
    showToast(`Added new task: ${newTask.title}`, 'success');
  };

  const handleRescheduleSuggestion = () => {
    showToast(`AI rescheduled tasks to align with your morning peak focus hours!`, 'success');
  };

  // Study Plan Item Toggle
  const handleTogglePlanItem = (itemId) => {
    setStudyPlan(prev => ({
      ...prev,
      weeks: prev.weeks.map(w => ({
        ...w,
        days: w.days.map(d => ({
          ...d,
          items: d.items.map(i => {
            if (i.id === itemId) {
              const nextVal = !i.completed;
              if (nextVal) showToast(`Marked milestone completed!`, 'success');
              api.togglePlanItem(itemId, nextVal).catch(() => {});
              return { ...i, completed: nextVal };
            }
            return i;
          })
        }))
      }))
    }));
  };

  const handlePlanCreated = (newPlan) => {
    setStudyPlan(newPlan);
    api.saveStudyPlan(newPlan).catch(() => {});
    setCurrentTab('study_plan');
    showToast(`New adaptive study plan generated successfully! 🚀`, 'success');
  };

  const handleUpgradeSuccess = () => {
    setUser(prev => {
      const next = { ...prev, isPremium: true };
      api.updateUser(next).catch(() => {});
      return next;
    });
    showToast(`Welcome to StudySync Pro! All premium features unlocked. 🌟`, 'success');
  };

  const handleNotificationClick = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    api.markNotification(id).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface font-body-lg flex flex-col selection:bg-primary/20 selection:text-primary">
      
      {/* Top Fixed Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        streakDays={user.streakDays}
        openTimer={() => {
          setActiveFocusTask(null);
          setIsTimerOpen(true);
        }}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />

      {/* Main Content Area with Dynamic Tab Switching */}
      <main className="flex-1 pt-16 w-full">
        {currentTab === 'home' && (
          <HomePage 
            setCurrentTab={setCurrentTab} 
            onOpenNewPlanModal={() => setIsNewPlanModalOpen(true)} 
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            user={user}
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onStartFocus={handleStartFocus}
            onRescheduleTask={handleRescheduleSuggestion}
            onAddTask={handleAddTask}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'study_plan' && (
          <StudyPlanPage
            studyPlan={studyPlan}
            onTogglePlanItem={handleTogglePlanItem}
            onOpenNewPlanModal={() => setIsNewPlanModalOpen(true)}
            onStartFocusSession={(item) => {
              setActiveFocusTask({ title: item.title, subject: item.subject });
              setIsTimerOpen(true);
            }}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'assistant' && (
          <AiAssistantPage user={user} />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsPage
            user={user}
            badges={badges}
            weeklyAnalytics={weeklyAnalytics}
            onScheduleRevision={() => {
              showToast('Revision block scheduled for Macroeconomics!', 'success');
              setCurrentTab('dashboard');
            }}
          />
        )}

        {currentTab === 'history' && (
          <HistoryPage
            history={history}
            onStartRevision={(item) => {
              setActiveFocusTask({ title: `Revision: ${item.title}`, subject: item.subject });
              setIsTimerOpen(true);
            }}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            user={user}
            onUpdateUser={(updated) => {
              setUser(updated);
              api.updateUser(updated).catch(() => {});
            }}
            onOpenUpgrade={() => {
              setSelectedBillingCycle('yearly');
              setIsCheckoutOpen(true);
            }}
            showToast={showToast}
          />
        )}

        {currentTab === 'premium' && (
          <PremiumPage
            user={user}
            onOpenCheckout={(cycle) => {
              setSelectedBillingCycle(cycle);
              setIsCheckoutOpen(true);
            }}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage setCurrentTab={setCurrentTab} />
        )}

        {currentTab === 'testimonials' && (
          <TestimonialsPage setCurrentTab={setCurrentTab} />
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Focus / Pomodoro Timer Modal */}
      <FocusTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        activeTask={activeFocusTask}
        onCompleteSession={handleCompleteSession}
      />

      {/* New Study Plan Generator Modal */}
      <NewPlanModal
        isOpen={isNewPlanModalOpen}
        onClose={() => setIsNewPlanModalOpen(false)}
        onPlanCreated={handlePlanCreated}
      />

      {/* Checkout / Subscription Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        billingCycle={selectedBillingCycle}
        onClose={() => setIsCheckoutOpen(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
      />

      {/* Notification Toast Alert */}
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
