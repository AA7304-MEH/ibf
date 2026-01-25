import React from 'react';
import Skeleton from './Skeleton';
import Card from './Card';

const ProjectCardSkeleton = () => {
    return (
        <Card className="flex flex-col gap-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-9 w-24 rounded-lg" />
            </div>
        </Card>
    );
};

export default ProjectCardSkeleton;
