import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Shield, Scan } from 'lucide-react';

interface AnalysisModalProps {
  open: boolean;
  onComplete: () => void;
  organizationName: string;
}

const analysisSteps = [
  { message: 'Initializing attack surface model...', duration: 800 },
  { message: 'Enumerating exposure surfaces...', duration: 1000 },
  { message: 'Correlating risk factors...', duration: 1200 },
  { message: 'Simulating attacker entry paths...', duration: 1000 },
  { message: 'Finalizing visualization...', duration: 800 },
];

export function AnalysisModal({ open, onComplete, organizationName }: AnalysisModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedMessages, setCompletedMessages] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      setCurrentStep(0);
      setProgress(0);
      setCompletedMessages([]);
      setIsComplete(false);
      return;
    }

    let stepIndex = 0;
    let progressValue = 0;
    const progressPerStep = 100 / analysisSteps.length;

    const runStep = () => {
      if (stepIndex >= analysisSteps.length) {
        setIsComplete(true);
        setTimeout(() => {
          onComplete();
        }, 500);
        return;
      }

      setCurrentStep(stepIndex);
      const step = analysisSteps[stepIndex];
      
      // Animate progress for this step
      const progressIncrement = progressPerStep / (step.duration / 50);
      const progressInterval = setInterval(() => {
        progressValue += progressIncrement;
        if (progressValue >= (stepIndex + 1) * progressPerStep) {
          progressValue = (stepIndex + 1) * progressPerStep;
          clearInterval(progressInterval);
        }
        setProgress(Math.min(progressValue, 100));
      }, 50);

      setTimeout(() => {
        clearInterval(progressInterval);
        setCompletedMessages(prev => [...prev, step.message.replace('...', '')]);
        stepIndex++;
        runStep();
      }, step.duration);
    };

    // Start after a brief delay
    const startTimeout = setTimeout(runStep, 300);

    return () => {
      clearTimeout(startTimeout);
    };
  }, [open, onComplete]);

  return (
    <Dialog open={open}>
      <DialogContent 
        className="sm:max-w-xl bg-background/95 backdrop-blur-md border-cyber-cyan/30 shadow-[0_0_50px_rgba(0,255,255,0.1)]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="p-3 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30">
                <Shield className="w-8 h-8 text-cyber-cyan" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Scan className="w-4 h-4 text-cyber-cyan animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Attack Surface Analysis</h2>
              <p className="text-sm text-muted-foreground font-mono">{organizationName}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full mb-6">
            <Progress 
              value={progress} 
              className="h-2 bg-muted/50"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground font-mono">
              <span>{Math.round(progress)}%</span>
              <span>{isComplete ? 'COMPLETE' : 'ANALYZING'}</span>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="w-full bg-black/60 rounded-lg border border-border/50 p-4 min-h-[200px]">
            <div className="font-mono text-sm space-y-2">
              {/* Completed messages */}
              {completedMessages.map((msg, index) => (
                <div key={index} className="flex items-center gap-2 text-cyber-green">
                  <span className="text-cyber-green">✓</span>
                  <span>{msg}</span>
                </div>
              ))}
              
              {/* Current step */}
              {!isComplete && currentStep < analysisSteps.length && (
                <div className="flex items-center gap-2 text-cyber-cyan">
                  <span className="animate-pulse">▸</span>
                  <span>{analysisSteps[currentStep].message}</span>
                  <span className="inline-flex">
                    <span className="animate-[pulse_0.5s_ease-in-out_infinite]">_</span>
                  </span>
                </div>
              )}

              {/* Completion message */}
              {isComplete && (
                <div className="flex items-center gap-2 text-cyber-cyan mt-4 pt-4 border-t border-border/30">
                  <span className="text-cyber-green">●</span>
                  <span>Analysis complete. Rendering attack surface map...</span>
                </div>
              )}
            </div>
          </div>

          {/* Subtle scanning animation */}
          <div className="w-full mt-4 flex justify-center">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-cyber-cyan/60 rounded-full"
                  style={{
                    height: '16px',
                    animation: `pulse 0.8s ease-in-out ${i * 0.1}s infinite`,
                    opacity: isComplete ? 0 : 1,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
