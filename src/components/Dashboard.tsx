import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AttackSurfaceNode } from '@/components/AttackSurfaceNode';
import { SurfaceDetailPanel } from '@/components/SurfaceDetailPanel';
import { SummaryPanel } from '@/components/SummaryPanel';
import { Shield, ArrowLeft, Building2, Info } from 'lucide-react';
import { TargetConfig, AttackSurface, RiskAssessment } from '@/types/asm';
import { generateRiskAssessment } from '@/lib/riskEngine';
import { cn } from '@/lib/utils';

// Node positions (percentages relative to container)
const nodePositions = [
  { x: 50, y: 15 },   // Top
  { x: 85, y: 35 },   // Right top
  { x: 85, y: 65 },   // Right bottom
  { x: 15, y: 65 },   // Left bottom
  { x: 15, y: 35 },   // Left top
];

export function Dashboard() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<TargetConfig | null>(null);
  const [selectedSurface, setSelectedSurface] = useState<AttackSurface | null>(null);
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);

  useEffect(() => {
    const storedConfig = sessionStorage.getItem('asmConfig');
    if (!storedConfig) {
      navigate('/configure');
      return;
    }

    const parsedConfig = JSON.parse(storedConfig) as TargetConfig;
    setConfig(parsedConfig);
    
    // Generate assessment
    const riskAssessment = generateRiskAssessment(parsedConfig);
    setAssessment(riskAssessment);
  }, [navigate]);

  if (!config || !assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading assessment...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="p-2 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30">
                <Shield className="w-5 h-5 text-cyber-cyan" />
              </div>
              <span className="text-lg font-semibold tracking-wide text-foreground">ASM</span>
            </button>
            
            <div className="h-8 w-px bg-border" />
            
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{config.organizationName}</span>
              <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted capitalize">
                {config.industry}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/configure')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Left section: Attack Surface Map */}
        <div className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          selectedSurface ? 'lg:w-[60%]' : 'w-full'
        )}>
          {/* Attack Surface Visualization */}
          <div className="relative flex-1 min-h-[400px] lg:min-h-[500px] p-8">
            {/* Grid background */}
            <div className="absolute inset-0 cyber-grid-bg opacity-30" />
            
            {/* Center node (Target) */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                {/* Outer ring */}
                <div className="absolute -inset-12 rounded-full border border-cyber-cyan/20 animate-pulse" />
                <div className="absolute -inset-8 rounded-full border border-cyber-cyan/30" />
                
                {/* Center node */}
                <div className="w-24 h-24 rounded-full bg-cyber-cyan/10 border-2 border-cyber-cyan flex items-center justify-center shadow-glow-cyan">
                  <div className="text-center">
                    <Building2 className="w-8 h-8 text-cyber-cyan mx-auto mb-1" />
                    <span className="text-xs font-medium text-cyber-cyan">TARGET</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attack surface nodes */}
            {assessment.surfaces.map((surface, index) => (
              <AttackSurfaceNode
                key={surface.id}
                surface={surface}
                isSelected={selectedSurface?.id === surface.id}
                onClick={() => setSelectedSurface(
                  selectedSurface?.id === surface.id ? null : surface
                )}
                position={nodePositions[index]}
                delay={index * 100}
              />
            ))}

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="w-4 h-4" />
              <span>Click on any surface node to view detailed analysis</span>
            </div>
          </div>

          {/* Summary section */}
          <div className="p-6 border-t border-border bg-card/30">
            <SummaryPanel assessment={assessment} />
          </div>

          {/* Disclaimer */}
          <div className="p-4 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              This application is a simulated educational model of attack surface management.
              No real scanning, vulnerability detection, or live data analysis is performed.
            </p>
          </div>
        </div>

        {/* Right section: Detail Panel */}
        {selectedSurface && (
          <div className="hidden lg:block w-[40%] max-w-[500px]">
            <SurfaceDetailPanel
              surface={selectedSurface}
              onClose={() => setSelectedSurface(null)}
            />
          </div>
        )}
      </div>

      {/* Mobile detail panel (overlay) */}
      {selectedSurface && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <SurfaceDetailPanel
            surface={selectedSurface}
            onClose={() => setSelectedSurface(null)}
          />
        </div>
      )}
    </div>
  );
}
