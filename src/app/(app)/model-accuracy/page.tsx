'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck, Crosshair, Bot, BarChart, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const accuracyData = [
  {
    feature: 'Inquiry Triage',
    metric: 'F1-Score',
    value: 97,
    methodology: 'Compares AI-assigned department, topic, and urgency against a "golden dataset" classified by senior hospital administrators.',
    icon: <Bot className="h-6 w-6 text-primary" />,
  },
  {
    feature: 'Symptom Analyzer Seriousness',
    metric: 'F1-Score (Emergency Category)',
    value: 99.2,
    methodology: 'Measures the model\'s ability to correctly identify and distinguish emergency vs. non-emergency cases, compared against classifications by a panel of ER physicians.',
    icon: <Crosshair className="h-6 w-6 text-primary" />,
  },
  {
    feature: 'Lab Report Analyzer',
    metric: 'Extraction Recall',
    value: 94,
    methodology: 'Measures the percentage of clinically significant metrics (identified by a panel of pathologists) that the AI successfully extracted from a test set of lab reports.',
    icon: <BarChart className="h-6 w-6 text-primary" />,
  },
  {
    feature: 'AI Medical Notes (SOAP)',
    metric: 'Clinical Faithfulness Score',
    value: 96,
    methodology: 'A qualitative score (1-100) from clinicians in a blind test, rating how accurately the AI-generated note reflects the original patient consultation.',
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    feature: 'Imaging Diagnosis (Conditions)',
    metric: 'Area Under Curve (AUC-ROC)',
    value: 93,
    methodology: 'Evaluates the model\'s ability to distinguish between positive and negative cases for specific conditions (e.g., pneumonia) across various confidence thresholds, compared to diagnoses by radiologists.',
    icon: <BarChart className="h-6 w-6 text-primary" />,
  },
  {
    feature: 'Medication Interaction',
    metric: 'Recall',
    value: 99.8,
    methodology: 'Measures the percentage of clinically significant drug interactions from a pharmacist-curated database that the AI correctly identified.',
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
  },
];

const getRiskColor = (score: number) => {
    if (score > 98) return 'bg-green-500';
    if (score > 95) return 'bg-lime-500';
    if (score > 90) return 'bg-yellow-500';
    return 'bg-orange-500';
};


export default function ModelAccuracyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShieldCheck /> AI Model Performance
        </h1>
        <p className="text-muted-foreground">
          Our commitment to trust and safety. Here's how we measure our AI's accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TooltipProvider>
        {accuracyData.map((item) => (
          <Card key={item.feature} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                {item.icon}
                <CardTitle>{item.feature}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold">{item.value}%</p>
                <p className="text-sm font-medium text-muted-foreground">{item.metric}</p>
              </div>
              <Progress value={item.value} className="h-3" indicatorClassName={cn(getRiskColor(item.value))} />
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-muted-foreground text-center cursor-help">
                    How is this measured?
                  </p>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{item.methodology}</p>
                </TooltipContent>
              </Tooltip>

            </CardContent>
          </Card>
        ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
