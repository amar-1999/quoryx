import React, { useState } from "react";
import {
  MoreHorizontal,
  GripHorizontal,
  Maximize2,
  Sparkles,
  Settings,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIInsightModal } from "./AIInsightModal";
import { WidgetConfigModal } from "./WidgetConfigModal";
import { useDashboardStore } from "@/stores/useDashboardStore";

export function WidgetWrapper({ children, title, widgetId }) {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const { updateWidgetConfig, removeWidget } = useDashboardStore();

  const handleConfigSave = (newConfig) => {
    updateWidgetConfig(widgetId, newConfig);
    setIsConfigModalOpen(false);
  };

  const handleDelete = () => {
    removeWidget(widgetId);
  };

  return (
    <>
      <div className="h-full w-full flex flex-col rounded-xl overflow-hidden glass-card transition-all duration-300 hover:shadow-lg group">
        {/* Header */}
        <div className="h-11 px-4 flex items-center justify-between shrink-0 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="drag-handle cursor-move p-1.5 rounded-md hover:bg-accent opacity-50 group-hover:opacity-100 transition-all text-muted-foreground hover:text-foreground">
              <GripHorizontal className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm text-foreground truncate tracking-wide">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary hover:text-primary hover:bg-primary/10 transition-colors"
              onClick={() => setIsAIModalOpen(true)}
            >
              <Sparkles className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={() => setIsConfigModalOpen(true)}
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 min-h-0 overflow-hidden relative">
          {children}
        </div>
      </div>

      <AIInsightModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        widgetContext={{
          title,
          type: "WIDGET",
          config: { title, id: widgetId },
        }}
      />

      <WidgetConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={{ title }}
        onSave={handleConfigSave}
      />
    </>
  );
}
