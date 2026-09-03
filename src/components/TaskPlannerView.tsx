import React, { useState } from "react";
import {
  CalendarCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Tag,
  CheckSquare,
  Square,
} from "lucide-react";
import { PlannerTask, ApplicationPlan } from "../types";
import { generateTaskPlan } from "../services/api";

interface TaskPlannerViewProps {
  tasks: PlannerTask[];
  setTasks: React.Dispatch<React.SetStateAction<PlannerTask[]>>;
}

export const TaskPlannerView: React.FC<TaskPlannerViewProps> = ({ tasks, setTasks }) => {
  // Plan inputs
  const [careerGoal, setCareerGoal] = useState("Land an entry-level Cybersecurity Analyst role");
  const [targetJob, setTargetJob] = useState("Junior Cybersecurity Analyst");
  const [deadline, setDeadline] = useState("Within 4 weeks");
  const [availableHours, setAvailableHours] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom task form
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<PlannerTask["category"]>("CV");
  const [newTaskPriority, setNewTaskPriority] = useState<PlannerTask["priority"]>("Medium");
  const [newTaskDuration, setNewTaskDuration] = useState<number>(45);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const plan = await generateTaskPlan({
        careerGoal,
        targetJob,
        deadline,
        availableHours,
      });

      if (plan.tasks && plan.tasks.length > 0) {
        setTasks(plan.tasks);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate task plan.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: PlannerTask = {
      id: "task-" + Date.now(),
      title: newTaskTitle.trim(),
      dayOrPhase: "Active Week",
      durationMinutes: newTaskDuration,
      priority: newTaskPriority,
      category: newTaskCategory,
      description: "Custom user task",
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const getPriorityBadge = (p: PlannerTask["priority"]) => {
    if (p === "High") return "bg-rose-50 text-rose-700 border-rose-200";
    if (p === "Medium") return "bg-amber-50 text-amber-800 border-amber-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-6 h-6 text-blue-600" />
              Application Task Planner &amp; Strategy
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Interactive Execution Roadmap
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Transform high-level career goals into realistic daily milestones with estimated time commitments.
          </p>
        </div>

        {/* Progress gauge */}
        <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-4 text-xs shadow-xs">
          <div>
            <div className="text-slate-500 text-[11px] font-semibold uppercase">Progress</div>
            <div className="font-bold text-slate-900 text-base">
              {completedCount} / {tasks.length} Done
            </div>
          </div>
          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Strategy Generator Settings */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          Generate Realistic Application Strategy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Career Goal</label>
            <input
              type="text"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1">Target Vacancy Title</label>
            <input
              type="text"
              value={targetJob}
              onChange={(e) => setTargetJob(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1">Target Timeline</label>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1">Available Hours / Week</label>
            <input
              type="number"
              min={1}
              max={60}
              value={availableHours}
              onChange={(e) => setAvailableHours(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="button"
            disabled={loading}
            onClick={handleGeneratePlan}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-2 transition"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Scheduling Milestones with Gemini...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate Tailored Roadmap
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Add Custom Task Form */}
      <form
        onSubmit={handleAddCustomTask}
        className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center gap-3 text-xs shadow-xs"
      >
        <div className="flex-1 w-full">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add an ad-hoc action item (e.g. Schedule mock interview with mentor)..."
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value as any)}
            className="px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
          >
            <option value="CV">CV</option>
            <option value="Search">Search</option>
            <option value="Application">Application</option>
            <option value="Interview">Interview</option>
            <option value="Skills">Skills</option>
          </select>

          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as any)}
            className="px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg flex items-center gap-1 shrink-0 shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>
      </form>

      {/* Interactive Task List */}
      <div className="space-y-2.5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-xl border transition flex items-start justify-between gap-3 shadow-xs ${
              task.completed
                ? "bg-slate-50/70 border-slate-200 opacity-60"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-3 flex-1">
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className="mt-0.5 text-slate-400 hover:text-slate-600 transition"
              >
                {task.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      task.completed ? "line-through text-slate-400" : "text-slate-900"
                    }`}
                  >
                    {task.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getPriorityBadge(
                      task.priority
                    )}`}
                  >
                    {task.priority} Priority
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-slate-100 text-slate-700">
                    {task.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ~{task.durationMinutes} min
                  </span>
                  <span>•</span>
                  <span>{task.dayOrPhase}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeTask(task.id)}
              className="text-slate-400 hover:text-red-500 p-1"
              aria-label="Remove task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
            <CalendarCheck className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800">No tasks currently scheduled</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click 'Generate Tailored Roadmap' above to let CareerBridge AI synthesize a weekly step-by-step application schedule.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
