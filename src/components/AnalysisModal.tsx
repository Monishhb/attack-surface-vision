import { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Shield } from 'lucide-react';

interface AnalysisModalProps {
  open: boolean;
  onComplete: () => void;
  organizationName: string;
}

const analysisStages = [
  { name: 'Initialization', message: 'Initializing attack surface model', weight: 0.12 },
  { name: 'Surface Enumeration', message: 'Enumerating exposure surfaces', weight: 0.25 },
  { name: 'Risk Correlation', message: 'Correlating risk factors', weight: 0.28 },
  { name: 'Attack Path Modeling', message: 'Simulating attacker entry paths', weight: 0.22 },
  { name: 'Finalization', message: 'Finalizing visualization', weight: 0.13 },
];

// Generate random duration with slight bias toward middle values
function randomDuration(min: number, max: number): number {
  // Use beta-like distribution for more natural feel
  const u1 = Math.random();
  const u2 = Math.random();
  const beta = (u1 + u2) / 2; // Tends toward middle
  return min + beta * (max - min);
}

// Add random jitter to a value
function jitter(value: number, variance: number): number {
  return value * (1 + (Math.random() - 0.5) * variance);
}

// Easing function for non-linear progress
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

interface Node {
  id: number;
  x: number;
  y: number;
  radius: number;
  opacity: number;
  color: string;
  pulsePhase: number;
  targetOpacity: number;
}

interface Edge {
  from: number;
  to: number;
  opacity: number;
  progress: number;
  targetProgress: number;
}

