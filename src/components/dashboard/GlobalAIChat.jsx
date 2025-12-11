import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  X,
  Bot,
  User,
  Zap,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/stores/useDashboardStore";

const SUGGESTIONS = [
  { icon: TrendingUp, label: "Analyze current trends" },
  { icon: BarChart3, label: "Summarize dashboard" },
  { icon: Zap, label: "Find anomalies" },
];

export function GlobalAIChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm Cortex, your analytics copilot. How can I help you optimize your dashboard today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const { getCurrentDashboard } = useDashboardStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const dashboard = getCurrentDashboard();
      let response = "I've analyzed your data. ";

      if (text.toLowerCase().includes("trend")) {
        response +=
          "Overall trends are positive (+12% WoW). The 'Revenue' KPI is driving this growth, though 'Active Users' has plateaued slightly.";
      } else if (text.toLowerCase().includes("summarize")) {
        response += `You are currently viewing the "${
          dashboard?.name || "Main"
        }" dashboard. It contains ${
          dashboard?.layout?.length || 0
        } widgets. Key metrics indicate healthy performance, but watch out for the dip in traffic on weekends.`;
      } else if (text.toLowerCase().includes("anomalies")) {
        response +=
          "I detected a sharp spike in bounce rate on Friday at 8 PM. This correlates with the server deployment window.";
      } else {
        response +=
          "I can help you visualize this data better. Try asking me to summarize the current view or find outliers.";
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Chat Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-[#0f111a]/95 border-l border-white/10 shadow-2xl flex flex-col backdrop-blur-xl"
          >
            {/* Header */}
            <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 ring-1 ring-indigo-500/50">
                  <Bot className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Cortex AI</h3>
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-6"
              ref={scrollRef}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3 max-w-[90%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                      msg.role === "user" ? "bg-indigo-600" : "bg-slate-700"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : "bg-slate-800 border border-white/5 text-slate-200 rounded-tl-sm"
                    )}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="bg-slate-800 border border-white/5 p-3 rounded-2xl rounded-tl-sm flex items-center gap-1 h-10">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s.label)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all text-xs text-indigo-300 whitespace-nowrap"
                    >
                      <s.icon className="h-3 w-3" />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative"
              >
                <Input
                  className="pr-12 bg-black/20 border-white/10 focus-visible:ring-indigo-500/50 text-slate-200 placeholder:text-slate-500"
                  placeholder="Ask anything about your data..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1 top-1 h-8 w-8 bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
