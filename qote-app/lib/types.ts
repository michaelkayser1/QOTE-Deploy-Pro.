export interface Domain {
  id: string;
  title: string;
  subtitle: string;
  coherenceRules: string[];
  currentState: {
    description: string;
    visual?: string;
  };
  exportFormat: {
    type: 'json' | 'text';
    content: string;
  };
}

export interface Hinge {
  id: string;
  fromDomain: string;
  toDomain: string;
  label: string;
  icon: string;
  rotationType: string;
  constraint: string;
  transformation: {
    before: string;
    after: string;
  };
}

export interface ArchitectureMetrics {
  coupling: number;
  hingeClarity: number;
  iterationSpeed: number;
  curvature: number;
}

export interface ArchitectureExample {
  name: string;
  domains: Domain[];
  hinges: Hinge[];
  metrics: ArchitectureMetrics;
}

export type ArchitectureState = 'healthy' | 'monolithic';
