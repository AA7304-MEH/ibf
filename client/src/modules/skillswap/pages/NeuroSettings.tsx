import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cog6ToothIcon,
    SparklesIcon,
    PaintBrushIcon,
    BellIcon,
    ShieldCheckIcon,
    GlobeAltIcon,
    SunIcon,
    MoonIcon,
    ComputerDesktopIcon,
    CheckCircleIcon,
    AdjustmentsHorizontalIcon,
    EyeIcon,
    BookOpenIcon,
    MusicalNoteIcon,
    LightBulbIcon,
    HandRaisedIcon
} from '@heroicons/react/24/outline';

interface Settings {
    learningStyle: string;
    pacePreference: string;
    dailyGoal: number;
    theme: string;
    fontSize: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyDigest: boolean;
    mentorAlerts: boolean;
    profileVisibility: string;
    showActivity: boolean;
    allowMessages: boolean;
    reduceMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
    language: string;
    timezone: string;
}

const NeuroSettings: React.FC = () => {
    const [activeSection, setActiveSection] = useState('preferences');
    const [settings, setSettings] = useState<Settings>({
        learningStyle: 'visual',
        pacePreference: 'steady',
        dailyGoal: 30,
        theme: 'dark',
        fontSize: 'medium',
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: false,
        mentorAlerts: true,
        profileVisibility: 'public',
        showActivity: true,
        allowMessages: true,
        reduceMotion: false,
        highContrast: false,
        screenReader: false,
        language: 'en',
        timezone: 'America/New_York'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('neuroSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
        setLoading(false);
    }, []);

    const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const saveSettings = () => {
        setSaving(true);
        setTimeout(() => {
            localStorage.setItem('neuroSettings', JSON.stringify(settings));
            setSaving(false);
            setHasChanges(false);
            setSavedMessage(true);
            setTimeout(() => setSavedMessage(false), 3000);
        }, 1000);
    };

    const resetSettings = () => {
        const defaultSettings: Settings = {
            learningStyle: 'visual',
            pacePreference: 'steady',
            dailyGoal: 30,
            theme: 'dark',
            fontSize: 'medium',
            emailNotifications: true,
            pushNotifications: true,
            weeklyDigest: false,
            mentorAlerts: true,
            profileVisibility: 'public',
            showActivity: true,
            allowMessages: true,
            reduceMotion: false,
            highContrast: false,
            screenReader: false,
            language: 'en',
            timezone: 'America/New_York'
        };
        setSettings(defaultSettings);
        setHasChanges(true);
    };

    const sections = [
        { id: 'preferences', title: 'Learning Preferences', icon: SparklesIcon, color: 'indigo' },
        { id: 'appearance', title: 'Appearance', icon: PaintBrushIcon, color: 'purple' },
        { id: 'notifications', title: 'Notifications', icon: BellIcon, color: 'amber' },
        { id: 'privacy', title: 'Privacy', icon: ShieldCheckIcon, color: 'green' },
        { id: 'accessibility', title: 'Accessibility', icon: AdjustmentsHorizontalIcon, color: 'blue' },
        { id: 'language', title: 'Language & Region', icon: GlobeAltIcon, color: 'rose' }
    ];

    const learningStyles = [
        { id: 'visual', label: 'Visual', icon: EyeIcon, description: 'Learn through images and videos' },
        { id: 'auditory', label: 'Auditory', icon: MusicalNoteIcon, description: 'Learn through listening' },
        { id: 'reading', label: 'Reading', icon: BookOpenIcon, description: 'Learn through text' },
        { id: 'kinesthetic', label: 'Hands-on', icon: HandRaisedIcon, description: 'Learn by doing' }
    ];

    const paceOptions = [
        { id: 'relaxed', label: 'Relaxed', description: 'Take your time, no rush' },
        { id: 'steady', label: 'Steady', description: 'Balanced pace for consistent progress' },
        { id: 'intensive', label: 'Intensive', description: 'Fast-paced learning' }
    ];

    const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) => (
        <button
            onClick={() => onChange(!enabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-gray-600'}`}
        >
            <motion.div
                animate={{ x: enabled ? 24 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
            />
        </button>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const renderSection = () => {
        switch (activeSection) {
            case 'preferences':
                return (
                    <div className="space-y-8">
                        {/* Learning Style */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Learning Style</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {learningStyles.map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => updateSetting('learningStyle', style.id)}
                                        className={`p-4 rounded-xl border-2 transition-all text-center ${settings.learningStyle === style.id
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <style.icon className={`w-8 h-8 mx-auto mb-2 ${settings.learningStyle === style.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                                        <span className={`font-medium ${settings.learningStyle === style.id ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-300'}`}>{style.label}</span>
                                        <p className="text-xs text-gray-500 mt-1">{style.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pace Preference */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Learning Pace</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {paceOptions.map((pace) => (
                                    <button
                                        key={pace.id}
                                        onClick={() => updateSetting('pacePreference', pace.id)}
                                        className={`p-4 rounded-xl border-2 transition-all ${settings.pacePreference === pace.id
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className={`font-medium ${settings.pacePreference === pace.id ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-300'}`}>{pace.label}</span>
                                        <p className="text-xs text-gray-500 mt-1">{pace.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Daily Goal */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Daily Learning Goal</h3>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="15"
                                    max="120"
                                    step="15"
                                    value={settings.dailyGoal}
                                    onChange={(e) => updateSetting('dailyGoal', parseInt(e.target.value))}
                                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <span className="text-2xl font-bold text-indigo-600 min-w-[80px] text-right">
                                    {settings.dailyGoal} min
                                </span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>15 min</span>
                                <span>2 hours</span>
                            </div>
                        </div>
                    </div>
                );

            case 'appearance':
                return (
                    <div className="space-y-8">
                        {/* Theme */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Theme</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'light', icon: SunIcon, label: 'Light' },
                                    { id: 'dark', icon: MoonIcon, label: 'Dark' },
                                    { id: 'system', icon: ComputerDesktopIcon, label: 'System' }
                                ].map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => updateSetting('theme', theme.id)}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${settings.theme === theme.id
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <theme.icon className={`w-8 h-8 ${settings.theme === theme.id ? 'text-purple-600' : 'text-gray-400'}`} />
                                        <span className={`font-medium ${settings.theme === theme.id ? 'text-purple-600' : 'text-gray-600 dark:text-gray-300'}`}>{theme.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Size */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Font Size</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {['small', 'medium', 'large'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => updateSetting('fontSize', size)}
                                        className={`p-4 rounded-xl border-2 transition-all ${settings.fontSize === size
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className={`font-medium capitalize ${size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : ''} ${settings.fontSize === size ? 'text-purple-600' : 'text-gray-600 dark:text-gray-300'}`}>
                                            {size}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        {[
                            { key: 'emailNotifications' as const, label: 'Email Notifications', description: 'Receive updates via email' },
                            { key: 'pushNotifications' as const, label: 'Push Notifications', description: 'Browser push notifications' },
                            { key: 'weeklyDigest' as const, label: 'Weekly Digest', description: 'Summary of your progress' },
                            { key: 'mentorAlerts' as const, label: 'Mentor Alerts', description: 'Messages from mentors' }
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                                <Toggle enabled={settings[item.key]} onChange={(val) => updateSetting(item.key, val)} />
                            </div>
                        ))}
                    </div>
                );

            case 'privacy':
                return (
                    <div className="space-y-6">
                        {/* Profile Visibility */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Profile Visibility</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {['public', 'friends', 'private'].map((visibility) => (
                                    <button
                                        key={visibility}
                                        onClick={() => updateSetting('profileVisibility', visibility)}
                                        className={`p-4 rounded-xl border-2 transition-all ${settings.profileVisibility === visibility
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className={`font-medium capitalize ${settings.profileVisibility === visibility ? 'text-green-600' : 'text-gray-600 dark:text-gray-300'}`}>
                                            {visibility}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {[
                            { key: 'showActivity' as const, label: 'Show Activity Status', description: 'Let others see when you\'re online' },
                            { key: 'allowMessages' as const, label: 'Allow Direct Messages', description: 'Receive messages from other users' }
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                                <Toggle enabled={settings[item.key]} onChange={(val) => updateSetting(item.key, val)} />
                            </div>
                        ))}
                    </div>
                );

            case 'accessibility':
                return (
                    <div className="space-y-6">
                        {[
                            { key: 'reduceMotion' as const, label: 'Reduce Motion', description: 'Minimize animations' },
                            { key: 'highContrast' as const, label: 'High Contrast', description: 'Increase color contrast' },
                            { key: 'screenReader' as const, label: 'Screen Reader Support', description: 'Optimize for screen readers' }
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                                <Toggle enabled={settings[item.key]} onChange={(val) => updateSetting(item.key, val)} />
                            </div>
                        ))}
                    </div>
                );

            case 'language':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Language</h3>
                            <select
                                value={settings.language}
                                onChange={(e) => updateSetting('language', e.target.value)}
                                className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="de">Deutsch</option>
                                <option value="zh">中文</option>
                                <option value="ja">日本語</option>
                            </select>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Timezone</h3>
                            <select
                                value={settings.timezone}
                                onChange={(e) => updateSetting('timezone', e.target.value)}
                                className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                            >
                                <option value="America/New_York">Eastern Time (ET)</option>
                                <option value="America/Chicago">Central Time (CT)</option>
                                <option value="America/Denver">Mountain Time (MT)</option>
                                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                <option value="Europe/London">London (GMT)</option>
                                <option value="Europe/Paris">Paris (CET)</option>
                                <option value="Asia/Tokyo">Tokyo (JST)</option>
                                <option value="Asia/Kolkata">India (IST)</option>
                            </select>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-8 relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Cog6ToothIcon className="w-12 h-12 text-white" />
                        <div>
                            <h1 className="text-4xl font-bold text-white">Neuro Settings</h1>
                            <p className="text-white/70">Personalize your learning experience</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Save Status */}
            <AnimatePresence>
                {savedMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50"
                    >
                        <CheckCircleIcon className="w-5 h-5" />
                        Settings saved successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 h-fit lg:sticky lg:top-6">
                    <nav className="space-y-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === section.id
                                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <section.icon className="w-5 h-5" />
                                <span className="font-medium">{section.title}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            {sections.find(s => s.id === activeSection)?.title}
                        </h2>
                        {renderSection()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={resetSettings}
                            className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            Reset to Defaults
                        </button>
                        <button
                            onClick={saveSettings}
                            disabled={!hasChanges || saving}
                            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${hasChanges && !saving
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {saving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeuroSettings;
