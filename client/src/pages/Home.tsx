import React from 'react';
import { Link } from 'react-router-dom';
import { BuildingOfficeIcon, UserGroupIcon, AcademicCapIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
                    <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                        Innovator Bridge Foundry
                    </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    Where <span className="text-blue-600">Founders</span> Meet <span className="text-purple-600">Builders</span>
                </h1>

                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                    IBF is the unified platform for startup incubation, talent collaboration,
                    and student micro-internships. One ecosystem to build, fund, and scale.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/register"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
                    >
                        Start Building for Free
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>

                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                    >
                        Existing User? Sign In
                    </Link>
                </div>
            </div>

            {/* Three Modules Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                    One Platform, Three Ecosystems
                </h2>

                <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                    IBF connects startups with the right talent at every stage, from
                    ideation to scaling.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Incubator Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-xl mb-6">
                            <BuildingOfficeIcon className="h-7 w-7 text-blue-600" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            IBF Incubator
                        </h3>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Apply to our accelerator program. Get funding, mentorship,
                            and access to exclusive talent. Join the next batch of startups.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center text-gray-700">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <span>Equity-free grants available</span>
                            </div>

                            <div className="flex items-center text-gray-700">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <span>1:1 mentorship sessions</span>
                            </div>

                            <div className="flex items-center text-gray-700">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <span>Priority talent access</span>
                            </div>
                        </div>

                        <Link
                            to="/incubator"
                            className="inline-flex items-center mt-8 text-blue-600 font-semibold hover:text-blue-800 group"
                        >
                            View Startup Directory
                            <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Collab Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-xl mb-6">
                            <UserGroupIcon className="h-7 w-7 text-purple-600" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            IBF Collab
                        </h3>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Build your MVP with vetted talent. Focus on results, not hiring.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center text-gray-700">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                <span>100+ vetted professionals</span>
                            </div>

                            <div className="flex items-center text-gray-700">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                <span>Fixed-price or hourly projects</span>
                            </div>

                            <div className="flex items-center text-gray-700">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                <span>Seamless project management</span>
                            </div>
                        </div>

                        <Link
                            to="/collab"
                            className="inline-flex items-center mt-8 text-purple-600 font-semibold hover:text-purple-800 group"
                        >
                            Browse Projects
                            <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* SkillSwap Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-xl mb-6">
                            <AcademicCapIcon className="h-7 w-7 text-green-600" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            IBF SkillSwap
                        </h3>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Safe micro-internships for students (16-18). Gain real startup
                            experience with vetted projects and parental supervision.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center text-gray-700">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                <span>Age 16-18 only</span>
                            </div>

                            <div className="flex items-center text-gray-700">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                <span>Parental consent required</span>
                            </div>

                            <div className="flex items-center text-gray-700">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                <span>Educational credit available</span>
                            </div>
                        </div>

                        <Link
                            to="/skillswap"
                            className="inline-flex items-center mt-8 text-green-600 font-semibold hover:text-green-800 group"
                        >
                            Student Registration
                            <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">50+</div>
                            <div className="text-gray-400">Startups Funded</div>
                        </div>

                        <div>
                            <div className="text-4xl font-bold mb-2">1,200+</div>
                            <div className="text-gray-400">Projects Completed</div>
                        </div>

                        <div>
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-gray-400">Student Interns</div>
                        </div>

                        <div>
                            <div className="text-4xl font-bold mb-2">100%</div>
                            <div className="text-gray-400">Free Platform</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
