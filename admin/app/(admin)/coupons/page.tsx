'use client';

export default function CouponsPage() {
    return (
        <div className="pb-6 fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">Coupons & Discounts</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Create and manage discount codes for customers</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary font-bold text-slate-600 bg-white">
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
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total Coupons</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">6</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Active</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">4</div>
                    <div className="text-xs font-semibold text-emerald-500">2 expire soon</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total Uses</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">18</div>
                </div>
                <div className="card p-5">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Discount Given</h3>
                    <div className="text-3xl font-black text-slate-800 tracking-tight mb-2">$1.2k</div>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative w-64 text-slate-500">
                    <input type="text" placeholder="Search coupons..." className="pl-4 py-2 pr-4 text-[13.5px] w-full outline-none border border-slate-200 rounded-lg focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/10 transition-all font-medium bg-white" />
                </div>
                
                <select className="border border-slate-200 rounded-lg py-2 px-4 text-[13.5px] font-medium text-slate-600 hover:border-slate-300 outline-none bg-white pr-8">
                    <option>All Statuses</option>
                </select>
                
                <select className="border border-slate-200 rounded-lg py-2 px-4 text-[13.5px] font-medium text-slate-600 hover:border-slate-300 outline-none bg-white pr-8">
                    <option>All Types</option>
                </select>

                <select className="border border-slate-200 rounded-lg py-2 px-4 text-[13.5px] font-medium text-slate-600 hover:border-slate-300 outline-none bg-white pr-8">
                    <option>All Segments</option>
                </select>
            </div>

            {/* Coupons Table */}
            <div className="card overflow-hidden border border-slate-200 mb-8">
                <div className="p-5 border-b border-slate-100 bg-white flex justify-between items-center">
                    <div>
                        <h2 className="text-[16px] font-bold text-slate-800">Coupons</h2>
                        <p className="text-[13px] text-slate-500 font-medium">Create and assign discount codes</p>
                    </div>
                    <button className="bg-[#3b82f6] hover:bg-blue-600 text-white text-[13px] font-bold px-4 py-2 rounded-lg shadow-sm transition-colors">
                        + New Coupon
                    </button>
                </div>
                <div className="overflow-x-auto bg-white">
                    <table className="w-full text-left bg-white">
                        <thead>
                            <tr>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Code</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Discount</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Type</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Assigned To</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Valid Period</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Uses</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Status</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-slate-100">
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">WELCOME30</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[14px] font-bold text-emerald-500">30%</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[12px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">Percentage</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] font-medium text-slate-700">All customers</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] text-slate-600">Apr 1 - Apr 30, 2026</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] font-medium text-slate-700">7 / 50</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[12px] font-bold text-emerald-500">Active</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50">Edit</button>
                                        <button className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50">Usage</button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="border-t border-slate-100">
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">VIP100OFF</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[14px] font-bold text-emerald-500">$100</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[12px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-md">Fixed</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] font-medium text-slate-700">sarah@acmecorp.ae</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] text-slate-600">Mar 1 - Jun 30, 2026</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] font-medium text-slate-700">1 / 1</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[12px] font-bold text-amber-500">Used</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50">Edit</button>
                                        <button className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50">Usage</button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="border-t border-slate-100">
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">LAUNCH50</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[14px] font-bold text-emerald-500">50%</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[12px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">Percentage</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] font-medium text-slate-700">All customers</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] text-slate-600">Mar 1 - Mar 31, 2026</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] font-medium text-slate-700">9 / 100</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[12px] font-bold text-rose-500 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Expired</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50">Edit</button>
                                        <button className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50">Usage</button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="border-t border-slate-100">
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">ENT200</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[14px] font-bold text-emerald-500">$200</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[12px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-md">Fixed</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] font-medium text-slate-700">mk@techbridge.io</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] text-slate-600">Apr 1 - Dec 31, 2026</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[13px] font-medium text-slate-700">0 / 1</span></td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className="text-[12px] font-bold text-emerald-500">Active</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50">Edit</button>
                                        <button className="text-[12px] font-bold border border-slate-200 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50">Usage</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Coupon Usage Table */}
            <div className="card overflow-hidden border border-slate-200">
                <div className="p-5 border-b border-slate-100 bg-white">
                    <h2 className="text-[16px] font-bold text-slate-800">Recent Coupon Usage</h2>
                </div>
                <div className="overflow-x-auto bg-white">
                    <table className="w-full text-left bg-white">
                        <thead>
                            <tr>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Code</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Used By (Email)</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Discount Applied</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Order</th>
                                <th className="pt-4 pb-3 px-6 text-[10px] font-bold tracking-widest text-slate-400 uppercase bg-white border-b-0">Used At</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-slate-100">
                                <td className="px-6 py-4"><span className="text-[13px] font-mono font-medium text-slate-700">WELCOME30</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-semibold text-slate-800">sarah@acmecorp.ae</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-bold text-emerald-500">-$23.70</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-mono font-bold text-slate-500">#BOOK-2051</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-medium text-slate-700">Mar 18, 2026</span></td>
                            </tr>
                            <tr className="border-t border-slate-100">
                                <td className="px-6 py-4"><span className="text-[13px] font-mono font-medium text-slate-700">VIP100OFF</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-semibold text-slate-800">sarah@acmecorp.ae</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-bold text-emerald-500">-$100.00</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-mono font-bold text-slate-500">#BOOK-2045</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-medium text-slate-700">Mar 1, 2026</span></td>
                            </tr>
                            <tr className="border-t border-slate-100">
                                <td className="px-6 py-4"><span className="text-[13px] font-mono font-medium text-slate-700">WELCOME30</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-semibold text-slate-800">james@finovate.sg</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-bold text-emerald-500">-$23.70</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-mono font-bold text-slate-500">#BOOK-2048</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-medium text-slate-700">Mar 5, 2026</span></td>
                            </tr>
                            <tr className="border-t border-slate-100">
                                <td className="px-6 py-4"><span className="text-[13px] font-mono font-medium text-slate-700">LAUNCH50</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-semibold text-slate-800">lena@startupnest.co</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-bold text-emerald-500">-$14.50</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-mono font-bold text-slate-500">#BOOK-2049</span></td>
                                <td className="px-6 py-4"><span className="text-[13px] font-medium text-slate-700">Feb 28, 2026</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
