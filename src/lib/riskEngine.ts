import { 
  TargetConfig, 
  AttackSurface, 
  RiskAssessment, 
  RiskLevel,
  Industry,
  SecurityMaturity,
  AttackPath
} from '@/types/asm';

// Deterministic hash function for consistent scoring
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Industry-specific risk modifiers
const industryRiskModifiers: Record<Industry, Record<string, number>> = {
  education: {
    external: 1.2,
    identity: 1.0,
    network: 0.9,
    human: 1.3,
    thirdParty: 1.1,
  },
  finance: {
    external: 1.1,
    identity: 1.4,
    network: 1.2,
    human: 1.1,
    thirdParty: 1.3,
  },
  healthcare: {
    external: 1.0,
    identity: 1.2,
    network: 1.1,
    human: 1.2,
    thirdParty: 1.4,
  },
  technology: {
    external: 1.3,
    identity: 1.1,
    network: 1.3,
    human: 0.9,
    thirdParty: 1.2,
  },
  government: {
    external: 1.2,
    identity: 1.3,
    network: 1.2,
    human: 1.1,
    thirdParty: 1.1,
  },
};

// Security maturity reduction factors
const maturityReduction: Record<SecurityMaturity, number> = {
  low: 1.0,
  medium: 0.75,
  high: 0.5,
};

function getRiskLevel(score: number): RiskLevel {
  if (score <= 5) return 'low';
  if (score <= 10) return 'medium';
  if (score <= 15) return 'high';
  return 'critical';
}

function getOverallRiskLevel(totalScore: number): RiskLevel {
  if (totalScore <= 30) return 'low';
  if (totalScore <= 60) return 'medium';
  if (totalScore <= 80) return 'high';
  return 'critical';
}

function calculateSurfaceScore(
  baseScore: number,
  modifier: number,
  maturityFactor: number,
  variance: number
): number {
  const adjusted = baseScore * modifier * maturityFactor;
  const withVariance = adjusted + (variance % 5) - 2;
  return Math.max(0, Math.min(20, Math.round(withVariance)));
}

