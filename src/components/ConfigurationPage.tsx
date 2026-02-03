import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CyberBackground } from '@/components/CyberBackground';
import { Shield, ArrowLeft, ArrowRight, Building2, User, AlertCircle } from 'lucide-react';
import { TargetConfig, TargetType, Industry, SecurityMaturity } from '@/types/asm';

const industries: { value: Industry; label: string }[] = [
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'technology', label: 'Technology' },
  { value: 'government', label: 'Government' },
];

const maturityLevels: { value: SecurityMaturity; label: string; description: string }[] = [
  { value: 'low', label: 'Low', description: 'Limited security controls and awareness' },
  { value: 'medium', label: 'Medium', description: 'Standard security practices in place' },
  { value: 'high', label: 'High', description: 'Advanced security program with mature controls' },
];

export function ConfigurationPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<Partial<TargetConfig>>({
    targetType: 'organization',
    industry: 'technology',
    securityMaturity: 'medium',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!config.organizationName?.trim()) {
      setError('Please enter an organization name or domain');
      return;
    }

    // Store config and navigate to dashboard
    sessionStorage.setItem('asmConfig', JSON.stringify(config));
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <CyberBackground />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background pointer-events-none" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full py-6 px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="p-2 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30">
                <Shield className="w-6 h-6 text-cyber-cyan" />
              </div>
              <span className="text-lg font-semibold tracking-wide text-foreground">ASM</span>
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-10 animate-fade-in-up">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Target Configuration
              </h1>
              <p className="text-muted-foreground">
                Define the scope of your attack surface simulation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Target Type */}
              <div className="cyber-card animate-fade-in-up delay-100">
                <Label className="text-base font-medium text-foreground mb-4 block">
                  Target Type
                </Label>
                <RadioGroup
                  value={config.targetType}
                  onValueChange={(value: TargetType) => 
                    setConfig({ ...config, targetType: value })
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  <label
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      config.targetType === 'individual'
                        ? 'border-cyber-cyan bg-cyber-cyan/10'
                        : 'border-border hover:border-muted-foreground/50'
                    }`}
                  >
                    <RadioGroupItem value="individual" className="sr-only" />
                    <div className={`p-3 rounded-lg ${
                      config.targetType === 'individual' 
                        ? 'bg-cyber-cyan/20' 
                        : 'bg-muted'
                    }`}>
                      <User className={`w-5 h-5 ${
                        config.targetType === 'individual' 
                          ? 'text-cyber-cyan' 
                          : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Individual</p>
                      <p className="text-sm text-muted-foreground">Personal exposure</p>
                    </div>
                  </label>
                  
                  <label
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      config.targetType === 'organization'
                        ? 'border-cyber-cyan bg-cyber-cyan/10'
                        : 'border-border hover:border-muted-foreground/50'
                    }`}
                  >
                    <RadioGroupItem value="organization" className="sr-only" />
                    <div className={`p-3 rounded-lg ${
                      config.targetType === 'organization' 
                        ? 'bg-cyber-cyan/20' 
                        : 'bg-muted'
                    }`}>
                      <Building2 className={`w-5 h-5 ${
                        config.targetType === 'organization' 
                          ? 'text-cyber-cyan' 
                          : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Organization</p>
                      <p className="text-sm text-muted-foreground">Enterprise scope</p>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              {/* Organization Name */}
              <div className="cyber-card animate-fade-in-up delay-200">
                <Label htmlFor="orgName" className="text-base font-medium text-foreground mb-4 block">
                  Organization Name or Domain
                </Label>
                <Input
                  id="orgName"
                  type="text"
                  placeholder="e.g., Acme Corporation or acme.com"
                  value={config.organizationName || ''}
                  onChange={(e) => {
                    setConfig({ ...config, organizationName: e.target.value });
                    setError(null);
                  }}
                  className="bg-muted/50 border-border focus:border-cyber-cyan focus:ring-cyber-cyan/20 h-12"
                />
                {error && (
                  <div className="flex items-center gap-2 mt-3 text-cyber-red">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>

              {/* Industry */}
              <div className="cyber-card animate-fade-in-up delay-300">
                <Label className="text-base font-medium text-foreground mb-4 block">
                  Industry Sector
                </Label>
                <Select
                  value={config.industry}
                  onValueChange={(value: Industry) => 
                    setConfig({ ...config, industry: value })
                  }
                >
                  <SelectTrigger className="bg-muted/50 border-border h-12 focus:border-cyber-cyan focus:ring-cyber-cyan/20">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {industries.map((industry) => (
                      <SelectItem 
                        key={industry.value} 
                        value={industry.value}
                        className="focus:bg-cyber-cyan/10 focus:text-foreground"
                      >
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Security Maturity */}
              <div className="cyber-card animate-fade-in-up delay-400">
                <Label className="text-base font-medium text-foreground mb-4 block">
                  Security Maturity Level
                </Label>
                <RadioGroup
                  value={config.securityMaturity}
                  onValueChange={(value: SecurityMaturity) => 
                    setConfig({ ...config, securityMaturity: value })
                  }
                  className="space-y-3"
                >
                  {maturityLevels.map((level) => (
                    <label
                      key={level.value}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        config.securityMaturity === level.value
                          ? 'border-cyber-cyan bg-cyber-cyan/10'
                          : 'border-border hover:border-muted-foreground/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <RadioGroupItem value={level.value} className="sr-only" />
                        <div className={`w-3 h-3 rounded-full ${
                          level.value === 'low' ? 'bg-cyber-red' :
                          level.value === 'medium' ? 'bg-cyber-amber' :
                          'bg-cyber-green'
                        }`} />
                        <div>
                          <p className="font-medium text-foreground">{level.label}</p>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      </div>
                      {config.securityMaturity === level.value && (
                        <div className="w-2 h-2 rounded-full bg-cyber-cyan" />
                      )}
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {/* Submit */}
              <div className="flex justify-end animate-fade-in-up delay-500">
                <Button
                  type="submit"
                  variant="cyberSolid"
                  size="lg"
                  className="group"
                >
                  Generate Attack Surface Map
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
