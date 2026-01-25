import React, { useState } from 'react';
import { BoltIcon, MoonIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

const NeuroSettings: React.FC = () => {
    const [settings, setSettings] = useState({
        focusMode: false,
        dyslexiaFont: false,
        calmMode: false,
        highContrast: false
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        // In a real app, we would inject CSS classes or Context here
        if (key === 'focusMode') {
            document.body.classList.toggle('focus-mode');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cognitive & Neuro-Diversity Settings</h1>
            <p className="text-gray-500 mb-8">Customize the SkillSwap interface to match your unique way of processing information.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Focus Mode */}
                <div className={`p-6 rounded-2xl border transition-all ${settings.focusMode ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-indigo-100 p-3 rounded-xl">
                            <BoltIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <Toggle checked={settings.focusMode} onChange={() => toggle('focusMode')} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Hyper-Focus Mode</h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Reduces UI clutter, hides non-essential notifications, and uses a monochromatic theme to minimize distraction. Ideal for ADHD.
                    </p>
                </div>

                {/* Dyslexia Support */}
                <div className={`p-6 rounded-2xl border transition-all ${settings.dyslexiaFont ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-orange-100 p-3 rounded-xl">
                            <span className="text-xl font-serif font-bold text-orange-600">Aa</span>
                        </div>
                        <Toggle checked={settings.dyslexiaFont} onChange={() => toggle('dyslexiaFont')} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Dyslexia Support</h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Enables OpenDyslexic font simulation, increases line height, and adds bottom-weight to letters for better readability.
                    </p>
                </div>

                {/* Calm Mode */}
                <div className={`p-6 rounded-2xl border transition-all ${settings.calmMode ? 'bg-teal-50 border-teal-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-teal-100 p-3 rounded-xl">
                            <MoonIcon className="w-6 h-6 text-teal-600" />
                        </div>
                        <Toggle checked={settings.calmMode} onChange={() => toggle('calmMode')} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Calm Mode</h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Uses muted pastel colors, reduces motion/animations, and provides gentle guidance prompts. Designed for anxiety reduction.
                    </p>
                </div>

                {/* Mood Adaptation */}
                <div className={`p-6 rounded-2xl border bg-white border-gray-200 shadow-sm`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-pink-100 p-3 rounded-xl">
                            <span className="text-xl">🎭</span>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Emotional Adaptation</h3>
                    <p className="text-sm text-gray-600 mt-2 mb-4">
                        Select your current state to adapt the UI colors and pacing.
                    </p>
                    <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200">Energetic</button>
                        <button className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200">Focused</button>
                        <button className="flex-1 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-200">Stressed</button>
                    </div>
                </div>

                {/* Screen Reader */}
                <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm opacity-50 cursor-not-allowed">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-gray-100 p-3 rounded-xl">
                            <SpeakerWaveIcon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="px-2 py-1 bg-gray-200 text-xs font-bold rounded text-gray-500">Coming Soon</div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Screen Reader Optimization</h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Enhanced ARIA labels and sequential keyboard navigation for visual impairments.
                    </p>
                </div>

            </div>
        </div>
    );
};

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`${checked ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`}
    >
        <span
            aria-hidden="true"
            className={`${checked ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
    </button>
);

export default NeuroSettings;
