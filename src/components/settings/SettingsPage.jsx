import React from "react";
import {
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Moon,
  Monitor,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/useUserStore";
import { useUIStore } from "@/stores/useUIStore";

export function SettingsPage() {
  const { user, signOut } = useUserStore();
  const { setView } = useUIStore();

  return (
    <div className="flex-1 h-full overflow-y-auto bg-background/50 p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-8 max-w-4xl">
        {/* Profile Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2">
            <User className="h-5 w-5 text-primary" />
            Profile
          </h2>
          <div className="glass-card p-6 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.email?.[0].toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  {user?.email?.split("@")[0] || "User"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {user?.email || "guest@example.com"}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Appearance */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2">
            <Palette className="h-5 w-5 text-indigo-500" />
            Appearance
          </h2>
          <div className="glass-card p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-background">
                  <Moon className="h-4 w-4" />
                </div>
                <span className="font-medium">Dark Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Always On</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-background">
                  <Monitor className="h-4 w-4" />
                </div>
                <span className="font-medium">Density</span>
              </div>
              <span className="text-xs text-muted-foreground">Comfortable</span>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 border-b border-border pb-2">
            <Database className="h-5 w-5 text-emerald-500" />
            Data
          </h2>
          <div className="glass-card p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Local Cache</h4>
                <p className="text-sm text-muted-foreground">
                  Clear locally stored widget configurations.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => localStorage.clear() || window.location.reload()}
              >
                Clear Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
