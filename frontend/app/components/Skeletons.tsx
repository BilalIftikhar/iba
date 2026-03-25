// Server-safe skeleton card — no 'use client' needed
export function SkeletonCard() {
    return (
        <div className="card p-6 space-y-3">
            <div className="skeleton h-3 w-1/3 rounded" />
            <div className="skeleton h-8 w-1/2 rounded" />
            <div className="skeleton h-3 w-2/3 rounded" />
        </div>
    );
}

export function SkeletonRow() {
    return (
        <tr>
            {[1, 2, 3, 4, 5].map((i) => (
                <td key={i} className="px-4 py-3">
                    <div className="skeleton h-3 rounded" style={{ width: `${50 + i * 8}%` }} />
                </td>
            ))}
        </tr>
    );
}
