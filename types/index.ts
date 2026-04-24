
export interface Task {
  name: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

export interface Priority {
  task: string;
  level: 'alta' | 'média' | 'baixa';
  reason: string;
}

export interface AnalysisResult {
  primary_action: string;
  reason: string;
  priorities: Priority[];
  // Compatibilidade com versões anteriores
  tasks?: Task[];
  recommended_action?: string;
}

export interface Decision {
  id: string;
  input: string;
  output: AnalysisResult;
  timestamp: number;
}
