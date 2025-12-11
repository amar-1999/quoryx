import React, { useEffect } from "react";
import { Layout } from "./components/layout/Layout";
import { DashboardCanvas } from "./components/dashboard/DashboardCanvas";
import { ThemeProvider } from "./components/ui/theme-provider";
import { AuthPage } from "./components/auth/AuthPage";
import { useUserStore } from "@/stores/useUserStore";
import { useUIStore } from "@/stores/useUIStore";
import { SettingsPage } from "./components/settings/SettingsPage";
import { SavedReportsPage } from "./components/reports/SavedReportsPage";

function App() {
  const { user, loading, initAuth, signInWithGoogle } = useUserStore();
  const { currentView } = useUIStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0b0c15] text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-white/10 rounded-lg mb-4" />
          <div className="h-4 w-32 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthPage />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout>
        {currentView === "settings" && <SettingsPage />}
        {currentView === "saved-reports" && <SavedReportsPage />}
        {(currentView === "dashboard" || !currentView) && <DashboardCanvas />}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
