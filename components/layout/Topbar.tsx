"use client";

import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/UserAvatar";

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
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  return (
    <header className="h-16 bg-bg-primary border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-text-secondary hover:text-text-primary transition-colors p-1.5 rounded-md hover:bg-bg-elevated"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block" />

      <div className="relative">
        <button
          onClick={() => setShowMenu((v) => !v)}
          className="flex items-center gap-2.5 hover:bg-bg-elevated rounded-lg px-3 py-2 transition-colors"
        >
          <UserAvatar name={userName} size="sm" />
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-medium text-text-primary leading-none">{userName}</span>
            {userBranch && userSemester && (
              <span className="text-xs text-text-muted leading-none mt-0.5">
                {userBranch} · Sem {userSemester}
              </span>
            )}
          </div>
          <Badge variant={userRole === "admin" ? "accent" : "default"} className="hidden sm:inline-flex">
            {userRole}
          </Badge>
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-1 w-56 bg-bg-card border border-border rounded-lg shadow-accent overflow-hidden z-50 animate-slide-up">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-text-primary">{userName}</p>
                {userBranch && (
                  <p className="text-xs text-text-muted mt-0.5">{userBranch} · Sem {userSemester}</p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-text-secondary hover:text-red-400 hover:bg-bg-elevated transition-colors"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
