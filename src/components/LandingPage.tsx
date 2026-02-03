import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CyberBackground } from '@/components/CyberBackground';
import { Shield, ArrowRight, Target, Eye, Lock } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CyberBackground />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full py-6 px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30">
                <Shield className="w-6 h-6 text-cyber-cyan" />
              </div>
              <span className="text-lg font-semibold tracking-wide text-foreground">ASM</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Documentation</span>
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">About</span>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-card/60 border border-border/60 backdrop-blur-sm mb-8 animate-fade-in-up shadow-[0_0_20px_hsl(var(--cyber-cyan)/0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75" style={{ animationDuration: '2s' }} />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green" />
              </span>
              <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">Live Attack Surface Model</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up delay-100">
              <span className="text-foreground">Attack Surface</span>
              <br />
              <span className="cyber-text-gradient">Mapper</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground font-light mb-4 animate-fade-in-up delay-200">
              Visualizing Organizational Exposure from an Attacker's Perspective
            </p>

            {/* Description */}
            <p className="text-base text-muted-foreground/80 max-w-2xl mx-auto mb-12 animate-fade-in-up delay-300">
              Understand your organization's attack surface through interactive visualization. 
              Simulate attacker reconnaissance without any real-world scanning or data collection.
            </p>

            {/* CTA Button */}
            <div className="animate-fade-in-up delay-400">
              <Button
                variant="cyberSolid"
                size="xl"
                onClick={() => navigate('/configure')}
                className="group"
              >
                Start Attack Surface Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Feature cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-20 animate-fade-in-up delay-500">
              <FeatureCard
                icon={Target}
                title="Surface Mapping"
                description="Identify potential exposure points across your digital footprint"
              />
              <FeatureCard
                icon={Eye}
                title="Attacker View"
                description="Understand how adversaries perceive your organization"
              />
              <FeatureCard
                icon={Lock}
                title="Defense Alignment"
                description="Map defensive controls to identified attack surfaces"
              />
            </div>
          </div>
        </main>

        {/* Footer disclaimer */}
        <footer className="py-8 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              This application is a simulated educational model of attack surface management.
              No real scanning, vulnerability detection, or live data analysis is performed.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  title: string; 
  description: string;
}) {
  return (
    <div className="group p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-cyber-cyan/30 hover:bg-card/80 transition-all duration-300">
      <div className="w-12 h-12 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center mb-4 group-hover:shadow-glow-cyan transition-shadow">
        <Icon className="w-6 h-6 text-cyber-cyan" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
