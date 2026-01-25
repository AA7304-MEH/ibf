import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layout Components
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Incubator Module
import IncubatorStartups from './pages/incubator/Startups';
import IncubatorApply from './pages/incubator/Apply';
import IncubatorDashboard from './pages/incubator/Dashboard';
import IncubatorStartupDetail from './pages/incubator/StartupDetail';
import IncubatorLanding from './pages/incubator/Landing';

// Collab Module
import CollabMarketplace from './pages/collab/Marketplace';
import CollabPostProject from './pages/collab/PostProject';
import CollabProjectDetail from './pages/collab/ProjectDetail';
import CollabLanding from './pages/collab/Landing';

// SkillSwap Module
import SkillSwapLanding from './pages/SkillSwap/Landing';
import SkillSwapProjects from './pages/SkillSwap/Projects';
import SkillSwapConsent from './pages/SkillSwap/Consent';

// SkillSwap Public Flow
import AgeGate from './pages/SkillSwap/AgeGate';
import StudentRegistration from './pages/SkillSwap/register/StudentRegistration';
import SkillAssessmentWizard from './pages/SkillSwap/assessment/SkillAssessmentWizard';
import LearningRoadmap from './pages/SkillSwap/dashboard/LearningRoadmap';

// Dashboard
import UserDashboard from './pages/dashboard/Dashboard';

// Admin
import AdminPanel from './pages/admin/Panel';
import IncubatorManager from './pages/admin/IncubatorManager';

// Wellbeing & Gamification
import WellbeingDashboard from './pages/Wellbeing/WellbeingDashboard';
import ParentalInsight from './pages/Parent/ParentalInsight';
import Leaderboard from './pages/SkillSwap/gamification/Leaderboard';

// Social & Career
import ProjectShowcase from './pages/Social/ProjectShowcase';
import PortfolioBuilder from './pages/Career/PortfolioBuilder';
import LearningCircles from './pages/Social/Circles/LearningCircles';

// Settings & Visuals
import PrivacySettings from './pages/Settings/PrivacySettings';
import SkillGalaxy from './pages/Visuals/SkillGalaxy';
import EcosystemHub from './pages/Ecosystem/EcosystemHub';
import SchoolDashboard from './pages/Ecosystem/Portals/SchoolDashboard';
import MentorDashboard from './pages/Ecosystem/Portals/MentorDashboard';

// Incubator Features
import StartupMultiverse from './pages/incubator/StartupMultiverse';
import FounderCopilot from './pages/incubator/FounderCopilot';
import HoloPitchRoom from './pages/incubator/HoloPitchRoom';
import StartupGenome from './pages/Incubator/Genome/StartupGenome';

// Collab Features
import NeuralTalentMatch from './pages/collab/NeuralTalentMatch';
import ProjectWarRoom from './pages/collab/ProjectWarRoom';
import WorkDNA from './pages/collab/WorkDNA';
import SkillEvolution from './pages/collab/SkillEvolution';

