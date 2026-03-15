import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HomeIcon,
    BriefcaseIcon,
    UserGroupIcon,
    AcademicCapIcon,
    TrophyIcon,
    ShieldCheckIcon,
    BuildingLibraryIcon,
    CpuChipIcon,
    BoltIcon,
    CreditCardIcon,
    RocketLaunchIcon,
    ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeSolid,
    BriefcaseIcon as BriefcaseSolid,
    TrophyIcon as TrophySolid,
    RocketLaunchIcon as RocketSolid,
    UserGroupIcon as UserGroupSolid,
    AcademicCapIcon as AcademicSolid,
    CreditCardIcon as CreditSolid,
    BoltIcon as BoltSolid,
    ArrowTrendingUpIcon as TrendingSolid,
    ShieldCheckIcon as ShieldSolid,
    CpuChipIcon as CpuSolid,
    BuildingLibraryIcon as LibrarySolid,
} from '@heroicons/react/24/solid';

interface SidebarProps {
    userRole: string;
}

type NavItem = {
    name: string;
    path: string;
    icon: React.ElementType;
    iconSolid: React.ElementType;
    badge?: string;
};

type NavSection = {
    title: string;
    items: NavItem[];
};

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
    const location = useLocation();

    const isItemActive = (path: string) => {
        const base = path.split('?')[0];
        return location.pathname === base || location.pathname.startsWith(base + '/');
    };

    const getSections = (): NavSection[] => {
        const sections: NavSection[] = [];

        sections.push({
            title: 'Earning Centre',
            items: [
                { name: 'Dashboard',    path: '/dashboard',          icon: HomeIcon,         iconSolid: HomeSolid },
                { name: 'Marketplace',  path: '/marketplace',        icon: BriefcaseIcon,    iconSolid: BriefcaseSolid },
                { name: 'Leaderboard',  path: '/leaderboard/market', icon: TrophyIcon,       iconSolid: TrophySolid },
            ],
        });

        sections.push({
            title: 'Task Modules',
            items: [
                { name: 'Incubator',    path: '/marketplace?module=incubator', icon: RocketLaunchIcon, iconSolid: RocketSolid },
                { name: 'Collab Hub',   path: '/marketplace?module=collab',    icon: UserGroupIcon,    iconSolid: UserGroupSolid },
                { name: 'SkillSwap',    path: '/marketplace?module=skillswap', icon: AcademicCapIcon,  iconSolid: AcademicSolid },
            ],
        });

        sections.push({
            title: 'Financials',
            items: [
                { name: 'My Wallet',    path: '/wallet',    icon: CreditCardIcon,       iconSolid: CreditSolid },
                { name: 'Withdraw',     path: '/withdraw',  icon: BoltIcon,             iconSolid: BoltSolid },
                { name: 'Referral Hub', path: '/referrals', icon: ArrowTrendingUpIcon,  iconSolid: TrendingSolid },
            ],
        });

        if (userRole === 'admin') {
            sections.push({
                title: 'Administration',
                items: [
                    { name: 'Admin Panel',   path: '/admin',              icon: ShieldCheckIcon,      iconSolid: ShieldSolid },
                    { name: 'Manage Tasks',  path: '/admin/tasks',        icon: CpuChipIcon,          iconSolid: CpuSolid },
                    { name: 'KYC & Payouts', path: '/admin/withdrawals',  icon: BuildingLibraryIcon,  iconSolid: LibrarySolid },
                ],
            });
        }

        return sections;
    };

    return (
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 hidden lg:flex flex-col overflow-hidden glass border-r border-white/5 z-40 transition-all duration-300">
            {/* Scrollable nav area */}
            <nav className="flex-1 overflow-y-auto landing-scrollbar py-6 px-4 space-y-8">
                {getSections().map((section, idx) => (
                    <div key={idx}>
                        {/* Section label */}
                        <div className="flex items-center gap-3 px-3 mb-3">
                            <span className="text-[10px] font-syne font-extrabold tracking-[0.2em] uppercase text-teal/40">
                                {section.title}
                            </span>
                            <div className="flex-1 h-[1px] bg-gradient-to-r from-teal/20 to-transparent" />
                        </div>

                        {/* Nav items */}
                        <div className="space-y-1.5">
                            {section.items.map((link) => {
                                const active = isItemActive(link.path);
                                const IconOutline = link.icon;
                                const IconSolid = link.iconSolid;

                                return (
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        className={({ isActive }) => `
                                            group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden
                                            ${active 
                                                ? 'bg-gradient-to-r from-teal/15 to-transparent text-teal ring-1 ring-inset ring-teal/20' 
                                                : 'text-muted hover:text-white hover:bg-white/[0.04]'}
                                        `}
                                    >
                                        {/* Active indicator bar */}
                                        {active && (
                                            <motion.span 
                                                layoutId="activeTab"
                                                className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-teal rounded-r-full shadow-[0_0_12px_#00f5d4]" 
                                            />
                                        )}

                                        {/* Icon Container */}
                                        <div className={`
                                            flex-shrink-0 w-5 h-5 flex items-center justify-center transition-transform duration-300
                                            ${active ? 'scale-110' : 'group-hover:scale-110'}
                                        `}>
                                            {active
                                                ? <IconSolid className="w-5 h-5 drop-shadow-[0_0_8px_rgba(0,245,212,0.4)]" />
                                                : <IconOutline className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                                            }
                                        </div>

                                        {/* Label */}
                                        <span className={`font-sans text-[13.5px] tracking-tight truncate ${active ? 'font-bold' : 'font-medium opacity-80 group-hover:opacity-100'}`}>
                                            {link.name}
                                        </span>

                                        {/* Badge */}
                                        {link.badge && (
                                            <span className="ml-auto text-[9px] font-black px-2 py-0.5 rounded-full bg-teal/10 text-teal border border-teal/20 shadow-[0_0_10px_rgba(0,245,212,0.1)]">
                                                {link.badge}
                                            </span>
                                        )}

                                        {/* Hover Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer branding strip */}
            <div className="px-6 py-4 flex items-center gap-3 bg-white/[0.02] border-t border-white/5">
                <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-teal animate-pulse shadow-[0_0_8px_#00f5d4]" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-teal animate-ping opacity-40" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[11px] font-syne font-bold tracking-tight text-white/70">
                        SolveEarn Platform
                    </span>
                    <span className="text-[9px] font-semibold text-muted/50 uppercase tracking-tighter">
                        Nexus Core v2.4
                    </span>
                </div>
                <div className="ml-auto px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[8px] font-black text-muted/40">
                    LIVE
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
