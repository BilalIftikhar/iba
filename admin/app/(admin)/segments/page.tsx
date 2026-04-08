'use client';

export default function SegmentsPage() {
    return (
        <div className="pb-6 fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Customer Segments</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Group customers by behaviour, plan, or custom criteria</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary font-bold text-slate-600">
                        + New Message
                    </button>
                    <button className="btn btn-primary font-bold shadow-sm">
                        + Create Booking
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total Segments</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">6</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Largest Segment</h3>
                    <div className="text-2xl font-black text-slate-800 tracking-tight mb-1">High Value</div>
                    <div className="text-xs font-semibold text-emerald-500">4 customers</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Customers Tagged</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">6</div>
                    <div className="text-xs font-semibold text-emerald-500">100% coverage</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Coupons Tied</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">2</div>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-bold text-slate-800">All Segments</h2>
                <button className="btn btn-primary btn-sm font-bold shadow-sm">
                    + New Segment
                </button>
            </div>

            <div className="card overflow-hidden border border-slate-200">
                <div className="divide-y divide-slate-100">
                    {/* High Value */}
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 bg-white hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start gap-4 w-full md:w-1/2">
                            <span className="text-[#3b82f6] text-xl mt-0.5">💎</span>
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-800">High Value</h3>
                                <p className="text-[13px] font-medium text-slate-500 mt-0.5">Customers with 2+ bookings or Enterprise/Pro plan</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[16px] font-bold text-slate-800">4</span>
                            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">customers</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[12px] font-bold text-emerald-600">1 coupon</span>
                            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">assigned</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-white bg-slate-50 shadow-sm transition-all">View</button>
                            <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-white bg-slate-50 shadow-sm transition-all">Edit</button>
                        </div>
                    </div>

                    {/* Enterprise Clients */}
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 bg-white hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start gap-4 w-full md:w-1/2">
                            <span className="text-[#8b5cf6] text-xl mt-0.5">🏢</span>
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-800">Enterprise Clients</h3>
                                <p className="text-[13px] font-medium text-slate-500 mt-0.5">All customers on the Enterprise plan</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[16px] font-bold text-slate-800">2</span>
                            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">customers</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[12px] font-bold text-emerald-600">1 coupon</span>
                            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">assigned</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-white bg-slate-50 shadow-sm transition-all">View</button>
                            <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-white bg-slate-50 shadow-sm transition-all">Edit</button>
                        </div>
                    </div>

                    {/* At Risk */}
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 bg-white hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start gap-4 w-full md:w-1/2">
                            <span className="text-red-500 text-xl mt-0.5">⚠️</span>
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-800">At Risk</h3>
                                <p className="text-[13px] font-medium text-slate-500 mt-0.5">Past due, inactive for 30+ days, or cancellation requested</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[16px] font-bold text-slate-800">1</span>
                            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">customers</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[12px] font-bold text-slate-400">0 coupons</span>
                            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">assigned</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-white bg-slate-50 shadow-sm transition-all">View</button>
                            <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-white bg-slate-50 shadow-sm transition-all">Edit</button>
                        </div>
                    </div>

                    {/* New Signups */}
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 bg-white hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start gap-4 w-full md:w-1/2">
                            <span className="text-[#10b981] text-xl mt-0.5">🆕</span>
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-800">New Signups</h3>
                                <p className="text-[13px] font-medium text-slate-500 mt-0.5">Joined in the last 30 days</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[16px] font-bold text-slate-800">2</span>
                            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">customers</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[12px] font-bold text-emerald-600">1 coupon</span>
                            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">assigned</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-white bg-slate-50 shadow-sm transition-all">View</button>
                            <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-white bg-slate-50 shadow-sm transition-all">Edit</button>
                        </div>
                    </div>
                    
                    {/* Power Users */}
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 bg-white hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start gap-4 w-full md:w-1/2">
                            <span className="text-amber-500 text-xl mt-0.5">⚡</span>
                            <div>
                                <h3 className="text-[15px] font-bold text-slate-800">Power Users</h3>
                                <p className="text-[13px] font-medium text-slate-500 mt-0.5">Using 70%+ of their automation quota</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[16px] font-bold text-slate-800">2</span>
                            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">customers</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-[12px] font-bold text-slate-400">0 coupons</span>
                            <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">assigned</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-white bg-slate-50 shadow-sm transition-all">View</button>
                            <button className="text-[12px] font-bold border border-slate-200 px-4 py-1.5 rounded-lg text-slate-600 hover:bg-white bg-slate-50 shadow-sm transition-all">Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
