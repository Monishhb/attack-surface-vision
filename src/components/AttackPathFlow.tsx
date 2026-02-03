import { AttackPath } from '@/types/asm';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttackPathFlowProps {
  attackPath: AttackPath;
}

export function AttackPathFlow({ attackPath }: AttackPathFlowProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyber-red animate-pulse" />
        Most Likely Initial Access Path
      </h3>
      
      {/* Path visualization */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {attackPath.steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                'px-4 py-2 rounded-lg border text-sm font-medium whitespace-nowrap',
                'transition-all duration-300 animate-fade-in-up opacity-0',
                index === 0 
                  ? 'bg-cyber-red/10 border-cyber-red/30 text-cyber-red' 
                  : index === attackPath.steps.length - 1
                    ? 'bg-cyber-orange/10 border-cyber-orange/30 text-cyber-orange'
                    : 'bg-muted/50 border-border text-muted-foreground'
              )}
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards',
              }}
            >
              {step}
            </div>
            {index < attackPath.steps.length - 1 && (
              <ArrowRight 
                className="w-5 h-5 text-muted-foreground mx-1 flex-shrink-0 animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${index * 100 + 50}ms`,
                  animationFillMode: 'forwards',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {attackPath.description}
      </p>
    </div>
  );
}
