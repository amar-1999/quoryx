import React, { useState } from "react";
import { Bell, Search, User, Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-provider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useUIStore } from "@/stores/useUIStore";
import { useUserStore } from "@/stores/useUserStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { cn } from "@/lib/utils";
import { Check, Trash2 } from "lucide-react";

// ... imports
import { GlobalAIChat } from "@/components/dashboard/GlobalAIChat";

export function Header() {
  const { toggleSidebar } = useUIStore();
  const { user, signOut } = useUserStore();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between shrink-0 z-10 transition-colors sticky top-0">
        {/* Mobile Menu & Search */}
        <div className="flex items-center gap-3 md:w-96">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 bg-muted/50 w-full md:w-64 focus:w-full transition-all duration-300"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />

          {user?.id === "guest" ? (
            <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium">
              Read Only
            </div>
          ) : (
            <Button
              size="sm"
              className="hidden md:flex shadow-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
              onClick={() => setIsChatOpen(true)}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Ask AI
            </Button>
          )}

          <div className="h-8 w-[1px] bg-border mx-1 hidden md:block" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <NotificationBadge />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 p-0 sm:w-96 backdrop-blur-xl bg-card/95 border-white/10"
            >
              <NotificationList />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full overflow-hidden border border-border hover:border-foreground/20"
              >
                <User className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => signOut()}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <GlobalAIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}

function NotificationBadge() {
  const { unreadCount } = useNotificationStore();
  const count = unreadCount();
  if (count === 0) return null;
  return (
    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
  );
}

function NotificationList() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
    useNotificationStore();
  const unread = unreadCount();

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <h4 className="font-semibold text-sm">Notifications</h4>
        {unread > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-2 text-xs text-primary"
            onClick={markAllAsRead}
          >
            Mark all read
          </Button>
        )}
      </div>
      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No notifications
          </div>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className="cursor-pointer p-0 focus:bg-transparent"
              asChild
            >
              <div
                className={cn(
                  "w-full flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors border-l-2 outline-none",
                  n.read
                    ? "border-transparent opacity-60"
                    : "border-primary bg-primary/5"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  markAsRead(n.id);
                }}
              >
                <div
                  className={cn(
                    "h-2 w-2 mt-2 rounded-full shrink-0",
                    n.type === "warning"
                      ? "bg-amber-500"
                      : n.type === "success"
                      ? "bg-emerald-500"
                      : "bg-blue-500"
                  )}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={cn(
                        "text-sm font-medium leading-none",
                        !n.read && "text-foreground"
                      )}
                    >
                      {n.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {n.message}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </div>
      {notifications.length > 0 && (
        <div className="p-2 border-t border-border/50">
          <Button
            variant="ghost"
            className="w-full text-xs h-8 text-muted-foreground hover:text-destructive"
            onClick={clearAll}
          >
            <Trash2 className="mr-2 h-3 w-3" /> Clear all
          </Button>
        </div>
      )}
    </>
  );
}
