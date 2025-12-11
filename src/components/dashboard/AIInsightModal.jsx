import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { generateWidgetInsight } from "@/lib/ai";
import { motion } from "framer-motion";

export function AIInsightModal({ isOpen, onClose, widgetContext }) {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    if (isOpen && widgetContext) {
      setLoading(true);
      setInsight(null);

      // Call the AI service
      generateWidgetInsight("WIDGET", widgetContext.config, {}).then((data) => {
        setInsight(data);
        setLoading(false);
      });
    }
  }, [isOpen, widgetContext]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col bg-[#0f111a] border-white/10 text-slate-200">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>
            <DialogTitle className="text-xl">
              AI Analysis: {widgetContext?.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            Powered by Cortex AI • Confidence Score:{" "}
            {insight ? `${(insight.confidence * 100).toFixed(0)}%` : "..."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 flex-1 overflow-y-auto min-h-[200px] pr-2 custom-scrollbar">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-slate-500 py-12">
              <Sparkles className="h-8 w-8 animate-pulse text-indigo-500" />
              <p className="text-sm font-medium animate-pulse">
                Analyzing data patterns...
              </p>
            </div>
          ) : insight ? (
            <div className="space-y-6">
              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 rounded-xl bg-white/5 border border-white/5"
              >
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Executive Summary
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {insight.summary}
                </p>
              </motion.div>

              {/* Observations */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Key Observations
                </h4>
                {insight.observations.map((obs, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-300">{obs}</span>
                  </motion.div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                  Recommended Actions
                </h4>
                {insight.recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
                  >
                    <Lightbulb className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-indigo-200">{rec}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Close Analysis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
