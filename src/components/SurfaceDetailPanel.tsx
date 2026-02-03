import { AttackSurface, RiskLevel } from '@/types/asm';
import { X, AlertTriangle, Shield, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SurfaceDetailPanelProps {
  surface: AttackSurface;
  onClose: () => void;
}

const riskColors: Record<RiskLevel, { text: string; bg: string; border: string }> = {
  low: { text: 'text-cyber-green', bg: 'bg-cyber-green/10', border: 'border-cyber-green/30' },
  medium: { text: 'text-cyber-amber', bg: 'bg-cyber-amber/10', border: 'border-cyber-amber/30' },
  high: { text: 'text-cyber-orange', bg: 'bg-cyber-orange/10', border: 'border-cyber-orange/30' },
  critical: { text: 'text-cyber-red', bg: 'bg-cyber-red/10', border: 'border-cyber-red/30' },
};

export function SurfaceDetailPanel({ surface, onClose }: SurfaceDetailPanelProps) {
  const colors = riskColors[surface.riskLevel];

  return (
    <div className="h-full flex flex-col bg-card border-l border-border animate-slide-in-right">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', colors.bg, colors.border, 'border')}>
              <Target className={cn('w-5 h-5', colors.text)} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{surface.name}</h2>
              <p className="text-sm text-muted-foreground">{surface.description}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Risk indicators */}
        <div className="flex items-center gap-4">
          <div className={cn('px-3 py-1.5 rounded-full text-sm font-semibold uppercase', colors.bg, colors.text)}>
            {surface.riskLevel} Risk
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Score:</span>
            <span className={cn('text-2xl font-bold font-mono', colors.text)}>{surface.riskScore}</span>
            <span className="text-sm text-muted-foreground">/ 20</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Exposure Reasons */}
        <Section
          icon={AlertTriangle}
          title="Why This Surface is Exposed"
          iconColor="text-cyber-amber"
        >
          <ul className="space-y-2">
            {surface.exposureReasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-amber mt-2 flex-shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </Section>

        {/* Attacker Methods */}
        <Section
          icon={Zap}
          title="Typical Attacker Entry Methods"
          iconColor="text-cyber-red"
        >
          <ul className="space-y-2">
            {surface.attackerMethods.map((method, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-red mt-2 flex-shrink-0" />
                {method}
              </li>
            ))}
          </ul>
        </Section>

        {/* Business Impact */}
        <Section
          icon={Target}
          title="Potential Business Impact"
          iconColor="text-cyber-orange"
        >
          <ul className="space-y-2">
            {surface.businessImpact.map((impact, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-orange mt-2 flex-shrink-0" />
                {impact}
              </li>
            ))}
          </ul>
        </Section>

        {/* Defensive Controls */}
        <Section
          icon={Shield}
          title="Recommended Defensive Controls"
          iconColor="text-cyber-green"
        >
          <ul className="space-y-3">
            {surface.defensiveControls.map((control, index) => (
              <li 
                key={index} 
                className="flex items-start gap-3 p-3 rounded-lg bg-cyber-green/5 border border-cyber-green/20"
              >
                <Shield className="w-4 h-4 text-cyber-green mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">{control}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  iconColor,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  iconColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className={cn('w-4 h-4', iconColor)} />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}
