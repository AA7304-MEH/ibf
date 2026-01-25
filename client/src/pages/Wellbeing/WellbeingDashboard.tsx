import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import {
    ClockIcon,
    FireIcon,
    FaceSmileIcon,
    BoltIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import { PlayCircleIcon, PauseCircleIcon, StopCircleIcon } from '@heroicons/react/24/solid';

const WellbeingDashboard: React.FC = () => {
    // Stats State
    const [stats, setStats] = useState<any[]>([]);
    const [todayMetrics, setTodayMetrics] = useState<any>({ screenTimeMinutes: 0, focusSessions: 0 });

    // Mood State
    const [moodLogged, setMoodLogged] = useState(false);

    // Timer State
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
    const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');

    const heartbeatInterval = useRef<any>(null);

    useEffect(() => {
        fetchStats();
        startHeartbeat();

        return () => {
            if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
        };
    }, []);

    // Focus Timer Logic
    useEffect(() => {
        let interval: any = null;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerActive) {
            // Timer finished
            handleTimerComplete();
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const startHeartbeat = () => {
        // Send heartbeat every minute to track active screen time
        heartbeatInterval.current = setInterval(async () => {
            if (document.visibilityState === 'visible') {
                try {
                    const res = await api.post('/wellbeing/heartbeat', { minutes: 1 });
                    setTodayMetrics((prev: any) => ({ ...prev, screenTimeMinutes: res.data.screenTimeMinutes }));
                } catch (err) {
                    console.error("Heartbeat failed", err);
                }
            }
        }, 60000); // 1 min
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/wellbeing/stats');
            setStats(res.data);
            // Assuming last item is today
            if (res.data.length > 0) {
                const last = res.data[res.data.length - 1];
                // Check if date is today
                if (new Date(last.date).toDateString() === new Date().toDateString()) {
                    setTodayMetrics(last);
                    if (last.moodScore) setMoodLogged(true);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleTimerComplete = async () => {
        setTimerActive(false);
        if (timerMode === 'work') {
            // Log session
            try {
                await api.post('/wellbeing/focus-session', { durationMinutes: 25 });
                fetchStats(); // Refresh stats
                alert("Focus Session Complete! Great job 🚀. Time for a break?");
                setTimerMode('break');
                setTimeLeft(5 * 60);
            } catch (err) {
                console.error(err);
            }
        } else {
            alert("Break over! Ready to focus?");
            setTimerMode('work');
            setTimeLeft(25 * 60);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const logMood = async (score: number) => {
        try {
            await api.post('/wellbeing/checkin', { moodScore: score });
            setMoodLogged(true);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Digital Wellbeing</h1>
            <p className="text-gray-500 mb-8">Balance your coding with healthy habits.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Timer & Mood */}
                <div className="space-y-8">
                    {/* Focus Timer */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center">
                                <ClockIcon className="w-6 h-6 mr-2" />
                                {timerMode === 'work' ? 'Focus Mode' : 'Break Time'}
                            </h2>
                            <button className="text-white/80 hover:text-white text-sm">Settings</button>
                        </div>

                        <div className="text-center mb-8">
                            <div className="text-7xl font-mono font-bold tracking-wider mb-2">
                                {formatTime(timeLeft)}
                            </div>
                            <p className="text-indigo-200">
                                {timerActive ? 'Stay focused, you got this!' : 'Ready to start?'}
                            </p>
                        </div>

                        <div className="flex justify-center space-x-4">
                            {!timerActive ? (
                                <button
                                    onClick={() => setTimerActive(true)}
                                    className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold flex items-center hover:bg-gray-100 transition-colors"
                                >
                                    <PlayCircleIcon className="w-6 h-6 mr-2" /> START
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setTimerActive(false)}
                                        className="bg-indigo-800/50 text-white px-6 py-3 rounded-full font-bold flex items-center hover:bg-indigo-800 transition-colors"
                                    >
                                        <PauseCircleIcon className="w-6 h-6 mr-2" /> PAUSE
                                    </button>
                                    <button
                                        onClick={() => { setTimerActive(false); setTimeLeft(timerMode === 'work' ? 25 * 60 : 5 * 60); }}
                                        className="text-white/70 hover:text-white px-4"
                                    >
                                        <StopCircleIcon className="w-8 h-8" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mood Check-in */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                            <FaceSmileIcon className="w-5 h-5 mr-2 text-yellow-500" />
                            How are you feeling today?
                        </h3>
                        {moodLogged ? (
                            <div className="text-center py-4 text-green-600 bg-green-50 rounded-xl">
                                Thanks for checking in! 🌟
                            </div>
                        ) : (
                            <div className="flex justify-between px-2">
                                {[1, 2, 3, 4, 5].map((score) => (
                                    <button
                                        key={score}
                                        onClick={() => logMood(score)}
                                        className="text-2xl hover:scale-125 transition-transform"
                                        title={`Score: ${score}`}
                                    >
                                        {score === 1 ? '😫' : score === 2 ? '😕' : score === 3 ? '😐' : score === 4 ? '🙂' : '🤩'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Col: Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Today's Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 flex items-center">
                            <div className="p-3 bg-orange-100 rounded-lg mr-4">
                                <FireIcon className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Screen Time (Today)</p>
                                <p className="text-2xl font-bold text-gray-900">{Math.floor(todayMetrics.screenTimeMinutes / 60)}h {todayMetrics.screenTimeMinutes % 60}m</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg mr-4">
                                <BoltIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Focus Sessions</p>
                                <p className="text-2xl font-bold text-gray-900">{todayMetrics.focusSessionsCount || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Trends Chart (Placeholder for now) */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-64 flex flex-col items-center justify-center">
                        <ChartBarIcon className="w-12 h-12 text-gray-300 mb-2" />
                        <p className="text-gray-400">Weekly Activity Trends will appear here</p>
                        {/* Note: In real app, use Recharts here with `stats` data */}
                        <div className="flex items-end space-x-2 h-32 mt-4">
                            {stats.slice(-7).map((d, i) => (
                                <div key={i} className="w-8 bg-blue-500 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
                                    style={{ height: `${Math.min(d.screenTimeMinutes / 5, 100)}%` }}
                                    title={`${Math.round(d.screenTimeMinutes)} mins`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Health Tips */}
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-6 text-white">
                        <h3 className="font-bold flex items-center mb-2">
                            <SparklesIcon className="w-5 h-5 mr-2" /> Daily Tip
                        </h3>
                        <p className="opacity-90">
                            Remember the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Quick fix for SparklesIcon if not imported (Heroicons v2 names vary, Sparkles is typical)
const SparklesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

export default WellbeingDashboard;
