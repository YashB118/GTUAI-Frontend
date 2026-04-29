"use client";

import { useState } from "react";
import { Menu, LogOut, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface TopbarProps {
  onMenuClick: () => void;
  userName?: string;
  userRole?: string;
  userBranch?: string;
  userSemester?: number;
}

export function Topbar({
  onMenuClick,
  userName = "Student",
  userRole = "student",
  userBranch,
  userSemester,
}: TopbarProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem("access_token");
    // Hard redirect — clears bfcache, middleware re-validates session on next load
    window.location.replace("/");
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10 glass border-b border-border">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-text-secondary hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-bg-elevated"
      >
        <Menu size={18} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="flex items-center gap-2.5 hover:bg-bg-elevated rounded-lg px-3 py-1.5 transition-all duration-200"
          >
            <UserAvatar name={userName} size="sm" />
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-[13px] font-medium text-text-primary leading-none">{userName}</span>
              {userBranch && userSemester && (
                <span className="text-[11px] text-text-muted leading-none mt-0.5">
                  {userBranch} · Sem {userSemester}
                </span>
              )}
            </div>
            <ChevronDown size={13} className="text-text-muted hidden sm:block" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50 animate-scale-in shadow-menu border border-border glass">
                <div className="px-4 py-3">
                  <p className="text-[13px] font-medium text-text-primary">{userName}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {userRole === "admin" ? "Administrator" : `${userBranch ?? ""} · Sem ${userSemester ?? ""}`}
                  </p>
                </div>
                <div className="h-px bg-border mx-3" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-text-secondary hover:text-red-400 hover:bg-bg-elevated transition-colors"
                >
                  <LogOut size={13} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