export function AnalysisModal({ open, onComplete, organizationName }: AnalysisModalProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [completedMessages, setCompletedMessages] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [subStatus, setSubStatus] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const progressRef = useRef(0);

  // Smooth progress display that never goes backward
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        const target = progressRef.current;
        if (prev >= target) return prev;
        // Smooth interpolation toward target
        const diff = target - prev;
        const step = Math.max(0.3, diff * 0.15);
        return Math.min(prev + step, target);
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

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

    const colors = ['#00FFFF', '#FF6B35', '#00FF88', '#FFD700', '#FF4444', '#8B5CF6', '#EC4899', '#14B8A6'];
    nodesRef.current = [
      { id: 0, x: centerX, y: centerY, radius: 14, opacity: 0, targetOpacity: 0, color: '#00FFFF', pulsePhase: 0 },
    ];

    const nodeCount = 8;
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
      const distance = 75 + Math.random() * 35;
      nodesRef.current.push({
        id: i + 1,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        radius: 5 + Math.random() * 5,
        opacity: 0,
        targetOpacity: 0,
        color: colors[i % colors.length],
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    edgesRef.current = [];
    for (let i = 1; i <= nodeCount; i++) {
      edgesRef.current.push({ from: 0, to: i, opacity: 0, progress: 0, targetProgress: 0 });
    }
    for (let i = 1; i < nodeCount; i++) {
      if (Math.random() > 0.4) {
        edgesRef.current.push({ from: i, to: ((i % nodeCount) + 1), opacity: 0, progress: 0, targetProgress: 0 });
      }
    }

    let lastTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const progressRatio = displayProgress / 100;

      // Update node and edge targets based on progress
      nodesRef.current.forEach((node, index) => {
        const threshold = index / nodesRef.current.length * 0.6;
        node.targetOpacity = progressRatio > threshold ? 1 : 0;
        node.opacity += (node.targetOpacity - node.opacity) * delta * 3;
        node.pulsePhase += delta * (2 + Math.random() * 0.5);
      });

      edgesRef.current.forEach((edge, index) => {
        const threshold = 0.1 + (index / edgesRef.current.length) * 0.5;
        edge.targetProgress = Math.max(0, Math.min(1, (progressRatio - threshold) / 0.25));
        edge.progress += (edge.targetProgress - edge.progress) * delta * 2.5;
        edge.opacity = edge.progress;
      });

      // Draw edges
      edgesRef.current.forEach((edge) => {
        if (edge.progress > 0.01) {
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
          gradient.addColorStop(0, `rgba(0, 255, 255, ${edge.opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(0, 255, 255, ${edge.opacity * 0.2})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Data packet
          if (edge.progress > 0.15 && edge.progress < 0.9) {
            const packetSpeed = 800 + Math.random() * 400;
            const packetPos = ((now / packetSpeed) + edge.from * 0.3) % 1;
            const packetX = fromNode.x + dx * packetPos * edge.progress;
            const packetY = fromNode.y + dy * packetPos * edge.progress;
            
            ctx.beginPath();
            ctx.arc(packetX, packetY, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 255, ${edge.opacity * 0.9})`;
            ctx.fill();
          }
        }
      });

      // Draw nodes
      nodesRef.current.forEach((node) => {
        if (node.opacity > 0.01) {
          const pulseScale = 1 + Math.sin(node.pulsePhase) * 0.12;
          const currentRadius = node.radius * pulseScale;

          // Glow
          const glowGradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, currentRadius * 3.5
          );
          glowGradient.addColorStop(0, `${node.color}${Math.floor(node.opacity * 50).toString(16).padStart(2, '0')}`);
          glowGradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();

          // Body
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = `${node.color}${Math.floor(node.opacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();

          // Highlight
          ctx.beginPath();
          ctx.arc(node.x - currentRadius * 0.25, node.y - currentRadius * 0.25, currentRadius * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity * 0.35})`;
          ctx.fill();
        }
      });

      // Scanning ring
      if (progressRatio < 0.95) {
        const ringSpeed = 2500 - progressRatio * 500;
        const ringProgress = (now / ringSpeed) % 1;
        const ringRadius = ringProgress * 130;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 255, ${(1 - ringProgress) * 0.25})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [open, displayProgress]);

  // Randomized step progression
  useEffect(() => {
    if (!open) {
      setCurrentStage(0);
      setProgress(0);
      setDisplayProgress(0);
      progressRef.current = 0;
      setCompletedMessages([]);
      setIsComplete(false);
      setSubStatus('');
      return;
    }

    // Random total duration between 2.5s and 8s
    const totalDuration = randomDuration(2500, 8000);
    
    // Calculate stage durations with randomization
    const stageDurations = analysisStages.map(stage => {
      const baseDuration = totalDuration * stage.weight;
      return jitter(baseDuration, 0.4); // ±20% variance
    });

    // Normalize to match total duration
    const sum = stageDurations.reduce((a, b) => a + b, 0);
    const normalizedDurations = stageDurations.map(d => (d / sum) * totalDuration);

    let stageIndex = 0;
    let stageStartTime = Date.now();
    let stageProgress = 0;
    let accumulatedProgress = 0;

    const subStatuses = [
      ['Bootstrapping modules...', 'Loading threat database...', 'Configuring analysis engine...'],
      ['Scanning external assets...', 'Mapping network boundaries...', 'Identifying entry points...'],
      ['Analyzing threat vectors...', 'Computing risk metrics...', 'Cross-referencing vulnerabilities...'],
      ['Building attack graph...', 'Calculating path probabilities...', 'Mapping lateral movement...'],
      ['Aggregating results...', 'Generating visualizations...', 'Preparing report data...'],
    ];

    const runAnalysis = () => {
      if (stageIndex >= analysisStages.length) {
        progressRef.current = 100;
        setProgress(100);
        setIsComplete(true);
        setTimeout(() => onComplete(), randomDuration(400, 800));
        return;
      }

      const stageDuration = normalizedDurations[stageIndex];
      const elapsed = Date.now() - stageStartTime;
      const stageProgressRatio = Math.min(elapsed / stageDuration, 1);
      
      // Non-linear progress within stage
      const easedProgress = easeInOutQuad(stageProgressRatio);
      
      // Add micro-pauses at random intervals
      const pauseFactor = Math.sin(elapsed / 200) > 0.9 ? 0.3 : 1;
      stageProgress = easedProgress * pauseFactor + stageProgress * (1 - pauseFactor) * 0.1;
      
      const stageWeight = normalizedDurations[stageIndex] / totalDuration * 100;
      const currentProgress = accumulatedProgress + stageProgress * stageWeight;
      
      // Ensure progress never goes backward
      progressRef.current = Math.max(progressRef.current, currentProgress);
      setProgress(progressRef.current);
      
      // Random sub-status updates
      if (Math.random() < 0.02 && stageProgressRatio < 0.9) {
        const stageSubStatuses = subStatuses[stageIndex];
        setSubStatus(stageSubStatuses[Math.floor(Math.random() * stageSubStatuses.length)]);
      }

      if (stageProgressRatio >= 1) {
        accumulatedProgress += stageWeight;
        setCompletedMessages(prev => [...prev, analysisStages[stageIndex].message]);
        stageIndex++;
        stageStartTime = Date.now();
        setCurrentStage(stageIndex);
        setSubStatus('');
        
        // Random pause between stages
        const pauseDuration = randomDuration(50, 300);
        setTimeout(() => requestAnimationFrame(runAnalysis), pauseDuration);
      } else {
        requestAnimationFrame(runAnalysis);
      }
    };

    const startDelay = randomDuration(200, 500);
    const startTimeout = setTimeout(runAnalysis, startDelay);

    return () => clearTimeout(startTimeout);
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
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyber-cyan font-mono tabular-nums">
                  {Math.round(displayProgress)}%
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full px-2 mb-4">
            <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyber-cyan via-cyan-400 to-cyber-cyan transition-all duration-150 ease-out rounded-full"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground font-mono">
              <span className="opacity-60">{currentStage < analysisStages.length ? analysisStages[currentStage].name : 'Complete'}</span>
              <span className="tabular-nums">{isComplete ? 'COMPLETE' : 'PROCESSING'}</span>
            </div>
          </div>

          {/* Terminal Output */}
          <div className="w-full bg-black/60 rounded-lg border border-border/50 p-3 h-[130px] overflow-hidden">
            <div className="font-mono text-xs space-y-1">
              {completedMessages.slice(-3).map((msg, index) => (
                <div key={index} className="flex items-center gap-2 text-cyber-green/80">
                  <span>✓</span>
                  <span>{msg}</span>
                </div>
              ))}
              
              {!isComplete && currentStage < analysisStages.length && (
                <>
                  <div className="flex items-center gap-2 text-cyber-cyan">
                    <span className="animate-pulse">▸</span>
                    <span>{analysisStages[currentStage].message}</span>
                    <span className="animate-[pulse_0.6s_ease-in-out_infinite]">_</span>
                  </div>
                  {subStatus && (
                    <div className="flex items-center gap-2 text-muted-foreground/70 pl-4">
                      <span className="text-[10px]">└</span>
                      <span className="text-[10px]">{subStatus}</span>
                    </div>
                  )}
                </>
              )}

              {isComplete && (
                <div className="flex items-center gap-2 text-cyber-cyan pt-2 border-t border-border/30">
                  <span className="text-cyber-green">●</span>
                  <span>Analysis complete. Rendering attack surface...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
