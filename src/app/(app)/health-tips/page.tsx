'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Leaf, Dumbbell, Brain, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { getPersonalizedHealthTips, HealthTipsOutput } from '@/ai/flows/personalized-health-tips-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function TipCard({ icon, title, tips }: { icon: React.ReactNode, title: string, tips: string[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {icon} {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3 list-disc pl-5">
                    {tips.map((tip, index) => (
                        <li key={index} className="text-muted-foreground">{tip}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}

export default function HealthTipsPage() {
    const { user } = useAuth();
    const [tips, setTips] = useState<HealthTipsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            const fetchTips = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const result = await getPersonalizedHealthTips({ name: user.name });
                    setTips(result);
                } catch (err) {
                    console.error("Error fetching health tips:", err);
                    setError("We couldn't generate your personalized tips at the moment. Please try again later.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchTips();
        }
    }, [user]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Lightbulb /> Personalized Health Tips
                </h1>
                <p className="text-muted-foreground">
                    Your daily dose of wellness, tailored just for you, {user?.name}.
                </p>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {tips && (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                    <TipCard icon={<Leaf className="text-green-500" />} title="Nutrition Tips" tips={tips.nutritionTips} />
                    <TipCard icon={<Dumbbell className="text-blue-500" />} title="Exercise Tips" tips={tips.exerciseTips} />
                    <TipCard icon={<Brain className="text-purple-500" />} title="Stress Management" tips={tips.stressManagementTips} />
                </div>
            )}
        </div>
    );
}
