import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
    HeartIcon,
    CpuChipIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
    userRole: string;
}

type NavSection = {
    title: string;
    items: { name: string; path: string; icon: any }[];
};

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
    const location = useLocation();
    const pathname = location.pathname;

    // Detect active module
    const currentModule = pathname.startsWith('/skillswap') ? 'skillswap'
        : pathname.startsWith('/incubator') ? 'incubator'
            : pathname.startsWith('/collab') ? 'collab'
                : 'general'; // dashboard, profile, etc.

    const getSections = (): NavSection[] => {
        // Common items for everyone (Overview usually goes to dashboard)
        // If inside a module, maybe show a "Back to Hub" or specific module dashboard?
        // For now, keep Overview global but filter the rest.

        const common = [{ name: 'Overview', path: '/dashboard', icon: HomeIcon }];

        let sections: NavSection[] = [];

        // 1. INCUBATOR MODULE
        if (userRole === 'founder' || userRole === 'admin') {
            if (currentModule === 'incubator' || currentModule === 'general') {
                sections.push({
                    title: 'Incubator',
                    items: [
                        { name: 'Dashboard', path: '/incubator', icon: HomeIcon }, // Module Dashboard
                        { name: 'Multiverse HQ', path: '/incubator/multiverse', icon: RocketLaunchIcon },
                        { name: 'Startup Genome', path: '/incubator/genome', icon: ChartBarIcon },
                        { name: 'Founder Copilot', path: '/incubator/founder-copilot', icon: BoltIcon },
                        { name: 'Pitch Simulation', path: '/incubator/pitch-room', icon: UserGroupIcon },
                    ]
                });
            }
        }

        // 2. COLLAB MODULE
        if (['founder', 'talent', 'student', 'admin'].includes(userRole)) {
            if (currentModule === 'collab' || currentModule === 'general') {
                sections.push({
                    title: 'Collab Hub',
                    items: [
                        { name: 'Dashboard', path: '/collab', icon: HomeIcon },
                        { name: 'Neural Match', path: '/collab/neural-match', icon: UserGroupIcon },
                        { name: 'War Room', path: '/collab/war-room', icon: UserGroupIcon },
                        { name: 'Work DNA', path: '/collab/assessment', icon: FingerPrintIcon },
                        { name: 'Skill Evolution', path: '/collab/skill-evolution', icon: ChartBarIcon },
                        { name: 'Marketplace', path: '/marketplace', icon: BriefcaseIcon },
                    ]
                });
            }
        }

        // 3. SKILLSWAP MODULE - (Now includes Parent & Company Portals as sub-features)
        if (['student', 'parent', 'company', 'admin'].includes(userRole)) {
            if (currentModule === 'skillswap' || currentModule === 'general') {
                const skillSwapItems = [
                    { name: 'My Learning', path: '/skillswap', icon: AcademicCapIcon },
                    { name: 'Ecosystem Brain', path: '/skillswap/ecosystem/brain', icon: CpuChipIcon },
                    { name: 'Symbiosis Engine', path: '/skillswap/ecosystem/symbiosis', icon: HeartIcon },
                    { name: 'Metaverse HQ', path: '/skillswap/metaverse', icon: CubeTransparentIcon },
                    { name: 'Skill Wallet', path: '/skillswap/skill-wallet', icon: CreditCardIcon },
                    { name: 'Global Impact', path: '/skillswap/global-impact', icon: GlobeAltIcon },
                    { name: 'Neuro Settings', path: '/skillswap/settings', icon: BoltIcon },
                    { name: 'Live Chat', path: '/skillswap/chat', icon: ChatBubbleLeftRightIcon },
                ];

                sections.push({
                    title: 'SkillSwap Hub',
                    items: skillSwapItems
                });

                // Conditional Parent Integration
                if (['parent', 'admin'].includes(userRole)) {
                    sections.push({
                        title: 'Parent Ecosystem',
                        items: [
                            { name: 'Guardian Dashboard', path: '/parent/dashboard', icon: ShieldCheckIcon },
                            { name: 'Child Insights', path: '/parent/insight', icon: ChartBarIcon },
                        ]
                    });
                }

                // Conditional Company Integration
                if (['company', 'admin'].includes(userRole)) {
                    sections.push({
                        title: 'Company Portal',
                        items: [
                            { name: 'Post Internship', path: '/internships/post', icon: BriefcaseIcon },
                            { name: 'Manage Applicants', path: '/internships/manage', icon: UserGroupIcon },
                        ]
                    });
                }

                sections.push({
                    title: 'Career & Social',
                    items: [
                        { name: 'Portfolio Builder', path: '/career/portfolio', icon: BriefcaseIcon },
                        { name: 'Micro-Internships', path: '/internships', icon: RocketLaunchIcon },
                        { name: 'Waitlist / Beta', path: '/social/showcase', icon: UserGroupIcon },
                    ]
                });

                sections.push({
                    title: 'Gamification',
                    items: [
                        { name: 'Leaderboard', path: '/skillswap/leaderboard', icon: ChartBarIcon },
                    ]
                });
            }
        }



        // General / Hub View
        if (currentModule === 'general') {
            // Add a "Modules" header if we are in general view to separate them
            // Actually, the above logic adds them as blocks. 
            // Maybe add "General" block at the top
            sections.unshift({
                title: 'General',
                items: common
            });
        }

        return sections;
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
