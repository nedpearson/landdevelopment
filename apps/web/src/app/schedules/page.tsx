"use client";

import React, { useState } from "react";
import { Plus, CheckCircle, X, Clock, CalendarDays, AlertTriangle } from "lucide-react";

type ScheduleTask = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: "Not Started" | "In Progress" | "Complete" | "Delayed";
  responsible: string;
  isCritical: boolean;
};

const initialTasks: ScheduleTask[] = [
  { id: "1", name: "Land Acquisition", startDate: "2024-01-01", endDate: "2024-02-15", duration: 45, status: "Complete", responsible: "Acquisitions Team", isCritical: true },
  { id: "2", name: "Feasibility Study", startDate: "2024-01-15", endDate: "2024-02-28", duration: 44, status: "Complete", responsible: "Civil Engineer", isCritical: false },
  { id: "3", name: "Entitlements / Zoning", startDate: "2024-03-01", endDate: "2024-08-30", duration: 182, status: "In Progress", responsible: "Land Use Attorney", isCritical: true },
  { id: "4", name: "Schematic Design", startDate: "2024-03-15", endDate: "2024-05-15", duration: 61, status: "In Progress", responsible: "Architect", isCritical: false },
  { id: "5", name: "Construction Docs", startDate: "2024-05-16", endDate: "2024-09-15", duration: 122, status: "Not Started", responsible: "Architect", isCritical: true },
  { id: "6", name: "Permitting", startDate: "2024-09-16", endDate: "2024-11-30", duration: 75, status: "Not Started", responsible: "Expediter", isCritical: true },
  { id: "7", name: "Site Mobilization", startDate: "2024-12-01", endDate: "2024-12-15", duration: 14, status: "Not Started", responsible: "General Contractor", isCritical: true },
];

export default function SchedulesPage() {
  const [tasks, setTasks] = useState<ScheduleTask[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

    const newTask: ScheduleTask = {
      id: Math.random().toString(36).substring(7),
      name: formData.get("name") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      duration: duration > 0 ? duration : 1,
      status: formData.get("status") as any,
      responsible: formData.get("responsible") as string,
      isCritical: formData.get("isCritical") === "true",
    };
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
    showToast("Task added to schedule");
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      "Not Started": "bg-slate-700 text-slate-300",
      "In Progress": "bg-sky-900/50 text-sky-400 border border-sky-700/50",
      "Complete": "bg-emerald-900/50 text-emerald-400 border border-emerald-700/50",
      "Delayed": "bg-red-900/50 text-red-400 border border-red-700/50",
    }[status] || "bg-slate-700 text-slate-300";

    return <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${styles}`}>{status}</span>;
  };

  // Mock utility for Gantt offsets (assuming timeline is Jan - Dec 2024)
  const getGanttStyle = (startDate: string, duration: number) => {
    const start = new Date(startDate);
    const yearStart = new Date("2024-01-01");
    const dayOfYear = Math.floor((start.getTime() - yearStart.getTime()) / (1000 * 3600 * 24));
    
    // Scale: 365 days = 100% width
    const left = Math.max(0, (dayOfYear / 365) * 100);
    const width = Math.min(100 - left, (duration / 365) * 100);
    
    return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Project Schedules</h1>
          <p className="text-slate-400 mt-1">Track timelines, critical paths, and task assignments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm mb-6 flex flex-col md:flex-row">
        
        {/* Task List (Left Side) */}
        <div className="w-full md:w-[450px] border-r border-slate-700 overflow-x-auto flex-shrink-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700 text-slate-300 text-sm">
                <th className="p-3 font-semibold w-8"></th>
                <th className="p-3 font-semibold">Task & Details</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-sm">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-700/30 transition h-16">
                  <td className="p-3 text-center">
                    {task.isCritical && <AlertTriangle size={14} className="text-red-500 mx-auto" title="Critical Path" />}
                  </td>
                  <td className="p-3">
                    <div className={`font-medium ${task.isCritical ? 'text-red-400' : 'text-white'}`}>{task.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                      <CalendarDays size={12} /> {task.startDate} ({task.duration}d) • {task.responsible}
                    </div>
                  </td>
                  <td className="p-3">
                    {getStatusBadge(task.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gantt Chart (Right Side) */}
        <div className="flex-1 overflow-x-auto bg-slate-900/50 relative">
          {/* Months Header */}
          <div className="flex border-b border-slate-700 bg-slate-900 min-w-[800px]">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
              <div key={month} className="flex-1 text-center text-xs font-semibold text-slate-400 py-3 border-r border-slate-700/30">
                {month}
              </div>
            ))}
          </div>
          
          {/* Timeline Grid Lines */}
          <div className="absolute top-10 bottom-0 left-0 right-0 flex pointer-events-none min-w-[800px]">
            {[...Array(12)].map((_, i) => (
              <div key={`grid-${i}`} className="flex-1 border-r border-slate-700/20" />
            ))}
          </div>

          {/* Gantt Bars */}
          <div className="divide-y divide-slate-700/10 min-w-[800px]">
            {tasks.map((task) => (
              <div key={`gantt-${task.id}`} className="h-16 relative flex items-center px-2 group">
                <div 
                  className={`absolute h-6 rounded shadow-sm flex items-center px-2 text-[10px] font-bold text-white/90 overflow-hidden ${task.isCritical ? 'bg-red-600/80 hover:bg-red-500' : task.status === 'Complete' ? 'bg-emerald-600/80' : 'bg-sky-600/80 hover:bg-sky-500'}`}
                  style={getGanttStyle(task.startDate, task.duration)}
                >
                  <span className="truncate drop-shadow-md">{task.name}</span>
                </div>
                {/* Background hover effect syncs with row */}
                <div className="absolute inset-0 bg-transparent group-hover:bg-slate-700/10 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Add Schedule Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Task Name</label>
                  <input required name="name" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-lime-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
                    <input required name="startDate" type="date" defaultValue="2024-06-01" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-lime-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">End Date</label>
                    <input required name="endDate" type="date" defaultValue="2024-06-30" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-lime-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Responsible Party</label>
                  <input required name="responsible" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-lime-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select required name="status" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-lime-500 focus:outline-none">
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Complete</option>
                    <option>Delayed</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                  <input type="checkbox" id="isCritical" name="isCritical" value="true" className="w-4 h-4 accent-lime-600 rounded" />
                  <label htmlFor="isCritical" className="text-sm font-medium text-slate-300">Mark as Critical Path Item</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition">Cancel</button>
                <button type="submit" className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-2 rounded-lg transition">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-lime-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
