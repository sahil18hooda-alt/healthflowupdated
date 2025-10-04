'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Bot, Loader2, UploadCloud, TestTube, AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { analyzeLabReport } from '@/ai/flows/ai-lab-report-analyzer';
import type { LabReportAnalysisOutput } from '@/lib/types';

export default function LabReportAnalyzerPage() {
  const [reportImage, setReportImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<LabReportAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

   const getInterpretationVariant = (interpretation: string): "default" | "destructive" | "secondary" => {
    const lowerCaseInterpretation = interpretation.toLowerCase();
    if (lowerCaseInterpretation.includes('high') || lowerCaseInterpretation.includes('low')) {
        return "destructive";
    }
    if (lowerCaseInterpretation.includes('normal')) {
        return "default";
    }
    return "secondary";
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TestTube /> AI Lab Report Analyzer
        </h1>
        <p className="text-muted-foreground">
          Upload a photo of your lab report for an easy-to-understand analysis.
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
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>Here is a summary and breakdown of your lab report.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
                <h3 className="font-semibold text-lg mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground">{analysis.summary}</p>
            </div>

            <div>
                <h3 className="font-semibold text-lg mb-2">Key Metrics</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Normal Range</TableHead>
                        <TableHead>Interpretation</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {analysis.keyMetrics.map((metric, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{metric.metric}</TableCell>
                            <TableCell>{metric.value}</TableCell>
                            <TableCell>{metric.normalRange}</TableCell>
                            <TableCell>
                                <Badge variant={getInterpretationVariant(metric.interpretation)}>
                                    {metric.interpretation}
                                </Badge>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>{analysis.disclaimer}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
