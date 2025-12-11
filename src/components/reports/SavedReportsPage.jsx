import React, { useState } from "react";
import {
  FileText,
  Download,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  FileSpreadsheet,
  FileBarChart,
  Plus,
  Loader2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDashboardStore } from "@/stores/useDashboardStore";

const MOCK_REPORTS = [];

export function SavedReportsPage() {
  const { dashboards } = useDashboardStore();
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [search, setSearch] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [config, setConfig] = useState({
    dashboardId: "",
    period: "Monthly", // Daily, Weekly, Monthly
    format: "PDF",
  });

  const filteredReports = reports.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setReports(reports.filter((r) => r.id !== id));
  };

  const handleGenerate = async () => {
    if (!config.dashboardId) return;

    setIsGenerating(true);
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const dashboardName =
      dashboards.find((d) => d.id === config.dashboardId)?.name || "Dashboard";
    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newReport = {
      id: Math.random(),
      name: `${dashboardName} - ${config.period} Report`,
      type: config.format,
      date: dateStr,
      size: (Math.random() * 2 + 0.5).toFixed(1) + " MB",
      status: "Ready",
      period: config.period,
    };

    setReports([newReport, ...reports]);
    setIsGenerating(false);
    setIsDialogOpen(false);
    setConfig({ dashboardId: "", period: "Monthly", format: "PDF" });
  };

  const getIcon = (type) => {
    switch (type) {
      case "Excel":
        return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />;
      case "PDF":
        return <FileText className="h-5 w-5 text-rose-500" />;
      case "CSV":
        return <FileBarChart className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background/50 p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Saved Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate snapshot reports from your dashboards.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              Generate New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10 sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Generate Dashboard Report</DialogTitle>
              <DialogDescription>
                Select a dashboard and time period for your snapshot.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Dashboard Selection */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Select Dashboard</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={config.dashboardId}
                  onChange={(e) =>
                    setConfig({ ...config, dashboardId: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select a dashboard...
                  </option>
                  {dashboards.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Period Selection */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Period</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={config.period}
                    onChange={(e) =>
                      setConfig({ ...config, period: e.target.value })
                    }
                  >
                    <option value="Daily">Daily Summary</option>
                    <option value="Weekly">Weekly Review</option>
                    <option value="Monthly">Monthly Report</option>
                    <option value="Quarterly">Quarterly Report</option>
                  </select>
                </div>

                {/* Format Selection */}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Format</label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={config.format}
                    onChange={(e) =>
                      setConfig({ ...config, format: e.target.value })
                    }
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="Excel">Excel Spreadsheet</option>
                    <option value="CSV">CSV Data</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!config.dashboardId || isGenerating}
              >
                {isGenerating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-9 bg-card/50 border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-dashed">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* List */}
      <div className="glass-card rounded-xl overflow-hidden border border-white/5">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-5">Report Name</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group"
            >
              {/* Name */}
              <div className="col-span-5 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-background/50 border border-white/5">
                  {getIcon(report.type)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{report.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {report.type} Document
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="col-span-2 text-sm text-muted-foreground">
                {report.date}
              </div>

              {/* Size */}
              <div className="col-span-2 text-sm font-mono text-muted-foreground">
                {report.size}
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                    report.status === "Ready"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  }`}
                >
                  {report.status}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-card/95 border-white/10 backdrop-blur-xl"
                  >
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(report.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <div className="inline-flex p-4 rounded-full bg-secondary mb-4">
                <Search className="h-6 w-6" />
              </div>
              <p>No reports found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
