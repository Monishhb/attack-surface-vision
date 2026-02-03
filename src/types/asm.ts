export type TargetType = 'individual' | 'organization';

export type Industry = 'education' | 'finance' | 'healthcare' | 'technology' | 'government';

export type SecurityMaturity = 'low' | 'medium' | 'high';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface TargetConfig {
  targetType: TargetType;
  organizationName: string;
  industry: Industry;
  securityMaturity: SecurityMaturity;
}

export interface AttackSurface {
  id: string;
  name: string;
  shortName: string;
  description: string;
  riskLevel: RiskLevel;
  riskScore: number;
  exposureReasons: string[];
  attackerMethods: string[];
  businessImpact: string[];
  defensiveControls: string[];
  icon: string;
}

export interface AttackPath {
  steps: string[];
  description: string;
}

export interface RiskAssessment {
  totalScore: number;
  overallRiskLevel: RiskLevel;
  surfaces: AttackSurface[];
  mostLikelyPath: AttackPath;
  weakestSurface: AttackSurface;
  topDefensivePriorities: string[];
}
