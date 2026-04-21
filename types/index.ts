
export interface Task {
  name: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

export interface AnalysisResult {
  tasks: Task[];
  recommended_action: string;
}

export interface Decision {
  id: string;
  input: string;
  output: AnalysisResult;
  timestamp: number;
}
