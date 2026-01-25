import React, { useState } from 'react';
import { TrophyIcon, FireIcon } from '@heroicons/react/24/solid';

const Leaderboard: React.FC = () => {
    // Mock Leaderboard Data
    const leaders = [
        { rank: 1, name: "Sarah J.", xp: 2450, streak: 12, avatar: "👩‍💻" },
        { rank: 2, name: "Ashwin M.", xp: 2100, streak: 8, avatar: "👨‍💻" },
        { rank: 3, name: "Dev P.", xp: 1950, streak: 5, avatar: "🧑‍🚀" },
        { rank: 4, name: "Maya S.", xp: 1800, streak: 3, avatar: "👩‍🎨" },
        { rank: 5, name: "Liam K.", xp: 1650, streak: 10, avatar: "🕵️" },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-yellow-500 p-4 text-white flex justify-between items-center">
                <h3 className="font-bold flex items-center text-lg">
                    <TrophyIcon className="w-6 h-6 mr-2 text-yellow-100" />
                    Top Builders
                </h3>
                <span className="text-xs bg-yellow-600 px-2 py-1 rounded">Weekly</span>
            </div>

            <div className="divide-y divide-gray-100">
                {leaders.map((user) => (
                    <div key={user.rank} className="p-4 flex items-center hover:bg-gray-50 transition-colors">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold mr-4
                            ${user.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                user.rank === 2 ? 'bg-gray-200 text-gray-700' :
                                    user.rank === 3 ? 'bg-orange-100 text-orange-800' : 'text-gray-400'}
                        `}>
                            {user.rank}
                        </div>
                        <div className="text-2xl mr-3">{user.avatar}</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{user.name}</h4>
                            <div className="flex items-center text-xs text-gray-500">
                                <span className="text-purple-600 font-bold mr-2">{user.xp} XP</span>
                                {user.streak > 5 && (
                                    <span className="flex items-center text-orange-500">
                                        <FireIcon className="w-3 h-3 mr-0.5" /> {user.streak} day streak
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 bg-gray-50 text-center text-sm text-blue-600 font-medium cursor-pointer hover:bg-gray-100">
                View Full Leaderboard
            </div>
        </div>
    );
};

export default Leaderboard;
