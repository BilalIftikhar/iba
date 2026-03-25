'use client';

const STATUS_CONFIG = {
    success: {
        label: 'Success',
        dot: 'bg-[var(--success)]',
        pill: 'bg-[var(--success-dim)] text-[var(--success)] border border-[var(--success)]/20',
    },
    error: {
        label: 'Failed',
        dot: 'bg-[var(--danger)]',
        pill: 'bg-[var(--danger-dim)] text-[var(--danger)] border border-[var(--danger)]/20',
    },
    running: {
        label: 'Running',
        dot: 'bg-[var(--warning)] animate-pulse',
        pill: 'bg-[var(--warning-dim)] text-[var(--warning)] border border-[var(--warning)]/20',
    },
    waiting: {
        label: 'Waiting',
        dot: 'bg-[var(--muted)]',
        pill: 'bg-white/5 text-[var(--muted)] border border-white/10',
    },
    unknown: {
        label: 'Unknown',
        dot: 'bg-[var(--muted)]',
        pill: 'bg-white/5 text-[var(--muted)] border border-white/10',
    },
} as const;

export function RunStatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.unknown;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}
