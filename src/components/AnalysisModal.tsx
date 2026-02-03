import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Shield } from 'lucide-react';

interface AnalysisModalProps {
  open: boolean;
  onComplete: () => void;
  organizationName: string;
}

const analysisSteps = [
  { message: 'Initializing attack surface model', duration: 800 },
  { message: 'Enumerating exposure surfaces', duration: 1000 },
  { message: 'Correlating risk factors', duration: 1200 },
  { message: 'Simulating attacker entry paths', duration: 1000 },
  { message: 'Finalizing visualization', duration: 800 },
];

interface Node {
  id: number;
  x: number;
  y: number;
  radius: number;
  opacity: number;
  color: string;
  pulsePhase: number;
}

interface Edge {
  from: number;
  to: number;
  opacity: number;
  progress: number;
}

export function AnalysisModal({ open, onComplete, organizationName }: AnalysisModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedMessages, setCompletedMessages] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);

  // Network graph animation
  useEffect(() => {
    if (!open || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Initialize nodes in a circular pattern around center
    const colors = ['#00FFFF', '#FF6B35', '#00FF88', '#FFD700', '#FF4444'];
    nodesRef.current = [
      { id: 0, x: centerX, y: centerY, radius: 12, opacity: 0, color: '#00FFFF', pulsePhase: 0 },
    ];

    // Add surrounding nodes
    const nodeCount = 8;
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
      const distance = 80 + Math.random() * 30;
      nodesRef.current.push({
        id: i + 1,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        radius: 6 + Math.random() * 4,
        opacity: 0,
        color: colors[i % colors.length],
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Create edges from center to outer nodes and some between outer nodes
    edgesRef.current = [];
    for (let i = 1; i <= nodeCount; i++) {
      edgesRef.current.push({ from: 0, to: i, opacity: 0, progress: 0 });
    }
    // Add some cross connections
    for (let i = 1; i < nodeCount; i++) {
      if (Math.random() > 0.5) {
        edgesRef.current.push({ from: i, to: i + 1, opacity: 0, progress: 0 });
      }
    }

    let startTime = Date.now();
    const totalDuration = 4800; // Match the analysis duration

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(elapsed / totalDuration, 1);

      ctx.clearRect(0, 0, width, height);

      // Update and draw edges
      edgesRef.current.forEach((edge, index) => {
        const edgeStartTime = (index / edgesRef.current.length) * 0.6;
        const edgeProgress = Math.max(0, Math.min(1, (progressRatio - edgeStartTime) / 0.3));
        
        edge.progress = edgeProgress;
        edge.opacity = edgeProgress;

        if (edge.progress > 0) {
          const fromNode = nodesRef.current[edge.from];
          const toNode = nodesRef.current[edge.to];
          
          const dx = toNode.x - fromNode.x;
          const dy = toNode.y - fromNode.y;
          const endX = fromNode.x + dx * edge.progress;
          const endY = fromNode.y + dy * edge.progress;

          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(endX, endY);
          
          const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, endX, endY);
          gradient.addColorStop(0, `rgba(0, 255, 255, ${edge.opacity * 0.6})`);
          gradient.addColorStop(1, `rgba(0, 255, 255, ${edge.opacity * 0.3})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Draw data packet traveling along edge
          if (edge.progress > 0.1 && edge.progress < 0.95) {
            const packetPos = (Date.now() / 500) % 1;
            const packetX = fromNode.x + dx * packetPos * edge.progress;
            const packetY = fromNode.y + dy * packetPos * edge.progress;
            
            ctx.beginPath();
            ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 255, ${edge.opacity})`;
            ctx.fill();
          }
        }
      });

      // Update and draw nodes
      nodesRef.current.forEach((node, index) => {
        const nodeStartTime = (index / nodesRef.current.length) * 0.5;
        node.opacity = Math.max(0, Math.min(1, (progressRatio - nodeStartTime) / 0.2));
        node.pulsePhase += 0.05;

        if (node.opacity > 0) {
          const pulseScale = 1 + Math.sin(node.pulsePhase) * 0.15;
          const currentRadius = node.radius * pulseScale;

          // Outer glow
          const glowGradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, currentRadius * 3
          );
          glowGradient.addColorStop(0, `${node.color}${Math.floor(node.opacity * 40).toString(16).padStart(2, '0')}`);
          glowGradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius * 3, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();

          // Node body
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = `${node.color}${Math.floor(node.opacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();

          // Inner highlight
          ctx.beginPath();
          ctx.arc(node.x - currentRadius * 0.3, node.y - currentRadius * 0.3, currentRadius * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity * 0.4})`;
          ctx.fill();
        }
      });

      // Draw scanning ring effect
      if (progressRatio < 1) {
        const ringProgress = (Date.now() / 2000) % 1;
        const ringRadius = ringProgress * 120;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 255, ${(1 - ringProgress) * 0.3})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      if (progressRatio < 1 || !isComplete) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [open, isComplete]);

  // Step progression
  useEffect(() => {
    if (!open) {
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
        }, 600);
        return;
      }

      setCurrentStep(stepIndex);
      const step = analysisSteps[stepIndex];
      
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
        setCompletedMessages(prev => [...prev, step.message]);
        stepIndex++;
        runStep();
      }, step.duration);
    };

    const startTimeout = setTimeout(runStep, 300);

    return () => {
      clearTimeout(startTimeout);
    };
  }, [open, onComplete]);

  return (
    <Dialog open={open}>
      <DialogContent 
        className="sm:max-w-lg bg-background/95 backdrop-blur-md border-cyber-cyan/30 shadow-[0_0_50px_rgba(0,255,255,0.15)]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center py-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30">
              <Shield className="w-6 h-6 text-cyber-cyan" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Analyzing Attack Surface</h2>
              <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{organizationName}</p>
            </div>
          </div>

          {/* Network Graph Canvas */}
          <div className="relative w-full aspect-square max-w-[280px] mb-4">
            <canvas 
              ref={canvasRef}
              width={280}
              height={280}
              className="w-full h-full"
            />
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyber-cyan font-mono">
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full px-2 mb-4">
            <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyan-400 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Terminal Output */}
          <div className="w-full bg-black/60 rounded-lg border border-border/50 p-3 max-h-[140px] overflow-hidden">
            <div className="font-mono text-xs space-y-1">
              {completedMessages.slice(-3).map((msg, index) => (
                <div key={index} className="flex items-center gap-2 text-cyber-green/80">
                  <span>✓</span>
                  <span>{msg}</span>
                </div>
              ))}
              
              {!isComplete && currentStep < analysisSteps.length && (
                <div className="flex items-center gap-2 text-cyber-cyan">
                  <span className="animate-pulse">▸</span>
                  <span>{analysisSteps[currentStep].message}</span>
                  <span className="animate-[pulse_0.5s_ease-in-out_infinite]">_</span>
                </div>
              )}

              {isComplete && (
                <div className="flex items-center gap-2 text-cyber-cyan pt-2 border-t border-border/30">
                  <span className="text-cyber-green">●</span>
                  <span>Rendering attack surface map...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
