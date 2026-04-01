import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Wrench,
  Save,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Zap,
  Waves,
} from "lucide-react";
import { format } from "date-fns";
import useUser from "@/utils/useUser";

export default function MaintenanceLogPage() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [logType, setLogType] = useState("maintenance"); // "maintenance" or "weekly"

  const [maintenanceForm, setMaintenanceForm] = useState({
    log_date: format(new Date(), "yyyy-MM-dd"),
    log_time: format(new Date(), "HH:mm"),
    action: "",
    notes: "",
    filter_changed: false,
  });

  const [weeklyForm, setWeeklyForm] = useState({
    log_date: format(new Date(), "yyyy-MM-dd"),
    log_time: format(new Date(), "HH:mm"),
    total_alkalinity: "",
    shock_added: "",
    filter_cleaned: false,
    notes: "",
  });

  // Reset forms when component mounts
  useEffect(() => {
    setMaintenanceForm({
      log_date: format(new Date(), "yyyy-MM-dd"),
      log_time: format(new Date(), "HH:mm"),
      action: "",
      notes: "",
      filter_changed: false,
    });
    setWeeklyForm({
      log_date: format(new Date(), "yyyy-MM-dd"),
      log_time: format(new Date(), "HH:mm"),
      total_alkalinity: "",
      shock_added: "",
      filter_cleaned: false,
      notes: "",
    });
  }, []);

  const maintenanceMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/maintenance-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save maintenance log");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-logs"] });
      window.location.href = "/";
    },
  });

  const weeklyMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/weekly-checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save weekly check");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly-checks"] });
      window.location.href = "/";
    },
  });

  const handleMaintenanceSubmit = (e) => {
    e.preventDefault();
    maintenanceMutation.mutate(maintenanceForm);
  };

  const handleWeeklySubmit = (e) => {
    e.preventDefault();
    weeklyMutation.mutate({
      ...weeklyForm,
      total_alkalinity: parseFloat(weeklyForm.total_alkalinity) || 0,
      shock_added: parseFloat(weeklyForm.shock_added) || 0,
    });
  };

  if (!user) return null;

  const commonActions = [
    "Water Change",
    "Filter Replacement",
    "Deep Clean",
    "Cover Treatment",
    "Jet Cleaning",
    "System Flush",
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <a
          href="/"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </a>
        <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
      </div>

      {/* Tab Switcher */}
      <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setLogType("maintenance")}
          className={`flex-1 py-3 rounded-2xl font-semibold transition-all ${
            logType === "maintenance"
              ? "bg-orange-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Wrench size={18} />
            <span>Maintenance Log</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setLogType("weekly")}
          className={`flex-1 py-3 rounded-2xl font-semibold transition-all ${
            logType === "weekly"
              ? "bg-purple-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Calendar size={18} />
            <span>Weekly Check</span>
          </div>
        </button>
      </div>

      {/* Maintenance Form */}
      {logType === "maintenance" && (
        <form onSubmit={handleMaintenanceSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={maintenanceForm.log_date}
                  onChange={(e) =>
                    setMaintenanceForm({
                      ...maintenanceForm,
                      log_date: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  value={maintenanceForm.log_time}
                  onChange={(e) =>
                    setMaintenanceForm({
                      ...maintenanceForm,
                      log_time: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Action Performed
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {commonActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() =>
                      setMaintenanceForm({ ...maintenanceForm, action })
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      maintenanceForm.action === action
                        ? "bg-orange-600 text-white shadow-md"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or type custom action..."
                value={maintenanceForm.action}
                onChange={(e) =>
                  setMaintenanceForm({
                    ...maintenanceForm,
                    action: e.target.value,
                  })
                }
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <input
                type="checkbox"
                id="filter_changed"
                checked={maintenanceForm.filter_changed}
                onChange={(e) =>
                  setMaintenanceForm({
                    ...maintenanceForm,
                    filter_changed: e.target.checked,
                  })
                }
                className="w-6 h-6 rounded-lg text-orange-600 focus:ring-orange-500 border-gray-300"
              />
              <label
                htmlFor="filter_changed"
                className="font-bold text-orange-900 cursor-pointer"
              >
                Filter Replaced with New One
              </label>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-2">
            <label className="text-sm font-semibold text-gray-700">Notes</label>
            <textarea
              placeholder="Details about the maintenance..."
              value={maintenanceForm.notes}
              onChange={(e) =>
                setMaintenanceForm({
                  ...maintenanceForm,
                  notes: e.target.value,
                })
              }
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none min-h-[100px]"
            />
          </div>

          <button
            type="submit"
            disabled={maintenanceMutation.isPending}
            className="w-full bg-orange-600 text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {maintenanceMutation.isPending
              ? "Saving..."
              : "Save Maintenance Log"}
          </button>
        </form>
      )}

      {/* Weekly Check Form */}
      {logType === "weekly" && (
        <form onSubmit={handleWeeklySubmit} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={weeklyForm.log_date}
                  onChange={(e) =>
                    setWeeklyForm({ ...weeklyForm, log_date: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  value={weeklyForm.log_time}
                  onChange={(e) =>
                    setWeeklyForm({ ...weeklyForm, log_time: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Waves size={16} className="text-purple-600" />
                  Total Alkalinity (ppm)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={weeklyForm.total_alkalinity}
                  onChange={(e) =>
                    setWeeklyForm({
                      ...weeklyForm,
                      total_alkalinity: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Zap size={16} className="text-purple-600" />
                  Shock Added (g/ml)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={weeklyForm.shock_added}
                  onChange={(e) =>
                    setWeeklyForm({
                      ...weeklyForm,
                      shock_added: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl border border-purple-100">
              <input
                type="checkbox"
                id="filter_cleaned"
                checked={weeklyForm.filter_cleaned}
                onChange={(e) =>
                  setWeeklyForm({
                    ...weeklyForm,
                    filter_cleaned: e.target.checked,
                  })
                }
                className="w-6 h-6 rounded-lg text-purple-600 focus:ring-purple-500 border-gray-300"
              />
              <label
                htmlFor="filter_cleaned"
                className="font-bold text-purple-900 cursor-pointer"
              >
                Filter Cleaned & Rinsed
              </label>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-2">
            <label className="text-sm font-semibold text-gray-700">Notes</label>
            <textarea
              placeholder="Any observations..."
              value={weeklyForm.notes}
              onChange={(e) =>
                setWeeklyForm({ ...weeklyForm, notes: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none min-h-[100px]"
            />
          </div>

          <button
            type="submit"
            disabled={weeklyMutation.isPending}
            className="w-full bg-purple-600 text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {weeklyMutation.isPending ? "Saving..." : "Save Weekly Check"}
          </button>
        </form>
      )}
    </div>
  );
}
