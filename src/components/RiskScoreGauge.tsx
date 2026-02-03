import { RiskLevel } from '@/types/asm';
import { cn } from '@/lib/utils';

interface RiskScoreGaugeProps {
  score: number;
  riskLevel: RiskLevel;
}

const riskColors: Record<RiskLevel, { stroke: string; text: string; glow: string }> = {
  low: { 
    stroke: 'stroke-cyber-green', 
    text: 'text-cyber-green',
    glow: 'drop-shadow-[0_0_8px_hsl(160,85%,45%,0.5)]'
  },
  medium: { 
    stroke: 'stroke-cyber-amber', 
    text: 'text-cyber-amber',
    glow: 'drop-shadow-[0_0_8px_hsl(40,95%,50%,0.5)]'
  },
  high: { 
    stroke: 'stroke-cyber-orange', 
    text: 'text-cyber-orange',
    glow: 'drop-shadow-[0_0_8px_hsl(25,95%,55%,0.5)]'
  },
  critical: { 
    stroke: 'stroke-cyber-red', 
    text: 'text-cyber-red',
    glow: 'drop-shadow-[0_0_8px_hsl(0,85%,55%,0.5)]'
  },
};

export function RiskScoreGauge({ score, riskLevel }: RiskScoreGaugeProps) {
  const colors = riskColors[riskLevel];
  const percentage = score / 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
          className="stroke-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(colors.stroke, colors.glow, 'transition-all duration-1000 ease-out')}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-3xl font-bold font-mono', colors.text)}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          / 100
        </span>
      </div>
    </div>
  );
}