export function generateRiskAssessment(config: TargetConfig): RiskAssessment {
  const seed = hashString(`${config.organizationName}-${config.industry}-${config.securityMaturity}`);
  const industryMod = industryRiskModifiers[config.industry];
  const maturityFactor = maturityReduction[config.securityMaturity];

  const surfaces: AttackSurface[] = [
    {
      id: 'external',
      name: 'External Exposure Surface',
      shortName: 'External',
      description: 'Public-facing assets, web applications, and exposed services',
      riskLevel: 'medium',
      riskScore: 0,
      exposureReasons: [
        'Publicly accessible web applications and portals',
        'Exposed API endpoints without proper rate limiting',
        'Outdated SSL/TLS configurations on public services',
        'DNS records revealing internal infrastructure details',
        'Cloud storage with misconfigured access policies',
      ],
      attackerMethods: [
        'Reconnaissance of public-facing assets',
        'Identification of technology stack through fingerprinting',
        'Discovery of exposed administrative interfaces',
        'Enumeration of subdomains and virtual hosts',
      ],
      businessImpact: [
        'Data breach through exposed endpoints',
        'Service disruption affecting customer access',
        'Regulatory compliance violations',
        'Reputational damage from public disclosure',
      ],
      defensiveControls: [
        'Implement Web Application Firewall (WAF)',
        'Regular external penetration testing',
        'Continuous asset discovery and monitoring',
        'Enforce strong TLS configurations',
        'Deploy DDoS protection services',
      ],
      icon: 'globe',
    },
    {
      id: 'identity',
      name: 'Identity & Access Surface',
      shortName: 'Identity',
      description: 'Authentication systems, credentials, and access management',
      riskLevel: 'medium',
      riskScore: 0,
      exposureReasons: [
        'Single-factor authentication on critical systems',
        'Privileged accounts without additional controls',
        'Stale user accounts with active credentials',
        'Inconsistent password policies across systems',
        'Shared service accounts without proper auditing',
      ],
      attackerMethods: [
        'Credential stuffing using leaked databases',
        'Password spraying against exposed services',
        'Session hijacking through token theft',
        'Privilege escalation via misconfigured permissions',
      ],
      businessImpact: [
        'Unauthorized access to sensitive systems',
        'Lateral movement across the organization',
        'Data exfiltration under legitimate credentials',
        'Compliance failures for access controls',
      ],
      defensiveControls: [
        'Enforce Multi-Factor Authentication (MFA)',
        'Implement Privileged Access Management (PAM)',
        'Regular access reviews and deprovisioning',
        'Deploy Identity Threat Detection solutions',
        'Adopt Zero Trust architecture principles',
      ],
      icon: 'fingerprint',
    },
    {
      id: 'network',
      name: 'Network & Remote Access Surface',
      shortName: 'Network',
      description: 'Network infrastructure, VPN, and remote access systems',
      riskLevel: 'medium',
      riskScore: 0,
      exposureReasons: [
        'VPN concentrators with known vulnerabilities',
        'Remote desktop services exposed to internet',
        'Network segmentation gaps between environments',
        'Legacy protocols still active on network',
        'Insufficient monitoring of east-west traffic',
      ],
      attackerMethods: [
        'Exploitation of VPN vulnerabilities',
        'Brute force attacks on RDP/SSH services',
        'Network sniffing on unsecured segments',
        'Pivoting through compromised network devices',
      ],
      businessImpact: [
        'Complete network compromise',
        'Ransomware propagation across segments',
        'Persistent backdoor access',
        'Disruption of critical business operations',
      ],
      defensiveControls: [
        'Implement network segmentation and micro-segmentation',
        'Deploy Network Detection and Response (NDR)',
        'Replace VPN with Zero Trust Network Access (ZTNA)',
        'Regular vulnerability scanning of network devices',
        'Enable encrypted communications for all traffic',
      ],
      icon: 'network',
    },
    {
      id: 'human',
      name: 'Human & Social Engineering Surface',
      shortName: 'Human',
      description: 'Employee awareness, phishing susceptibility, and insider threats',
      riskLevel: 'medium',
      riskScore: 0,
      exposureReasons: [
        'Employee email addresses publicly available',
        'Organizational hierarchy visible on LinkedIn',
        'Limited security awareness training programs',
        'High-value targets identifiable through public info',
        'Remote workforce with reduced oversight',
      ],
      attackerMethods: [
        'Targeted spear-phishing campaigns',
        'Business Email Compromise (BEC) attacks',
        'Social engineering via phone (vishing)',
        'Credential harvesting through fake portals',
      ],
      businessImpact: [
        'Initial access through compromised credentials',
        'Financial fraud via wire transfer manipulation',
        'Malware deployment through email attachments',
        'Intellectual property theft by insiders',
      ],
      defensiveControls: [
        'Regular phishing simulation and training',
        'Email security with advanced threat protection',
        'Implement DMARC, DKIM, and SPF records',
        'Establish insider threat monitoring program',
        'Create clear incident reporting procedures',
      ],
      icon: 'users',
    },
    {
      id: 'thirdParty',
      name: 'Third-Party & Supply Chain Surface',
      shortName: 'Supply Chain',
      description: 'Vendor relationships, integrations, and supply chain dependencies',
      riskLevel: 'medium',
      riskScore: 0,
      exposureReasons: [
        'Third-party vendors with privileged access',
        'SaaS applications with broad data access',
        'Software dependencies with known vulnerabilities',
        'Limited visibility into vendor security posture',
        'Contractual gaps in security requirements',
      ],
      attackerMethods: [
        'Compromise of trusted vendor accounts',
        'Supply chain attacks via software updates',
        'Exploitation of integration weaknesses',
        'Island hopping through partner networks',
      ],
      businessImpact: [
        'Indirect breach through vendor compromise',
        'Widespread impact from software supply chain attack',
        'Regulatory liability for third-party failures',
        'Business disruption from vendor outages',
      ],
      defensiveControls: [
        'Implement vendor risk assessment program',
        'Enforce least privilege for third-party access',
        'Monitor vendor security ratings continuously',
        'Include security requirements in contracts',
        'Deploy Software Composition Analysis (SCA)',
      ],
      icon: 'link',
    },
  ];

  // Calculate scores for each surface
  surfaces.forEach((surface, index) => {
    const baseScore = 12 + (seed % 6);
    const modifier = industryMod[surface.id === 'thirdParty' ? 'thirdParty' : surface.id];
    const variance = (seed >> (index * 4)) % 10;
    
    surface.riskScore = calculateSurfaceScore(baseScore, modifier, maturityFactor, variance);
    surface.riskLevel = getRiskLevel(surface.riskScore);
  });

  const totalScore = surfaces.reduce((sum, s) => sum + s.riskScore, 0);
  const overallRiskLevel = getOverallRiskLevel(totalScore);
  
  // Find weakest surface
  const weakestSurface = [...surfaces].sort((a, b) => b.riskScore - a.riskScore)[0];

  // Generate attack path based on weakest surfaces
  const sortedSurfaces = [...surfaces].sort((a, b) => b.riskScore - a.riskScore);
  const attackPath: AttackPath = generateAttackPath(sortedSurfaces, config);

  // Top defensive priorities
  const topDefensivePriorities = [
    weakestSurface.defensiveControls[0],
    sortedSurfaces[1].defensiveControls[0],
    sortedSurfaces[2].defensiveControls[0],
  ];

  return {
    totalScore,
    overallRiskLevel,
    surfaces,
    mostLikelyPath: attackPath,
    weakestSurface,
    topDefensivePriorities,
  };
}

function generateAttackPath(sortedSurfaces: AttackSurface[], config: TargetConfig): AttackPath {
  const primary = sortedSurfaces[0];
  const secondary = sortedSurfaces[1];

  const pathTemplates: Record<string, AttackPath> = {
    human: {
      steps: [
        'Human Surface',
        'Credential Phishing',
        'Identity Compromise',
        'Internal Access',
        'Data Exfiltration',
      ],
      description: 'Initial access through social engineering, leading to credential theft and subsequent internal network access.',
    },
    external: {
      steps: [
        'External Surface',
        'Web Application Exploit',
        'Server Compromise',
        'Lateral Movement',
        'Objective Achievement',
      ],
      description: 'Exploitation of public-facing assets to gain foothold, followed by internal reconnaissance and lateral movement.',
    },
    identity: {
      steps: [
        'Identity Surface',
        'Credential Attack',
        'Account Takeover',
        'Privilege Escalation',
        'Full Domain Access',
      ],
      description: 'Direct attack on authentication systems leading to account compromise and privilege escalation.',
    },
    network: {
      steps: [
        'Network Surface',
        'VPN/RDP Exploitation',
        'Network Foothold',
        'Internal Reconnaissance',
        'Critical Asset Access',
      ],
      description: 'Compromise of remote access infrastructure enabling direct network access and internal movement.',
    },
    thirdParty: {
      steps: [
        'Supply Chain Surface',
        'Vendor Compromise',
        'Trusted Access Abuse',
        'Internal Pivot',
        'Target Achievement',
      ],
      description: 'Indirect access through compromised third-party, leveraging trusted relationships to reach objectives.',
    },
  };

  return pathTemplates[primary.id] || pathTemplates.human;
}
