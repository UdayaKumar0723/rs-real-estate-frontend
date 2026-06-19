"use client";

import { Building2, LogOut, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const router = useRouter();
  const { user, logout, isReady } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-ink">
          <Building2 className="h-6 w-6 text-brand" aria-hidden="true" />
          RS Estates
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link className="nav-link" href="/">
            Properties
          </Link>
          <Link className="nav-link" href="/inquiries">
            Inquiries
          </Link>
          <Link className="nav-link" href="/dashboard">
            My Listings
          </Link>

          {isReady && user ? (
            <>
              <Link className="btn-primary" href="/dashboard/new">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add
              </Link>
              <button className="icon-btn" onClick={handleLogout} title="Logout" type="button">
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" href="/login">
                Login
              </Link>
              <Link className="btn-primary" href="/register">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
