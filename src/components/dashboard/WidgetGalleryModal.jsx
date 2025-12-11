import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  LineChart,
  PieChart,
  Table,
  Gauge,
  ListOrdered,
  ArrowLeft,
  Check,
  Upload,
  FileSpreadsheet,
} from "lucide-react";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { cn } from "@/lib/utils";
import { read, utils } from "xlsx";

const WIDGET_TYPES = [
  {
    type: "KPI",
    label: "KPI Card",
    icon: Gauge,
    desc: "Single metric with trend",
  },
  {
    type: "TIMESERIES",
    label: "Time Series",
    icon: LineChart,
    desc: "Line/Area chart over time",
  },
  {
    type: "BAR",
    label: "Bar Chart",
    icon: BarChart3,
    desc: "Categorical comparison",
  },
  {
    type: "PIE",
    label: "Pie Chart",
    icon: PieChart,
    desc: "Part-to-whole distribution",
  },
  {
    type: "TABLE",
    label: "Data Table",
    icon: Table,
    desc: "Detailed rows and columns",
  },
  {
    type: "TOPN",
    label: "Top List",
    icon: ListOrdered,
    desc: "Ranked items list",
  },
];

export function WidgetGalleryModal({ isOpen, onClose }) {
  const { addWidget } = useDashboardStore();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [config, setConfig] = useState({
    title: "", // Will be overridden by sheet name
    metric: "revenue",
    excelData: null, // Store parsed data here
  });
  const [fileName, setFileName] = useState("");

  const handleSelectType = (type) => {
    setSelectedType(type);
    const typeLabel = WIDGET_TYPES.find((t) => t.type === type)?.label;
    setConfig((prev) => ({ ...prev, title: `New ${typeLabel}` }));
    setStep(2);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const data = await file.arrayBuffer();
    const workbook = read(data);

    // Store all sheets data
    const sheetsData = {};
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      sheetsData[sheetName] = utils.sheet_to_json(sheet, { header: 1 }); // Array of arrays
    });

    setConfig((prev) => ({ ...prev, excelData: sheetsData }));
  };

  const getHeaders = () => {
    if (!config.excelData) return [];
    // Get headers from first sheet as default
    const sheetName = Object.keys(config.excelData)[0];
    return config.excelData[sheetName][0] || [];
  };

  const handleCreate = () => {
    if (selectedType && config.excelData) {
      // Iterate through each sheet and create a widget
      Object.entries(config.excelData).forEach(([sheetName, rows]) => {
        if (rows.length > 0) {
          addWidget(selectedType, {
            title: sheetName,
            metric: config.metric,
            staticData: rows,
            mapping: config.mapping, // Pass the user-selected mapping
          });
        }
      });
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedType(null);
    setConfig({
      title: "",
      metric: "revenue",
      excelData: null,
      mapping: { label: 0, value: 1 },
    });
    setFileName("");
    onClose();
  };

  const headers = getHeaders();

  const renderStep1 = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
      {WIDGET_TYPES.map((widget) => (
        <Button
          key={widget.type}
          variant="outline"
          className="h-32 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all group"
          onClick={() => handleSelectType(widget.type)}
        >
          <div className="p-3 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
            <widget.icon className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <div className="font-semibold">{widget.label}</div>
            <div className="text-xs text-muted-foreground">{widget.desc}</div>
          </div>
        </Button>
      ))}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 py-4">
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm">
        <Upload className="inline-block w-4 h-4 mr-2 mb-0.5" />
        Data Source Required. Upload an Excel file.
      </div>

      <div className="space-y-2">
        {/* File Input */}
        <label className="text-sm font-medium text-foreground">
          Excel File (*.xlsx, *.xls) <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center gap-4">
          <Input
            id="excel-upload"
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            className="w-full h-24 border-dashed border-2 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/50"
            onClick={() => document.getElementById("excel-upload").click()}
          >
            {fileName ? (
              <>
                <FileSpreadsheet className="h-8 w-8 text-emerald-500" />
                <span className="text-foreground font-medium">{fileName}</span>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6" />
                <span>Click to upload Excel file</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {fileName && headers.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border">
          <h4 className="font-medium text-sm text-foreground mb-2">
            Map Your Data
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Label Column (X-Axis/Name)
              </label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    mapping: { ...prev.mapping, label: Number(e.target.value) },
                  }))
                }
                value={config.mapping?.label || 0}
              >
                {headers.map((h, i) => (
                  <option key={i} value={i}>
                    {h || `Column ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Value Column (Y-Axis/Metric)
              </label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    mapping: { ...prev.mapping, value: Number(e.target.value) },
                  }))
                }
                value={config.mapping?.value || 1}
              >
                {headers.map((h, i) => (
                  <option key={i} value={i}>
                    {h || `Column ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            We'll use these columns to build your widgets.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-3xl bg-card/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle>
            {step === 1
              ? "Add Widget"
              : `Configure ${
                  WIDGET_TYPES.find((t) => t.type === selectedType)?.label
                }`}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Select a widget type to add to your dashboard."
              : "Upload data to generate your widgets."}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[300px]">
          {step === 1 ? renderStep1() : renderStep2()}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          {step === 2 ? (
            <>
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!config.excelData}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Check className="h-4 w-4" /> Create{" "}
                {config.excelData
                  ? `${Object.keys(config.excelData).length} Widgets`
                  : "Widget"}
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={resetAndClose}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
