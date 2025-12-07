'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface FlipCardProps {
    data: {
        name: string;
        specialization: string;
        image: string;
        bio: string;
        id: string;
        createLink: (href: string) => string;
    };
    className?: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({ data, className }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    function handleFlip() {
        if (!isAnimating) {
            setIsFlipped(!isFlipped);
            setIsAnimating(true);
        }
    }

    return (
        <div
            className={cn(
                'flip-card w-[300px] h-[400px] rounded-md cursor-pointer',
                className
            )}
            onClick={handleFlip}
            onMouseEnter={() => !isAnimating && setIsFlipped(true)}
            onMouseLeave={() => !isAnimating && setIsFlipped(false)}
        >
            <motion.div
                className="flip-card-inner w-full h-full relative"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, animationDirection: 'normal' }}
                onAnimationComplete={() => setIsAnimating(false)}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front Side */}
                <div
                    className="flip-card-front w-full h-full absolute top-0 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col items-center justify-center p-4 backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-4">
                        <img
                            src={data.image}
                            alt={data.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                        {data.name}
                    </h2>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1 text-center">
                        {data.specialization}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                        Hover to view details
                    </p>
                </div>

                {/* Back Side */}
                <div
                    className="flip-card-back w-full h-full absolute top-0 left-0 bg-blue-600 dark:bg-blue-700 rounded-lg shadow-lg overflow-hidden flex flex-col items-center justify-center p-6 text-white backface-hidden"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <h3 className="text-lg font-bold mb-2">{data.name}</h3>
                    <p className="text-sm text-center mb-6 line-clamp-4">
                        {data.bio}
                    </p>
                    <div className="flex flex-col gap-3 w-full">
                        <Link
                            href={data.createLink(`/appointments?tab=book&doctor=${encodeURIComponent(data.name)}`)}
                            passHref
                            className="w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="secondary"
                                className="w-full font-bold"
                            >
                                Book Appointment
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
