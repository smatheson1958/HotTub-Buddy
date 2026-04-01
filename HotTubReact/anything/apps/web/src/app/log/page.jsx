import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Droplet, Save, ArrowLeft, Trash2 } from "lucide-react";
import { format } from "date-fns";
import useUser from "@/utils/useUser";

export default function DailyLogPage() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    log_date: format(new Date(), "yyyy-MM-dd"),
    log_time: format(new Date(), "HH:mm"),
    sanitizer_free: "",
    ph: "",
    notes: "",
    added_sanitizer: "",
    added_ph_up: "",
    added_ph_down: "",
  });

  // Reset form when component mounts
  useEffect(() => {
    setFormData({
      log_date: format(new Date(), "yyyy-MM-dd"),
      log_time: format(new Date(), "HH:mm"),
      sanitizer_free: "",
      ph: "",
      notes: "",
      added_sanitizer: "",
      added_ph_up: "",
      added_ph_down: "",
    });
  }, []);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/hot-tub-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save log");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hot-tub-logs"] });
      window.location.href = "/";
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      sanitizer_free: parseFloat(formData.sanitizer_free) || 0,
      ph: parseFloat(formData.ph) || 0,
      added_sanitizer: parseFloat(formData.added_sanitizer) || 0,
      added_ph_up: parseFloat(formData.added_ph_up) || 0,
      added_ph_down: parseFloat(formData.added_ph_down) || 0,
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
        <h1 className="text-2xl font-bold text-gray-900">Daily Water Log</h1>
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
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Chlorine (ppm)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 2.0"
                value={formData.sanitizer_free}
                onChange={(e) =>
                  setFormData({ ...formData, sanitizer_free: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                pH Level
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 7.4"
                value={formData.ph}
                onChange={(e) =>
                  setFormData({ ...formData, ph: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
          <h3 className="font-bold text-gray-900">Chemicals Added</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Chlorine (g/ml)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={formData.added_sanitizer}
                onChange={(e) =>
                  setFormData({ ...formData, added_sanitizer: e.target.value })
                }
                onBlur={(e) => {
                  if (e.target.value && e.target.value.trim() !== "") {
                    const numValue = parseFloat(e.target.value);
                    if (!isNaN(numValue)) {
                      const rounded = Math.round(numValue * 10) / 10;
                      setFormData({
                        ...formData,
                        added_sanitizer: rounded.toString(),
                      });
                    }
                  }
                }}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                pH Up (g/ml)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={formData.added_ph_up}
                onChange={(e) =>
                  setFormData({ ...formData, added_ph_up: e.target.value })
                }
                onBlur={(e) => {
                  if (e.target.value && e.target.value.trim() !== "") {
                    const numValue = parseFloat(e.target.value);
                    if (!isNaN(numValue)) {
                      const rounded = Math.round(numValue * 10) / 10;
                      setFormData({
                        ...formData,
                        added_ph_up: rounded.toString(),
                      });
                    }
                  }
                }}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                pH Down (g/ml)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={formData.added_ph_down}
                onChange={(e) =>
                  setFormData({ ...formData, added_ph_down: e.target.value })
                }
                onBlur={(e) => {
                  if (e.target.value && e.target.value.trim() !== "") {
                    const numValue = parseFloat(e.target.value);
                    if (!isNaN(numValue)) {
                      const rounded = Math.round(numValue * 10) / 10;
                      setFormData({
                        ...formData,
                        added_ph_down: rounded.toString(),
                      });
                    }
                  }
                }}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
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
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {mutation.isPending ? "Saving..." : "Save Daily Log"}
        </button>
      </form>
    </div>
  );
}
