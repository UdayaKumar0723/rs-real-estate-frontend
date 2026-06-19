"use client";

import { Send } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

export function InquiryForm({ propertyId }: { propertyId: string }) {
  const { user, accessToken, isReady } = useAuth();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setError("");
    setIsSubmitting(true);

    try {
      await apiRequest("/api/inquiries", {
        method: "POST",
        token: accessToken,
        body: JSON.stringify({ propertyId, message }),
      });
      setMessage("");
      setStatus("Inquiry sent successfully. The owner can see it in received inquiries.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return <div className="skeleton h-36" />;
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-ink">Contact owner</h2>
        <p className="mt-2 text-sm text-muted">Login first to send an inquiry for this property.</p>
        <Link className="btn-primary mt-4 inline-flex" href="/login">
          Login to Contact
        </Link>
      </div>
    );
  }

  return (
    <form className="rounded-lg border border-slate-200 bg-white p-5" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold text-ink">Contact owner</h2>
      <p className="mt-1 text-sm text-muted">
        Duplicate inquiries are blocked for the same property.
      </p>

      {status ? <p className="alert-success mt-4">{status}</p> : null}
      {error ? <p className="alert-error mt-4">{error}</p> : null}

      <label className="field mt-4">
        <span>Message</span>
        <textarea
          required
          minLength={10}
          maxLength={1000}
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="I am interested in this property. Please contact me."
        />
      </label>

      <button className="btn-primary mt-4" disabled={isSubmitting} type="submit">
        <Send className="h-4 w-4" aria-hidden="true" />
        {isSubmitting ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
