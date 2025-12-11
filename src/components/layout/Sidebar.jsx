import React, { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Plus,
  FolderOpen,
  ChevronRight,
  X,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useUIStore } from "@/stores/useUIStore";
import { useUserStore } from "@/stores/useUserStore";

export function Sidebar() {
  const {
    dashboards,
    currentDashboardId,
    setCurrentDashboard,
    createDashboard,
    deleteDashboard,
    renameDashboard,
  } = useDashboardStore();

  const { isSidebarOpen, closeSidebar, currentView, setView } = useUIStore();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const startEditing = (dashboard) => {
    setEditingId(dashboard.id);
    setEditName(dashboard.name);
  };

  const saveEditing = () => {
    if (editingId && editName.trim()) {
      renameDashboard(editingId, editName);
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 w-72 border-r border-border bg-card/95 backdrop-blur-xl flex flex-col h-full transition-transform duration-300 shadow-xl md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-gradient-to-r from-blue-500/10 to-transparent">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 mr-3">
              <BarChart3 className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Antigravity AI
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground"
            onClick={closeSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 no-scrollbar">
          {/* Dashboards Section */}
          <div>
            <h2 className="mb-3 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Analytics
            </h2>
            <div className="space-y-1">
              {dashboards.map((dashboard) => (
                <div
                  key={dashboard.id}
                  className="group flex items-center relative"
                >
                  {editingId === dashboard.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={saveEditing}
                      onKeyDown={(e) => e.key === "Enter" && saveEditing()}
                      autoFocus
                      className="h-10 text-sm"
                    />
                  ) : (
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start font-medium text-sm h-10 transition-all duration-200 pr-16", // Added padding right for actions
                        currentDashboardId === dashboard.id &&
                          currentView === "dashboard"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                      onClick={() => {
                        setCurrentDashboard(dashboard.id);
                        setView("dashboard");
                        closeSidebar();
                      }}
                    >
                      <LayoutDashboard
                        className={cn(
                          "mr-3 h-4 w-4",
                          currentDashboardId === dashboard.id &&
                            currentView === "dashboard"
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                      <span className="truncate">{dashboard.name}</span>
                    </Button>
                  )}

                  {/* Actions - Hidden if Guest */}
                  {useUserStore.getState().user?.id !== "guest" &&
                    editingId !== dashboard.id && (
                      <div className="absolute right-1 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Rename Option */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(dashboard);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        {/* Delete Option */}
                        {dashboards.length > 1 && !dashboard.isDefault && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                confirm(
                                  `Are you sure you want to delete "${dashboard.name}"?`
                                )
                              ) {
                                deleteDashboard(dashboard.id);
                              }
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* Studio/Library Mock Section */}
          <div>
            <h2 className="mb-3 px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Library
            </h2>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 transition-all",
                  currentView === "saved-reports"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                onClick={() => {
                  setView("saved-reports");
                  closeSidebar();
                }}
              >
                <FolderOpen
                  className={cn(
                    "mr-3 h-4 w-4",
                    currentView === "saved-reports"
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />
                Saved Reports
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-muted/20 space-y-3">
          {useUserStore.getState().user?.id !== "guest" && (
            <Button
              className="w-full justify-start shadow-lg"
              onClick={createDashboard}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Dashboard
            </Button>
          )}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-10 transition-all",
              currentView === "settings"
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
            onClick={() => {
              setView("settings");
              closeSidebar();
            }}
          >
            <Settings
              className={cn(
                "mr-2 h-4 w-4",
                currentView === "settings" ? "text-primary" : ""
              )}
            />
            Settings
          </Button>
        </div>
      </aside>
    </>
  );
}
