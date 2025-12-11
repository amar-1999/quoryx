import React from "react";

import { cn } from "@/lib/utils";

import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function TopNListWidget({ config }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      const result = await api.widgets.getData("mock-id", {
        ...config,
        type: "TOPN",
      });
      if (mounted) {
        setData(result);
        setLoading(false);
      }
    };
    fetchData();
    return () => (mounted = false);
  }, [config.title, config.metric]);

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex flex-col gap-4 p-2 h-full overflow-y-auto custom-scrollbar">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{item.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">
                {item.value}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  item.trend.startsWith("+")
                    ? "text-emerald-500"
                    : "text-rose-500"
                )}
              >
                {item.trend}
              </span>
            </div>
          </div>
          <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
