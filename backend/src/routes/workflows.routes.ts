import { Router } from 'express';
export const workflowsRouter = Router();

// GET /api/v1/workflows — List all workflows for the authenticated user
workflowsRouter.get('/', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// GET /api/v1/workflows/:id — Get a single workflow by ID
workflowsRouter.get('/:id', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /api/v1/workflows/:id/pause — Pause an active workflow via n8n API
workflowsRouter.post('/:id/pause', async (_req, res) => {
    // TODO: Call N8nService.pauseWorkflow(n8n_workflow_id)
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /api/v1/workflows/:id/resume — Resume a paused workflow via n8n API
workflowsRouter.post('/:id/resume', async (_req, res) => {
    // TODO: Call N8nService.resumeWorkflow(n8n_workflow_id)
    res.status(501).json({ message: 'Not implemented yet' });
});
