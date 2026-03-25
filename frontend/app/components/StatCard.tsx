'use client';

interface Props {
    label: string;
    value: string | number;
    sub?: string;
    icon: string;          // emoji / SVG string
    accentColor?: string;  // CSS custom-property name, e.g. 'var(--success)'
    trend?: number;        // positive = up (green), negative = down (red)
    animDelay?: number;    // stagger in ms
}

export function StatCard({ label, value, sub, icon, accentColor, trend, animDelay = 0 }: Props) {
    const trendColor = trend == null ? '' : trend >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]';
    const trendArrow = trend == null ? '' : trend >= 0 ? '↑' : '↓';

    return (
        <div
            className="card card-hover p-6 flex flex-col gap-4 fade-in"
            style={{ animationDelay: `${animDelay}ms` }}
        >
            {/* Header row */}
            <div className="flex items-start justify-between">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: accentColor ? `${accentColor}1a` : 'var(--bg-elevated)' }}
                >
                    {icon}
                </div>
                {trend != null && (
                    <span className={`text-xs font-semibold ${trendColor}`}>
                        {trendArrow} {Math.abs(trend)}%
                    </span>
                )}
            </div>

            {/* Value */}
            <div>
                <p className="text-[var(--text-sub)] text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
                <p
                    className="text-3xl font-bold tabular-nums"
                    style={{ color: accentColor ?? 'var(--text)' }}
                >
                    {value}
                </p>
                {sub && <p className="text-[var(--text-sub)] text-xs mt-1">{sub}</p>}
            </div>
        </div>
    );
}
