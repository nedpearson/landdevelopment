"use client";

import React, { useState } from "react";
import { Plus, Search, DollarSign, Download, CheckCircle, X, PieChart } from "lucide-react";

type BudgetItem = {
  id: string;
  category: "Land" | "Hard Costs" | "Soft Costs" | "Financing" | "Contingency";
  description: string;
  budgetAmount: number;
  committed: number;
  spent: number;
};

const initialBudgetItems: BudgetItem[] = [
  { id: "1", category: "Land", description: "Land Acquisition", budgetAmount: 2000000, committed: 2000000, spent: 2000000 },
  { id: "2", category: "Soft Costs", description: "Architectural & Engineering", budgetAmount: 450000, committed: 450000, spent: 125000 },
  { id: "3", category: "Soft Costs", description: "Legal & Entitlements", budgetAmount: 150000, committed: 100000, spent: 45000 },
  { id: "4", category: "Hard Costs", description: "Site Work & Grading", budgetAmount: 1200000, committed: 1200000, spent: 400000 },
  { id: "5", category: "Hard Costs", description: "Vertical Construction", budgetAmount: 8500000, committed: 0, spent: 0 },
  { id: "6", category: "Financing", description: "Construction Interest", budgetAmount: 600000, committed: 600000, spent: 0 },
  { id: "7", category: "Contingency", description: "Project Contingency (5%)", budgetAmount: 645000, committed: 0, spent: 0 },
];

export default function BudgetsPage() {
  const [items, setItems] = useState<BudgetItem[]>(initialBudgetItems);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredItems = items.filter(i =>
    i.description.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: BudgetItem = {
      id: Math.random().toString(36).substring(7),
      category: formData.get("category") as any,
      description: formData.get("description") as string,
      budgetAmount: Number(formData.get("budgetAmount")),
      committed: Number(formData.get("committed")) || 0,
      spent: Number(formData.get("spent")) || 0,
    };
    setItems([...items, newItem]);
    setIsModalOpen(false);
    showToast("Budget line item added");
  };

  const totals = items.reduce((acc, item) => ({
    budget: acc.budget + item.budgetAmount,
    committed: acc.committed + item.committed,
    spent: acc.spent + item.spent,
  }), { budget: 0, committed: 0, spent: 0 });

  const getCategoryColor = (cat: string) => {
    const colors = {
      "Land": "text-orange-400 bg-orange-400/10 border-orange-400/20",
      "Hard Costs": "text-blue-400 bg-blue-400/10 border-blue-400/20",
      "Soft Costs": "text-purple-400 bg-purple-400/10 border-purple-400/20",
      "Financing": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      "Contingency": "text-slate-400 bg-slate-400/10 border-slate-400/20",
    };
    return colors[cat as keyof typeof colors] || "text-slate-400 bg-slate-400/10 border-slate-400/20";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Development Budgets</h1>
          <p className="text-slate-400 mt-1">Track costs, commitments, and actual spend</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => showToast("Budget exported to CSV")}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
          >
            <Download size={20} />
            <span>Export</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            <span>Add Line Item</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-sm font-medium mb-1">Total Budget</div>
          <div className="text-3xl font-bold text-white">{formatCurrency(totals.budget)}</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-sm font-medium mb-1">Total Committed</div>
          <div className="text-3xl font-bold text-orange-400">{formatCurrency(totals.committed)}</div>
          <div className="text-xs text-slate-500 mt-1">{((totals.committed / totals.budget) * 100).toFixed(1)}% of Budget</div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
          <div className="text-slate-400 text-sm font-medium mb-1">Total Spent</div>
          <div className="text-3xl font-bold text-sky-400">{formatCurrency(totals.spent)}</div>
          <div className="text-xs text-slate-500 mt-1">{((totals.spent / totals.budget) * 100).toFixed(1)}% of Budget</div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Filter budget items..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700 text-slate-300 text-sm">
                <th className="p-4 font-semibold">Category / Description</th>
                <th className="p-4 font-semibold text-right">Budget</th>
                <th className="p-4 font-semibold text-right">Committed</th>
                <th className="p-4 font-semibold text-right">Spent</th>
                <th className="p-4 font-semibold text-right">Variance</th>
                <th className="p-4 font-semibold w-48">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-sm">
              {filteredItems.map((item) => {
                const variance = item.budgetAmount - item.committed;
                const percentSpent = item.budgetAmount > 0 ? (item.spent / item.budgetAmount) * 100 : 0;
                
                return (
                  <tr key={item.id} className="hover:bg-slate-700/30 transition">
                    <td className="p-4">
                      <div className="font-medium text-white">{item.description}</div>
                      <div className="mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium text-slate-200">{formatCurrency(item.budgetAmount)}</td>
                    <td className="p-4 text-right text-orange-200">{formatCurrency(item.committed)}</td>
                    <td className="p-4 text-right text-sky-200">{formatCurrency(item.spent)}</td>
                    <td className="p-4 text-right">
                      <span className={variance < 0 ? "text-red-400 font-medium" : "text-emerald-400 font-medium"}>
                        {formatCurrency(variance)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-sky-500 rounded-full"
                            style={{ width: `${Math.min(100, percentSpent)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-8 text-right">{percentSpent.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length > 0 && (
                <tr className="bg-slate-900/80 font-bold border-t-2 border-slate-600">
                  <td className="p-4 text-white">TOTAL</td>
                  <td className="p-4 text-right text-white">{formatCurrency(totals.budget)}</td>
                  <td className="p-4 text-right text-orange-400">{formatCurrency(totals.committed)}</td>
                  <td className="p-4 text-right text-sky-400">{formatCurrency(totals.spent)}</td>
                  <td className="p-4 text-right text-emerald-400">{formatCurrency(totals.budget - totals.committed)}</td>
                  <td className="p-4"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Add Budget Line Item</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <select required name="category" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:outline-none">
                    <option>Land</option>
                    <option>Hard Costs</option>
                    <option>Soft Costs</option>
                    <option>Financing</option>
                    <option>Contingency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <input required name="description" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Budget Amount ($)</label>
                  <input required name="budgetAmount" type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Committed ($)</label>
                    <input name="committed" type="number" defaultValue="0" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Spent ($)</label>
                    <input name="spent" type="number" defaultValue="0" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-orange-500 focus:outline-none" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition">Cancel</button>
                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition">Save Line Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-orange-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
