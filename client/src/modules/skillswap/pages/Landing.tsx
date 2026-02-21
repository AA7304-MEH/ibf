import React from 'react';
import { Link } from 'react-router-dom';

const SkillSwapLanding: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    SkillSwap
                </h1>
                <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                    Micro-internships for students. Gain experience, build your portfolio.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        to="/skillswap/projects"
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
                    >
                        Browse Projects
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SkillSwapLanding;
