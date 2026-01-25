import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const FeatureCard = ({ title, description, icon, className }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={cn(
                "bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-start gap-6 group",
                className
            )}
        >
            {icon && (
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {icon}
                </div>
            )}
            <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
};

export default FeatureCard;
