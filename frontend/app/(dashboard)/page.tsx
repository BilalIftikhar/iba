import { Suspense } from 'react';
import { fetchStatsSummary, fetchRuns } from '../lib/api';
import type { StatsSummary, RunsResponse } from '../lib/types';
import { DashboardClient } from '../components/DashboardClient';

export const metadata = {
  title: 'Dashboard — IBA Automation Intelligence',
  description: 'Overview of your automations, executions and ROI metrics.',
};

export const revalidate = 30;
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let summary: StatsSummary | null = null;
  let initialRuns: RunsResponse = { runs: [], nextCursor: null };

  try {
    [summary, initialRuns] = await Promise.all([
      fetchStatsSummary(),
      fetchRuns({ limit: 10 }),
    ]);
  } catch (err) {
    console.error('[Dashboard] fetch error:', err);
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient summary={summary} initialRuns={initialRuns} />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-white rounded-2xl border border-slate-100" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="h-64 bg-white rounded-2xl border border-slate-100" />
        <div className="h-64 bg-white rounded-2xl border border-slate-100" />
      </div>
      <div className="h-80 bg-white rounded-2xl border border-slate-100" />
    </div>
  );
}
