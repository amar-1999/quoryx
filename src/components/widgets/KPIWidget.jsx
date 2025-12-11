import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Activity, Loader2 } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export function KPIWidget({ config }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      // Pass widget type explicitly as it might not be in config
      const result = await api.widgets.getData("mock-id", {
        ...config,
        type: "KPI",
      });
      if (mounted) {
        setData(result);
        setLoading(false);
      }
    };
    fetchData();
    return () => (mounted = false);
  }, [config.title, config.metric]); // Re-fetch if config changes

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const { value, trend, formatted, isPositive, history } = data;

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tighter tabular-nums">
          {formatted}
        </span>
        <div
          className={cn(
            "flex items-center text-sm font-medium",
            isPositive ? "text-emerald-500" : "text-rose-500"
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          {Math.abs(trend)}%
        </div>
      </div>

      <div className="h-16 w-full opacity-50 relative mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <Tooltip
              content={<></>}
              cursor={{ stroke: "var(--primary)", strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#10b981" : "#f43f5e"}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
