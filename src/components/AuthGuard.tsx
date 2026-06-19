"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuth();

  if (!isReady) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="skeleton h-40" />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="rounded-lg border border-slate-200 bg-white p-8">
          <h1 className="text-2xl font-bold text-ink">Login required</h1>
          <p className="mt-3 text-muted">This page uses protected login required.</p>
          <Link className="btn-primary mt-6" href="/login">
            Login
          </Link>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
