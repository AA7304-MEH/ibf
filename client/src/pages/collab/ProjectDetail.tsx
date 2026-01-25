import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetail: React.FC = () => {
    const { id } = useParams();
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Project Detail: {id}</h1>
        </div>
    );
};
export default ProjectDetail;
