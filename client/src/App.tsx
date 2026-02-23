import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layout Components
import Layout from './components/layout/Layout';
import IncubatorLayout from './modules/incubator/layouts/IncubatorLayout';
import CollabLayout from './modules/collab/layouts/CollabLayout';
import SkillSwapLayout from './modules/skillswap/layouts/SkillSwapLayout';
import PrivateRoute from './components/auth/PrivateRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Incubator Module
import IncubatorStartups from './modules/incubator/pages/Startups';
import IncubatorApply from './modules/incubator/pages/Apply';
import IncubatorDashboard from './modules/incubator/pages/Dashboard';
import IncubatorStartupDetail from './modules/incubator/pages/StartupDetail';
import IncubatorLanding from './modules/incubator/pages/Landing';

// Incubator Features
import MultiverseHQ from './modules/incubator/pages/MultiverseHQ';
import StartupMultiverse from './modules/incubator/pages/StartupMultiverse';
import FounderCopilot from './modules/incubator/pages/FounderCopilot';
import HoloPitchRoom from './modules/incubator/pages/HoloPitchRoom';
import StartupGenome from './modules/incubator/pages/Genome/StartupGenome';
import PitchAnalysisResults from './modules/incubator/pages/PitchAnalysisResults';

// Collab Module
import CollabMarketplace from './modules/collab/pages/Marketplace';
import CollabPostProject from './modules/collab/pages/PostProject';
import CollabProjectDetail from './modules/collab/pages/ProjectDetail';
import CollabLanding from './modules/collab/pages/Marketplace';

// Collab Features
import NeuralTalentMatch from './modules/collab/pages/NeuralTalentMatch';
import ProjectWarRoom from './modules/collab/pages/ProjectWarRoom';
import ProjectWarRoom3D from './modules/collab/pages/ProjectWarRoom3D';
import WorkDNA from './modules/collab/pages/WorkDNA';
import SkillEvolution from './modules/collab/pages/SkillEvolution';

// SkillSwap Module
// import SkillSwapLanding from './modules/skillswap/pages/Landing';
import SkillSwapProjects from './modules/skillswap/pages/Projects';
import SkillSwapConsent from './modules/skillswap/pages/Consent';

// SkillSwap Public Flow
import AgeGate from './modules/skillswap/pages/AgeGate';
import StudentRegistration from './modules/skillswap/pages/register/StudentRegistration';
import AssessmentWizard from './modules/skillswap/pages/AssessmentWizard';
// import LearningRoadmap from './modules/skillswap/pages/dashboard/LearningRoadmap';
import StudentDashboard from './modules/skillswap/pages/dashboard/StudentDashboard';
import LessonPlayer from './modules/skillswap/pages/learning/LessonPlayer';

// Gamification & Tools
import Leaderboard from './modules/skillswap/pages/gamification/Leaderboard';
import WellbeingDashboard from './pages/Wellbeing/WellbeingDashboard';
import ParentalInsight from './pages/Parent/ParentalInsight';


// Ultimate Features
import EcosystemBrain from './pages/Ecosystem/Brain/EcosystemBrain';
// import SymbiosisEngine from './pages/Ecosystem/SymbiosisEngine'; // Old path
import SymbiosisEngine from './modules/symbiosis/pages/SymbiosisEngine'; // New path
import DigitalTwinWorkspace from './pages/Metaverse/DigitalTwinWorkspace';
import HoloMeeting from './pages/Metaverse/HoloMeeting';
import SkillWallet from './pages/Web3/SkillWallet';
import PlanetaryDashboard from './pages/Impact/PlanetaryDashboard';
import NeuroSettings from './pages/Settings/NeuroSettings';
import AICopilot from './components/ai/AICopilot';

// Admin & Settings
import AdminPanel from './pages/AdminPanel';
import PrivacySettings from './pages/Settings/PrivacySettings';
import PortfolioBuilder from './pages/Career/PortfolioBuilder';
import ProjectShowcase from './pages/Social/ProjectShowcase';
import UserDashboard from './pages/dashboard/Dashboard';

// New Dashboard Components
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ContentModeration from './pages/admin/ContentModeration';
import ParentDashboard from './pages/Parent/ParentDashboard';
import ProjectBoard from './modules/collab/pages/ProjectBoard';

// Micro-Internships
import MyLearning from './pages/dashboard/MyLearning';
import InternshipMarketplace from './pages/MicroInternships/InternshipMarketplace';
import PostMicroInternship from './pages/MicroInternships/PostMicroInternship';
import ManageApplicants from './pages/MicroInternships/ManageApplicants';
import InternshipWorkflow from './pages/MicroInternships/InternshipWorkflow';

// SkillSwap New Features
import SkillWalletPage from './modules/skillswap/pages/SkillWallet';
import MetaverseHQ from './modules/skillswap/pages/MetaverseHQ';
import ParentDashboardNew from './modules/skillswap/pages/parent/ParentDashboard';
import CompanyDashboard from './modules/skillswap/pages/CompanyDashboard';

