'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Bot, Loader2, UploadCloud, ScanSearch, AlertTriangle, Trash2, Download, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { diagnoseImage } from '@/ai/flows/ai-imaging-diagnosis-flow';
import type { ImagingDiagnosisOutput } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ImagingDiagnosisContent() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ImagingDiagnosisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasConsented, setHasConsented] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const createLink = (href: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `${href}?${params.toString()}`;
  }


  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/dicom': [] },
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!image) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await diagnoseImage({ image });
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. The image might be unsupported or of poor quality. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
   const handleDownloadReport = () => {
        const reportElement = document.getElementById('ai-report-card');
        if (!reportElement || !analysis) {
            toast({
                title: "Error",
                description: "Cannot download report right now. Please try again.",
                variant: "destructive"
            });
            return;
        }

        toast({
            title: "Generating PDF...",
            description: "Your report is being prepared for download.",
        });

        html2canvas(reportElement, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'px', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const width = pdfWidth;
            const height = width / ratio;

            let position = 0;
            if (height < pdfHeight) {
                position = (pdfHeight - height) / 2;
            }
            
            pdf.addImage(imgData, 'PNG', 0, position, width, height);
            pdf.save(`HealthFlow_Imaging_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        });
    };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ScanSearch /> AI Imaging &amp; Diagnosis
        </h1>
        <p className="text-muted-foreground">
          Upload a medical image for a preliminary, AI-powered diagnostic analysis.
        </p>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>For Informational Use Only</AlertTitle>
        <AlertDescription>
          This AI analysis is not a medical diagnosis. Always consult a qualified healthcare professional for any health concerns and to interpret your medical images.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Upload Medical Image</CardTitle>
          <CardDescription>Upload an X-ray, CT scan, or MRI image (JPG, PNG). DICOM support is experimental.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!image ? (
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
                {isDragActive ? 'Drop the image here...' : "Drag 'n' drop an image, or click to select"}
              </p>
            </div>
          ) : (
            <div className="relative w-full max-w-md mx-auto bg-black rounded-md p-2">
                <Image src={image} alt="Medical image preview" width={512} height={512} className="rounded-md object-contain aspect-square mx-auto" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={() => setImage(null)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox id="consent" checked={hasConsented} onCheckedChange={(checked) => setHasConsented(!!checked)} />
            <Label htmlFor="consent" className="text-sm text-muted-foreground">
              I consent to have this image analyzed by the AI for informational purposes.
            </Label>
          </div>

          <Button onClick={handleAnalyze} disabled={isLoading || !image || !hasConsented}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Analyzing...' : 'Run AI Analysis'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(isLoading || analysis) && (
        <Card id="ai-report-card">
          <CardHeader>
            <CardTitle>AI Diagnostic Report</CardTitle>
            <CardDescription>This is a preliminary analysis. Please review with your doctor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && !analysis ? (
                <div className="space-y-6">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="space-y-4 pt-4">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            ) : analysis && (
                <>
                    <Alert variant="default">
                        <AlertTitle className="text-lg">Recommended Department for Follow-up</AlertTitle>
                        <AlertDescription className="text-base font-semibold text-primary">
                            {analysis.recommendedDepartment}
                        </AlertDescription>
                    </Alert>

                    <div>
                        <h3 className="font-semibold text-lg mb-2">Overall Summary</h3>
                        <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Potential Conditions</h3>
                        {analysis.potentialConditions.length > 0 ? analysis.potentialConditions.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="font-medium">{item.condition}</p>
                                    <span className="font-bold text-primary">{item.confidence}% Confidence</span>
                                </div>
                                <Progress value={item.confidence} className="h-2" />
                            </div>
                        )) : <p className="text-sm text-muted-foreground">No specific conditions identified with high confidence.</p>}
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Key Observations</h3>
                        <div className="prose prose-sm max-w-none text-muted-foreground rounded-md border p-4 bg-muted/50">
                            <ul className="list-disc pl-5">
                            {analysis.observations.split('\n').map((obs, i) => obs.trim().length > 1 && <li key={i}>{obs.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>AI Confidence Visualization (Simulated)</CardTitle>
                            <CardDescription>This is a generated heatmap showing which parts of the image the AI may have focused on.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center bg-black rounded-md aspect-video p-2">
                            {analysis.heatmapDataUri ? (
                                <Image src={analysis.heatmapDataUri} alt="AI Heatmap Visualization" width={512} height={512} className="rounded-md object-contain aspect-square mx-auto" />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <p>Generating visualization...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Disclaimer</AlertTitle>
                        <AlertDescription>{analysis.disclaimer}</AlertDescription>
                    </Alert>
                </>
            )}
          </CardContent>
           {analysis && (
            <CardFooter className="gap-4">
                    <Button onClick={handleDownloadReport} disabled={!analysis}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report (PDF)
                    </Button>
                    <Button asChild variant="outline" disabled={!analysis}>
                      <Link href={createLink("/ai-therapist")}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat with Doctor
                      </Link>
                    </Button>
                </CardFooter>
            )}
        </Card>
      )}
    </div>
  );
}

export default function ImagingDiagnosisPage() {
    return (
        // Suspense is needed because we are using useSearchParams
        <React.Suspense fallback={<div>Loading...</div>}>
            <ImagingDiagnosisContent />
        </React.Suspense>
    )
}
