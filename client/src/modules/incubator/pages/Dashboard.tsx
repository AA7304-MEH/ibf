import {
    ClockIcon,
    CheckCircleIcon,
    ChatBubbleLeftRightIcon,
    UserGroupIcon,
    ChartPieIcon,
    ListBulletIcon,
    PlusIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const IncubatorDashboard: React.FC = () => {
    // Mock Data - In real app fetch from /incubator/me
    const application = {
        startupName: 'TechFlow',
        status: 'accepted', // applied, review, interview, accepted, rejected
        submissionDate: '2026-01-20',
        nextStep: 'Onboarding Call',
        timeline: [
            { step: 'Applied', date: 'Jan 20', status: 'completed' },
            { step: 'Under Review', date: 'Jan 22', status: 'completed' },
            { step: 'Interview', date: 'Jan 24', status: 'completed' },
            { step: 'Decision', date: 'Jan 25', status: 'completed' },
            { step: 'Accepted', date: 'Jan 25', status: 'current' }
        ]
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Incubator Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Track your application and access resources.</p>
            </header>

            {/* Status Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Application Status:
                            <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm uppercase">
                                {application.status}
                            </span>
                        </h2>
                        <p className="text-gray-500 mt-1">Startup: <strong>{application.startupName}</strong></p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Next Action</p>
                        <p className="font-bold text-ibf-primary text-lg">{application.nextStep}</p>
                    </div>
                </div>

                {/* Visual Timeline */}
                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 hidden md:block" />
                    <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                        {application.timeline.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${item.status === 'completed' ? 'bg-green-500 border-green-200 text-white' :
                                    item.status === 'current' ? 'bg-ibf-primary border-blue-200 text-white animate-pulse' :
                                        'bg-white border-gray-200 text-gray-300'
                                    } shadow-sm transition-colors duration-300`}>
                                    {item.status === 'completed' ? <CheckCircleIcon className="w-6 h-6" /> :
                                        item.status === 'current' ? <ClockIcon className="w-6 h-6" /> :
                                            <div className="w-3 h-3 rounded-full bg-gray-300" />}
                                </div>
                                <div className="mt-4 bg-white dark:bg-gray-800 px-2">
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{item.step}</p>
                                    <p className="text-xs text-gray-500">{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Key Metrics */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <ChartPieIcon className="w-5 h-5 text-ibf-primary" /> Key Startup Metrics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Monthly Active Users</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,240</p>
                            <p className="text-xs text-green-600 mt-1">↑ 12% vs last month</p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Revenue (MRR)</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${(12400).toLocaleString()}</p>
                            <p className="text-xs text-green-600 mt-1">↑ 8% vs last month</p>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Growth Rate</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">24%</p>
                            <p className="text-xs text-purple-600 mt-1">On track for Q1</p>
                        </div>
                    </div>
                </div>

                {/* Team Presence */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <UserGroupIcon className="w-5 h-5 text-gray-400" /> Team Presence
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">Sarah (Founder) - Online</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <span className="text-sm text-gray-500 italic">John (Technical) - Offline</span>
                        </div>
                        <Link to="/incubator/multiverse" className="block w-full text-center py-2 bg-ibf-primary/10 text-ibf-primary rounded-lg text-sm font-medium hover:bg-ibf-primary/20 transition-colors">
                            Enter Virtual Office
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Task Manager (Kanban Preview) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <ListBulletIcon className="w-5 h-5 text-ibf-primary" /> Active Tasks
                        </h3>
                        <button className="flex items-center gap-1 text-sm bg-ibf-primary text-white px-3 py-1.5 rounded-lg hover:bg-ibf-primary-dark transition-colors">
                            <PlusIcon className="w-4 h-4" /> New Task
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">To Do (2)</p>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 text-sm">
                                Refine pitch deck for Sarah
                                <p className="text-xs text-gray-400 mt-2">Due Feb 25</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 text-sm">
                                Setup MongoDB indexing
                                <p className="text-xs text-gray-400 mt-2">Due Mar 01</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">In Progress (1)</p>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 text-sm">
                                API Security Audit
                                <p className="text-xs text-blue-400 mt-2">Assigned to: John</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-green-500 uppercase tracking-wider">Done (3)</p>
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 text-sm opacity-60">
                                Landing Page MVP
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Communications */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400" /> Communications
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-sm">IBF Admin</span>
                                    <span className="text-xs text-gray-400">Today</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Congratulations on your acceptance! Please check your email for the onboarding kit.
                                </p>
                            </div>
                            <button className="w-full text-center text-sm text-ibf-primary font-medium hover:underline">View All Messages</button>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-900 dark:text-purple-100">
                            <AcademicCapIcon className="w-5 h-5" /> Founder Resources
                        </h3>
                        <div className="space-y-3 font-medium">
                            <button className="w-full bg-white dark:bg-gray-800 text-purple-700 py-2.5 rounded-lg shadow-sm hover:shadow transition-shadow">
                                Book Mentor Hours
                            </button>
                            <button className="w-full bg-white dark:bg-gray-800 text-purple-700 py-2.5 rounded-lg shadow-sm hover:shadow transition-shadow">
                                Legal Templates (SAFE)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncubatorDashboard;
