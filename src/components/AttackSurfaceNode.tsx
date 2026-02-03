import { AttackSurface, RiskLevel } from '@/types/asm';
import { Globe, Fingerprint, Network, Users, Link } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttackSurfaceNodeProps {
  surface: AttackSurface;
  isSelected: boolean;
  onClick: () => void;
  position: { x: number; y: number };
  delay: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  fingerprint: Fingerprint,
  network: Network,
  users: Users,
  link: Link,
};

const riskColors: Record<RiskLevel, { bg: string; border: string; text: string; glow: string }> = {
  low: {
    bg: 'bg-cyber-green/10',
    border: 'border-cyber-green/50',
    text: 'text-cyber-green',
    glow: 'shadow-[0_0_20px_hsl(160,85%,45%,0.3)]',
  },
  medium: {
    bg: 'bg-cyber-amber/10',
    border: 'border-cyber-amber/50',
    text: 'text-cyber-amber',
    glow: 'shadow-[0_0_20px_hsl(40,95%,50%,0.3)]',
  },
  high: {
    bg: 'bg-cyber-orange/10',
    border: 'border-cyber-orange/50',
    text: 'text-cyber-orange',
    glow: 'shadow-[0_0_20px_hsl(25,95%,55%,0.3)]',
  },
  critical: {
    bg: 'bg-cyber-red/10',
    border: 'border-cyber-red/50',
    text: 'text-cyber-red',
    glow: 'shadow-[0_0_20px_hsl(0,85%,55%,0.3)]',
  },
};

export function AttackSurfaceNode({
  surface,
  isSelected,
  onClick,
  position,
  delay,
}: AttackSurfaceNodeProps) {
  const Icon = iconMap[surface.icon] || Globe;
  const colors = riskColors[surface.riskLevel];

  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300',
        'group cursor-pointer focus:outline-none',
        'animate-fade-in-up opacity-0'
      )}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {/* Connection line to center */}
      <div 
        className="absolute w-px bg-gradient-to-b from-cyber-cyan/30 to-transparent"
        style={{
          height: '80px',
          left: '50%',
          bottom: '100%',
          transform: 'translateX(-50%)',
        }}
      />
      
      {/* Node container */}
      <div
        className={cn(
          'relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 backdrop-blur-sm',
          'transition-all duration-300 min-w-[140px]',
          colors.bg,
          colors.border,
          isSelected ? colors.glow : 'hover:scale-105',
          isSelected && 'ring-2 ring-offset-2 ring-offset-background ring-cyber-cyan scale-105'
        )}
      >
        {/* Risk score badge */}
        <div 
          className={cn(
            'absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center',
            'text-xs font-bold border-2 bg-background',
            colors.border,
            colors.text
          )}
        >
          {surface.riskScore}
        </div>

        {/* Icon */}
        <div className={cn('p-3 rounded-lg', colors.bg)}>
          <Icon className={cn('w-6 h-6', colors.text)} />
        </div>

        {/* Name */}
        <span className="text-sm font-medium text-foreground text-center leading-tight">
          {surface.shortName}
        </span>

        {/* Risk level */}
        <span className={cn('text-xs font-semibold uppercase tracking-wider', colors.text)}>
          {surface.riskLevel}
        </span>
      </div>

      {/* Pulse effect for critical */}
      {surface.riskLevel === 'critical' && (
        <div 
          className={cn(
            'absolute inset-0 rounded-xl border-2 animate-ping',
            colors.border
          )}
          style={{ animationDuration: '2s' }}
        />
      )}
    </button>
  );
}
