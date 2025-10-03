'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Leaf, Dumbbell, Brain, Loader2, AlertTriangle, Sun, CloudRain, Wind, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { getPersonalizedHealthTips, HealthTipsOutput } from '@/ai/flows/personalized-health-tips-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import HealthProfileQuestionnaire from '@/components/health-profile/questionnaire';
import { HealthProfile } from '@/lib/types';

function TipCard({ icon, title, tip }: { icon: React.ReactNode, title: string, tip: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    {icon} {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{tip}</p>
            </CardContent>
        </Card>
    );
}

// Mock function to get real-time data
const getRealTimeData = () => {
    const weathers = ['Sunny', 'Cloudy', 'Rainy'];
    const airQualities = ['Good', 'Moderate', 'Unhealthy'];
    return {
        weather: weathers[Math.floor(Math.random() * weathers.length)],
        airQuality: airQualities[Math.floor(Math.random() * airQualities.length)],
    }
}

export default function HealthTipsPage() {
    const { user, updateHealthProfile } = useAuth();
    const [tips, setTips] = useState<HealthTipsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const hasCompletedProfile = !!user?.healthProfile;

    useEffect(() => {
        if (user && hasCompletedProfile) {
            const fetchTips = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    // Simulate fetching real-time data
                    const realTimeData = getRealTimeData();
                    
                    const result = await getPersonalizedHealthTips({
                        userProfile: {
                            name: user.name,
                            primaryGoal: user.healthProfile!.primaryGoal,
                            activityLevel: user.healthProfile!.activityLevel,
                            sleepHours: user.healthProfile!.sleepHours,
                            stressLevel: user.healthProfile!.stressLevel,
                        },
                        realTimeData: realTimeData,
                    });
                    setTips(result);
                } catch (err) {
                    console.error("Error fetching health tips:", err);
                    setError("We couldn't generate your personalized tips at the moment. Please try again later.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchTips();
        } else {
            setIsLoading(false);
        }
    }, [user, hasCompletedProfile]);

    const handleProfileComplete = (data: Omit<HealthProfile, 'id' | 'userId' | 'updatedAt'>) => {
        if (!user) return;
        const newProfile: HealthProfile = {
            ...data,
            id: user.id,
            userId: user.id,
            updatedAt: new Date().toISOString(),
        };
        updateHealthProfile(newProfile);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-4 text-lg text-muted-foreground">Generating your daily wellness plan...</p>
            </div>
        );
    }
    
    if (!hasCompletedProfile) {
        return <HealthProfileQuestionnaire onSubmit={handleProfileComplete} />;
    }

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {tips && (
                <>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Lightbulb /> {tips.greeting}
                    </h1>
                    <p className="text-muted-foreground">
                        Here is your daily dose of wellness, tailored just for you.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <TipCard icon={<Leaf className="text-green-500" />} title="Nutrition" tip={tips.nutritionTip} />
                    <TipCard icon={<Dumbbell className="text-blue-500" />} title="Fitness" tip={tips.exerciseTip} />
                    <TipCard icon={<Brain className="text-purple-500" />} title="Wellbeing" tip={tips.wellbeingTip} />
                    <TipCard icon={<Sun className="text-yellow-500" />} title="Today's Outlook" tip={tips.contextualTip} />
                </div>
                </>
            )}
        </div>
    );
}