// Phase 5-6 Features
import GlobalImpactDashboard from './modules/skillswap/pages/GlobalImpactDashboard';
import NeuroSettingsPage from './modules/skillswap/pages/NeuroSettings';
import LiveChat from './modules/skillswap/pages/LiveChat';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AICopilot />
            <ToastProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Public Landing Pages */}
                    <Route path="/incubator-landing" element={<IncubatorLanding />} />
                    <Route path="/collab-landing" element={<CollabLanding />} />

                    {/* SkillSwap Public Flow */}
                    <Route path="/skillswap-public" element={<AgeGate />} />
                    <Route path="/skillswap/register" element={<StudentRegistration />} />

                    {/* INCUBATOR MODULE */}
                    <Route path="/incubator" element={
                        <PrivateRoute allowedRoles={['founder', 'admin']}>
                            <IncubatorLayout />
                        </PrivateRoute>
                    }>
                        <Route index element={<IncubatorDashboard />} />
                        <Route path="dashboard" element={<IncubatorDashboard />} />
                        <Route path="startups" element={<IncubatorStartups />} />
                        <Route path="startups/:id" element={<IncubatorStartupDetail />} />
                        <Route path="apply" element={<IncubatorApply />} />
                        <Route path="multiverse" element={<MultiverseHQ />} />
                        <Route path="simulation" element={<StartupMultiverse />} />
                        <Route path="founder-copilot" element={<FounderCopilot />} />
                        <Route path="pitch-room" element={<HoloPitchRoom />} />
                        <Route path="genome" element={<StartupGenome />} />
                        <Route path="pitch-analysis" element={<PitchAnalysisResults />} />
                    </Route>

                    {/* COLLAB MODULE */}
                    <Route path="/collab" element={
                        <PrivateRoute allowedRoles={['founder', 'talent', 'admin']}>
                            <CollabLayout />
                        </PrivateRoute>
                    }>
                        <Route index element={<CollabMarketplace />} />
                        <Route path="market" element={<CollabMarketplace />} />
                        <Route path="post" element={<CollabPostProject />} />
                        <Route path="project/:id" element={<CollabProjectDetail />} />
                        <Route path="neural-match" element={<NeuralTalentMatch />} />
                        <Route path="war-room" element={<ProjectWarRoom3D />} />
                        <Route path="war-room-legacy" element={<ProjectWarRoom />} />
                        <Route path="assessment" element={<WorkDNA />} />
                        <Route path="skill-evolution" element={<SkillEvolution />} />
                        <Route path="board/:id" element={<ProjectBoard />} />
                    </Route>

                    {/* SKILLSWAP MODULE */}
                    <Route path="/skillswap" element={
                        <PrivateRoute allowedRoles={['student', 'teen', 'company', 'founder', 'admin']}>
                            <SkillSwapLayout />
                        </PrivateRoute>
                    }>
                        <Route index element={<StudentDashboard />} />
                        <Route path="dashboard" element={<StudentDashboard />} />
                        <Route path="company-portal" element={<CompanyDashboard />} />
                        <Route path="projects" element={<SkillSwapProjects />} />
                        <Route path="consent" element={<SkillSwapConsent />} />
                        <Route path="assessment" element={<AssessmentWizard />} />
                        <Route path="leaderboard" element={<Leaderboard />} />
                        <Route path="wellbeing" element={<WellbeingDashboard />} />
                        <Route path="parent-insight" element={<ParentalInsight />} />
                        <Route path="ecosystem/brain" element={<EcosystemBrain />} />
                        <Route path="ecosystem/symbiosis" element={<SymbiosisEngine />} />
                        <Route path="metaverse/workspace" element={<DigitalTwinWorkspace />} />
                        <Route path="metaverse/meeting" element={<HoloMeeting />} />
                        <Route path="lms" element={<StudentDashboard />} />
                        <Route path="learning/:moduleId/:lessonId" element={<LessonPlayer />} />
                        <Route path="web3/wallet" element={<SkillWallet />} />
                        <Route path="impact/global" element={<PlanetaryDashboard />} />
                        <Route path="skill-wallet" element={<SkillWalletPage />} />
                        <Route path="metaverse" element={<MetaverseHQ />} />
                        <Route path="metaverse/room/:roomId" element={<MetaverseHQ />} />
                        <Route path="parent-portal" element={<ParentDashboardNew />} />
                        <Route path="global-impact" element={<GlobalImpactDashboard />} />
                        <Route path="settings" element={<NeuroSettingsPage />} />
                        <Route path="chat" element={<LiveChat />} />
                    </Route>

                    {/* GENERAL DASHBOARD / ADMIN */}
                    <Route path="/" element={<Layout />}>
                        <Route path="dashboard" element={
                            <PrivateRoute>
                                <UserDashboard />
                            </PrivateRoute>
                        } />
                        <Route path="admin" element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </PrivateRoute>
                        } />
                        <Route path="admin/users" element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <UserManagement />
                            </PrivateRoute>
                        } />
                        <Route path="admin/moderation" element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <ContentModeration />
                            </PrivateRoute>
                        } />
                        <Route path="admin/panel" element={
                            <PrivateRoute allowedRoles={['admin']}>
                                <AdminPanel />
                            </PrivateRoute>
                        } />
                        <Route path="parent" element={
                            <PrivateRoute>
                                <ParentDashboard />
                            </PrivateRoute>
                        } />
                        <Route path="settings/neuro" element={<PrivateRoute><NeuroSettings /></PrivateRoute>} />
                        <Route path="settings/privacy" element={<PrivateRoute><PrivacySettings /></PrivateRoute>} />
                        <Route path="career/portfolio" element={<PrivateRoute><PortfolioBuilder /></PrivateRoute>} />
                        <Route path="social/showcase" element={<PrivateRoute><ProjectShowcase /></PrivateRoute>} />
                        <Route path="learning" element={<PrivateRoute><MyLearning /></PrivateRoute>} />
                        <Route path="internships" element={<PrivateRoute><InternshipMarketplace /></PrivateRoute>} />
                        <Route path="post-internship" element={<PrivateRoute><PostMicroInternship /></PrivateRoute>} />
                        <Route path="internships/manage" element={<PrivateRoute><ManageApplicants /></PrivateRoute>} />
                        <Route path="internships/workflow" element={<PrivateRoute><InternshipWorkflow /></PrivateRoute>} />
                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </ToastProvider>
        </AuthProvider>
    );
};

export default App;
