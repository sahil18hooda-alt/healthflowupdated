'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dumbbell, Target, Zap, Utensils, Bed, Smile, Bot, Loader2, Lightbulb, Activity, BrainCircuit, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { HealthProfile, FitnessCoachOutput } from '@/lib/types';
import { getFitnessPlan } from '@/ai/flows/ai-fitness-coach-flow';

const healthProfileSchema = z.object({
  primaryGoal: z.enum(['lose-weight', 'gain-muscle', 'improve-endurance', 'reduce-stress', 'eat-healthier', 'improve-sleep'], {
    required_error: "Please select a primary goal.",
  }),
  activityLevel: z.enum(['sedentary', 'lightly-active', 'moderately-active', 'very-active'], {
    required_error: "Please select your activity level.",
  }),
  dietaryPreferences: z.array(z.string()).optional(),
  sleepHours: z.number().min(0).max(24),
  stressLevel: z.enum(['low', 'moderate', 'high'], {
    required_error: "Please select your stress level.",
  }),
});

const goals = [
    { value: 'lose-weight', label: 'Lose Weight', icon: <Target className="h-4 w-4 mr-2" /> },
    { value: 'gain-muscle', label: 'Gain Muscle', icon: <Dumbbell className="h-4 w-4 mr-2" /> },
    { value: 'improve-endurance', label: 'Improve Endurance', icon: <Zap className="h-4 w-4 mr-2" /> },
    { value: 'reduce-stress', label: 'Reduce Stress', icon: <Smile className="h-4 w-4 mr-2" /> },
    { value: 'eat-healthier', label: 'Eat Healthier', icon: <Utensils className="h-4 w-4 mr-2" /> },
    { value: 'improve-sleep', label: 'Improve Sleep', icon: <Bed className="h-4 w-4 mr-2" /> },
];

const dietOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'none', label: 'None' },
];

const categoryIcons = {
    Fitness: <Dumbbell className="h-5 w-5 text-primary" />,
    Nutrition: <Utensils className="h-5 w-5 text-green-500" />,
    Wellness: <BrainCircuit className="h-5 w-5 text-yellow-500" />,
    Sleep: <Bed className="h-5 w-5 text-purple-500" />,
}

export default function FitnessCoachPage() {
  const [recommendations, setRecommendations] = useState<FitnessCoachOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof healthProfileSchema>>({
    resolver: zodResolver(healthProfileSchema),
    defaultValues: {
      primaryGoal: 'lose-weight',
      activityLevel: 'moderately-active',
      dietaryPreferences: [],
      sleepHours: 7,
      stressLevel: 'moderate',
    },
  });

  const handleGetRecommendations = async (values: z.infer<typeof healthProfileSchema>) => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const profile: HealthProfile = { ...values, dietaryPreferences: values.dietaryPreferences || [] };
      const result = await getFitnessPlan(profile);
      setRecommendations(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating your plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Dumbbell /> AI Fitness Coach
        </h1>
        <p className="text-muted-foreground">
          Your personalized guide to a healthier lifestyle.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Health Profile</CardTitle>
          <CardDescription>Tell us about your goals and lifestyle for personalized recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGetRecommendations)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="primaryGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Goal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select your main goal" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {goals.map(goal => <SelectItem key={goal.value} value={goal.value}>{goal.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select your activity level" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                            <SelectItem value="lightly-active">Lightly Active (1-3 days/week)</SelectItem>
                            <SelectItem value="moderately-active">Moderately Active (3-5 days/week)</SelectItem>
                            <SelectItem value="very-active">Very Active (6-7 days/week)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="stressLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Typical Stress Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select your stress level" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                    control={form.control}
                    name="sleepHours"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>Average Nightly Sleep</FormLabel>
                                <span className="text-sm font-medium">{field.value} hours</span>
                            </div>
                            <FormControl>
                                <Slider
                                    min={0} max={12} step={0.5}
                                    defaultValue={[field.value]}
                                    onValueChange={(vals) => field.onChange(vals[0])}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

              <FormField
                control={form.control}
                name="dietaryPreferences"
                render={() => (
                  <FormItem>
                    <FormLabel>Dietary Preferences</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {dietOptions.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="dietaryPreferences"
                          render={({ field }) => {
                            return (
                              <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(field.value?.filter((value) => value !== item.id));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating Plan...' : 'Generate My AI Plan'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recommendations && (
        <Card>
          <CardHeader>
            <CardTitle>Your AI-Powered Weekly Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
                <Heart className="h-4 w-4" />
                <AlertTitle>{recommendations.weeklySummary.theme}</AlertTitle>
                <AlertDescription className="italic">
                    "{recommendations.weeklySummary.motivationalQuote}"
                </AlertDescription>
            </Alert>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Actionable Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.actionableTips.map((item, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                      {categoryIcons[item.category]}
                      <CardTitle className="text-base">{item.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{item.tip}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
