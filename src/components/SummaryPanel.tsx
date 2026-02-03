import { RiskAssessment, RiskLevel } from '@/types/asm';
import { RiskScoreGauge } from '@/components/RiskScoreGauge';
import { AttackPathFlow } from '@/components/AttackPathFlow';
import { AlertTriangle, Shield, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryPanelProps {
  assessment: RiskAssessment;
}

const riskColors: Record<RiskLevel, { text: string; bg: string; border: string }> = {
  low: { text: 'text-cyber-green', bg: 'bg-cyber-green/10', border: 'border-cyber-green/30' },
  medium: { text: 'text-cyber-amber', bg: 'bg-cyber-amber/10', border: 'border-cyber-amber/30' },
  high: { text: 'text-cyber-orange', bg: 'bg-cyber-orange/10', border: 'border-cyber-orange/30' },
  critical: { text: 'text-cyber-red', bg: 'bg-cyber-red/10', border: 'border-cyber-red/30' },
};

export function SummaryPanel({ assessment }: SummaryPanelProps) {
  const colors = riskColors[assessment.overallRiskLevel];
  const weakestColors = riskColors[assessment.weakestSurface.riskLevel];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Overall Risk Score */}
      <div className="cyber-card flex flex-col items-center justify-center py-8 animate-fade-in-up">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Overall Attack Surface Risk
        </h3>
        <RiskScoreGauge score={assessment.totalScore} riskLevel={assessment.overallRiskLevel} />
        <div className={cn('mt-4 px-4 py-2 rounded-full text-sm font-bold uppercase', colors.bg, colors.text, colors.border, 'border')}>
          {assessment.overallRiskLevel} Risk
        </div>
      </div>

      {/* Weakest Surface */}
      <div className="cyber-card animate-fade-in-up delay-100">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className={cn('w-5 h-5', weakestColors.text)} />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Key Weakest Surface
          </h3>
        </div>
        
        <div className={cn('p-4 rounded-lg border mb-4', weakestColors.bg, weakestColors.border)}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-foreground">{assessment.weakestSurface.name}</span>
            <span className={cn('text-2xl font-bold font-mono', weakestColors.text)}>
              {assessment.weakestSurface.riskScore}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {assessment.weakestSurface.description}
          </p>
        </div>

        <div className={cn('px-3 py-1.5 rounded-full text-xs font-semibold uppercase inline-flex items-center gap-2', weakestColors.bg, weakestColors.text)}>
          <Target className="w-3 h-3" />
          Highest Priority Target
        </div>
      </div>

      {/* Top Defensive Priorities */}
      <div className="cyber-card animate-fade-in-up delay-200">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-cyber-green" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Top 3 Defensive Priorities
          </h3>
        </div>
        
        <ul className="space-y-3">
          {assessment.topDefensivePriorities.map((priority, index) => (
            <li 
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-cyber-green/5 border border-cyber-green/20"
            >
              <span className="w-6 h-6 rounded-full bg-cyber-green/20 text-cyber-green text-xs font-bold flex items-center justify-center flex-shrink-0">
                {index + 1}
              </span>
              <span className="text-sm text-foreground">{priority}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Attack Path */}
      <div className="lg:col-span-3 cyber-card animate-fade-in-up delay-300">
        <AttackPathFlow attackPath={assessment.mostLikelyPath} />
      </div>
    </div>
  );
}
