"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { ReceivedInquiry, SentInquiry } from "@/types";

export default function InquiriesPage() {
  const { accessToken } = useAuth();
  const [sent, setSent] = useState<SentInquiry[]>([]);
  const [received, setReceived] = useState<ReceivedInquiry[]>([]);
  const [activeTab, setActiveTab] = useState<"sent" | "received">("received");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInquiries() {
      setError("");
      setIsLoading(true);
      try {
        const [sentResult, receivedResult] = await Promise.all([
          apiRequest<SentInquiry[]>("/api/inquiries/sent", { token: accessToken }),
          apiRequest<ReceivedInquiry[]>("/api/inquiries/received", { token: accessToken }),
        ]);
        setSent(sentResult);
        setReceived(receivedResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load inquiries");
      } finally {
        setIsLoading(false);
      }
    }

    if (accessToken) {
      loadInquiries();
    }
  }, [accessToken]);

  return (
    <AuthGuard>
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-ink">Inquiries</h1>
          <p className="mt-2 text-muted">
            Track messages sent to owners and messages received on your listings.
          </p>
        </div>

        <div className="mb-5 inline-flex rounded-lg border border-slate-200 bg-white p-1">
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold ${
              activeTab === "received" ? "bg-brand text-white" : "text-slate-600"
            }`}
            onClick={() => setActiveTab("received")}
            type="button"
          >
            Received
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold ${
              activeTab === "sent" ? "bg-brand text-white" : "text-slate-600"
            }`}
            onClick={() => setActiveTab("sent")}
            type="button"
          >
            Sent
          </button>
        </div>

        {error ? <p className="alert-error mb-5">{error}</p> : null}
        {isLoading ? <div className="skeleton h-64" /> : null}

        {!isLoading && activeTab === "received" ? (
          received.length ? (
            <div className="space-y-4">
              {received.map((item) => (
                <article className="rounded-lg border border-slate-200 bg-white p-5" key={item.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        className="text-lg font-semibold text-ink hover:text-brand"
                        href={`/properties/${item.property_id}`}
                      >
                        {item.property_title}
                      </Link>
                      <p className="mt-1 text-sm text-muted">
                        From {item.sender_name} ({item.sender_email})
                      </p>
                    </div>
                    <p className="text-sm text-muted">{formatDate(item.created_at)}</p>
                  </div>
                  <p className="mt-4 leading-7 text-slate-700">{item.message}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No received inquiries"
              message="When buyers contact you, their messages will appear here."
            />
          )
        ) : null}

        {!isLoading && activeTab === "sent" ? (
          sent.length ? (
            <div className="space-y-4">
              {sent.map((item) => (
                <article className="rounded-lg border border-slate-200 bg-white p-5" key={item.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        className="text-lg font-semibold text-ink hover:text-brand"
                        href={`/properties/${item.property_id}`}
                      >
                        {item.property_title}
                      </Link>
                      <p className="mt-1 text-sm text-muted">
                        To {item.owner_name} ({item.owner_email}) in {item.locality}, {item.city}
                      </p>
                    </div>
                    <p className="text-sm text-muted">{formatDate(item.created_at)}</p>
                  </div>
                  <p className="mt-4 leading-7 text-slate-700">{item.message}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No sent inquiries"
              message="Open a property detail page and contact the owner to create a sent inquiry."
              actionHref="/"
              actionLabel="Browse Properties"
            />
          )
        ) : null}
      </section>
    </AuthGuard>
  );
}
