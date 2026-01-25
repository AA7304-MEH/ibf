import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    HomeIcon,
    BriefcaseIcon,
    UserGroupIcon,
    AcademicCapIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    CloudArrowDownIcon,
    BuildingLibraryIcon,
    CubeTransparentIcon,
    BoltIcon,
    CreditCardIcon,
    GlobeAltIcon,
    RocketLaunchIcon,
    FingerPrintIcon,
    HeartIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
    userRole: string;
}

type NavSection = {
    title: string;
    items: { name: string; path: string; icon: any }[];
};

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {

    const getSections = (): NavSection[] => {
        // Common items for everyone
        const common = [{ name: 'Overview', path: '/dashboard', icon: HomeIcon }];

        if (userRole === 'founder') {
            return [
                {
                    title: 'General',
                    items: common
                },
                {
                    title: 'Incubator Ultimate',
                    items: [
                        { name: 'Multiverse HQ', path: '/incubator/multiverse', icon: RocketLaunchIcon },
                        { name: 'Startup Genome', path: '/incubator/genome', icon: ChartBarIcon },
                        { name: 'Founder Copilot', path: '/incubator/founder-copilot', icon: BoltIcon },
                        { name: 'Pitch Simulation', path: '/incubator/pitch-room', icon: UserGroupIcon },
                        { name: 'Applications', path: '/dashboard/applications', icon: UserGroupIcon },
                    ]
                }
            ];
        }

        if (userRole === 'talent' || userRole === 'student') {
            return [
                {
                    title: 'General',
                    items: common
                },
                {
                    title: 'Collab Advanced',
                    items: [
                        { name: 'Neural Match', path: '/collab/neural-match', icon: UserGroupIcon },
                        { name: 'War Room', path: '/collab/war-room', icon: UserGroupIcon },
                        { name: 'Work DNA', path: '/collab/assessment', icon: FingerPrintIcon },
                        { name: 'Skill Evolution', path: '/collab/skill-evolution', icon: ChartBarIcon },
                        { name: 'Marketplace', path: '/marketplace', icon: BriefcaseIcon },
                    ]
                },
                {
                    title: 'SkillSwap Ecosystem',
                    items: [
                        { name: 'Ecosystem Brain', path: '/ecosystem/brain', icon: GlobeAltIcon },
                        { name: 'Symbiosis Engine', path: '/ecosystem/symbiosis', icon: HeartIcon },
                        { name: 'Metaverse HQ', path: '/metaverse/workspace', icon: CubeTransparentIcon },
                        { name: 'Skill Wallet', path: '/web3/wallet', icon: CreditCardIcon },
                        { name: 'Global Impact', path: '/impact/global', icon: GlobeAltIcon },
                        { name: 'Neuro Settings', path: '/settings/neuro', icon: BoltIcon },
                    ]
                },
                {
                    title: 'Career & Social',
                    items: [
                        { name: 'Portfolio', path: '/career/portfolio', icon: UserGroupIcon },
                        { name: 'Waitlist / Beta', path: '/social/showcase', icon: UserGroupIcon },
                    ]
                }
            ];
        }

        // Admin / Fallback
        return [
            {
                title: 'Menu',
                items: common
            }
        ];
    };

    return (
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-surface-card-light dark:bg-surface-card-dark border-r border-gray-200 dark:border-gray-800 hidden lg:block overflow-y-auto">
            <div className="p-4 space-y-6">
                {getSections().map((section, idx) => (
                    <div key={idx}>
                        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            {section.title}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                        }`
                                    }
                                >
                                    <link.icon className="w-5 h-5" />
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