// Ultimate Features
import EcosystemBrain from './pages/Ecosystem/Brain/EcosystemBrain';
import SymbiosisEngine from './pages/Ecosystem/SymbiosisEngine';
import DigitalTwinWorkspace from './pages/Metaverse/DigitalTwinWorkspace';
import HoloMeeting from './pages/Metaverse/HoloMeeting';
import Web3Wallet from './pages/Web3/Web3Wallet';
import PlanetaryDashboard from './pages/Impact/PlanetaryDashboard';
import NeuroSettings from './pages/Settings/NeuroSettings';
import AICopilot from './components/ai/AICopilot';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AICopilot />
            <ToastProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/incubator" element={<IncubatorLanding />} />
                    <Route path="/collab" element={<CollabLanding />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* SkillSwap Public Flow */}
                    <Route path="/skillswap" element={<AgeGate />} />
                    <Route path="/skillswap/register" element={<StudentRegistration />} />

                    {/* SkillSwap Assessment - Public/Protected Hybrid */}
                    <Route path="/skillswap/assessment" element={
                        <PrivateRoute allowedRoles={['student']}>
                            <SkillAssessmentWizard />
                        </PrivateRoute>
                    } />

                    {/* Protected Routes */}
                    <Route element={<Layout />}>
                        {/* Dashboard */}
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <UserDashboard />
                            </PrivateRoute>
                        } />

                        {/* Incubator Protected Routes */}
                        <Route path="/incubator/startups" element={
                            <PrivateRoute allowedRoles={['founder', 'admin']}>
                                <IncubatorStartups />
                            </PrivateRoute>
                        } />
                        <Route path="/incubator/apply" element={
                            <PrivateRoute allowedRoles={['founder']}>
                                <IncubatorApply />
                            </PrivateRoute>
                        } />
                        <Route path="/incubator/startups/:id" element={
                            <PrivateRoute allowedRoles={['founder', 'admin']}>
                                <IncubatorStartupDetail />
                            </PrivateRoute>
                        } />
                        <Route path="/incubator/dashboard" element={
                            <PrivateRoute allowedRoles={['founder']}>
                                <IncubatorDashboard />
                            </PrivateRoute>
                        } />

                        {/* Collab Protected Routes */}
                        <Route path="/collab/market" element={
                            <PrivateRoute allowedRoles={['founder', 'talent', 'admin']}>
                                <CollabMarketplace />
                            </PrivateRoute>
                        } />
                        <Route path="/collab/post" element={
                            <PrivateRoute allowedRoles={['founder', 'admin']}>
                                <CollabPostProject />
                            </PrivateRoute>
                        } />
                        <Route path="/collab/project/:id" element={
                            <PrivateRoute allowedRoles={['founder', 'talent', 'admin']}>
                                <CollabProjectDetail />
                            </PrivateRoute>
                        } />

                        {/* SkillSwap Routes - Student Only (Dashboard) */}
                        <Route path="/skillswap/dashboard">
                            <Route index element={
                                <PrivateRoute allowedRoles={['student']}>
                                    <div className="p-6">
                                        <h1 className="text-2xl font-bold mb-6 text-gray-800">Student Dashboard</h1>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            <div className="lg:col-span-2">
                                                <LearningRoadmap />
                                            </div>
                                            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                                                <h3 className="font-bold text-gray-700 mb-4">Recommended Projects</h3>
                                                {/* Placeholder for project recommendations */}
                                                <div className="text-sm text-gray-500">
                                                    Analysis based on your Skill DNA suggests these "Growth" projects...
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </PrivateRoute>
                            } />
                            <Route path="projects" element={
                                <PrivateRoute allowedRoles={['student']}>
                                    <SkillSwapProjects />
                                </PrivateRoute>
                            } />
                            <Route path="consent" element={
                                <PrivateRoute allowedRoles={['student']}>
                                    <SkillSwapConsent />
                                </PrivateRoute>
                            } />
                        </Route>

                        {/* Social & Career Routes */}
                        <Route path="/social/showcase" element={<PrivateRoute><ProjectShowcase /></PrivateRoute>} />
                        <Route path="/social/circles" element={<PrivateRoute><LearningCircles /></PrivateRoute>} />
                        <Route path="/career/portfolio" element={<PrivateRoute><PortfolioBuilder /></PrivateRoute>} />

                        {/* Final Ecosystem Routes */}
                        <Route path="/settings/privacy" element={<PrivateRoute><PrivacySettings /></PrivateRoute>} />
                        <Route path="/visuals/galaxy" element={<PrivateRoute><SkillGalaxy /></PrivateRoute>} />
                        <Route path="/ecosystem" element={<PrivateRoute><EcosystemHub /></PrivateRoute>} />
                        <Route path="/ecosystem/school" element={<PrivateRoute><SchoolDashboard /></PrivateRoute>} />
                        <Route path="/ecosystem/mentor" element={<PrivateRoute><MentorDashboard /></PrivateRoute>} />

                        {/* Incubator Ultimate Routes - Founder Only */}
                        <Route path="/incubator/multiverse" element={<PrivateRoute allowedRoles={['founder']}><StartupMultiverse /></PrivateRoute>} />
                        <Route path="/incubator/founder-copilot" element={<PrivateRoute allowedRoles={['founder']}><FounderCopilot /></PrivateRoute>} />
                        <Route path="/incubator/pitch-room" element={<PrivateRoute allowedRoles={['founder']}><HoloPitchRoom /></PrivateRoute>} />
                        <Route path="/incubator/genome" element={<PrivateRoute allowedRoles={['founder']}><StartupGenome /></PrivateRoute>} />

                        {/* Collab Advanced Routes - Talent Only */}
                        <Route path="/collab/neural-match" element={<PrivateRoute allowedRoles={['talent']}><NeuralTalentMatch /></PrivateRoute>} />
                        <Route path="/collab/war-room" element={<PrivateRoute allowedRoles={['talent']}><ProjectWarRoom /></PrivateRoute>} />
                        <Route path="/collab/assessment" element={<PrivateRoute allowedRoles={['talent']}><WorkDNA /></PrivateRoute>} />
                        <Route path="/collab/skill-evolution" element={<PrivateRoute allowedRoles={['talent']}><SkillEvolution /></PrivateRoute>} />

                        {/* Ultimate Metaverse Routes - Student/SkillSwap Only */}
                        <Route path="/ecosystem/brain" element={<PrivateRoute allowedRoles={['student', 'founder', 'talent']}><EcosystemBrain /></PrivateRoute>} />
                        <Route path="/ecosystem/symbiosis" element={<PrivateRoute allowedRoles={['student', 'founder', 'talent']}><SymbiosisEngine /></PrivateRoute>} />
                        <Route path="/metaverse/workspace" element={<PrivateRoute allowedRoles={['student']}><DigitalTwinWorkspace /></PrivateRoute>} />
                        <Route path="/metaverse/meeting" element={<PrivateRoute allowedRoles={['student']}><HoloMeeting /></PrivateRoute>} />
                        <Route path="/web3/wallet" element={<PrivateRoute allowedRoles={['student']}><Web3Wallet /></PrivateRoute>} />
                        <Route path="/impact/global" element={<PrivateRoute allowedRoles={['student']}><PlanetaryDashboard /></PrivateRoute>} />
                        <Route path="/settings/neuro" element={<PrivateRoute><NeuroSettings /></PrivateRoute>} />

                        {/* Wellbeing & Gamification Routes */}
                        <Route path="/wellbeing" element={
                            <PrivateRoute allowedRoles={['student']}>
                                <WellbeingDashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/parent-insight" element={
                            <PrivateRoute allowedRoles={['student', 'parent']}>
                                <ParentalInsight />
                            </PrivateRoute>
                        } />
                        <Route path="/leaderboard" element={
                            <PrivateRoute allowedRoles={['student']}>
                                <div className="p-6">
                                    <h1 className="text-2xl font-bold mb-6">Builders Leaderboard</h1>
                                    <Leaderboard />
                                </div>
                            </PrivateRoute>
                        } />

                        <Route path="/admin" element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <AdminPanel />
                            </PrivateRoute>
                        } />
                        <Route path="/admin/incubator" element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <IncubatorManager />
                            </PrivateRoute>
                        } />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Route>
                </Routes>
            </ToastProvider>
        </AuthProvider>
    );
};

export default App;
