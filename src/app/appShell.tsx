import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { SearchPage } from "../pages/searchPage";
import { SearchHistoryPage } from "../pages/searchHistoryPage";
import { ReportsPage } from "../pages/reportsPage";
import { useAuthSession, useLogout } from "../hooks/useAuth";
import type { ApiClientError } from "../lib/apiClient";
import { getErrorMessageFromCode } from "../lib/errorMessages";
import { Button } from "../components/ui/button";
import { buttonVariants } from "../components/ui/buttonVariants";
import { cn } from "../lib/utils";
import { useUiStore } from "../store/uiStore";

function Header({ user, isLoggedIn, onLogout }: { user: any; isLoggedIn: boolean; onLogout: () => void }) {
  return (
    <header className="mb-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 via-sky-50 to-white px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-blue-900 sm:text-2xl">OSINT Intelligence Console</h1>
          <p className="text-sm text-blue-700">Search, review findings, and manage intelligence history and reports in one place.</p>
        </div>
        <div className="flex items-center gap-2 text-right">
          <div>
            <p className="text-sm font-semibold text-slate-900">{user?.name ?? "Guest Mode"}</p>
            <p className="text-xs text-red-500">{user?.email ?? "Login to unlock history and report archive."}</p>
          </div>
          {isLoggedIn && (
            <Button type="button" variant="outline" size="sm" onClick={onLogout}>
              <Icon icon="mage:logout" className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function NavBar() {
  const NavItem = ({ to, children }: { to: string; children: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(buttonVariants({ variant: isActive ? "default" : "ghost", size: "sm" }))
      }
    >
      {children}
    </NavLink>
  );

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
      <NavItem to="/">Homepage</NavItem>
      <NavItem to="/history">Search History</NavItem>
      <NavItem to="/reports">Reports</NavItem>
    </nav>
  );
}

export const AppShell = () => {
  const authSessionQuery = useAuthSession();
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();
  const user = authSessionQuery.data?.user;
  const isLoggedIn = authSessionQuery.data?.authenticated === true;

  const setSelectedSearchRunId = useUiStore((state) => state.setSelectedSearchRunId);
  const setSelectedFindingId = useUiStore((state) => state.setSelectedFindingId);
  const setActiveCategory = useUiStore((state) => state.setActiveCategory);
  const setTransientRun = useUiStore((state) => state.setTransientRun);
  const setLastSearchParams = useUiStore((state) => state.setLastSearchParams);
  const setPendingSearchQuery = useUiStore((state) => state.setPendingSearchQuery);

  async function onLogout() {
    setSelectedSearchRunId(null);
    setSelectedFindingId(null);
    setActiveCategory("ALL");
    setTransientRun(null);
    setLastSearchParams(null);
    setPendingSearchQuery(null);
    void queryClient.cancelQueries({ queryKey: ["search-data"] });
    void queryClient.cancelQueries({ queryKey: ["search-run"] });
    void queryClient.cancelQueries({ queryKey: ["search-runs"] });
    void queryClient.cancelQueries({ queryKey: ["homepage-data"] });
    queryClient.removeQueries({ queryKey: ["search-data"] });
    queryClient.removeQueries({ queryKey: ["search-run"] });
    queryClient.removeQueries({ queryKey: ["search-runs"] });
    queryClient.removeQueries({ queryKey: ["homepage-data"] });

    try {
      await logoutMutation.mutateAsync();
      await queryClient.invalidateQueries({ queryKey: ["auth-session"] });
      await queryClient.invalidateQueries({ queryKey: ["search-runs"] });
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Logged out successfully.");
    } catch (error) {
      const apiError = error as ApiClientError;
      toast.error(getErrorMessageFromCode(apiError.code, apiError.message));
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl p-4 sm:p-6">
      <Header user={user} isLoggedIn={isLoggedIn} onLogout={onLogout} />

      <div className="mb-6 flex justify-center">
        <NavBar />
      </div>

      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/history" element={<SearchHistoryPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
};
