'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import Link from 'next/link';
import { Bot, Loader2, UploadCloud, TestTube, AlertTriangle, Trash2, Download, MessageSquare, Plus, Minus, Info, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { analyzeLabReport } from '@/ai/flows/ai-lab-report-analyzer';
import type { LabReportAnalysisOutput, LabReportMetric } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MetricDetail = ({ title, content, icon }: { title: string, content: string | undefined, icon: React.ReactNode }) => {
    if (!content) return null;
    return (
        <div className="mt-4">
            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                {icon} {title}
            </h4>
            <div className="prose prose-sm max-w-none text-muted-foreground pl-6">
                <ul className="list-disc">
                    {content.split(/[-•\n]/).map((item, index) => item.trim() && <li key={index}>{item.trim()}</li>)}
                </ul>
            </div>
        </div>
    )
}

const ResultCard = ({ metric }: { metric: LabReportMetric }) => {
  const getInterpretationStyles = (interpretation: string): { card: string, icon: React.ReactNode, text: string } => {
    const lower = interpretation.toLowerCase();
    if (lower.includes('high') || lower.includes('low')) {
        return { card: 'border-red-500/50 bg-red-500/5', icon: <AlertTriangle className="h-5 w-5 text-red-500" />, text: 'text-red-600' };
    }
    if (lower.includes('borderline')) {
        return { card: 'border-yellow-500/50 bg-yellow-500/5', icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />, text: 'text-yellow-600' };
    }
    return { card: 'border-green-500/50 bg-green-500/5', icon: <ClipboardList className="h-5 w-5 text-green-500" />, text: 'text-green-600' };
  };

  const styles = getInterpretationStyles(metric.interpretation);
  const isNormal = metric.interpretation === 'Normal';

  return (
    <AccordionItem value={metric.metric} className={cn("rounded-lg border-2 mb-3", styles.card)}>
      <AccordionTrigger className="p-4 text-left hover:no-underline">
        <div className="flex items-center justify-between w-full">
            <div className='flex items-center gap-4'>
                {styles.icon}
                <div className="flex-col">
                    <p className="font-bold text-base">{metric.metric}</p>
                    <p className="text-sm text-muted-foreground">Normal Range: {metric.normalRange}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={cn('text-lg font-bold', styles.text)}>{metric.value}</p>
                <p className={cn('text-sm font-semibold', styles.text)}>{metric.interpretation}</p>
            </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-4 pt-0">
          <div className="border-t-2 pt-4">
              {isNormal ? (
                <p className="text-sm text-muted-foreground">{metric.explanation}</p>
              ) : (
                <>
                    <p className="text-sm text-muted-foreground mb-4">{metric.explanation}</p>
                    <MetricDetail title="Possible Reasons" content={metric.possibleCauses} icon={<Info className="h-4 w-4" />} />
                    <MetricDetail title="What You Can Do" content={metric.recommendedActions} icon={<ClipboardList className="h-4 w-4" />} />
                    {metric.recommendedDepartment && 
                        <div className="mt-4">
                            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">Recommended Department</h4>
                            <p className="pl-6 text-primary font-bold">{metric.recommendedDepartment}</p>
                        </div>
                    }
                </>
              )}
          </div>
      </AccordionContent>
    </AccordionItem>
  );
};


export default function LabReportAnalyzerPage() {
  const [reportImage, setReportImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<LabReportAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReportImage(e.target?.result as string);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!reportImage) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeLabReport({ reportImage });
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred while analyzing the report. Please ensure the image is clear and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    const reportElement = document.getElementById('ai-report');
    if (!reportElement) {
        toast({ title: "Error downloading report", variant: "destructive" });
        return;
    }
    toast({ title: "Generating PDF..." });
    html2canvas(reportElement, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        let width = pdfWidth;
        let height = width / ratio;
        if (height > pdfHeight) {
            height = pdfHeight;
            width = height * ratio;
        }
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        pdf.save(`Lab_Report_Analysis_${new Date().toISOString().split('T')[0]}.pdf`);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TestTube /> Intelligent Lab Report Interpreter
        </h1>
        <p className="text-muted-foreground">
          Upload a photo of your lab report for a detailed, AI-powered explanation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Your Lab Report</CardTitle>
          <CardDescription>Drag & drop or click to upload a JPG or PNG image of your report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!reportImage ? (
            <div
              {...getRootProps()}
              className={cn(
                'flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
              )}
            >
              <input {...getInputProps()} />
              <UploadCloud className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-center text-muted-foreground">
                {isDragActive ? 'Drop the file here ...' : "Drag 'n' drop an image here, or click to select a file"}
              </p>
            </div>
          ) : (
            <div className="relative w-full max-w-md mx-auto">
                <Image src={reportImage} alt="Lab report preview" width={400} height={500} className="rounded-md object-contain" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => setReportImage(null)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
          )}

          <Button onClick={handleAnalyze} disabled={isLoading || !reportImage}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Analyzing...' : 'Analyze Report'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysis && (
        <Card id="ai-report">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>Here is a summary and breakdown of your lab report.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <Alert>
                <Bot className="h-4 w-4" />
                <AlertTitle>Overall Health Summary</AlertTitle>
                <AlertDescription>{analysis.overallSummary}</AlertDescription>
            </Alert>
            
            <div>
                <h3 className="font-semibold text-lg mb-4">Detailed Breakdown</h3>
                <Accordion type="multiple" className="w-full">
                    {analysis.keyMetrics.map((metric) => (
                        <ResultCard key={metric.metric} metric={metric} />
                    ))}
                </Accordion>
            </div>
            
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>{analysis.disclaimer}</AlertDescription>
            </Alert>
          </CardContent>
           <CardFooter className="gap-4">
                <Button onClick={handleDownloadReport}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report (PDF)
                </Button>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
