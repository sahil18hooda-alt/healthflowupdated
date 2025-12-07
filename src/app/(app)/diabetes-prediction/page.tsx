'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Activity, AlertCircle, CheckCircle2, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
    glucose: z.coerce.number().min(0, 'Glucose level must be positive').max(500, 'Invalid glucose level'),
    insulin: z.coerce.number().min(0, 'Insulin level must be positive').max(1000, 'Invalid insulin level'),
    bmi: z.coerce.number().min(0, 'BMI must be positive').max(100, 'Invalid BMI'),
    age: z.coerce.number().min(0, 'Age must be positive').max(120, 'Invalid age'),
});

export default function DiabetesPredictionPage() {
    const [result, setResult] = useState<'positive' | 'negative' | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            glucose: 0,
            insulin: 0,
            bmi: 0,
            age: 0,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Model weights extracted from Python SVC model
        // Features: Glucose, Insulin, BMI, Age
        const scalerMin = [0.0, 0.0, 0.0, -0.35];
        const scalerScale = [0.005025125628140704, 0.001182033096926714, 0.01490312965722802, 0.016666666666666666];
        const svcCoef = [4.962139494913286, -0.07128376502090022, 3.020636254731132, 0.9459478246541713];
        const svcIntercept = -5.305266931754016;

        const features = [values.glucose, values.insulin, values.bmi, values.age];

        let decision = svcIntercept;
        for (let i = 0; i < 4; i++) {
            // Apply MinMaxScaler: X_scaled = X * scale_ + min_
            const scaled = features[i] * scalerScale[i] + scalerMin[i];
            // Apply SVC weights
            decision += scaled * svcCoef[i];
        }

        setResult(decision > 0 ? 'positive' : 'negative');
    }

    return (
        <div className="container max-w-2xl py-8 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Diabetes Prediction</h1>
                <p className="text-muted-foreground">
                    Enter your health metrics to get an AI-powered assessment of your diabetes risk.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Health Metrics
                    </CardTitle>
                    <CardDescription>
                        Please provide accurate measurements for the best results.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="glucose"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Glucose Level (mg/dL)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="e.g. 120" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Plasma glucose concentration.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="insulin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Insulin Level (mu U/ml)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="e.g. 80" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                2-Hour serum insulin.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bmi"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>BMI</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.1" placeholder="e.g. 25.5" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Body mass index (weight in kg/(height in m)^2).
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="age"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Age</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="e.g. 35" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Age in years.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full">Analyze Risk</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {result && (
                <Alert variant={result === 'positive' ? 'destructive' : 'default'} className={result === 'positive' ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}>
                    {result === 'positive' ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <AlertTitle className={result === 'positive' ? 'text-red-500' : 'text-green-500'}>
                        {result === 'positive' ? 'High Risk Detected' : 'Low Risk Detected'}
                    </AlertTitle>
                    <AlertDescription className={result === 'positive' ? 'text-red-500/90' : 'text-green-500/90'}>
                        {result === 'positive'
                            ? "The model predicts a high likelihood of diabetes based on the provided metrics. We strongly recommend consulting with a healthcare professional for a comprehensive evaluation."
                            : "The model predicts a low likelihood of diabetes. However, maintaining a healthy lifestyle is always important. Regular check-ups are recommended."}
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                    Disclaimer: This tool uses a machine learning model for educational and informational purposes only.
                    It is not a substitute for professional medical advice, diagnosis, or treatment.
                    Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
            </div>
        </div>
    );
}
