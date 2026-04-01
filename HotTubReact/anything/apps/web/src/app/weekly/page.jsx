import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Save, ArrowLeft, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import useUser from "@/utils/useUser";

export default function WeeklyCheckPage() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    log_date: format(new Date(), "yyyy-MM-dd"),
    log_time: format(new Date(), "HH:mm"),
    total_alkalinity: "",
    shock_added: "",
    filter_cleaned: false,
    notes: "",
  });

  // Reset form when component mounts
  useEffect(() => {
    setFormData({
      log_date: format(new Date(), "yyyy-MM-dd"),
      log_time: format(new Date(), "HH:mm"),
      total_alkalinity: "",
      shock_added: "",
      filter_cleaned: false,
      notes: "",
    });
  }, []);

  const mutation = useMutation({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      total_alkalinity: parseFloat(formData.total_alkalinity) || 0,
      shock_added: parseFloat(formData.shock_added) || 0,
      alkalinity_up_added: parseFloat(formData.alkalinity_up_added) || 0,
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <a
          href="/"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </a>
        <h1 className="text-2xl font-bold text-gray-900">Weekly Maintenance</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={formData.log_date}
                onChange={(e) =>
                  setFormData({ ...formData, log_date: e.target.value })
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
                value={formData.log_time}
                onChange={(e) =>
                  setFormData({ ...formData, log_time: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Total Alkalinity (ppm)
              </label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={formData.total_alkalinity}
                onChange={(e) =>
                  setFormData({ ...formData, total_alkalinity: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Shock Added (g/ml)
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.shock_added}
                onChange={(e) =>
                  setFormData({ ...formData, shock_added: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl border border-purple-100">
            <input
              type="checkbox"
              id="filter_cleaned"
              checked={formData.filter_cleaned}
              onChange={(e) =>
                setFormData({ ...formData, filter_cleaned: e.target.checked })
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
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none min-h-[100px]"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-purple-600 text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {mutation.isPending ? "Saving..." : "Save Weekly Check"}
        </button>
      </form>
    </div>
  );
}
