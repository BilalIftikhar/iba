// Shared TypeScript types for n8n stats API responses

export interface PerWorkflowStat {
    workflow_id: string;
    n8n_workflow_id: string;
    name: string;
    department: string;
    status: 'active' | 'paused' | 'deploying';
    runs: number;
    successful: number;
    failed: number;
    success_rate_pct: number;
    estimated_minutes_saved: number;
    error?: string;
}

export interface StatsSummary {
    total_workflows: number;
    active_workflows: number;
    total_runs: number;
    successful_runs: number;
    failed_runs: number;
    success_rate_pct: number;
    estimated_hours_saved: number;
    per_workflow: PerWorkflowStat[];
}

export interface Run {
    execution_id: string;
    n8n_workflow_id: string;
    workflow_id: string | null;
    workflow_name: string;
    workflow_department: string | null;
    workflow_status: string | null;
    status: 'success' | 'error' | 'waiting' | 'running' | 'unknown';
    mode: string;
    started_at: string;
    stopped_at: string | null;
    duration_ms: number | null;
    retry_of: string | null;
}

export interface RunsResponse {
    runs: Run[];
    nextCursor: string | null;
}

// Shape of the run.completed Socket.io event pushed by the backend
export interface RunCompletedEvent {
    executionId: string;
    n8nWorkflowId: string;
    status: 'success' | 'error' | string;
    mode: string;
    startedAt: string;
    stoppedAt: string | null;
    durationMs: number | null;
    retryOf: string | null;
    workflowId: string | null;
    workflowName: string;
    department: string | null;
    clientId: string | null;
    minutesSaved: number;
}
