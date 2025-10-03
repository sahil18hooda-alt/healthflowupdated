'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { HealthProfile } from '@/lib/types';
import { Input } from '../ui/input';

type FormData = Omit<HealthProfile, 'id' | 'userId' | 'updatedAt'>;

const goals = [
  { id: 'lose-weight', label: 'Lose Weight' },
  { id: 'gain-muscle', label: 'Gain Muscle' },
  { id: 'improve-endurance', label: 'Improve Endurance' },
  { id: 'reduce-stress', label: 'Reduce Stress' },
  { id: 'eat-healthier', label: 'Eat Healthier' },
  { id: 'improve-sleep', label: 'Improve Sleep' },
];

const activityLevels = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { id: 'lightly-active', label: 'Lightly Active', description: 'Light exercise/sports 1-3 days/week' },
  { id: 'moderately-active', label: 'Moderately Active', description: 'Moderate exercise/sports 3-5 days/week' },
  { id: 'very-active', label: 'Very Active', description: 'Hard exercise/sports 6-7 days a week' },
];

const dietaryPreferences = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'none', label: 'None' },
];

const formSchema = z.object({
  age: z.coerce.number().min(1, 'Age is required.'),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  primaryGoal: z.enum(['lose-weight', 'gain-muscle', 'improve-endurance', 'reduce-stress', 'eat-healthier', 'improve-sleep']),
  activityLevel: z.enum(['sedentary', 'lightly-active', 'moderately-active', 'very-active']),
  dietaryPreferences: z.array(z.string()).refine(value => value.some(item => item), {
    message: 'You have to select at least one item.',
  }),
  sleepHours: z.coerce.number().min(1, 'Sleep hours are required.'),
  stressLevel: z.enum(['low', 'moderate', 'high']),
});

const stepFields = [
    ['age', 'gender'],
    ['primaryGoal'],
    ['activityLevel'],
    ['dietaryPreferences'],
    ['sleepHours', 'stressLevel']
];

export default function HealthProfileQuestionnaire({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietaryPreferences: [],
    },
  });

  const totalSteps = stepFields.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const nextStep = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="text-primary" /> Create Your Wellness Profile
        </CardTitle>
        <CardDescription>
          Answer a few questions to get personalized health tips.
        </CardDescription>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <h3 className="font-semibold text-lg">About You</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="age" render={({ field }) => (
                            <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" placeholder="e.g., 30" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="gender" render={({ field }) => (
                            <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl><SelectContent>
                                <SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem><SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent></Select><FormMessage /></FormItem>
                        )} />
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">What's your primary health goal?</h3>
                    <FormField control={form.control} name="primaryGoal" render={({ field }) => (
                        <FormItem><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                            {goals.map(goal => (
                                <FormItem key={goal.id} className="w-full">
                                    <FormControl><RadioGroupItem value={goal.id} className="sr-only" /><Label className={cn("flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-accent/50", field.value === goal.id && "bg-accent text-accent-foreground")}>{goal.label}</Label></FormControl>
                                </FormItem>
                            ))}
                        </RadioGroup></FormControl><FormMessage className="text-center pt-2" /></FormItem>
                    )} />
                  </div>
                )}
                 {currentStep === 2 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">How active are you?</h3>
                        <FormField control={form.control} name="activityLevel" render={({ field }) => (
                            <FormItem><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                                {activityLevels.map(level => (
                                    <FormItem key={level.id}><FormControl><RadioGroupItem value={level.id} className="sr-only" /><Label className={cn("flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-accent/50", field.value === level.id && "bg-accent text-accent-foreground")}>
                                        <span className="font-semibold">{level.label}</span>
                                        <span className="text-sm">{level.description}</span>
                                    </Label></FormControl></FormItem>
                                ))}
                            </RadioGroup></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                )}
                {currentStep === 3 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Any dietary preferences?</h3>
                        <FormField control={form.control} name="dietaryPreferences" render={() => (
                            <FormItem>{dietaryPreferences.map(item => (
                                <FormField key={item.id} control={form.control} name="dietaryPreferences" render={({ field }) => (
                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                        let updatedValue = [...field.value];
                                        if(item.id === 'none') {
                                            return field.onChange(checked ? ['none'] : []);
                                        }
                                        updatedValue = updatedValue.filter(v => v !== 'none');
                                        if (checked) {
                                            updatedValue.push(item.id);
                                        } else {
                                            updatedValue.splice(updatedValue.indexOf(item.id), 1);
                                        }
                                        return field.onChange(updatedValue);
                                    }} /></FormControl>
                                    <FormLabel className="font-normal">{item.label}</FormLabel>
                                </FormItem>
                                )} />
                            ))}<FormMessage /></FormItem>
                        )} />
                    </div>
                )}
                {currentStep === 4 && (
                    <div className="space-y-6">
                        <h3 className="font-semibold text-lg">Finally, a bit about your lifestyle.</h3>
                        <FormField control={form.control} name="sleepHours" render={({ field }) => (
                            <FormItem><FormLabel>On average, how many hours do you sleep per night?</FormLabel><FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="stressLevel" render={({ field }) => (
                            <FormItem><FormLabel>How would you rate your daily stress level?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                {['low', 'moderate', 'high'].map(level => (
                                    <FormItem key={level}><FormControl><RadioGroupItem value={level} className="sr-only" /><Label className={cn("flex items-center justify-center px-4 py-2 border rounded-lg cursor-pointer hover:bg-accent/50 capitalize", field.value === level && "bg-accent text-accent-foreground")}>{level}</Label></FormControl></FormItem>
                                ))}
                            </RadioGroup></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                )}

              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between pt-8">
              <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button type="button" onClick={nextStep}>
                {currentStep === totalSteps - 1 ? 'Finish' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
