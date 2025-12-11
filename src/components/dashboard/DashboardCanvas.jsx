import React, { useMemo, useState } from "react";
import * as RGL from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { WidgetWrapper } from "./WidgetWrapper";
import { motion } from "framer-motion";
import { PieChartWidget } from "@/components/widgets/PieChartWidget";
import { TopNListWidget } from "@/components/widgets/TopNListWidget";
import { KPIWidget } from "@/components/widgets/KPIWidget";
import { TimeSeriesChart } from "@/components/widgets/TimeSeriesChart";
import { BarChartWidget } from "@/components/widgets/BarChartWidget";
import { TableWidget } from "@/components/widgets/TableWidget";
import { WidgetGalleryModal } from "./WidgetGalleryModal";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "./DateRangePicker"; // ... inside component

// Robust Import for Vite/CJS
const WidthProvider = RGL.WidthProvider || RGL.default?.WidthProvider;
const Responsive = RGL.Responsive || RGL.default?.Responsive;

const ResponsiveGridLayout =
  WidthProvider && Responsive ? WidthProvider(Responsive) : null;

export function DashboardCanvas() {
  const { getCurrentDashboard, updateLayout } = useDashboardStore();
  const dashboard = getCurrentDashboard();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // useMemo isn't strictly necessary for dashboard.layout unless perf critical,
  // but good to safe-guard layout array fallback
  const layout = dashboard?.layout || [];

  const handleLayoutChange = (currentLayout) => {
    if (dashboard) {
      // Map current RGL layout back to our persisted format
      // We merge original item properties to keep config/type intact
      const mergedLayout = layout.map((item) => {
        const match = currentLayout.find((l) => l.i === item.i);
        return match ? { ...item, ...match } : item;
      });
      updateLayout(dashboard.id, mergedLayout);
    }
  };

  const renderWidget = (item) => {
    switch (item.type) {
      case "KPI":
        return <KPIWidget config={item.config} />;
      case "TIMESERIES":
        return <TimeSeriesChart config={item.config} />;
      case "BAR":
        return <BarChartWidget config={item.config} />;
      case "TABLE":
        return <TableWidget config={item.config} />;
      case "PIE":
        return <PieChartWidget config={item.config} />;
      case "TOPN":
        return <TopNListWidget config={item.config} />;
      default:
        return (
          <div className="p-4 text-red-500">
            Unknown Widget Type: {item.type}
          </div>
        );
    }
  };

  return (
    <div className="w-full relative min-h-screen pb-20">
      {/* Grid Background Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* Dashboard Actions Bar */}
      <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground/80">
            {dashboard?.name || "Dashboard"}
          </h1>
          <div className="h-6 w-[1px] bg-border hidden md:block" />
          <DateRangePicker />
        </div>

        <Button
          onClick={() => setIsGalleryOpen(true)}
          className="shadow-lg shadow-primary/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Widget
        </Button>
      </div>
      {!ResponsiveGridLayout ? (
        // Fallback Grid
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {layout.map((item) => (
            <div key={item.i} className="h-64">
              <WidgetWrapper title={item.config.title} widgetId={item.i}>
                {renderWidget(item)}
              </WidgetWrapper>
            </div>
          ))}
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout px-4"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          draggableHandle=".drag-handle"
          onLayoutChange={(layout) => handleLayoutChange(layout)}
          margin={[16, 16]}
          isDraggable
          isResizable
        >
          {layout.map((item, index) => (
            <div key={item.i} data-grid={item}>
              <motion.div
                className="h-full"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <WidgetWrapper title={item.config.title} widgetId={item.i}>
                  {renderWidget(item)}
                </WidgetWrapper>
              </motion.div>
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
      <WidgetGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}
